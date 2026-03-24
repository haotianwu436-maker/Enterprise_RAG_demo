from __future__ import annotations

import chromadb
from chromadb.config import Settings

from services.storage import ROOT

CHROMA_DIR = ROOT / "data" / "chroma"

_client: chromadb.PersistentClient | None = None


def get_client() -> chromadb.PersistentClient:
    global _client
    if _client is None:
        CHROMA_DIR.mkdir(parents=True, exist_ok=True)
        _client = chromadb.PersistentClient(
            path=str(CHROMA_DIR),
            settings=Settings(anonymized_telemetry=False),
        )
    return _client


def get_collection(knowledge_base_id: str):
    """每个知识库独立 collection，使用 Chroma 默认嵌入模型。"""
    safe = "".join(c if c.isalnum() or c in ("_", "-") else "_" for c in knowledge_base_id)
    name = f"kb_{safe}"[:512]
    return get_client().get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )
