import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  hint,
  accent = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "blue" | "green" | "amber" | "violet";
}) {
  const ring =
    accent === "blue"
      ? "from-accent/25 to-transparent"
      : accent === "green"
        ? "from-emerald-500/20 to-transparent"
        : accent === "amber"
          ? "from-amber-500/20 to-transparent"
          : "from-violet-500/20 to-transparent";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-overlay/70 p-5 shadow-card">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70", ring)} />
      <div className="relative">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</div>
        {hint ? <div className="mt-2 text-xs leading-relaxed text-zinc-500">{hint}</div> : null}
      </div>
    </div>
  );
}
