import type {
  ChatReplyApi,
  ChatSourceApi,
  KnowledgeFileApi,
  KnowledgeFileStatusApi,
} from "@/lib/apiTypes";
import type {
  ChatMessage,
  FileParseStatus,
  KnowledgeFileItem,
  KnowledgeFileType,
  KnowledgeProcessStage,
  SourceReference,
  SuggestedAction,
} from "@/lib/types";

export function mapApiTypeToFileType(t: string): KnowledgeFileType {
  const u = t.toUpperCase();
  if (u === "PDF") return "pdf";
  if (u === "WORD" || u === "DOC") return "word";
  if (u === "EXCEL" || u === "XLS" || u === "CSV") return "excel";
  if (u === "IMAGE" || u === "IMG") return "image";
  if (u === "VIDEO") return "video";
  return "pdf";
}

export function mapApiSourceTypeToRefType(t: string): SourceReference["type"] {
  const u = t.toUpperCase();
  if (u === "PDF") return "pdf";
  if (u === "WORD" || u === "DOC") return "word";
  if (u === "EXCEL" || u === "XLS") return "excel";
  if (u === "IMAGE") return "image";
  if (u === "VIDEO") return "video";
  return "doc";
}

function stagesFromStatus(s: KnowledgeFileStatusApi): KnowledgeProcessStage[] {
  const out: KnowledgeProcessStage[] = [];
  if (s.parsed) out.push("parsed");
  if (s.embedded) out.push("vectorized");
  if (s.searchable) out.push("qa_ready");
  if (s.transcriptionPending) out.push("awaiting_transcript");
  return out;
}

function deriveParseStatus(f: KnowledgeFileApi): FileParseStatus {
  if (f.resultBadge.includes("失败")) return "failed";
  if (f.status.searchable) return "parsed";
  return "parsing";
}

export function mapKnowledgeFileApiToItem(f: KnowledgeFileApi): KnowledgeFileItem {
  const tags =
    f.category && f.category !== "未分类" ? [f.category] : f.category === "未分类" ? ["未分类"] : [];

  return {
    id: f.id,
    name: f.name,
    fileType: mapApiTypeToFileType(f.type),
    uploadedAt: f.uploadedAt,
    status: deriveParseStatus(f),
    processStages: stagesFromStatus(f.status),
    tags: tags.length ? tags : ["未分类"],
    sizeLabel: f.size,
  };
}

export function mapChatSources(sources: ChatSourceApi[]): SourceReference[] {
  return sources.map((s) => ({
    id: s.id,
    title: s.title,
    type: mapApiSourceTypeToRefType(s.type),
    snippet: s.snippet,
  }));
}

export function mapSuggestedActionStrings(actions: string[]): SuggestedAction[] {
  return actions.map((label, i) => ({ id: `sa-${i}-${label.slice(0, 6)}`, label }));
}

export function mapChatReplyToAssistantMessage(reply: ChatReplyApi, createdAt: string): ChatMessage {
  const blocks = reply.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const paragraphs = blocks.length ? blocks : [reply.content];

  return {
    id: reply.id,
    role: "assistant",
    createdAt,
    paragraphs,
    sources: reply.sources?.length ? mapChatSources(reply.sources) : undefined,
    suggestedActions: reply.suggestedActions?.length
      ? mapSuggestedActionStrings(reply.suggestedActions)
      : undefined,
  };
}
