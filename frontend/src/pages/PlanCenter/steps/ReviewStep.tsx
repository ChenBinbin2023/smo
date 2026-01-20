import React from 'react'
import { Card, Tag, Typography, Divider, Table, Row, Col, Statistic } from 'antd'
import {
    FileProtectOutlined,
    CheckCircleFilled,
    TeamOutlined,
    FileTextOutlined,
    SafetyCertificateFilled,
    LikeFilled,
    WarningFilled,
    CloseCircleFilled,
    MessageFilled,
    SyncOutlined,
    BulbFilled
} from '@ant-design/icons'

const { Title, Text } = Typography

const ReviewStep: React.FC = () => {
    // Review Summary Data
    const reviewSummary = {
        status: 'Pass',
        score: 95,
        issuesFound: 1,
        pendingIssues: 0,
        reviewers: 4
    }

    const reviewLog = [
        // 第二轮评审（倒序，最新在前）
        { key: '1', role: '项目经理 (PM)', name: 'Project Manager', action: 'Approved', comments: '【定稿】二次评审全票通过，方案已定稿。', time: '2026-01-20 17:31' },
        { key: '2', role: '合规专家', name: 'Compliance Expert', action: 'Approved', comments: '【第二轮】修订内容符合监管要求，无额外合规风险。', time: '2026-01-20 17:30' },
        { key: '3', role: '商务 (BD)', name: 'Business Develop', action: 'Approved', comments: '【第二轮】21个月周期可接受，激励奖金预算可调配。', time: '2026-01-20 17:29' },
        { key: '4', role: '临床专家', name: 'Clinical Expert', action: 'Approved', comments: '【第二轮】入组策略优化方案符合预期，可有效压缩周期同时保障质量。', time: '2026-01-20 17:28' },
        // 方案修订
        { key: '5', role: '医学方案撰写专家', name: 'Medical Writer', action: 'Revised', comments: '【方案修订】已补充入组策略优化：缩短筛选期、激励奖金、备选中心机制。', time: '2026-01-20 17:25' },
        // 第一轮评审
        { key: '6', role: '项目经理 (PM)', name: 'Project Manager', action: 'Revision', comments: '【回退修订】综合意见后决定采用优化策略，@医学方案撰写专家 修订方案。', time: '2026-01-20 17:16' },
        { key: '7', role: '合规专家', name: 'Compliance Expert', action: 'Comment', comments: '【第一轮】如增加中心需重新评估GCP合规能力，伦理审查延长2-4周。', time: '2026-01-20 17:15' },
        { key: '8', role: '临床专家', name: 'Clinical Expert', action: 'Objection', comments: '【第一轮】反对增加中心：会稀释入组、增加质控成本约15%。', time: '2026-01-20 17:14' },
        { key: '9', role: '商务 (BD)', name: 'Business Develop', action: 'Issue', comments: '【第一轮】建议增加中心数量以加速入组（50→60家）。', time: '2026-01-20 17:12' },
        { key: '10', role: '临床专家', name: 'Clinical Expert', action: 'Approved', comments: '【第一轮】临床科学性校验通过，入排标准逻辑严密。', time: '2026-01-20 17:10' },
    ]

    const keyHighlights = [
        { item: '科学性设计', status: 'Excellent', details: '样本量(N=600)效能充足，双主要终点设计符合注册要求。' },
        { item: '操作可行性', status: 'Excellent', details: '访视窗口、采样流程设计均考虑了临床实际操作便利性。' },
        { item: '入组策略优化', status: 'Revised', details: '【方案已修订】第一轮评审发现争议，回退至方案撰写阶段修订后二次评审通过。优化内容：缩短筛选期(28→21天)+Tier1中心激励奖金+2家备选中心，周期从24个月压缩至21个月。' },
        { item: '合规性保障', status: 'Pass', details: '已预置遗传办审批、知情同意等关键合规节点的管控措施。' },
        { item: '商业价值', status: 'High', details: '差异化优势明显，预计具有较高的市场准入与商业回报潜力。' }
    ]

    return (
        <Card bordered={false} className="shadow-sm flex flex-col" styles={{ body: { padding: '40px' } }}>
            <div className="max-w-4xl mx-auto border border-gray-200 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-green-600 pb-4">
                    <div className="flex justify-center items-center mb-2 text-green-700">
                        <FileProtectOutlined className="text-4xl mr-3" />
                        <Title level={2} style={{ margin: 0, color: '#047857' }}>临床试验方案评审报告</Title>
                    </div>
                    <Text className="text-gray-500 uppercase tracking-widest">Clinical Study Protocol Review Report</Text>
                    <div className="mt-4 flex justify-center space-x-8">
                        <Text strong>方案编号: GC-001-301</Text>
                        <Text strong>版本: v1.0 (Final)</Text>
                        <Text strong>报告日期: 2026-01-20</Text>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                    <div>
                        <Title level={4} className="text-green-800 mb-1">评审结论: 通过 (Approved)</Title>
                        <Text className="text-green-700">本方案经项目经理、临床、合规及BD专家联合评审，各项指标均符合要求，无遗留问题，准予定稿。</Text>
                    </div>
                    <div className="text-right">
                        <SafetyCertificateFilled className="text-5xl text-green-500" />
                    </div>
                </div>

                {/* Statistics Row */}
                <Row gutter={16} className="mb-8">
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title="综合评分" value={reviewSummary.score} suffix="/ 100" valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title="参与角色" value={reviewSummary.reviewers} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title="发现问题" value={reviewSummary.issuesFound} prefix={<FileTextOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title="待解决" value={reviewSummary.pendingIssues} prefix={<LikeFilled className="text-green-500" />} />
                        </Card>
                    </Col>
                </Row>

                <Divider orientation="left"><span className="text-gray-600 font-bold">评审关键点 (Key Highlights)</span></Divider>
                <Table
                    dataSource={keyHighlights}
                    pagination={false}
                    size="middle"
                    bordered
                    className="mb-8"
                    columns={[
                        { title: '评审维度', dataIndex: 'item', key: 'item', width: '25%', render: (text) => <Text strong>{text}</Text> },
                        { title: '评级', dataIndex: 'status', key: 'status', width: '15%', render: (text: string) => {
                            if (text === 'Revised') {
                                return <Tag color="geekblue">方案已修订</Tag>
                            }
                            return <Tag color="success">{text}</Tag>
                        }},
                        { title: '评价详情', dataIndex: 'details', key: 'details' }
                    ]}
                />

                <Divider orientation="left"><span className="text-gray-600 font-bold">多角色签核日志 (Sign-off Log)</span></Divider>
                <Table
                    dataSource={reviewLog}
                    pagination={false}
                    size="middle"
                    columns={[
                        { title: '角色', dataIndex: 'role', key: 'role', width: '20%' },
                        { title: '签名', dataIndex: 'name', key: 'name', width: '20%', render: (text) => <span style={{ fontFamily: 'Cursive', fontSize: '1.2em' }}>{text}</span> },
                        { title: '最终意见', dataIndex: 'comments', key: 'comments' },
                        { title: '操作', dataIndex: 'action', key: 'action', width: '15%', render: (text: string) => {
                            const actionConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
                                'Approved': { color: 'success', icon: <CheckCircleFilled />, label: '通过' },
                                'Issue': { color: 'warning', icon: <WarningFilled />, label: '提出问题' },
                                'Objection': { color: 'error', icon: <CloseCircleFilled />, label: '反对' },
                                'Comment': { color: 'blue', icon: <MessageFilled />, label: '补充意见' },
                                'Mediate': { color: 'purple', icon: <SyncOutlined />, label: '协调' },
                                'Proposal': { color: 'cyan', icon: <BulbFilled />, label: '提出方案' },
                                'Revision': { color: 'orange', icon: <SyncOutlined />, label: '回退修订' },
                                'Revised': { color: 'geekblue', icon: <CheckCircleFilled />, label: '修订完成' },
                            }
                            const config = actionConfig[text] || { color: 'default', icon: null, label: text }
                            return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>
                        }},
                        { title: '时间戳', dataIndex: 'time', key: 'time', width: '15%', render: (text) => <Text type="secondary" style={{ fontSize: '11px' }}>{text}</Text> },
                    ]}
                />


            </div>
        </Card>
    )
}

export default ReviewStep
