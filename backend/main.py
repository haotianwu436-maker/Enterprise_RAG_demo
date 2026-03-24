from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.chat import router as chat_router
from routers.knowledge import router as knowledge_router

_BACKEND_ROOT = Path(__file__).resolve().parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv(_BACKEND_ROOT / ".env")
    from services.rag.ingest import bootstrap_default_kb_if_empty

    bootstrap_default_kb_if_empty("default")
    yield


app = FastAPI(
    title="企业知识库 AI · API",
    version="0.2.0",
    description="RAG：Chroma 向量检索 + 可选 OpenAI 生成；上传文件自动解析入库。",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(knowledge_router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
