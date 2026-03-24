"use client";

import { useAppState } from "@/context/AppStateContext";
import type { KnowledgeFileType } from "@/lib/types";
import { isApiConfigured } from "@/services/api";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

type DemoFile = {
  name: string;
  fileType: KnowledgeFileType;
};

const presets: DemoFile[] = [
  { name: "售后异常场景手册.pdf", fileType: "pdf" },
  { name: "销售拜访纪要_华东区.docx", fileType: "word" },
  { name: "渠道返利测算表.xlsx", fileType: "excel" },
  { name: "门店陈列验收照片.png", fileType: "image" },
  { name: "产品培训直播回放.mp4", fileType: "video" },
];

function presetToUploadableFile(p: DemoFile): File {
  const header = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF — 便于后端识别为二进制
  return new File([header], p.name, { type: "application/octet-stream" });
}

export function UploadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addSimulatedUpload, uploadKnowledgeFile } = useAppState();
  const [picked, setPicked] = useState<DemoFile | null>(presets[0] ?? null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const title = isApiConfigured() ? "上传文件" : "上传文件（离线演示）";

  async function confirm() {
    setBusy(true);
    try {
      if (localFile) {
        const ok = await uploadKnowledgeFile(localFile);
        if (ok) {
          setLocalFile(null);
          if (inputRef.current) inputRef.current.value = "";
          onClose();
        }
        return;
      }

      if (picked) {
        if (isApiConfigured()) {
          const f = presetToUploadableFile(picked);
          const ok = await uploadKnowledgeFile(f);
          if (ok) {
            onClose();
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 450));
        addSimulatedUpload({ name: picked.name, fileType: picked.fileType });
        onClose();
      }
    } finally {
      setBusy(false);
    }
  }

  const apiOn = isApiConfigured();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border-strong bg-surface-raised shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <div className="text-base font-semibold text-zinc-100">{title}</div>
            <div className="mt-1 text-sm text-zinc-500">
              {apiOn
                ? "支持 multipart 实际上传；也可选择示例文件快速联调。"
                : "未配置 NEXT_PUBLIC_API_BASE_URL 时，可使用示例文件完成离线演示。"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            关闭
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              本地文件（联调）
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setLocalFile(f ?? null);
                  if (f) setPicked(null);
                }}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-xl border border-border bg-surface-overlay px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-border-strong"
              >
                选择文件
              </button>
              <span className="text-xs text-zinc-500">
                {localFile ? localFile.name : "未选择 · 字段名 file"}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              或选择示例文件
            </div>
            <div className="mt-3 grid gap-2">
              {presets.map((p) => {
                const active = !localFile && picked?.name === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPicked(p);
                      setLocalFile(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition",
                      active
                        ? "border-accent/40 bg-accent/10 shadow-glow"
                        : "border-border bg-surface-overlay hover:border-border-strong"
                    )}
                  >
                    <span className="text-zinc-100">{p.name}</span>
                    <span className="text-[11px] text-zinc-500">点击选择</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-transparent px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-border-strong"
          >
            取消
          </button>
          <button
            type="button"
            disabled={busy || (!localFile && !picked)}
            onClick={confirm}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow disabled:opacity-40"
          >
            {busy ? "处理中…" : apiOn ? "上传并接入" : "确认接入（演示）"}
          </button>
        </div>
      </div>
    </div>
  );
}
