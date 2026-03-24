# Enterprise RAG Demo（企业 AI 知识库）

一个可直接演示给客户的「企业 AI 知识库系统」MVP：  
前端是高保真 SaaS 风格控制台，后端为 FastAPI + 本地向量检索（RAG），支持真实上传与问答联调。

## 功能概览

- 智能问答（`/chat`）
  - 支持引用来源与建议动作返回
  - 后端优先走真实检索，前端保留 mock 兜底
- 知识库管理
  - 文件列表读取：`GET /knowledge/files`
  - 文件上传入库：`POST /knowledge/upload`
  - 上传后自动解析/切片/向量化（支持 `pdf/docx/xlsx/txt/md`）
- 数据报表与设置页（前端演示模块）
  - 展示企业级产品化页面、运营分析与策略建议

## 技术栈

### Frontend

- Next.js（App Router）
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Chroma（本地持久化向量库）
- 文档解析：`pypdf`、`python-docx`、`openpyxl`
- 可选 LLM：OpenAI（配置 `OPENAI_API_KEY` 后启用）

## 项目结构

```text
.
├─ src/                       # Next.js 前端
├─ backend/
│  ├─ main.py                 # FastAPI 入口
│  ├─ routers/                # chat / knowledge 接口
│  ├─ schemas/                # Pydantic schema
│  ├─ services/
│  │  ├─ storage.py           # JSON 文件元数据存储
│  │  └─ rag/                 # RAG：解析、切片、向量、检索、LLM
│  ├─ uploads/                # 上传文件落盘目录
│  └─ data/
│     └─ chroma/              # Chroma 持久化目录
└─ README.md
```

## 快速开始

## 1) 启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- 接口文档：[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- 健康检查：[http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

## 2) 启动前端

在项目根目录创建（或确认）`.env.local`：

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

然后运行：

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 3) 可选：启用 OpenAI 生成

复制 `backend/.env.example` 为 `backend/.env`，填写：

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_CHAT_MODEL=gpt-4o-mini
```

说明：

- 未配置 `OPENAI_API_KEY`：后端返回「检索片段摘要拼接」结果（依然是 RAG 检索链路）
- 已配置：后端基于检索到的上下文调用模型生成更连贯回答

## 联调验收清单

- [ ] 聊天页面发送问题后，Network 出现 `POST /chat` 且返回 200
- [ ] 知识库页面加载时，Network 出现 `GET /knowledge/files` 且返回 200
- [ ] 上传本地文件后，Network 出现 `POST /knowledge/upload` 且返回 200
- [ ] 上传成功后文件出现在列表中，状态更新为可索引/可问答

## API 约定（核心）

- `POST /chat`
  - 请求：`message`, `conversationId?`, `knowledgeBaseId?`
  - 响应：`reply`（含 `content`、`sources`、`suggestedActions`）

- `GET /knowledge/files`
  - 响应：`files[]`

- `POST /knowledge/upload`
  - 上传：`multipart/form-data`，字段名 `file`
  - 响应：`success + file`

## 演示建议

推荐演示路径：

1. 智能问答（展示引用来源 + 建议动作）
2. 知识库上传（展示真实上传与自动入库）
3. 报表页（展示产品化能力，不仅是聊天）
4. 设置页（展示可扩展配置能力）

## 后续规划

- 向量库切换到 PostgreSQL + pgvector
- 图片 OCR / 视频转写后入库
- 异步任务队列（大文件解析）
- 多租户权限与审计日志
- 会话持久化与运营看板升级

---

如果你要快速二次演示，可以直接使用本仓库当前版本：前后端已可联通，具备真实 RAG 检索能力与企业级 UI 展示效果。
