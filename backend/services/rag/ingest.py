from __future__ import annotations

from pathlib import Path

from services.rag.chunking import chunk_text
from services.rag.chroma_client import get_collection
from services.rag.extract_text import extract_text_from_path
from services.rag.seed_corpus import SEED_CHUNKS


def _delete_file_chunks(collection, file_id: str) -> None:
    try:
        existing = collection.get(where={"file_id": file_id}, limit=10000)
        ids = existing.get("ids") or []
        if ids:
            collection.delete(ids=list(ids))
    except Exception:
        pass


def ingest_file(
    knowledge_base_id: str,
    file_id: str,
    filename: str,
    file_path: Path,
    doc_type: str,
) -> int:
    """解析 → 切片 → 写入向量库；返回写入的切片数量。"""
    text = extract_text_from_path(file_path, doc_type)
    chunks = chunk_text(text)
    if not chunks:
        return 0

    coll = get_collection(knowledge_base_id)
    _delete_file_chunks(coll, file_id)

    ids = [f"{file_id}_{i}" for i in range(len(chunks))]
    metadatas = [
        {
            "file_id": file_id,
            "file_name": filename,
            "file_type": doc_type,
            "chunk_index": str(i),
        }
        for i in range(len(chunks))
    ]
    coll.add(ids=ids, documents=chunks, metadatas=metadatas)
    return len(chunks)


def bootstrap_default_kb_if_empty(knowledge_base_id: str = "default") -> None:
    """首次启动且库为空时，写入演示种子片段。"""
    coll = get_collection(knowledge_base_id)
    try:
        if coll.count() > 0:
            return
    except Exception:
        return

    ids: list[str] = []
    documents: list[str] = []
    metadatas: list[dict] = []
    for i, row in enumerate(SEED_CHUNKS):
        fid = row["file_id"]
        ids.append(f"{fid}_seed_{i}")
        documents.append(row["text"])
        metadatas.append(
            {
                "file_id": fid,
                "file_name": row["file_name"],
                "file_type": row["file_type"],
                "chunk_index": str(i),
            }
        )
    if ids:
        coll.add(ids=ids, documents=documents, metadatas=metadatas)
