"""
本地 JSON 持久化 + uploads 目录。
后续可替换为 PostgreSQL / pgvector：保留 KnowledgeFileOut 结构作为 API 契约即可。
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data" / "knowledge_files.json"
UPLOAD_DIR = ROOT / "uploads"

_lock = Lock()


def _ensure_dirs() -> None:
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _default_seed() -> List[Dict[str, Any]]:
    """与前端 mock 对齐的初始数据（便于首次启动即有列表）。"""
    return [
        {
            "id": "file_kf-1",
            "name": "员工培训手册 v2.pdf",
            "type": "PDF",
            "size": "4.2 MB",
            "uploadedAt": "2025-03-18T10:20:00",
            "category": "培训资料",
            "status": {
                "parsed": True,
                "embedded": True,
                "searchable": True,
                "transcriptionPending": False,
            },
            "resultBadge": "可用于问答",
        },
        {
            "id": "file_kf-2",
            "name": "客户服务流程说明.docx",
            "type": "WORD",
            "size": "1.1 MB",
            "uploadedAt": "2025-03-19T14:05:00",
            "category": "制度文档",
            "status": {
                "parsed": True,
                "embedded": True,
                "searchable": True,
                "transcriptionPending": False,
            },
            "resultBadge": "可用于问答",
        },
        {
            "id": "file_kf-3",
            "name": "2025Q1 客诉统计.xlsx",
            "type": "EXCEL",
            "size": "860 KB",
            "uploadedAt": "2025-03-20T09:40:00",
            "category": "客户案例",
            "status": {
                "parsed": True,
                "embedded": True,
                "searchable": True,
                "transcriptionPending": False,
            },
            "resultBadge": "可用于问答",
        },
    ]


def _load_raw() -> Dict[str, Any]:
    _ensure_dirs()
    if not DATA_PATH.exists():
        payload = {"files": _default_seed()}
        DATA_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return payload
    try:
        return json.loads(DATA_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        payload = {"files": _default_seed()}
        DATA_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return payload


def _save_raw(data: Dict[str, Any]) -> None:
    _ensure_dirs()
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def list_files() -> List[Dict[str, Any]]:
    with _lock:
        data = _load_raw()
        return list(data.get("files", []))


def append_file(record: Dict[str, Any]) -> Dict[str, Any]:
    with _lock:
        data = _load_raw()
        files = list(data.get("files", []))
        files.insert(0, record)
        data["files"] = files
        _save_raw(data)
        return record


def update_file(file_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """浅合并更新一条文件记录（status 等字段整体覆盖）。"""
    with _lock:
        data = _load_raw()
        files = list(data.get("files", []))
        for i, f in enumerate(files):
            if f.get("id") == file_id:
                merged = {**f, **updates}
                files[i] = merged
                data["files"] = files
                _save_raw(data)
                return merged
        return None


def get_file(file_id: str) -> Optional[Dict[str, Any]]:
    with _lock:
        data = _load_raw()
        for f in data.get("files", []):
            if f.get("id") == file_id:
                return f
        return None


def format_uploaded_at(dt: Optional[datetime] = None) -> str:
    dt = dt or datetime.now()
    # ISO 8601，便于前端 Date 解析；展示格式由 UI 本地化
    return dt.replace(microsecond=0).isoformat()


def human_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.1f} MB"


def guess_doc_type(filename: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return "PDF"
    if lower.endswith((".doc", ".docx")):
        return "WORD"
    if lower.endswith((".xls", ".xlsx", ".csv")):
        return "EXCEL"
    if lower.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
        return "IMAGE"
    if lower.endswith((".mp4", ".mov", ".mkv", ".webm")):
        return "VIDEO"
    return "DOC"


def build_new_file_record(
    *,
    name: str,
    size_bytes: int,
    category: str = "未分类",
    parsed: bool = False,
    embedded: bool = False,
    searchable: bool = False,
    transcription_pending: bool = True,
) -> Dict[str, Any]:
    badge = "解析中"
    if searchable and embedded and parsed and not transcription_pending:
        badge = "可用于问答"
    elif not parsed:
        badge = "解析中"

    return {
        "id": f"file_{uuid.uuid4().hex[:10]}",
        "name": name,
        "type": guess_doc_type(name),
        "size": human_size(size_bytes),
        "uploadedAt": format_uploaded_at(),
        "category": category,
        "status": {
            "parsed": parsed,
            "embedded": embedded,
            "searchable": searchable,
            "transcriptionPending": transcription_pending,
        },
        "resultBadge": badge,
    }


def save_upload_bytes(filename: str, data: bytes) -> Path:
    _ensure_dirs()
    safe_name = filename.replace("\\", "_").replace("/", "_")
    dest = UPLOAD_DIR / f"{uuid.uuid4().hex}_{safe_name}"
    dest.write_bytes(data)
    return dest
