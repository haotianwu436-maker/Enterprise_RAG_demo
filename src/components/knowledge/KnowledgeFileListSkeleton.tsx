export function KnowledgeFileListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-border bg-surface-overlay/40 p-5"
        >
          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-xl bg-surface-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-surface-muted" />
              <div className="h-3 w-1/2 rounded bg-surface-muted/70" />
            </div>
          </div>
          <div className="mt-4 h-3 w-24 rounded bg-surface-muted/60" />
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 w-16 rounded-lg bg-surface-muted/50" />
            <div className="h-6 w-20 rounded-lg bg-surface-muted/50" />
            <div className="h-6 w-14 rounded-lg bg-surface-muted/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
