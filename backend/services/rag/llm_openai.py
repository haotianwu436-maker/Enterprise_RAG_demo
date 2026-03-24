from __future__ import annotations

import os
from typing import Any


def synthesize_with_openai(question: str, hits: list[dict[str, Any]]) -> str | None:
    """若设置 OPENAI_API_KEY，则用模型基于检索片段生成回答；否则返回 None。"""
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        return None

    model = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini").strip()

    context_blocks: list[str] = []
    for i, h in enumerate(hits, 1):
        meta = h.get("metadata") or {}
        name = meta.get("file_name", "文档")
        context_blocks.append(f"【片段{i}｜{name}】\n{h.get('text', '')}")

    context = "\n\n".join(context_blocks) if context_blocks else "（无检索片段）"

    try:
        from openai import OpenAI

        client = OpenAI(api_key=key)
        completion = client.chat.completions.create(
            model=model,
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "你是企业内部「知识库助手」。请严格依据用户提供的「知识库片段」作答；"
                        "若片段不足以回答，请明确说明并给出需要补充的信息类型。"
                        "使用简洁中文，必要时用条目列出。不要编造片段中不存在的数据。"
                    ),
                },
                {
                    "role": "user",
                    "content": f"用户问题：{question}\n\n知识库片段：\n{context}",
                },
            ],
        )
        choice = completion.choices[0].message.content
        return (choice or "").strip() or None
    except Exception:
        return None


def answer_without_llm(question: str, hits: list[dict[str, Any]]) -> str:
    """无 API Key 时：直接基于检索片段拼接可读回答。"""
    if not hits:
        return (
            "未在知识库中检索到与问题相关的片段。\n\n"
            "建议：上传相关制度/培训/数据文档，或换一种描述方式（例如加入业务场景关键词）。"
        )

    lines: list[str] = [
        "根据向量检索结果，从知识库中取回以下相关片段（尚未经大模型润色）：\n",
    ]
    for i, h in enumerate(hits, 1):
        meta = h.get("metadata") or {}
        name = meta.get("file_name", "未知文档")
        body = (h.get("text") or "").strip()
        snippet = body if len(body) <= 600 else body[:600] + "…"
        lines.append(f"**{i}. 来源：{name}**\n{snippet}\n")

    lines.append(
        "\n---\n"
        "提示：在服务器环境变量中配置 `OPENAI_API_KEY` 后，可将上述片段交给大模型生成更连贯的结论与行动建议。"
    )
    return "\n".join(lines)
