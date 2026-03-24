import type { SourceReference } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeLabel: Record<string, string> = {
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
  image: "图片",
  video: "视频",
  doc: "文档",
};

export function SourceReferenceCard({ sources }: { sources: SourceReference[] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface-overlay/60 p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          引用来源
        </div>
        <div className="text-[11px] text-zinc-500">来自企业私域知识切片</div>
      </div>
      <ul className="mt-3 space-y-2">
        {sources.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted/40 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-100">{s.title}</div>
              {s.snippet ? (
                <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                  {s.snippet}
                </div>
              ) : null}
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md border border-border-strong bg-surface-overlay px-2 py-0.5 text-[10px] font-medium text-zinc-400"
              )}
            >
              {typeLabel[s.type] ?? "文件"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
