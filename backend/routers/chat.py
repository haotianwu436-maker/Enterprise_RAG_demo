import os
import uuid
from typing import List

from fastapi import APIRouter

from schemas.chat import ChatReply, ChatRequest, ChatResponse, ChatSource
from services.rag.llm_openai import answer_without_llm, synthesize_with_openai
from services.rag.retrieve import query_knowledge_base

router = APIRouter(tags=["chat"])


def _default_actions() -> List[str]:
    return ["生成周报", "导出分析", "加入待办", "提交管理建议"]


def _hits_to_sources(hits: list) -> List[ChatSource]:
    sources: List[ChatSource] = []
    seen: set[str] = set()
    for i, h in enumerate(hits[:6]):
        meta = h.get("metadata") or {}
        title = str(meta.get("file_name", "知识库片段"))
        key = f"{title}:{h.get('text', '')[:40]}"
        if key in seen:
            continue
        seen.add(key)
        snippet = (h.get("text") or "")[:240]
        sources.append(
            ChatSource(
                id=str(h.get("id") or f"src_{i}"),
                title=title,
                type=str(meta.get("file_type", "DOC")),
                snippet=snippet + ("…" if len(h.get("text") or "") > 240 else ""),
            )
        )
    return sources


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    kb = (req.knowledgeBaseId or "default").strip() or "default"
    hits = query_knowledge_base(kb, req.message.strip(), k=8)

    content: str | None = None
    if os.getenv("OPENAI_API_KEY", "").strip():
        content = synthesize_with_openai(req.message, hits)
    if not content:
        content = answer_without_llm(req.message, hits)

    sources = _hits_to_sources(hits)
    if not sources and not hits:
        # 库完全为空时的友好提示
        sources = [
            ChatSource(
                id="src_empty",
                title="系统提示",
                type="DOC",
                snippet="知识库尚无向量数据，请确认后端已启动并完成种子初始化或上传文档。",
            )
        ]

    rid = f"msg_{uuid.uuid4().hex[:12]}"
    reply = ChatReply(
        id=rid,
        role="assistant",
        content=content,
        sources=sources,
        suggestedActions=_default_actions(),
    )
    return ChatResponse(reply=reply)
