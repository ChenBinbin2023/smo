import React from 'react'
import { Card, Descriptions, Alert, Tag } from 'antd'

const ClarificationStep: React.FC = () => (
    <Card title="RFP 关键要素解析 (Requirement Parsing)" size="small" extra={<Tag color="blue">Step 1</Tag>}>
        <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="药物名称">GC-001 (PD-L1 Inhibitor)</Descriptions.Item>
            <Descriptions.Item label="适应症">晚期胃癌 (Advanced Gastric Cancer)</Descriptions.Item>
            <Descriptions.Item label="分期">Phase III</Descriptions.Item>
            <Descriptions.Item label="治疗线数">一线 (1st Line)</Descriptions.Item>
            <Descriptions.Item label="对照组">Placebo + Chemo (XELOX)</Descriptions.Item>
            <Descriptions.Item label="目标入组">450 例</Descriptions.Item>
            <Descriptions.Item label="主要终点">OS, PFS</Descriptions.Item>
            <Descriptions.Item label="关键入排">HER2 Negative, ECOG 0-1</Descriptions.Item>
        </Descriptions>
        <Alert message="AI 提示: RFP 中未明确 PD-L1 表达水平临界值 (CPS)，建议设为 CPS >= 5 以提高成功率。" type="warning" showIcon style={{ marginTop: 16 }} />
    </Card>
)

export default ClarificationStep
