import type { KnowledgeFileItem, KnowledgeProcessStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeIcon: Record<string, string> = {
  pdf: "PDF",
  word: "W",
  excel: "X",
  image: "图",
  video: "视",
};

const statusLabel: Record<string, { text: string; className: string }> = {
  parsed: { text: "已解析", className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200" },
  parsing: { text: "解析中", className: "border-amber-500/25 bg-amber-500/10 text-amber-200" },
  failed: { text: "失败", className: "border-red-500/25 bg-red-500/10 text-red-200" },
};

const stageCopy: Record<KnowledgeProcessStage, string> = {
  parsed: "文档解析",
  vectorized: "向量化完成",
  qa_ready: "可用于问答",
  awaiting_transcript: "等待转写",
};

export function FileCard({ file }: { file: KnowledgeFileItem }) {
  const st = statusLabel[file.status] ?? statusLabel.parsed;

  return (
    <div className="group rounded-2xl border border-border bg-surface-overlay/70 p-5 shadow-card transition hover:border-border-strong">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-muted text-xs font-bold text-zinc-200">
            {typeIcon[file.fileType] ?? "文"}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-100">{file.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
              <span>{file.sizeLabel}</span>
              <span className="text-zinc-600">·</span>
              <span>
                {new Date(file.uploadedAt).toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold", st.className)}>
          {st.text}
        </span>
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">知识处理状态</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(stageCopy) as KnowledgeProcessStage[]).map((key) => {
            const on = file.processStages.includes(key);
            return (
              <span
                key={key}
                className={cn(
                  "rounded-lg border px-2 py-1 text-[11px]",
                  on
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                    : "border-border bg-surface-muted/30 text-zinc-600 line-through decoration-zinc-600"
                )}
              >
                {stageCopy[key]}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {file.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-surface-muted/40 px-2.5 py-1 text-[11px] text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
