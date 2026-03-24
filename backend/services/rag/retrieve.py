from __future__ import annotations

from typing import Any

from services.rag.chroma_client import get_collection


def query_knowledge_base(
    knowledge_base_id: str,
    question: str,
    k: int = 6,
) -> list[dict[str, Any]]:
    coll = get_collection(knowledge_base_id)
    if coll.count() == 0:
        return []

    res = coll.query(query_texts=[question], n_results=min(k, max(1, coll.count())))
    hits: list[dict[str, Any]] = []
    docs = res.get("documents") or []
    metas = res.get("metadatas") or []
    ids = res.get("ids") or []
    if not docs or not docs[0]:
        return []

    for i, doc in enumerate(docs[0]):
        meta = (metas[0][i] if metas and metas[0] and i < len(metas[0]) else {}) or {}
        cid = ids[0][i] if ids and ids[0] and i < len(ids[0]) else f"hit_{i}"
        hits.append({"id": str(cid), "text": doc, "metadata": meta})
    return hits
