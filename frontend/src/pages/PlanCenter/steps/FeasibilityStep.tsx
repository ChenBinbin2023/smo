import React from 'react'
import { Card, Row, Col, Statistic, Typography, Tag, Table, Descriptions, Progress, Alert } from 'antd'
import { CheckCircleOutlined, WarningOutlined, EnvironmentOutlined, ClockCircleOutlined, TeamOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

const { Text, Title } = Typography

const FeasibilityStep: React.FC = () => {
    // 区域策略数据
    const regionData = [
        { key: '1', region: '华东', centers: 12, targetEnroll: 180, competingStudies: 3, score: 85 },
        { key: '2', region: '华北', centers: 8, targetEnroll: 120, competingStudies: 2, score: 78 },
        { key: '3', region: '华南', centers: 6, targetEnroll: 90, competingStudies: 4, score: 72 },
        { key: '4', region: '西南', centers: 8, targetEnroll: 60, competingStudies: 1, score: 88 },
        { key: '5', region: '西北', centers: 6, targetEnroll: 30, competingStudies: 1, score: 82 },
    ]

    const regionColumns = [
        { title: '区域', dataIndex: 'region', key: 'region' },
        { title: '推荐中心数', dataIndex: 'centers', key: 'centers' },
        { title: '目标入组', dataIndex: 'targetEnroll', key: 'targetEnroll' },
        { title: '竞品研究', dataIndex: 'competingStudies', key: 'competingStudies', render: (v: number) => <Tag color={v > 2 ? 'red' : 'green'}>{v}项</Tag> },
        { title: '可行性评分', dataIndex: 'score', key: 'score', render: (v: number) => <Progress percent={v} size="small" status={v >= 80 ? 'success' : v >= 70 ? 'normal' : 'exception'} /> },
    ]

    // 关键风险数据
    const risks = [
        { level: 'high', title: '竞品分流风险', desc: '华南地区存在3项同适应症竞品研究，可能影响入组速度' },
        { level: 'medium', title: '伦理审批周期', desc: '部分二级中心伦理审批周期较长（预计45-60天）' },
        { level: 'low', title: '季节性因素', desc: '春节期间入组可能放缓，建议错峰启动' },
    ]

    return (
        <div className="space-y-4">
            {/* 核心指标概览 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="预计月入组速率"
                            value={0.52}
                            suffix="例/中心/月"
                            prefix={<TeamOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="筛选失败率预测"
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
                            title="推荐中心数量"
                            value={40}
                            suffix="家"
                            prefix={<EnvironmentOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="推荐入组周期"
                            value={24}
                            suffix="个月"
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
                        <Text strong>入组空间评估</Text>
                        <Tag color="green">可行</Tag>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <ReactECharts option={{
                            tooltip: { trigger: 'item' },
                            series: [{
                                name: '患者漏斗',
                                type: 'funnel',
                                left: '10%', top: 40, bottom: 40, width: '80%',
                                sort: 'descending',
                                gap: 2,
                                label: { show: true, position: 'inside', formatter: '{b}: {c}' },
                                data: [
                                    { value: 12000, name: '目标人群总数' },
                                    { value: 8400, name: 'HER2阴性 (70%)' },
                                    { value: 5040, name: 'CPS≥5 (60%)' },
                                    { value: 2520, name: '符合入排标准 (50%)' },
                                    { value: 1260, name: '竞品分流后 (50%)' },
                                    { value: 480, name: '目标入组 (38%)' }
                                ]
                            }]
                        }} style={{ height: 280 }} />
                    </Col>
                    <Col span={12}>
                        <Descriptions column={1} size="small" className="mt-4">
                            <Descriptions.Item label="目标人群基数">约12,000例（基于流行病学数据）</Descriptions.Item>
                            <Descriptions.Item label="入排筛选比">约 5:1（每5例筛选可入组1例）</Descriptions.Item>
                            <Descriptions.Item label="竞品分流影响">预计分流40-50%潜在受试者</Descriptions.Item>
                            <Descriptions.Item label="入组空间结论">
                                <Text type="success">入组目标480例在40家中心24个月内可达成</Text>
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
                        <Text strong>区域策略可行性</Text>
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
                        <Text strong>资源与周期测算</Text>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="启动期">中心启动预计3-4个月（含伦理审批）</Descriptions.Item>
                            <Descriptions.Item label="入组期">主入组期18个月，尾量入组2个月</Descriptions.Item>
                            <Descriptions.Item label="随访期">末例入组后12个月随访</Descriptions.Item>
                            <Descriptions.Item label="总周期">预计项目总周期36个月</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={12}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="CRA配置">建议6名CRA，人均管理6-7家中心</Descriptions.Item>
                            <Descriptions.Item label="CRC支持">40家中心需配置约50名CRC</Descriptions.Item>
                            <Descriptions.Item label="PM配置">建议2名PM（1主1副）</Descriptions.Item>
                            <Descriptions.Item label="预算预估">SMO服务费约1,200-1,500万元</Descriptions.Item>
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
                        <Text strong>关键风险初筛</Text>
                        <Tag color="orange">3项风险</Tag>
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
