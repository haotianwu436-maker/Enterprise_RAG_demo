import type {
  ChatResponseApi,
  KnowledgeFilesApiResponse,
  UploadResponseApi,
} from "@/lib/apiTypes";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  body?: string;

  constructor(message: string, status: number, body?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}

export function getApiBaseUrl(): string {
  return API_BASE;
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new ApiError("未配置 NEXT_PUBLIC_API_BASE_URL", 0);
  }
  const url = `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "网络错误";
    throw new ApiError(msg, 0);
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const bodyStr = typeof data === "string" ? data : JSON.stringify(data);
    throw new ApiError(`请求失败（${res.status}）`, res.status, bodyStr);
  }
  return data as T;
}

export async function healthCheck(): Promise<{ ok: boolean }> {
  if (!API_BASE) return { ok: false };
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

export type ChatRequestPayload = {
  message: string;
  conversationId?: string | null;
  knowledgeBaseId?: string;
};

export async function sendChatMessage(payload: ChatRequestPayload): Promise<ChatResponseApi> {
  return requestJson<ChatResponseApi>("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: payload.message,
      conversationId: payload.conversationId ?? undefined,
      knowledgeBaseId: payload.knowledgeBaseId ?? "default",
    }),
  });
}

export async function getKnowledgeFiles(): Promise<KnowledgeFilesApiResponse> {
  return requestJson<KnowledgeFilesApiResponse>("/knowledge/files", { method: "GET" });
}

export async function uploadKnowledgeFile(file: File): Promise<UploadResponseApi> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  if (!API_BASE) {
    throw new ApiError("未配置 NEXT_PUBLIC_API_BASE_URL", 0);
  }
  const res = await fetch(`${API_BASE}/knowledge/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const bodyStr = typeof data === "string" ? data : JSON.stringify(data);
    throw new ApiError(`上传失败（${res.status}）`, res.status, bodyStr);
  }
  return data as UploadResponseApi;
}
