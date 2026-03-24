export type FileParseStatus = "parsed" | "parsing" | "failed";

export type KnowledgeProcessStage =
  | "parsed"
  | "vectorized"
  | "qa_ready"
  | "awaiting_transcript";

export type KnowledgeFileType = "pdf" | "word" | "excel" | "image" | "video";

export interface SourceReference {
  id: string;
  title: string;
  type: KnowledgeFileType | "doc";
  /** 后端 RAG 片段摘要（可选） */
  snippet?: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  createdAt: string;
  /** Plain paragraphs */
  paragraphs?: string[];
  /** Structured sections with optional title */
  sections?: { title?: string; bullets: string[] }[];
  sources?: SourceReference[];
  suggestedActions?: SuggestedAction[];
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface KnowledgeFileItem {
  id: string;
  name: string;
  fileType: KnowledgeFileType;
  uploadedAt: string;
  status: FileParseStatus;
  processStages: KnowledgeProcessStage[];
  tags: string[];
  sizeLabel: string;
}

export interface ReportStats {
  totalFiles: number;
  todayQueries: number;
  topCategoryLabel: string;
  weeklyActiveUsers: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface FrequentQuestion {
  id: string;
  question: string;
  count: number;
  category: string;
}

export interface AiInsight {
  id: string;
  text: string;
  tone: "neutral" | "warning" | "positive";
}

/** 后端 API 类型别名（详细定义见 apiTypes.ts） */
export type {
  ChatSourceApi as ChatSource,
  ChatReplyApi as ChatReply,
  ChatResponseApi as ChatResponse,
  KnowledgeFileApi as KnowledgeFile,
  KnowledgeFilesApiResponse as KnowledgeFilesListResponse,
  UploadResponseApi as UploadResponse,
} from "./apiTypes";
