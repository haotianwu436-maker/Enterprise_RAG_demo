import type { Conversation } from "@/lib/types";

export const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "售后 SLA 与客诉闭环",
    updatedAt: "2025-03-22T09:12:00",
    messages: [
      {
        id: "m1",
        role: "user",
        createdAt: "2025-03-22T09:10:00",
        paragraphs: [
          "请结合制度与历史数据，说明一线客服在处理「物流延误」类客诉时，应在多长时间内完成首次响应与升级？",
        ],
      },
      {
        id: "m2",
        role: "assistant",
        createdAt: "2025-03-22T09:10:18",
        paragraphs: [
          "根据当前知识库内容分析，问题主要集中在以下 3 个方面：首次响应时效、升级触发条件、跨部门协同记录。",
        ],
        sections: [
          {
            title: "制度依据与执行口径",
            bullets: [
              "《客户服务流程说明》要求：工作时间内首次响应 ≤ 15 分钟；非工作时间按值班表在 30 分钟内回执。",
              "涉及物流承运商的延误，需同步在工单系统勾选「供应链协同」标签，便于运营侧拉通。",
            ],
          },
          {
            title: "结合历史数据的趋势判断",
            bullets: [
              "2025Q1 客诉统计中，物流延误类工单平均闭环时长 6.2 小时；其中未按时升级的样本占比 12%。",
              "闭环时长与是否上传物流面单截图呈显著相关，建议作为必填校验项。",
            ],
          },
          {
            title: "风险提示",
            bullets: [
              "若客户提及「平台投诉/监管渠道」，应立即按高风险工单模板升级至客服主管，并冻结自动话术。",
            ],
          },
        ],
        sources: [
          { id: "s1", title: "客户服务流程说明.docx", type: "word" },
          { id: "s2", title: "2025Q1 客诉统计.xlsx", type: "excel" },
          { id: "s3", title: "售后 SLA 与升级矩阵.pdf", type: "pdf" },
        ],
        suggestedActions: [
          { id: "a1", label: "生成周报" },
          { id: "a2", label: "导出分析" },
          { id: "a3", label: "加入待办" },
          { id: "a4", label: "提交管理建议" },
        ],
      },
    ],
  },
  {
    id: "conv-2",
    title: "新员工培训路径建议",
    updatedAt: "2025-03-21T16:40:00",
    messages: [
      {
        id: "m3",
        role: "user",
        createdAt: "2025-03-21T16:38:00",
        paragraphs: [
          "销售同学在入职第 1 周应该优先完成哪些培训模块？有没有推荐的考核节点？",
        ],
      },
      {
        id: "m4",
        role: "assistant",
        createdAt: "2025-03-21T16:38:22",
        paragraphs: [
          "结合历史数据与制度文档，建议优先优化以下流程：先建立「产品认知 → 话术合规 → 实战演练」的最小闭环，再进入 CRM 深度使用。",
        ],
        sections: [
          {
            title: "第 1 周推荐路径",
            bullets: [
              "D1-D2：完成《员工培训手册 v2》第 1-3 章（企业与产品、合规红线、客户信息保护）。",
              "D3：学习《销售转化 playbook》中的「需求挖掘四问」并完成情景模拟测评。",
              "D4-D5：在沙盒环境演练报价与合同审批流，提交 1 份演练录音/纪要。",
            ],
          },
          {
            title: "考核与验收",
            bullets: [
              "周五进行开卷测验 + 10 分钟口试，重点考察合规话术与异议处理。",
              "通过后方可开通正式租户的客户查看权限。",
            ],
          },
        ],
        sources: [
          { id: "s4", title: "员工培训手册 v2.pdf", type: "pdf" },
          { id: "s5", title: "销售转化 playbook.pptx", type: "pdf" },
        ],
        suggestedActions: [
          { id: "a1", label: "生成周报" },
          { id: "a2", label: "导出分析" },
          { id: "a3", label: "加入待办" },
        ],
      },
    ],
  },
  {
    id: "conv-3",
    title: "合同审批与用印",
    updatedAt: "2025-03-20T11:05:00",
    messages: [
      {
        id: "m5",
        role: "user",
        createdAt: "2025-03-20T11:02:00",
        paragraphs: ["标准销售合同从提交到用印，通常需要经过哪些节点？常见卡点是什么？"],
      },
      {
        id: "m6",
        role: "assistant",
        createdAt: "2025-03-20T11:02:30",
        paragraphs: [
          "根据制度文档与流程说明，标准路径为「销售发起 → 商务条款审核 → 法务评审 → 财务授信（如适用）→ 管理层审批 → 行政用印」。",
        ],
        sections: [
          {
            title: "可能原因（耗时偏高）",
            bullets: [
              "附件缺失：报价单版本与客户回签扫描件不一致。",
              "条款偏离标准模板：折扣、账期、交付边界未在备注中结构化说明。",
            ],
          },
          {
            title: "优化建议",
            bullets: [
              "在 CRM 合同卡片中强制关联「标准模板版本号」，减少反复对齐。",
              "对小额订单启用「绿色通道清单」，压缩管理层审批层级。",
            ],
          },
        ],
        sources: [
          { id: "s6", title: "合同管理制度（2025 修订）.pdf", type: "pdf" },
          { id: "s7", title: "用印与归档操作指引.docx", type: "word" },
        ],
        suggestedActions: [
          { id: "a2", label: "导出分析" },
          { id: "a4", label: "提交管理建议" },
        ],
      },
    ],
  },
];
