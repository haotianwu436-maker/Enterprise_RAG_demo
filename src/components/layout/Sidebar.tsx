"use client";

import { useAppState } from "@/context/AppStateContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/chat", label: "智能问答", icon: "◇" },
  { href: "/knowledge", label: "知识库", icon: "▦" },
  { href: "/reports", label: "数据报表", icon: "◧" },
  { href: "/settings", label: "系统设置", icon: "⚙" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const {
    conversations,
    activeConversationId,
    selectConversation,
    createConversation,
    reportStats,
  } = useAppState();

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-surface-raised/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-surface-overlay shadow-glow">
          <span className="text-lg text-accent">◆</span>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-zinc-100">企业知识库 AI</div>
          <div className="text-xs text-zinc-500">Enterprise Knowledge Copilot</div>
        </div>
      </div>

      <nav className="px-3 pb-2">
        <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          工作区
        </div>
        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-white/[0.06] text-zinc-100 shadow-card"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <span className="w-4 text-center text-zinc-500">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mx-3 my-3 h-px bg-border" />

      <div className="flex min-h-0 flex-1 flex-col px-3">
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            会话
          </div>
          <button
            type="button"
            onClick={createConversation}
            className="rounded-md border border-border bg-surface-overlay px-2 py-1 text-[11px] font-medium text-zinc-200 transition hover:border-border-strong hover:text-white"
          >
            新建
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 pb-4">
          {conversations.map((c) => {
            const active = c.id === activeConversationId && pathname?.startsWith("/chat");
            return (
              <Link
                key={c.id}
                href="/chat"
                onClick={() => selectConversation(c.id)}
                className={cn(
                  "flex w-full flex-col rounded-lg border px-3 py-2.5 text-left transition",
                  active
                    ? "border-accent/35 bg-accent/10 shadow-glow"
                    : "border-transparent bg-transparent hover:border-border hover:bg-white/[0.03]"
                )}
              >
                <div className="line-clamp-2 text-sm text-zinc-100">{c.title}</div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  {new Date(c.updatedAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="rounded-xl border border-border bg-surface-overlay p-3 text-xs leading-relaxed text-zinc-400">
          已接入企业知识库{" "}
          <span className="font-semibold text-zinc-200">{reportStats.totalFiles}</span>{" "}
          份资料 · 支持文档、图片、视频统一接入
        </div>
      </div>
    </aside>
  );
}
