"use client";

import { TopBar } from "@/components/layout/TopBar";
import { FileCard } from "@/components/knowledge/FileCard";
import { KnowledgeFileListSkeleton } from "@/components/knowledge/KnowledgeFileListSkeleton";
import { ProcessingFlowPanel } from "@/components/knowledge/ProcessingFlowPanel";
import { UploadDialog } from "@/components/knowledge/UploadDialog";
import { useAppState } from "@/context/AppStateContext";
import { isApiConfigured } from "@/services/api";
import { useState } from "react";

export default function KnowledgePage() {
  const { knowledgeFiles, knowledgeLoading, knowledgeError } = useAppState();
  const [open, setOpen] = useState(false);
  const apiOn = isApiConfigured();

  return (
    <>
      <TopBar
        title="知识库管理"
        subtitle="统一管理制度文档、培训资料、数据表格与多媒体资产。解析完成后即可用于语义检索与可控生成。"
        badge="多模态接入"
        rightSlot={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:bg-accent/90"
          >
            上传文件
          </button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-200">文件列表</div>
                <div className="mt-1 text-xs text-zinc-500">
                  支持 PDF / Word / Excel / 图片 / 视频 · 解析状态将同步展示在处理流水线中
                  {apiOn ? " · 当前自后端加载" : " · 当前为本地演示数据"}
                </div>
              </div>
              <div className="rounded-full border border-border bg-surface-overlay px-3 py-1 text-[11px] text-zinc-400">
                {knowledgeLoading ? "加载中…" : `已接入资料：${knowledgeFiles.length}`}
              </div>
            </div>

            {knowledgeError ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
                {knowledgeError}
              </div>
            ) : null}

            {knowledgeLoading ? (
              <KnowledgeFileListSkeleton />
            ) : knowledgeFiles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface-overlay/50 px-8 py-16 text-center">
                <div className="text-sm font-semibold text-zinc-200">暂无知识库文件</div>
                <p className="mt-2 text-xs text-zinc-500">
                  点击右上角上传文件，或启动后端后通过 API 同步列表。
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {knowledgeFiles.map((f) => (
                  <FileCard key={f.id} file={f} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <ProcessingFlowPanel />
            <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
              <div className="text-sm font-semibold text-zinc-100">合规与权限（产品化提示）</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                生产环境可对接企业 SSO、细粒度知识空间隔离、下载水印与审计追踪，满足内控与等保合规要求。
              </p>
            </div>
          </div>
        </div>
      </div>

      <UploadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
