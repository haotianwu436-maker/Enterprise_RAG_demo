import type { ChatMessage, SuggestedAction, SourceReference } from "@/lib/types";

const defaultSources: SourceReference[] = [
  { id: "ds1", title: "员工培训手册 v2.pdf", type: "pdf" },
  { id: "ds2", title: "客户服务流程说明.docx", type: "word" },
  { id: "ds3", title: "2025Q1 客诉统计.xlsx", type: "excel" },
];

const defaultActions: SuggestedAction[] = [
  { id: "a1", label: "生成周报" },
  { id: "a2", label: "导出分析" },
  { id: "a3", label: "加入待办" },
  { id: "a4", label: "提交管理建议" },
];

/** 根据用户问题关键词生成偏企业场景的 mock 回复（纯前端演示） */
export function buildMockAssistantReply(userText: string): Omit<ChatMessage, "id" | "role" | "createdAt"> {
  const t = userText.toLowerCase();
  const has = (keys: string[]) => keys.some((k) => userText.includes(k));

  if (has(["客诉", "客服", "售后", "投诉", "sla"])) {
    return {
      paragraphs: [
        "根据当前知识库内容分析，您的问题与「客户服务闭环与 SLA」高度相关。以下结论基于制度文档与统计表格的交叉检索结果。",
      ],
      sections: [
        {
          title: "关键结论",
          bullets: [
            "首次响应：工作时间内建议 15 分钟内完成；涉及高风险关键词需立即升级。",
            "物流延误类工单应同步标记「供应链协同」，并在 24 小时内补齐面单与客户沟通记录。",
          ],
        },
        {
          title: "数据侧观察",
          bullets: [
            "2025Q1 样本中，未按时升级的工单重复进线率更高，建议把升级触发条件嵌入工单模板。",
          ],
        },
      ],
      sources: defaultSources,
      suggestedActions: defaultActions,
    };
  }

  if (has(["培训", "新人", "员工", "考核"])) {
    return {
      paragraphs: [
        "结合历史数据与制度文档，建议优先优化以下流程：以「合规 → 产品 → 实战」为最小路径，减少信息过载。",
      ],
      sections: [
        {
          title: "建议培训排期（第 1 周）",
          bullets: [
            "前两天完成手册与合规章节，第三天进入销售话术与异议处理演练。",
            "周五安排测验与口试，通过后再开通敏感数据权限，降低泄露风险。",
          ],
        },
      ],
      sources: [
        { id: "s1", title: "员工培训手册 v2.pdf", type: "pdf" },
        { id: "s2", title: "销售转化 playbook.pptx", type: "pdf" },
      ],
      suggestedActions: defaultActions,
    };
  }

  if (has(["合同", "审批", "用印", "法务"])) {
    return {
      paragraphs: [
        "当前回答基于私域知识与语义检索结果生成。标准合同路径通常包含商务、法务、财务与管理节点；耗时多来自附件不一致与条款偏离模板。",
      ],
      sections: [
        {
          title: "优化建议",
          bullets: [
            "在 CRM 强制绑定模板版本号与折扣/账期结构化字段，可显著减少退回次数。",
            "对小额订单启用绿色通道清单，缩短审批链。",
          ],
        },
      ],
      sources: [
        { id: "s1", title: "合同管理制度（2025 修订）.pdf", type: "pdf" },
        { id: "s2", title: "用印与归档操作指引.docx", type: "word" },
      ],
      suggestedActions: defaultActions,
    };
  }

  if (has(["销售", "转化", "线索", "报价"])) {
    return {
      paragraphs: [
        "从知识库中的销售与运营材料来看，近期高价值问题集中在「需求确认、报价边界、回款条件」三类。",
      ],
      sections: [
        {
          title: "可执行建议",
          bullets: [
            "在首次演示前完成 BANT 信息最小集，避免无效方案投入。",
            "对折扣与账期偏离标准模板的场景，提前准备审批材料清单。",
          ],
        },
      ],
      sources: [
        { id: "s1", title: "销售转化 playbook.pptx", type: "pdf" },
        { id: "s2", title: "渠道政策摘要_内部.pdf", type: "pdf" },
      ],
      suggestedActions: defaultActions,
    };
  }

  // generic enterprise-style fallback
  void t;
  return {
    paragraphs: [
      "AI 正在结合知识库内容进行分析：您的问题属于跨文档场景，以下从「现状判断 — 可能原因 — 建议动作」给出结构化输出。",
    ],
    sections: [
      {
        title: "分析摘要",
        bullets: [
          "建议先明确业务目标与约束（合规、时效、成本），再在制度文档中定位对应条款。",
          "若涉及跨部门流程，优先补齐工单字段与附件，便于后续自动化报表归因。",
        ],
      },
      {
        title: "风险提示",
        bullets: [
          "对涉及客户隐私与数据导出的操作，请遵循最小权限原则，并保留审计痕迹。",
        ],
      },
    ],
    sources: defaultSources,
    suggestedActions: defaultActions,
  };
}
