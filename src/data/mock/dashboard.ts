import type {
  AiInsight,
  FrequentQuestion,
  ReportStats,
  TrendPoint,
} from "@/lib/types";

export const reportStats: ReportStats = {
  totalFiles: 128,
  todayQueries: 342,
  topCategoryLabel: "售后与物流",
  weeklyActiveUsers: 86,
};

export const trendLast7Days: TrendPoint[] = [
  { label: "03-16", value: 118 },
  { label: "03-17", value: 132 },
  { label: "03-18", value: 156 },
  { label: "03-19", value: 141 },
  { label: "03-20", value: 189 },
  { label: "03-21", value: 201 },
  { label: "03-22", value: 176 },
];

export const frequentQuestions: FrequentQuestion[] = [
  {
    id: "fq-1",
    question: "物流延误客诉的首次响应和升级标准是什么？",
    count: 96,
    category: "客户服务",
  },
  {
    id: "fq-2",
    question: "新员工第 1 周培训模块与考核节点如何安排？",
    count: 74,
    category: "内部培训",
  },
  {
    id: "fq-3",
    question: "标准销售合同的审批与用印路径、常见卡点？",
    count: 61,
    category: "流程优化",
  },
  {
    id: "fq-4",
    question: "折扣超过阈值时，需要哪些额外审批材料？",
    count: 52,
    category: "销售转化",
  },
  {
    id: "fq-5",
    question: "客户信息导出与脱敏要求有哪些？",
    count: 47,
    category: "制度文档",
  },
];

export const aiInsights: AiInsight[] = [
  {
    id: "in-1",
    text: "高频问题集中在售后流程：近 7 天与「物流/延误/升级」相关的会话占比 34%。",
    tone: "warning",
  },
  {
    id: "in-2",
    text: "培训资料调用率偏低：与「新员工/培训路径」相关的检索次数环比下降 9%。",
    tone: "neutral",
  },
  {
    id: "in-3",
    text: "建议优先补充销售 SOP：报价-合同-回款链路的问题重复率上升，适合沉淀标准问答。",
    tone: "positive",
  },
];

export const recommendationCards: string[] = [
  "建议补充《售后异常场景》图文版培训文档，降低一线话术偏差。",
  "优化售后 SOP：为「承运商协同」工单增加必填字段与自动提醒。",
  "完善常见问题库：将本周 Top10 问答沉淀为可发布对外的帮助中心条目。",
];

export const aiSummaryBlurb =
  "近期咨询重点集中在客户管理、员工培训、合同流程；其中售后协同类问题增长明显，建议与运营周报联动复盘。";
