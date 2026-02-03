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
import { useLanguage } from '../../../context/LanguageContext'

const { Title, Text } = Typography

const ReviewStep: React.FC = () => {
    const { language } = useLanguage()

    // Review Summary Data
    const reviewSummary = {
        status: language === 'zh' ? '通过' : 'Pass',
        score: 95,
        issuesFound: 1,
        pendingIssues: 0,
        reviewers: 4
    }

    const reviewLogZh = [
        { key: '1', role: '项目经理 (PM)', name: 'Project Manager', action: 'Approved', comments: '【定稿】二次评审全票通过，方案已定稿。', time: '2026-01-20 17:31' },
        { key: '2', role: '合规专家', name: 'Compliance Expert', action: 'Approved', comments: '【第二轮】修订内容符合监管要求，无额外合规风险。', time: '2026-01-20 17:30' },
        { key: '3', role: '商务 (BD)', name: 'Business Develop', action: 'Approved', comments: '【第二轮】21个月周期可接受，激励奖金预算可调配。', time: '2026-01-20 17:29' },
        { key: '4', role: '临床专家', name: 'Clinical Expert', action: 'Approved', comments: '【第二轮】入组策略优化方案符合预期，可有效压缩周期同时保障质量。', time: '2026-01-20 17:28' },
        { key: '5', role: '医学方案撰写专家', name: 'Medical Writer', action: 'Revised', comments: '【方案修订】已补充入组策略优化：缩短筛选期、激励奖金、备选中心机制。', time: '2026-01-20 17:25' },
        { key: '6', role: '项目经理 (PM)', name: 'Project Manager', action: 'Revision', comments: '【回退修订】综合意见后决定采用优化策略，@医学方案撰写专家 修订方案。', time: '2026-01-20 17:16' },
        { key: '7', role: '合规专家', name: 'Compliance Expert', action: 'Comment', comments: '【第一轮】如增加中心需重新评估GCP合规能力，伦理审查延长2-4周。', time: '2026-01-20 17:15' },
        { key: '8', role: '临床专家', name: 'Clinical Expert', action: 'Objection', comments: '【第一轮】反对增加中心：会稀释入组、增加质控成本约15%。', time: '2026-01-20 17:14' },
        { key: '9', role: '商务 (BD)', name: 'Business Develop', action: 'Issue', comments: '【第一轮】建议增加中心数量以加速入组（50→60家）。', time: '2026-01-20 17:12' },
        { key: '10', role: '临床专家', name: 'Clinical Expert', action: 'Approved', comments: '【第一轮】临床科学性校验通过，入排标准逻辑严密。', time: '2026-01-20 17:10' },
    ]
    const reviewLogEn = [
        { key: '1', role: 'Project Manager (PM)', name: 'Project Manager', action: 'Approved', comments: '[Final] 2nd round passed unanimously, protocol finalized.', time: '2026-01-20 17:31' },
        { key: '2', role: 'Compliance Expert', name: 'Compliance Expert', action: 'Approved', comments: '[R2] Revisions align with regs, no extra compliance risks.', time: '2026-01-20 17:30' },
        { key: '3', role: 'Business Develop (BD)', name: 'Business Develop', action: 'Approved', comments: '[R2] 21-month timeline acceptable, budget for bonuses available.', time: '2026-01-20 17:29' },
        { key: '4', role: 'Clinical Expert', name: 'Clinical Expert', action: 'Approved', comments: '[R2] Enrollment strategy meets expectations, effectively compresses timeline.', time: '2026-01-20 17:28' },
        { key: '5', role: 'Medical Writer', name: 'Medical Writer', action: 'Revised', comments: '[Revision] Added enrollment optimizations: shorter screening, bonuses, backup sites.', time: '2026-01-20 17:25' },
        { key: '6', role: 'Project Manager (PM)', name: 'Project Manager', action: 'Revision', comments: '[Revision] Decisions made to adopt optimization strategy, @MedicalWriter to revise.', time: '2026-01-20 17:16' },
        { key: '7', role: 'Compliance Expert', name: 'Compliance Expert', action: 'Comment', comments: '[R1] Adding sites requires re-evaluating GCP compliance, IRB may take 2-4 more weeks.', time: '2026-01-20 17:15' },
        { key: '8', role: 'Clinical Expert', name: 'Clinical Expert', action: 'Objection', comments: '[R1] Against adding sites: dilutes enrollment, increases QC costs by 15%.', time: '2026-01-20 17:14' },
        { key: '9', role: 'Business Develop (BD)', name: 'Business Develop', action: 'Issue', comments: '[R1] Suggest increasing site count to accelerate enrollment (50→60).', time: '2026-01-20 17:12' },
        { key: '10', role: 'Clinical Expert', name: 'Clinical Expert', action: 'Approved', comments: '[R1] Clinical scientific validation passed, rigorous I/E criteria.', time: '2026-01-20 17:10' },
    ]
    const reviewLog = language === 'zh' ? reviewLogZh : reviewLogEn

    const keyHighlightsZh = [
        { item: '科学性设计', status: 'Excellent', details: '样本量(N=600)效能充足，双主要终点设计符合注册要求。' },
        { item: '操作可行性', status: 'Excellent', details: '访视窗口、采样流程设计均考虑了临床实际操作便利性。' },
        { item: '入组策略优化', status: 'Revised', details: '【方案已修订】第一轮评审发现争议，回退至方案撰写阶段修订后二次评审通过。优化内容：缩短筛选期(28→21天)+Tier1中心激励奖金+2家备选中心，周期从24个月压缩至21个月。' },
        { item: '合规性保障', status: 'Pass', details: '已预置遗传办审批、知情同意等关键合规节点的管控措施。' },
        { item: '商业价值', status: 'High', details: '差异化优势明显，预计具有较高的市场准入与商业回报潜力。' }
    ]
    const keyHighlightsEn = [
        { item: 'Scientific Design', status: 'Excellent', details: 'Sample size (N=600) provides sufficient power, dual primary endpoints meet requirements.' },
        { item: 'Operational Feasibility', status: 'Excellent', details: 'Visit windows and sampling flow consider clinical practicality.' },
        { item: 'Enrollment Strategy', status: 'Revised', details: '[Revised] R1 dispute resolved by revision. Optimizations: Shorter screening (28→21d), Tier 1 bonuses, 2 backup sites. Timeline 24→21mo.' },
        { item: 'Compliance Assurance', status: 'Pass', details: 'Pre-set controls for HGR approval, ICF, and other key compliance nodes.' },
        { item: 'Business Value', status: 'High', details: 'Strong differentiation, expected high market access and commercial potential.' }
    ]
    const keyHighlights = language === 'zh' ? keyHighlightsZh : keyHighlightsEn

    return (
        <Card bordered={false} className="shadow-sm flex flex-col" styles={{ body: { padding: '40px' } }}>
            <div className="max-w-4xl mx-auto border border-gray-200 bg-white p-8 shadow-sm">

                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-green-600 pb-4">
                    <div className="flex justify-center items-center mb-2 text-green-700">
                        <FileProtectOutlined className="text-4xl mr-3" />
                        <Title level={2} style={{ margin: 0, color: '#047857' }}>{language === 'zh' ? '临床试验方案评审报告' : 'Clinical Trial Protocol Review Report'}</Title>
                    </div>
                    <Text className="text-gray-500 uppercase tracking-widest">Clinical Study Protocol Review Report</Text>
                    <div className="mt-4 flex justify-center space-x-8">
                        <Text strong>{language === 'zh' ? '方案编号' : 'Protocol ID'}: GC-001-301</Text>
                        <Text strong>{language === 'zh' ? '版本' : 'Version'}: v1.0 (Final)</Text>
                        <Text strong>{language === 'zh' ? '报告日期' : 'Report Date'}: 2026-01-20</Text>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                    <div>
                        <Title level={4} className="text-green-800 mb-1">{language === 'zh' ? '评审结论: 通过 (Approved)' : 'Review Conclusion: Approved'}</Title>
                        <Text className="text-green-700">{language === 'zh' ? '本方案经项目经理、临床、合规及BD专家联合评审，各项指标均符合要求，无遗留问题，准予定稿。' : 'This protocol has been jointly reviewed by PM, Clinical, Compliance, and BD experts. All indicators meet requirements, no pending issues, approved for finalization.'}</Text>
                    </div>
                    <div className="text-right">
                        <SafetyCertificateFilled className="text-5xl text-green-500" />
                    </div>
                </div>

                {/* Statistics Row */}
                <Row gutter={16} className="mb-8">
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title={language === 'zh' ? '综合评分' : 'Composite Score'} value={reviewSummary.score} suffix="/ 100" valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title={language === 'zh' ? '参与角色' : 'Reviewer Roles'} value={reviewSummary.reviewers} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title={language === 'zh' ? '发现问题' : 'Issues Found'} value={reviewSummary.issuesFound} prefix={<FileTextOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" className="text-center bg-gray-50">
                            <Statistic title={language === 'zh' ? '待解决' : 'Pending'} value={reviewSummary.pendingIssues} prefix={<LikeFilled className="text-green-500" />} />
                        </Card>
                    </Col>
                </Row>

                <Divider orientation="left"><span className="text-gray-600 font-bold">{language === 'zh' ? '评审关键点' : 'Key Highlights'}</span></Divider>
                <Table
                    dataSource={keyHighlights}
                    pagination={false}
                    size="middle"
                    bordered
                    className="mb-8"
                    columns={[
                        { title: language === 'zh' ? '评审维度' : 'Dimension', dataIndex: 'item', key: 'item', width: '25%', render: (text) => <Text strong>{text}</Text> },
                        {
                            title: language === 'zh' ? '评级' : 'Status', dataIndex: 'status', key: 'status', width: '15%', render: (text: string) => {
                                if (text === 'Revised') {
                                    return <Tag color="geekblue">{language === 'zh' ? '方案已修订' : 'Revised'}</Tag>
                                }
                                return <Tag color="success">{text}</Tag>
                            }
                        },
                        { title: language === 'zh' ? '评价详情' : 'Details', dataIndex: 'details', key: 'details' }
                    ]}
                />

                <Divider orientation="left"><span className="text-gray-600 font-bold">{language === 'zh' ? '多角色签核日志' : 'Sign-off Log'}</span></Divider>
                <Table
                    dataSource={reviewLog}
                    pagination={false}
                    size="middle"
                    columns={[
                        { title: language === 'zh' ? '角色' : 'Role', dataIndex: 'role', key: 'role', width: '20%' },
                        { title: language === 'zh' ? '签名' : 'Signature', dataIndex: 'name', key: 'name', width: '20%', render: (text) => <span style={{ fontFamily: 'Cursive', fontSize: '1.2em' }}>{text}</span> },
                        { title: language === 'zh' ? '最终意见' : 'Final Comments', dataIndex: 'comments', key: 'comments' },
                        {
                            title: language === 'zh' ? '操作' : 'Action', dataIndex: 'action', key: 'action', width: '15%', render: (text: string) => {
                                const actionConfig: Record<string, { color: string; icon: React.ReactNode; label: { zh: string; en: string } }> = {
                                    'Approved': { color: 'success', icon: <CheckCircleFilled />, label: { zh: '通过', en: 'Approve' } },
                                    'Issue': { color: 'warning', icon: <WarningFilled />, label: { zh: '提出问题', en: 'Issue' } },
                                    'Objection': { color: 'error', icon: <CloseCircleFilled />, label: { zh: '反对', en: 'Object' } },
                                    'Comment': { color: 'blue', icon: <MessageFilled />, label: { zh: '补充意见', en: 'Comment' } },
                                    'Mediate': { color: 'purple', icon: <SyncOutlined />, label: { zh: '协调', en: 'Mediate' } },
                                    'Proposal': { color: 'cyan', icon: <BulbFilled />, label: { zh: '提出方案', en: 'Propose' } },
                                    'Revision': { color: 'orange', icon: <SyncOutlined />, label: { zh: '回退修订', en: 'Revise' } },
                                    'Revised': { color: 'geekblue', icon: <CheckCircleFilled />, label: { zh: '修订完成', en: 'Revised' } },
                                }
                                const config = actionConfig[text] || { color: 'default', icon: null, label: { zh: text, en: text } }
                                return <Tag color={config.color} icon={config.icon}>{language === 'zh' ? config.label.zh : config.label.en}</Tag>
                            }
                        },
                        { title: language === 'zh' ? '时间戳' : 'Timestamp', dataIndex: 'time', key: 'time', width: '15%', render: (text) => <Text type="secondary" style={{ fontSize: '11px' }}>{text}</Text> },
                    ]}
                />
            </div>
        </Card>
    )
}

export default ReviewStep


