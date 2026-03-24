from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas.knowledge import KnowledgeFilesResponse, KnowledgeFileOut, UploadResponse
from services import storage
from services.rag.ingest import ingest_file

router = APIRouter(tags=["knowledge"])


@router.get("/knowledge/files", response_model=KnowledgeFilesResponse)
def get_files() -> KnowledgeFilesResponse:
    raw = storage.list_files()
    files = [KnowledgeFileOut.model_validate(f) for f in raw]
    return KnowledgeFilesResponse(files=files)


@router.post("/knowledge/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="缺少文件名")

    data = await file.read()
    dest = storage.save_upload_bytes(file.filename, data)

    record = storage.build_new_file_record(
        name=file.filename,
        size_bytes=len(data),
        category="未分类",
        parsed=False,
        embedded=False,
        searchable=False,
        transcription_pending=True,
    )
    record["localPath"] = dest.relative_to(storage.ROOT).as_posix()
    storage.append_file(record)

    file_id = record["id"]
    n_chunks = 0
    err = False
    try:
        n_chunks = ingest_file(
            knowledge_base_id="default",
            file_id=file_id,
            filename=file.filename,
            file_path=dest,
            doc_type=record["type"],
        )
    except Exception:
        err = True

    if err:
        storage.update_file(
            file_id,
            {
                "status": {
                    "parsed": False,
                    "embedded": False,
                    "searchable": False,
                    "transcriptionPending": False,
                },
                "resultBadge": "解析失败",
            },
        )
    elif n_chunks > 0:
        storage.update_file(
            file_id,
            {
                "status": {
                    "parsed": True,
                    "embedded": True,
                    "searchable": True,
                    "transcriptionPending": False,
                },
                "resultBadge": "可用于问答",
            },
        )
    else:
        storage.update_file(
            file_id,
            {
                "status": {
                    "parsed": True,
                    "embedded": False,
                    "searchable": False,
                    "transcriptionPending": False,
                },
                "resultBadge": "无文本可索引",
            },
        )

    refreshed = storage.get_file(file_id)
    if not refreshed:
        raise HTTPException(status_code=500, detail="保存记录失败")
    return UploadResponse(success=True, file=KnowledgeFileOut.model_validate(refreshed))
