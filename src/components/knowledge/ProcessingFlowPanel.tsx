const steps = [
  { title: "文档解析", desc: "结构提取、表格还原与版式保留" },
  { title: "OCR 图片识别", desc: "扫描件/拍照资料的文字化与置信度标注" },
  { title: "视频转写", desc: "音轨分离、时间轴对齐与章节摘要" },
  { title: "语义切片", desc: "按主题/段落窗口切分，保留上下文锚点" },
  { title: "向量检索", desc: "嵌入索引 + 混合检索，为 RAG 问答提供证据" },
];

export function ProcessingFlowPanel() {
  return (
    <div className="rounded-2xl border border-border bg-surface-overlay/70 p-6 shadow-card">
      <div className="text-sm font-semibold text-zinc-100">知识处理流程说明</div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
        该模块用于向客户展示后续可落地的 RAG 能力链路：从多模态接入到可检索证据，再到可控生成。
      </p>
      <ol className="mt-5 space-y-4">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface-muted text-xs font-bold text-zinc-300">
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-200">{s.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-zinc-500">{s.desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
