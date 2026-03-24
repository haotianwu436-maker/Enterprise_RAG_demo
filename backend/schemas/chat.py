from typing import List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="用户问题")
    conversationId: Optional[str] = Field(default=None, description="可选会话 ID")
    knowledgeBaseId: str = Field(default="default", description="知识库 ID")


class ChatSource(BaseModel):
    id: str
    title: str
    type: str
    snippet: str = ""


class ChatReply(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    sources: List[ChatSource] = Field(default_factory=list)
    suggestedActions: List[str] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: ChatReply
