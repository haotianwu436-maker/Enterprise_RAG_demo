"use client";

import { buildMockAssistantReply } from "@/data/mock/aiResponses";
import { frequentQuestions as fqSeed, reportStats as statsSeed, trendLast7Days as trendSeed } from "@/data/mock/dashboard";
import { initialConversations } from "@/data/mock/conversations";
import { initialKnowledgeFiles } from "@/data/mock/knowledgeFiles";
import { mapChatReplyToAssistantMessage, mapKnowledgeFileApiToItem } from "@/lib/mappers";
import type {
  ChatMessage,
  Conversation,
  FrequentQuestion,
  KnowledgeFileItem,
  KnowledgeFileType,
  ReportStats,
  TrendPoint,
} from "@/lib/types";
import {
  getKnowledgeFiles,
  isApiConfigured,
  sendChatMessage,
  uploadKnowledgeFile as uploadKnowledgeFileRequest,
} from "@/services/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "success" | "info" | "error";

export type ToastItem = {
  id: string;
  message: string;
  kind: ToastKind;
};

type AppStateValue = {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectConversation: (id: string) => void;
  createConversation: () => void;
  sendUserMessage: (text: string) => Promise<void>;
  isAssistantTyping: boolean;

  knowledgeFiles: KnowledgeFileItem[];
  knowledgeLoading: boolean;
  knowledgeError: string | null;
  refreshKnowledgeFiles: (opts?: { silent?: boolean }) => Promise<void>;
  /** 离线演示：模拟接入 */
  addSimulatedUpload: (payload: { name: string; fileType: KnowledgeFileType }) => void;
  /** 真实上传；未配置 API 时返回 false */
  uploadKnowledgeFile: (file: File) => Promise<boolean>;

  reportStats: ReportStats;
  trend: TrendPoint[];
  frequentQuestions: FrequentQuestion[];

  toasts: ToastItem[];
  pushToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

async function minTypingDelay(ms: number, started: number) {
  const elapsed = Date.now() - started;
  if (elapsed < ms) {
    await new Promise((r) => setTimeout(r, ms - elapsed));
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    JSON.parse(JSON.stringify(initialConversations)) as Conversation[]
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null
  );
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFileItem[]>(() =>
    JSON.parse(JSON.stringify(initialKnowledgeFiles)) as KnowledgeFileItem[]
  );
  const [knowledgeLoading, setKnowledgeLoading] = useState(() => isApiConfigured());
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [reportStatsState, setReportStatsState] = useState<ReportStats>(() => ({ ...statsSeed }));
  const [trend] = useState<TrendPoint[]>(() => [...trendSeed]);
  const [frequentQuestions] = useState<FrequentQuestion[]>(() => [...fqSeed]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = newId("toast");
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, kind === "error" ? 4200 : 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshKnowledgeFiles = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!isApiConfigured()) return;
      const silent = Boolean(opts?.silent);
      if (!silent) {
        setKnowledgeLoading(true);
        setKnowledgeError(null);
      }
      try {
        const res = await getKnowledgeFiles();
        const mapped = res.files.map(mapKnowledgeFileApiToItem);
        setKnowledgeFiles(mapped);
        setReportStatsState((s) => ({ ...s, totalFiles: mapped.length }));
      } catch {
        if (!silent) {
          setKnowledgeError("无法连接知识库服务，已保留当前列表");
        }
        pushToast("知识库列表刷新失败", "info");
      } finally {
        if (!silent) setKnowledgeLoading(false);
      }
    },
    [pushToast]
  );

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    (async () => {
      setKnowledgeLoading(true);
      setKnowledgeError(null);
      try {
        const res = await getKnowledgeFiles();
        if (cancelled) return;
        const mapped = res.files.map(mapKnowledgeFileApiToItem);
        setKnowledgeFiles(mapped);
        setReportStatsState((s) => ({ ...s, totalFiles: mapped.length }));
      } catch {
        if (!cancelled) {
          setKnowledgeError("无法连接知识库服务，已使用本地演示数据");
        }
      } finally {
        if (!cancelled) setKnowledgeLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const createConversation = useCallback(() => {
    const id = newId("conv");
    const conv: Conversation = {
      id,
      title: "新会话",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(id);
    pushToast("已创建新会话", "info");
  }, [pushToast]);

  const sendUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      let targetId = activeConversationId;
      if (!targetId) {
        const id = newId("conv");
        const conv: Conversation = {
          id,
          title: trimmed.slice(0, 18) + (trimmed.length > 18 ? "…" : ""),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveConversationId(id);
        targetId = id;
      }

      const userMsg: ChatMessage = {
        id: newId("msg"),
        role: "user",
        createdAt: new Date().toISOString(),
        paragraphs: [trimmed],
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetId) return c;
          const nextTitle =
            c.messages.length === 0
              ? trimmed.slice(0, 22) + (trimmed.length > 22 ? "…" : "")
              : c.title;
          return {
            ...c,
            title: nextTitle,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, userMsg],
          };
        })
      );

      setIsAssistantTyping(true);
      const started = Date.now();

      let assistantMsg: ChatMessage | undefined;

      try {
        if (isApiConfigured()) {
          const res = await sendChatMessage({
            message: trimmed,
            conversationId: targetId,
            knowledgeBaseId: "default",
          });
          await minTypingDelay(520, started);
          assistantMsg = mapChatReplyToAssistantMessage(res.reply, new Date().toISOString());
        }
      } catch {
        if (isApiConfigured()) {
          pushToast("无法连接问答服务，已使用本地模拟回复", "info");
        }
      }

      if (!assistantMsg) {
        await minTypingDelay(900 + Math.random() * 400, started);
        const assistantBody = buildMockAssistantReply(trimmed);
        assistantMsg = {
          id: newId("msg"),
          role: "assistant",
          createdAt: new Date().toISOString(),
          ...assistantBody,
        };
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: [...c.messages, assistantMsg],
              }
            : c
        )
      );

      setIsAssistantTyping(false);
    },
    [activeConversationId, pushToast]
  );

  const addSimulatedUpload = useCallback(
    ({ name, fileType }: { name: string; fileType: KnowledgeFileType }) => {
      const item: KnowledgeFileItem = {
        id: newId("kf"),
        name,
        fileType,
        uploadedAt: new Date().toISOString(),
        status: "parsing",
        processStages: ["parsed", "vectorized"],
        tags: ["新上传"],
        sizeLabel: "模拟",
      };
      setKnowledgeFiles((prev) => [item, ...prev]);
      setReportStatsState((s) => ({ ...s, totalFiles: s.totalFiles + 1 }));
      pushToast("已接入知识库：文件已进入解析与向量化队列", "success");
    },
    [pushToast]
  );

  const uploadKnowledgeFile = useCallback(
    async (file: File): Promise<boolean> => {
      if (!isApiConfigured()) {
        pushToast("未配置后端地址，请使用示例文件离线演示", "info");
        return false;
      }
      try {
        await uploadKnowledgeFileRequest(file);
        await refreshKnowledgeFiles({ silent: true });
        pushToast("文件已接入知识库，正在处理中", "success");
        return true;
      } catch {
        pushToast("上传失败，请稍后重试", "error");
        return false;
      }
    },
    [pushToast, refreshKnowledgeFiles]
  );

  const value = useMemo<AppStateValue>(
    () => ({
      conversations,
      activeConversationId,
      selectConversation,
      createConversation,
      sendUserMessage,
      isAssistantTyping,
      knowledgeFiles,
      knowledgeLoading,
      knowledgeError,
      refreshKnowledgeFiles,
      addSimulatedUpload,
      uploadKnowledgeFile,
      reportStats: reportStatsState,
      trend,
      frequentQuestions,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      conversations,
      activeConversationId,
      selectConversation,
      createConversation,
      sendUserMessage,
      isAssistantTyping,
      knowledgeFiles,
      knowledgeLoading,
      knowledgeError,
      refreshKnowledgeFiles,
      addSimulatedUpload,
      uploadKnowledgeFile,
      reportStatsState,
      trend,
      frequentQuestions,
      toasts,
      pushToast,
      dismissToast,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
