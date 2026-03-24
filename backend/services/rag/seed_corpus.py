"""
演示用种子片段：对应 JSON 里 file_kf-1/2/3，无真实 PDF 时仍可检索。
上传真实文件后会与向量库并存。
"""

from __future__ import annotations

# 每条为一条向量；file_id 与 knowledge_files.json 种子一致
SEED_CHUNKS: list[dict] = [
    {
        "file_id": "file_kf-1",
        "file_name": "员工培训手册 v2.pdf",
        "file_type": "PDF",
        "text": (
            "第一章 客户沟通与合规：一线员工在对外沟通中须遵守最小必要原则，不得超范围承诺。"
            "客户信息仅可在授权系统内查看，禁止截图外传。首次响应建议在工作时间 15 分钟内完成。"
        ),
    },
    {
        "file_id": "file_kf-1",
        "file_name": "员工培训手册 v2.pdf",
        "file_type": "PDF",
        "text": (
            "第二章 异议处理：当客户质疑价格或服务条款时，应先复述诉求再引用标准话术，避免争辩。"
            "涉及折扣与账期偏离标准模板时，必须走商务与财务联合审批。"
        ),
    },
    {
        "file_id": "file_kf-2",
        "file_name": "客户服务流程说明.docx",
        "file_type": "WORD",
        "text": (
            "工单创建：物流延误类客诉需勾选「供应链协同」标签，并上传物流面单与客户沟通记录截图。"
            "未按时升级的样本在复盘会上需说明原因并补充 SOP。"
        ),
    },
    {
        "file_id": "file_kf-2",
        "file_name": "客户服务流程说明.docx",
        "file_type": "WORD",
        "text": (
            "升级路径：客户提及监管投诉渠道或媒体曝光风险时，应立即升级至客服主管，暂停自动话术。"
            "高风险工单须在系统中锁定编辑权限并记录时间线。"
        ),
    },
    {
        "file_id": "file_kf-3",
        "file_name": "2025Q1 客诉统计.xlsx",
        "file_type": "EXCEL",
        "text": (
            "2025Q1 数据摘要：物流延误相关工单占总量 34%，平均闭环时长 6.2 小时。"
            "未在 24 小时内补齐面单截图的工单，重复进线率显著升高。"
        ),
    },
    {
        "file_id": "file_kf-3",
        "file_name": "2025Q1 客诉统计.xlsx",
        "file_type": "EXCEL",
        "text": (
            "建议动作：将「承运商协同」设为必填字段；对超时未升级样本自动推送主管待办。"
            "培训侧需补充《售后异常场景》图文版以降低话术偏差。"
        ),
    },
]
