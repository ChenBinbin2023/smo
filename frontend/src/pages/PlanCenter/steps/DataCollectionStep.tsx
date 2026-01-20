import React from 'react'
import { Card, Typography, Table, Tag, Statistic, Row, Col, Descriptions } from 'antd'
import { HistoryOutlined, TeamOutlined, LineChartOutlined, SafetyCertificateOutlined, BarChartOutlined } from '@ant-design/icons'

const { Text } = Typography

const DataCollectionStep: React.FC = () => {
    // 历史项目数据
    const historyProjects = [
        { key: '1', name: 'GC-2023-Phase2', indication: '晚期胃癌', phase: 'II期', centers: 18, enrollment: 120, duration: '14个月' },
        { key: '2', name: 'GC-2022-Phase3', indication: '晚期胃癌', phase: 'III期', centers: 35, enrollment: 380, duration: '22个月' },
        { key: '3', name: 'NSCLC-2023-P2', indication: '非小细胞肺癌', phase: 'II期', centers: 22, enrollment: 180, duration: '16个月' },
    ]

    const historyColumns = [
        { title: '项目编号', dataIndex: 'name', key: 'name' },
        { title: '适应症', dataIndex: 'indication', key: 'indication' },
        { title: '阶段', dataIndex: 'phase', key: 'phase' },
        { title: '中心数', dataIndex: 'centers', key: 'centers' },
        { title: '入组数', dataIndex: 'enrollment', key: 'enrollment' },
        { title: '周期', dataIndex: 'duration', key: 'duration' },
        { title: '操作', key: 'action', render: () => <Text type="secondary" className="cursor-not-allowed">查看详情</Text> },
    ]

    // 中心画像数据
    const centerProfiles = [
        { key: '1', name: '北京协和医院', tier: '一级', specialty: '肿瘤内科', piExp: '15年', projects: 28, avgEnroll: 18 },
        { key: '2', name: '上海中山医院', tier: '一级', specialty: '肿瘤内科', piExp: '12年', projects: 24, avgEnroll: 16 },
        { key: '3', name: '广州中山肿瘤医院', tier: '一级', specialty: '胃肠肿瘤', piExp: '18年', projects: 32, avgEnroll: 22 },
        { key: '4', name: '浙江省肿瘤医院', tier: '二级', specialty: '消化肿瘤', piExp: '10年', projects: 18, avgEnroll: 14 },
        { key: '5', name: '四川华西医院', tier: '一级', specialty: '肿瘤内科', piExp: '14年', projects: 22, avgEnroll: 15 },
    ]

    const centerColumns = [
        { title: '中心名称', dataIndex: 'name', key: 'name' },
        { title: '等级', dataIndex: 'tier', key: 'tier', render: (t: string) => <Tag color={t === '一级' ? 'green' : 'blue'}>{t}</Tag> },
        { title: '专业方向', dataIndex: 'specialty', key: 'specialty' },
        { title: 'PI经验', dataIndex: 'piExp', key: 'piExp' },
        { title: '历史项目', dataIndex: 'projects', key: 'projects' },
        { title: '平均入组', dataIndex: 'avgEnroll', key: 'avgEnroll' },
        { title: '操作', key: 'action', render: () => <Text type="secondary" className="cursor-not-allowed">查看详情</Text> },
    ]

    return (
        <div className="space-y-4">
            {/* 历史项目汇总 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <HistoryOutlined className="text-blue-500" />
                        <Text strong>历史项目数据</Text>
                        <Tag color="blue">12个同类项目</Tag>
                    </div>
                    <Text type="secondary" className="cursor-not-allowed">查看全部</Text>
                </div>
                <Table
                    dataSource={historyProjects}
                    columns={historyColumns}
                    size="small"
                    pagination={false}
                />
            </Card>

            {/* 中心/研究者画像 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <TeamOutlined className="text-green-500" />
                        <Text strong>中心/研究者画像</Text>
                        <Tag color="green">35家候选中心</Tag>
                    </div>
                    <Text type="secondary" className="cursor-not-allowed">查看全部</Text>
                </div>
                <Table
                    dataSource={centerProfiles}
                    columns={centerColumns}
                    size="small"
                    pagination={false}
                />
            </Card>

            {/* 入组与执行数据 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <LineChartOutlined className="text-orange-500" />
                    <Text strong>入组与执行数据</Text>
                </div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title="同类研究平均入组率" value={2.8} suffix="例/中心/月" valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="平均筛选失败率" value={23} suffix="%" valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="平均脱落率" value={12} suffix="%" valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="平均方案偏离" value={4.2} suffix="次/中心" valueStyle={{ fontSize: 18 }} />
                    </Col>
                </Row>
            </Card>

            {/* 法规/伦理条款 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <SafetyCertificateOutlined className="text-purple-500" />
                    <Text strong>法规/伦理条款</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="CDE指导原则">《抗肿瘤药物临床试验终点技术指导原则》2024版</Descriptions.Item>
                    <Descriptions.Item label="GCP合规要求">ICH-GCP E6(R2) / 中国GCP 2020版</Descriptions.Item>
                    <Descriptions.Item label="伦理审查周期">中心伦理平均审批周期 28天</Descriptions.Item>
                    <Descriptions.Item label="知情同意要求">电子知情同意需符合《药物临床试验质量管理规范》</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 外部基准 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <BarChartOutlined className="text-cyan-500" />
                    <Text strong>外部基准数据</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="ClinicalTrials.gov同类研究">47项（进行中18项）</Descriptions.Item>
                    <Descriptions.Item label="行业中位入组周期">胃癌III期中位入组周期 20个月</Descriptions.Item>
                    <Descriptions.Item label="竞品研究对标">CheckMate-649, KEYNOTE-859, ATTRACTION-4</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}

export default DataCollectionStep
