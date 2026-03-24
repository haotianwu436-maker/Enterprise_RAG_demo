"use client";

import { useAppState } from "@/context/AppStateContext";
import { cn } from "@/lib/utils";

export function ToastHost() {
  const { toasts, dismissToast } = useAppState();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={cn(
            "pointer-events-auto animate-slide-up rounded-xl border px-4 py-3 text-left text-sm shadow-card backdrop-blur-md transition hover:border-border-strong",
            t.kind === "success" && "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
            t.kind === "info" && "border-accent/25 bg-surface-overlay/90 text-zinc-100",
            t.kind === "error" && "border-red-500/30 bg-red-500/10 text-red-100"
          )}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            {t.kind === "success" ? "已完成" : t.kind === "error" ? "出错" : "提示"}
          </div>
          <div className="mt-1 leading-relaxed text-zinc-100">{t.message}</div>
        </button>
      ))}
    </div>
  );
}
