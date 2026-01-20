import React from 'react'
import { Card, Table, Tag, Typography, Row, Col, Button, List } from 'antd'
import { FileSearchOutlined, AlertOutlined, CheckSquareOutlined, FileProtectOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

const RiskComplianceStep: React.FC = () => {
    // 1. 适用法规清单
    const regulationData = [
        { key: '1', regulation: 'ICH-GCP E6(R2)', scope: '国际临床试验规范', requirement: '受试者权益保护、知情同意、数据完整性' },
        { key: '2', regulation: '《药物临床试验质量管理规范》', scope: '中国GCP', requirement: '伦理审查、研究者资质、不良事件报告' },
        { key: '3', regulation: '《涉及人的生物医学研究伦理审查办法》', scope: '伦理审查', requirement: '知情同意书内容、弱势群体保护' },
        { key: '4', regulation: '《数据安全法》《个人信息保护法》', scope: '数据合规', requirement: '数据跨境传输、去标识化、隐私保护' },
        { key: '5', regulation: '《人类遗传资源管理条例》', scope: '生物样本', requirement: '遗传资源采集审批、出境审批' },
    ]

    const regulationColumns = [
        { title: '法规名称', dataIndex: 'regulation', key: 'regulation', width: '30%' },
        { title: '适用范围', dataIndex: 'scope', key: 'scope', width: '20%' },
        { title: '核心要求', dataIndex: 'requirement', key: 'requirement' },
    ]

    // 2. 风险点与编写建议
    const riskData = [
        { key: '1', riskPoint: '安慰剂对照设计', priority: 'high', suggestion: '方案中应增加中期分析和早期终止规则，明确患者退出后的替代治疗方案' },
        { key: '2', riskPoint: '数据跨境传输', priority: 'high', suggestion: '方案中需说明数据出境安全评估情况，明确数据存储和传输的加密措施' },
        { key: '3', riskPoint: '采血频率与样本量', priority: 'medium', suggestion: '建议合并部分PK采血点，减少受试者负担，并在方案中说明必要性' },
        { key: '4', riskPoint: '弱势群体入组', priority: 'medium', suggestion: '如涉及老年人/未成年人，方案中需有额外保护措施和专门的知情同意流程' },
        { key: '5', riskPoint: '生物样本保存与使用', priority: 'low', suggestion: '方案中应明确样本用途范围、保存期限及销毁条件' },
    ]

    const riskColumns = [
        { title: '风险点', dataIndex: 'riskPoint', key: 'riskPoint', width: '20%' },
        { title: '关注度', dataIndex: 'priority', key: 'priority', width: '12%', render: (t: string) => <Tag color={t === 'high' ? 'red' : t === 'medium' ? 'orange' : 'blue'}>{t === 'high' ? '高' : t === 'medium' ? '中' : '低'}</Tag> },
        { title: '编写建议', dataIndex: 'suggestion', key: 'suggestion' }
    ]

    // 3. 合规要点清单
    const checklistItems = [
        { category: '知情同意', items: ['知情同意书语言通俗易懂', '明确告知风险与获益', '说明退出权利与后续治疗'] },
        { category: '受试者保护', items: ['受试者补偿方案合理', '不良事件报告与处理流程', '紧急揭盲程序'] },
        { category: '数据管理', items: ['数据采集与存储方案', '数据跨境传输合规说明', '去标识化与隐私保护措施'] },
        { category: '生物样本', items: ['样本采集目的与用途', '遗传资源审批情况', '样本保存期限与销毁'] },
    ]

    return (
        <div className="space-y-6">
            {/* 1. 适用法规清单 */}
            <Card
                size="small"
                title={<div className="flex items-center gap-2"><FileSearchOutlined className="text-blue-500" /><span>适用法规清单</span></div>}
                className="shadow-sm"
            >
                <Table
                    dataSource={regulationData}
                    columns={regulationColumns}
                    pagination={false}
                    size="small"
                />
            </Card>

            {/* 2. 风险点与编写建议 */}
            <Card
                size="small"
                title={<div className="flex items-center gap-2"><AlertOutlined className="text-orange-500" /><span>风险点与编写建议</span></div>}
                className="shadow-sm"
            >
                <Table
                    dataSource={riskData}
                    columns={riskColumns}
                    pagination={false}
                    size="small"
                />
            </Card>

            {/* 3. 合规要点清单 */}
            <Card
                size="small"
                title={<div className="flex items-center gap-2"><CheckSquareOutlined className="text-green-500" /><span>方案编写合规要点</span></div>}
                className="shadow-sm"
            >
                <div className="space-y-4">
                    <Paragraph className="text-gray-500 text-sm mb-4">
                        以下为方案编写时需覆盖的关键合规要点，将在后续方案撰写阶段自动检查：
                    </Paragraph>
                    <Row gutter={[16, 16]}>
                        {checklistItems.map((group, idx) => (
                            <Col span={12} key={idx}>
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <Text strong className="text-sm">{group.category}</Text>
                                    <List
                                        size="small"
                                        className="mt-2"
                                        dataSource={group.items}
                                        renderItem={(item) => (
                                            <List.Item className="py-1 border-0">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                                                    {item}
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <Text type="secondary" className="text-sm">共 {checklistItems.reduce((acc, g) => acc + g.items.length, 0)} 项合规要点，将在方案撰写阶段逐项核验</Text>
                        <Button type="primary" size="small" icon={<FileProtectOutlined />}>导出合规指南</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default RiskComplianceStep
