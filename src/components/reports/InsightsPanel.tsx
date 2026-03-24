import { aiInsights } from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export function InsightsPanel() {
  return (
    <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-100">AI 自动洞察</div>
        <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] text-zinc-400">
          每小时刷新（Demo）
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {aiInsights.map((i) => (
          <li
            key={i.id}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm leading-relaxed",
              i.tone === "warning" && "border-amber-500/20 bg-amber-500/5 text-amber-100",
              i.tone === "positive" && "border-emerald-500/20 bg-emerald-500/5 text-emerald-100",
              i.tone === "neutral" && "border-border bg-surface-muted/30 text-zinc-200"
            )}
          >
            {i.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
