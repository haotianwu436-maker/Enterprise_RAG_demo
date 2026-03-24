from typing import List

from pydantic import BaseModel, ConfigDict, Field


class KnowledgeFileStatus(BaseModel):
    parsed: bool = False
    embedded: bool = False
    searchable: bool = False
    transcriptionPending: bool = False


class KnowledgeFileOut(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    type: str
    size: str
    uploadedAt: str
    category: str
    status: KnowledgeFileStatus
    resultBadge: str


class KnowledgeFilesResponse(BaseModel):
    files: List[KnowledgeFileOut]


class UploadResponse(BaseModel):
    success: bool = True
    file: KnowledgeFileOut
