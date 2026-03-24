"use client";

import { useAppState } from "@/context/AppStateContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  rightSlot?: ReactNode;
};

export function TopBar({ title, subtitle, badge, rightSlot }: TopBarProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-border bg-surface/80 px-8 py-5 backdrop-blur-md">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">{title}</h1>
          {badge ? (
            <span
              className={cn(
                "rounded-full border border-border-strong bg-surface-overlay px-2.5 py-0.5 text-[11px] font-medium text-zinc-400"
              )}
            >
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {rightSlot ? <div className="shrink-0 pt-0.5">{rightSlot}</div> : null}
    </header>
  );
}

export function ChatTopBar() {
  const { conversations, activeConversationId } = useAppState();
  const current = conversations.find((c) => c.id === activeConversationId);

  return (
    <TopBar
      title={current?.title ?? "智能问答"}
      subtitle="当前回答基于私域知识与语义检索结果生成 · 可扩展为企业内部智能问答与决策辅助系统"
      badge="知识库：企业主库（生产）"
      rightSlot={
        <div className="rounded-xl border border-border bg-surface-overlay px-3 py-2 text-right text-xs text-zinc-400">
          <div className="text-zinc-500">会话 ID</div>
          <div className="font-mono text-[11px] text-zinc-300">
            {activeConversationId
              ? `${activeConversationId.slice(0, 12)}…`
              : "—"}
          </div>
        </div>
      }
    />
  );
}
