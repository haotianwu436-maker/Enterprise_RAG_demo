"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SourceReferenceCard } from "./SourceReferenceCard";
import { SuggestedActionsBar } from "./SuggestedActions";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "animate-fade-in flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[min(720px,100%)] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-card",
          isUser
            ? "border-border bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-zinc-100"
            : "border-border bg-surface-overlay/80 text-zinc-200"
        )}
      >
        {!isUser ? (
          <div className="mb-2 flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-medium text-zinc-400">
              企业知识助手
            </span>
            <span>
              {new Date(message.createdAt).toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ) : null}

        {message.paragraphs?.map((p, i) => (
          <p key={i} className={cn(i > 0 && "mt-3")}>
            {p}
          </p>
        ))}

        {message.sections?.map((sec, idx) => (
          <div key={idx} className={cn("mt-4", idx === 0 && !message.paragraphs?.length && "mt-0")}>
            {sec.title ? (
              <div className="mb-2 text-sm font-semibold text-zinc-100">{sec.title}</div>
            ) : null}
            <ul className="list-disc space-y-2 pl-5 marker:text-zinc-500">
              {sec.bullets.map((b, j) => (
                <li key={j} className="text-zinc-300">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {!isUser && message.sources ? <SourceReferenceCard sources={message.sources} /> : null}
        {!isUser && message.suggestedActions ? (
          <SuggestedActionsBar actions={message.suggestedActions} />
        ) : null}
      </div>
    </div>
  );
}
