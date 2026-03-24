/**
 * 与 FastAPI 后端约定的 JSON 结构（独立于 UI 领域模型）。
 */

export type KnowledgeFileStatusApi = {
  parsed: boolean;
  embedded: boolean;
  searchable: boolean;
  transcriptionPending: boolean;
};

export type KnowledgeFileApi = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
  status: KnowledgeFileStatusApi;
  resultBadge: string;
};

export type KnowledgeFilesApiResponse = {
  files: KnowledgeFileApi[];
};

export type ChatSourceApi = {
  id: string;
  title: string;
  type: string;
  snippet?: string;
};

export type ChatReplyApi = {
  id: string;
  role: string;
  content: string;
  sources: ChatSourceApi[];
  suggestedActions: string[];
};

export type ChatResponseApi = {
  reply: ChatReplyApi;
};

export type UploadResponseApi = {
  success: boolean;
  file: KnowledgeFileApi;
};
