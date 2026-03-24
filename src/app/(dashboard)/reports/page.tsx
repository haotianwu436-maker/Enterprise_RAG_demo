"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DashboardChart } from "@/components/reports/DashboardChart";
import { InsightsPanel } from "@/components/reports/InsightsPanel";
import { StatsCard } from "@/components/reports/StatsCard";
import {
  aiSummaryBlurb,
  recommendationCards,
} from "@/data/mock/dashboard";
import { useAppState } from "@/context/AppStateContext";

export default function ReportsPage() {
  const { reportStats, trend, frequentQuestions } = useAppState();

  return (
    <>
      <TopBar
        title="数据分析 / 报表"
        subtitle="从问答行为反哺知识运营：识别高频主题、发现缺口文档、形成可执行的优化清单。"
        badge="运营洞察"
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="知识库文件总数"
              value={String(reportStats.totalFiles)}
              hint="含制度、培训、数据与多媒体资料"
              accent="blue"
            />
            <StatsCard
              label="今日问答次数"
              value={String(reportStats.todayQueries)}
              hint="统计口径：完成一次模型回复计 1 次"
              accent="green"
            />
            <StatsCard
              label="常见问题分类"
              value={reportStats.topCategoryLabel}
              hint="按会话意图聚类（Demo）"
              accent="amber"
            />
            <StatsCard
              label="本周活跃用户数"
              value={String(reportStats.weeklyActiveUsers)}
              hint="去重登录用户（Demo）"
              accent="violet"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <DashboardChart data={trend} />
            </div>
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
              <div className="text-sm font-semibold text-zinc-100">高频问题</div>
              <div className="mt-1 text-xs text-zinc-500">用于驱动知识库补全与流程改造优先级</div>
              <ol className="mt-4 space-y-3">
                {frequentQuestions.map((q, idx) => (
                  <li
                    key={q.id}
                    className="rounded-xl border border-border bg-surface-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-zinc-500">
                          #{idx + 1} · {q.category}
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">{q.question}</div>
                      </div>
                      <div className="shrink-0 rounded-lg border border-border bg-surface-overlay px-2 py-1 text-[11px] text-zinc-400">
                        {q.count} 次
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
              <div className="text-sm font-semibold text-zinc-100">AI 自动总结</div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{aiSummaryBlurb}</p>
              <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted/20 p-4 text-xs text-zinc-500">
                可将此总结推送至飞书/企微群，或一键生成管理层周报（后续对接工作流）。
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
              <div className="text-sm font-semibold text-zinc-100">建议事项</div>
              <ul className="mt-4 space-y-3">
                {recommendationCards.map((t, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl border border-border bg-surface-muted/30 p-4 text-sm text-zinc-200"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface-overlay text-[11px] font-bold text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <InsightsPanel />
        </div>
      </div>
    </>
  );
}
