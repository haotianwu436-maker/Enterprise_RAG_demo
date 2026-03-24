"use client";

import type { TrendPoint } from "@/lib/types";
import { useMemo } from "react";

export function DashboardChart({ data }: { data: TrendPoint[] }) {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  return (
    <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-100">最近 7 天问答量</div>
          <div className="mt-1 text-xs text-zinc-500">趋势用于运营复盘与知识库补全优先级评估（Demo 数据）</div>
        </div>
        <div className="rounded-full border border-border bg-surface-muted px-3 py-1 text-[11px] text-zinc-400">
          自动刷新：关闭
        </div>
      </div>

      <div className="mt-6">
        <div className="flex h-44 items-end gap-3">
          {data.map((d) => {
            const h = Math.round((d.value / max) * 100);
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-full max-w-[44px] rounded-xl bg-gradient-to-t from-accent/15 to-accent/60 shadow-glow transition hover:to-accent/80"
                    style={{ height: `${Math.max(8, h)}%` }}
                    title={`${d.label}: ${d.value}`}
                  />
                </div>
                <div className="text-[11px] text-zinc-500">{d.label.slice(5)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
