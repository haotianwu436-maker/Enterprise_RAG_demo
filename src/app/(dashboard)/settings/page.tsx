"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useState, type ReactNode } from "react";

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-semibold text-zinc-100">{title}</div>
        {desc ? <div className="mt-1 text-xs text-zinc-500">{desc}</div> : null}
      </div>
      <div className="md:w-[360px]">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [model, setModel] = useState("gpt-4.1");
  const [retrieval, setRetrieval] = useState("kb-only");
  const [style, setStyle] = useState("pro");
  const [role, setRole] = useState("admin");

  return (
    <>
      <TopBar
        title="系统设置"
        subtitle="以下为演示配置项。接入生产后，建议将关键参数纳入变更审批与灰度发布流程。"
        badge="租户级"
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
            <Row
              title="模型选择"
              desc="不同模型在推理成本、合规托管区域与工具调用能力上存在差异。"
            >
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-accent/50"
              >
                <option value="gpt-4.1">GPT-4.1（企业托管）</option>
                <option value="claude">Claude（长文档友好）</option>
                <option value="gemini">Gemini（多模态增强）</option>
              </select>
            </Row>

            <Row
              title="检索模式"
              desc="私域优先可降低幻觉风险；混合模式适合需要外部基准信息的分析类任务。"
            >
              <select
                value={retrieval}
                onChange={(e) => setRetrieval(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-accent/50"
              >
                <option value="kb-only">仅知识库（推荐）</option>
                <option value="hybrid">公域 + 私域（受控）</option>
              </select>
            </Row>

            <Row
              title="输出风格"
              desc="影响回答的结构密度、是否默认附带引用来源与建议动作。"
            >
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-accent/50"
              >
                <option value="short">简洁</option>
                <option value="pro">专业（默认）</option>
                <option value="exec">决策建议</option>
              </select>
            </Row>

            <Row
              title="权限角色"
              desc="用于演示角色能力差异。生产环境建议对接 IAM 与知识空间 ACL。"
            >
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-accent/50"
              >
                <option value="admin">管理员</option>
                <option value="ops">运营</option>
                <option value="staff">普通员工</option>
              </select>
            </Row>
          </div>

          <div className="rounded-2xl border border-dashed border-accent/25 bg-accent/5 p-6">
            <div className="text-sm font-semibold text-zinc-100">API 接入提示（预留）</div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              后端建议提供：文件上传与任务状态查询、向量索引构建、会话消息持久化、审计日志与计费计量接口。
              前端已预留 <span className="font-mono text-xs text-zinc-300">src/services/api.ts</span>{" "}
              作为统一接入层，替换 mock 即可联调。
            </p>
            <div className="mt-4 rounded-xl border border-border bg-surface-overlay p-4 font-mono text-[11px] leading-relaxed text-zinc-500">
              NEXT_PUBLIC_API_BASE_URL=https://api.your-company.com
              <br />
              POST /v1/knowledge/files
              <br />
              POST /v1/chat/completions
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
