"use client";

import { useAppState } from "@/context/AppStateContext";
import { useState, type FormEvent } from "react";

export function ChatInput() {
  const { sendUserMessage, isAssistantTyping } = useAppState();
  const [value, setValue] = useState("");

  async function submit() {
    const text = value.trim();
    if (!text || isAssistantTyping) return;
    setValue("");
    await sendUserMessage(text);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submit();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-border bg-surface/90 px-8 py-5 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="rounded-2xl border border-border-strong bg-surface-overlay p-2 shadow-card">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            rows={3}
            placeholder="输入业务问题，例如：物流延误客诉如何升级？新员工培训如何排期？"
            className="w-full resize-none bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            disabled={isAssistantTyping}
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-2">
            <div className="text-[11px] text-zinc-500">Shift + Enter 换行 · Enter 发送</div>
            <button
              type="submit"
              disabled={isAssistantTyping || !value.trim()}
              className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              发送
            </button>
          </div>
        </div>
        <div className="text-center text-[11px] text-zinc-600">
          内容仅用于演示交互，不会上传至真实模型服务
        </div>
      </div>
    </form>
  );
}
