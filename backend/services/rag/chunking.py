from __future__ import annotations


def chunk_text(text: str, max_chars: int = 900, overlap: int = 150) -> list[str]:
    """固定窗口 + 重叠，适合中文与英文混合。"""
    t = " ".join(text.split())
    if not t:
        return []
    chunks: list[str] = []
    i = 0
    n = len(t)
    while i < n:
        piece = t[i : i + max_chars]
        if piece.strip():
            chunks.append(piece.strip())
        i += max(1, max_chars - overlap)
    return chunks
