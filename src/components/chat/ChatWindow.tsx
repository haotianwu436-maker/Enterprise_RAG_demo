"use client";

import { useAppState } from "@/context/AppStateContext";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow() {
  const { conversations, activeConversationId, isAssistantTyping } = useAppState();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const resolvedId = activeConversationId ?? conversations[0]?.id ?? null;
  const current = conversations.find((c) => c.id === resolvedId) ?? null;
  const messages = current?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isAssistantTyping]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(91,140,255,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(52,211,153,0.08),transparent_50%)]">
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-overlay/60 p-8 text-sm text-zinc-400 shadow-card">
              <div className="text-base font-semibold text-zinc-200">开始一个新的分析会话</div>
              <p className="mt-2 leading-relaxed">
                你可以询问客户服务、培训体系、合同审批、销售转化等问题。系统将结合知识库切片与引用来源给出结构化回答。
              </p>
            </div>
          ) : null}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {isAssistantTyping ? (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[min(720px,100%)] rounded-2xl border border-border bg-surface-overlay/80 px-4 py-3 shadow-card">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  AI 正在分析知识库…
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  正在执行语义检索、证据聚合与合规风险提示生成
                </div>
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
