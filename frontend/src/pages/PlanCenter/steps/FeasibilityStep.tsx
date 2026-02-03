import React from 'react'
import { Card, Row, Col, Statistic, Typography, Tag, Table, Descriptions, Progress, Alert } from 'antd'
import { CheckCircleOutlined, WarningOutlined, EnvironmentOutlined, ClockCircleOutlined, TeamOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useLanguage } from '../../../context/LanguageContext'

const { Text, Title } = Typography

const FeasibilityStep: React.FC = () => {
    const { language } = useLanguage()

    // 区域策略数据
    const regionDataZh = [
        { key: '1', region: '华东', centers: 12, targetEnroll: 180, competingStudies: 3, score: 85 },
        { key: '2', region: '华北', centers: 8, targetEnroll: 120, competingStudies: 2, score: 78 },
        { key: '3', region: '华南', centers: 6, targetEnroll: 90, competingStudies: 4, score: 72 },
        { key: '4', region: '西南', centers: 8, targetEnroll: 60, competingStudies: 1, score: 88 },
        { key: '5', region: '西北', centers: 6, targetEnroll: 30, competingStudies: 1, score: 82 },
    ]
    const regionDataEn = [
        { key: '1', region: 'East China', centers: 12, targetEnroll: 180, competingStudies: 3, score: 85 },
        { key: '2', region: 'North China', centers: 8, targetEnroll: 120, competingStudies: 2, score: 78 },
        { key: '3', region: 'South China', centers: 6, targetEnroll: 90, competingStudies: 4, score: 72 },
        { key: '4', region: 'Southwest', centers: 8, targetEnroll: 60, competingStudies: 1, score: 88 },
        { key: '5', region: 'Northwest', centers: 6, targetEnroll: 30, competingStudies: 1, score: 82 },
    ]
    const regionData = language === 'zh' ? regionDataZh : regionDataEn

    const regionColumns = [
        { title: language === 'zh' ? '区域' : 'Region', dataIndex: 'region', key: 'region' },
        { title: language === 'zh' ? '推荐中心数' : 'Rec. Sites', dataIndex: 'centers', key: 'centers' },
        { title: language === 'zh' ? '目标入组' : 'Target Enrollment', dataIndex: 'targetEnroll', key: 'targetEnroll' },
        { title: language === 'zh' ? '竞品研究' : 'Competing Studies', dataIndex: 'competingStudies', key: 'competingStudies', render: (v: number) => <Tag color={v > 2 ? 'red' : 'green'}>{v}{language === 'zh' ? '项' : ''}</Tag> },
        { title: language === 'zh' ? '可行性评分' : 'Feasibility Score', dataIndex: 'score', key: 'score', render: (v: number) => <Progress percent={v} size="small" status={v >= 80 ? 'success' : v >= 70 ? 'normal' : 'exception'} /> },
    ]

    // 关键风险数据
    const risksZh = [
        { level: 'high', title: '竞品分流风险', desc: '华南地区存在3项同适应症竞品研究，可能影响入组速度' },
        { level: 'medium', title: '伦理审批周期', desc: '部分二级中心伦理审批周期较长（预计45-60天）' },
        { level: 'low', title: '季节性因素', desc: '春节期间入组可能放缓，建议错峰启动' },
    ]
    const risksEn = [
        { level: 'high', title: 'Competing Study Risk', desc: '3 similar studies in South China might impact enrollment' },
        { level: 'medium', title: 'Ethics Approval Cycle', desc: 'L2 sites might have longer approval cycles (45-60 days)' },
        { level: 'low', title: 'Seasonal Factor', desc: 'Potential slowdown during Spring Festival, recommend staggered start' },
    ]
    const risks = language === 'zh' ? risksZh : risksEn

    const funnelDataEn = [
        { value: 12000, name: 'Target Population' },
        { value: 8400, name: 'HER2 Negative (70%)' },
        { value: 5040, name: 'CPS≥5 (60%)' },
        { value: 2520, name: 'Inclusion Criteria (50%)' },
        { value: 1260, name: 'After Competition (50%)' },
        { value: 480, name: 'Target Enrollment (38%)' }
    ]
    const funnelDataZh = [
        { value: 12000, name: '目标人群总数' },
        { value: 8400, name: 'HER2阴性 (70%)' },
        { value: 5040, name: 'CPS≥5 (60%)' },
        { value: 2520, name: '符合入排标准 (50%)' },
        { value: 1260, name: '竞品分流后 (50%)' },
        { value: 480, name: '目标入组 (38%)' }
    ]
    const funnelData = language === 'zh' ? funnelDataZh : funnelDataEn

    return (
        <div className="space-y-4">
            {/* 核心指标概览 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '预计月入组速率' : 'Est. Monthly Rate'}
                            value={0.52}
                            suffix={language === 'zh' ? '例/中心/月' : 'pts/site/mo'}
                            prefix={<TeamOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '筛选失败率预测' : 'Est. Screen Fail Rate'}
                            value={28.5}
                            suffix="%"
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<WarningOutlined className="text-red-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '推荐中心数量' : 'Rec. Sites'}
                            value={40}
                            suffix={language === 'zh' ? '家' : ''}
                            prefix={<EnvironmentOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '推荐入组周期' : 'Rec. Enrollment Cycle'}
                            value={24}
                            suffix={language === 'zh' ? '个月' : ' Months'}
                            prefix={<ClockCircleOutlined className="text-orange-500" />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 入组空间评估 - 漏斗图 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <CheckCircleOutlined className="text-blue-500" />
                        <Text strong>{language === 'zh' ? '入组空间评估' : 'Enrollment Space Eval'}</Text>
                        <Tag color="green">{language === 'zh' ? '可行' : 'Feasible'}</Tag>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <ReactECharts option={{
                            tooltip: { trigger: 'item' },
                            series: [{
                                name: language === 'zh' ? '患者漏斗' : 'Patient Funnel',
                                type: 'funnel',
                                left: '10%', top: 40, bottom: 40, width: '80%',
                                sort: 'descending',
                                gap: 2,
                                label: { show: true, position: 'inside', formatter: '{b}: {c}' },
                                data: funnelData
                            }]
                        }} style={{ height: 280 }} />
                    </Col>
                    <Col span={12}>
                        <Descriptions column={1} size="small" className="mt-4">
                            <Descriptions.Item label={language === 'zh' ? '目标人群基数' : 'Target Population Base'}>{language === 'zh' ? '约12,000例（基于流行病学数据）' : 'Approx. 12,000 (Epidemiology)'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '入排筛选比' : 'Screening Ratio'}>{language === 'zh' ? '约 5:1（每5例筛选可入组1例）' : 'Approx. 5:1 (1 enroll per 5 screens)'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '竞品分流影响' : 'Competition Impact'}>{language === 'zh' ? '预计分流40-50%潜在受试者' : 'Est. 40-50% patient diversion'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '入组空间结论' : 'Conclusion'}>
                                <Text type="success">{language === 'zh' ? '入组目标480例在40家中心24个月内可达成' : 'Target 480 pts achievable within 24M at 40 sites'}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {/* 区域策略可行性 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <EnvironmentOutlined className="text-green-500" />
                        <Text strong>{language === 'zh' ? '区域策略可行性' : 'Regional Strategy Feasibility'}</Text>
                    </div>
                }
            >
                <Table
                    dataSource={regionData}
                    columns={regionColumns}
                    size="small"
                    pagination={false}
                />
            </Card>

            {/* 资源与周期测算 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-orange-500" />
                        <Text strong>{language === 'zh' ? '资源与周期测算' : 'Resources & Timeline Est.'}</Text>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label={language === 'zh' ? '启动期' : 'Startup Phase'}>{language === 'zh' ? '中心启动预计3-4个月（含伦理审批）' : 'Est. 3-4 months (incl. Ethics)'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '入组期' : 'Enrollment Phase'}>{language === 'zh' ? '主入组期18个月，尾量入组2个月' : 'Main 18 months, tail 2 months'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '随访期' : 'Follow-up'}>{language === 'zh' ? '末例入组后12个月随访' : '12M post last patient in'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '总周期' : 'Total Cycle'}>{language === 'zh' ? '预计项目总周期36个月' : 'Est. 36 months total'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={12}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label={language === 'zh' ? 'CRA配置' : 'CRA Allocation'}>{language === 'zh' ? '建议6名CRA，人均管理6-7家中心' : 'Rec. 6 CRAs (6-7 sites per CRA)'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? 'CRC支持' : 'CRC Support'}>{language === 'zh' ? '40家中心需配置约50名CRC' : 'Approx. 50 CRCs for 40 sites'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? 'PM配置' : 'PM Allocation'}>{language === 'zh' ? '建议2名PM（1主1副）' : 'Rec. 2 PMs (1 Senior, 1 Assist)'}</Descriptions.Item>
                            <Descriptions.Item label={language === 'zh' ? '预算预估' : 'Budget Estimate'}>{language === 'zh' ? 'SMO服务费约1,200-1,500万元' : 'SMO fees: ~12-15M CNY'}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {/* 关键风险初筛 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <ExclamationCircleOutlined className="text-red-500" />
                        <Text strong>{language === 'zh' ? '关键风险初筛' : 'Key Risk Screening'}</Text>
                        <Tag color="orange">{risks.length} {language === 'zh' ? '项风险' : 'Risks'}</Tag>
                    </div>
                }
            >
                <div className="space-y-2">
                    {risks.map((risk, idx) => (
                        <Alert
                            key={idx}
                            type={risk.level === 'high' ? 'error' : risk.level === 'medium' ? 'warning' : 'info'}
                            message={risk.title}
                            description={risk.desc}
                            showIcon
                        />
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default FeasibilityStep
