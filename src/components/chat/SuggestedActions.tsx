"use client";

import type { SuggestedAction } from "@/lib/types";
import { useAppState } from "@/context/AppStateContext";

export function SuggestedActionsBar({ actions }: { actions: SuggestedAction[] }) {
  const { pushToast } = useAppState();
  if (!actions.length) return null;

  return (
    <div className="mt-4 rounded-xl border border-dashed border-accent/25 bg-accent/5 p-4">
      <div className="text-xs font-semibold text-zinc-300">AI 建议动作</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => pushToast(`已记录动作「${a.label}」（Demo）`, "info")}
            className="rounded-lg border border-border-strong bg-surface-overlay px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-accent/40 hover:text-white"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
