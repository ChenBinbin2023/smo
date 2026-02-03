import React from 'react'
import { Card, Typography, Table, Tag, Statistic, Row, Col, Descriptions } from 'antd'
import { HistoryOutlined, TeamOutlined, LineChartOutlined, SafetyCertificateOutlined, BarChartOutlined } from '@ant-design/icons'
import { useLanguage } from '../../../context/LanguageContext'

const { Text } = Typography

const DataCollectionStep: React.FC = () => {
    const { language } = useLanguage()

    // 历史项目数据
    const historyProjectsZh = [
        { key: '1', name: 'GC-2023-Phase2', indication: '晚期胃癌', phase: 'II期', centers: 18, enrollment: 120, duration: '14个月' },
        { key: '2', name: 'GC-2022-Phase3', indication: '晚期胃癌', phase: 'III期', centers: 35, enrollment: 380, duration: '22个月' },
        { key: '3', name: 'NSCLC-2023-P2', indication: '非小细胞肺癌', phase: 'II期', centers: 22, enrollment: 180, duration: '16个月' },
    ]
    const historyProjectsEn = [
        { key: '1', name: 'GC-2023-Phase2', indication: 'Advanced Gastric Cancer', phase: 'Phase II', centers: 18, enrollment: 120, duration: '14 Months' },
        { key: '2', name: 'GC-2022-Phase3', indication: 'Advanced Gastric Cancer', phase: 'Phase III', centers: 35, enrollment: 380, duration: '22 Months' },
        { key: '3', name: 'NSCLC-2023-P2', indication: 'NSCLC', phase: 'Phase II', centers: 22, enrollment: 180, duration: '16 Months' },
    ]
    const historyProjects = language === 'zh' ? historyProjectsZh : historyProjectsEn

    const historyColumns = [
        { title: language === 'zh' ? '项目编号' : 'ID', dataIndex: 'name', key: 'name' },
        { title: language === 'zh' ? '适应症' : 'Indication', dataIndex: 'indication', key: 'indication' },
        { title: language === 'zh' ? '阶段' : 'Phase', dataIndex: 'phase', key: 'phase' },
        { title: language === 'zh' ? '中心数' : 'Sites', dataIndex: 'centers', key: 'centers' },
        { title: language === 'zh' ? '入组数' : 'Enrollment', dataIndex: 'enrollment', key: 'enrollment' },
        { title: language === 'zh' ? '周期' : 'Duration', dataIndex: 'duration', key: 'duration' },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', render: () => <Text type="secondary" className="cursor-not-allowed">{language === 'zh' ? '查看详情' : 'Details'}</Text> },
    ]

    // 中心画像数据
    const centerProfilesZh = [
        { key: '1', name: '北京协和医院', tier: '一级', specialty: '肿瘤内科', piExp: '15年', projects: 28, avgEnroll: 18 },
        { key: '2', name: '上海中山医院', tier: '一级', specialty: '肿瘤内科', piExp: '12年', projects: 24, avgEnroll: 16 },
        { key: '3', name: '广州中山肿瘤医院', tier: '一级', specialty: '胃肠肿瘤', piExp: '18年', projects: 32, avgEnroll: 22 },
        { key: '4', name: '浙江省肿瘤医院', tier: '二级', specialty: '消化肿瘤', piExp: '10年', projects: 18, avgEnroll: 14 },
        { key: '5', name: '四川华西医院', tier: '一级', specialty: '肿瘤内科', piExp: '14年', projects: 22, avgEnroll: 15 },
    ]
    const centerProfilesEn = [
        { key: '1', name: 'PUMC Hospital', tier: 'Tier 1', specialty: 'Medical Oncology', piExp: '15Y', projects: 28, avgEnroll: 18 },
        { key: '2', name: 'Zhongshan Hospital', tier: 'Tier 1', specialty: 'Medical Oncology', piExp: '12Y', projects: 24, avgEnroll: 16 },
        { key: '3', name: 'SYSU Cancer Center', tier: 'Tier 1', specialty: 'GI Oncology', piExp: '18Y', projects: 32, avgEnroll: 22 },
        { key: '4', name: 'Zhejiang Cancer Hosp', tier: 'Tier 2', specialty: 'GI Oncology', piExp: '10Y', projects: 18, avgEnroll: 14 },
        { key: '5', name: 'West China Hospital', tier: 'Tier 1', specialty: 'Medical Oncology', piExp: '14Y', projects: 22, avgEnroll: 15 },
    ]
    const centerProfiles = language === 'zh' ? centerProfilesZh : centerProfilesEn

    const centerColumns = [
        { title: language === 'zh' ? '中心名称' : 'Site Name', dataIndex: 'name', key: 'name' },
        { title: language === 'zh' ? '等级' : 'Tier', dataIndex: 'tier', key: 'tier', render: (t: string) => <Tag color={(t === '一级' || t === 'Tier 1') ? 'green' : 'blue'}>{t}</Tag> },
        { title: language === 'zh' ? '专业方向' : 'Specialty', dataIndex: 'specialty', key: 'specialty' },
        { title: language === 'zh' ? 'PI经验' : 'PI Experience', dataIndex: 'piExp', key: 'piExp' },
        { title: language === 'zh' ? '历史项目' : 'Past Projects', dataIndex: 'projects', key: 'projects' },
        { title: language === 'zh' ? '平均入组' : 'Avg Enroll', dataIndex: 'avgEnroll', key: 'avgEnroll' },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', render: () => <Text type="secondary" className="cursor-not-allowed">{language === 'zh' ? '查看详情' : 'Details'}</Text> },
    ]

    return (
        <div className="space-y-4">
            {/* 历史项目汇总 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <HistoryOutlined className="text-blue-500" />
                        <Text strong>{language === 'zh' ? '历史项目数据' : 'Historical Project Data'}</Text>
                        <Tag color="blue">{language === 'zh' ? '12个同类项目' : '12 Similar Projects'}</Tag>
                    </div>
                    <Text type="secondary" className="cursor-not-allowed">{language === 'zh' ? '查看全部' : 'View All'}</Text>
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
                        <Text strong>{language === 'zh' ? '中心/研究者画像' : 'Site/PI Profiles'}</Text>
                        <Tag color="green">{language === 'zh' ? '35家候选中心' : '35 Candidate Sites'}</Tag>
                    </div>
                    <Text type="secondary" className="cursor-not-allowed">{language === 'zh' ? '查看全部' : 'View All'}</Text>
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
                    <Text strong>{language === 'zh' ? '入组与执行数据' : 'Enrollment & Execution Data'}</Text>
                </div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title={language === 'zh' ? '同类研究平均入组率' : 'Avg Enrollment Rate'} value={2.8} suffix={language === 'zh' ? '例/中心/月' : 'pts/site/mo'} valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title={language === 'zh' ? '平均筛选失败率' : 'Avg Screen Fail Rate'} value={23} suffix="%" valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title={language === 'zh' ? '平均脱落率' : 'Avg Dropout Rate'} value={12} suffix="%" valueStyle={{ fontSize: 18 }} />
                    </Col>
                    <Col span={6}>
                        <Statistic title={language === 'zh' ? '平均方案偏离' : 'Avg Protocol Deviation'} value={4.2} suffix={language === 'zh' ? '次/中心' : 'per site'} valueStyle={{ fontSize: 18 }} />
                    </Col>
                </Row>
            </Card>

            {/* 法规/伦理条款 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <SafetyCertificateOutlined className="text-purple-500" />
                    <Text strong>{language === 'zh' ? '法规/伦理条款' : 'Regulations & Ethics'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? 'CDE指导原则' : 'CDE Guidelines'}>{language === 'zh' ? '《抗肿瘤药物临床试验终点技术指导原则》2024版' : 'Endpoints Guiding Principles 2024'}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? 'GCP合规要求' : 'GCP Compliance'}>ICH-GCP E6(R2) / {language === 'zh' ? '中国GCP 2020版' : 'China GCP 2020'}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? '伦理审查周期' : 'Ethics Review Cycle'}>{language === 'zh' ? '中心伦理平均审批周期 28天' : 'Avg Site Ethics Approval 28D'}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? '知情同意要求' : 'ICF Requirements'}>{language === 'zh' ? '电子知情同意需符合《药物临床试验质量管理规范》' : 'eICF must comply with GCP'}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 外部基准 */}
            <Card size="small" className="shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <BarChartOutlined className="text-cyan-500" />
                    <Text strong>{language === 'zh' ? '外部基准数据' : 'External Benchmarks'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? 'ClinicalTrials.gov同类研究' : 'ClinicalTrials.gov Studies'}>{language === 'zh' ? '47项（进行中18项）' : '47 studies (18 ongoing)'}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? '行业中位入组周期' : 'Industry Median Cycle'}>{language === 'zh' ? '胃癌III期中位入组周期 20个月' : 'Median GC-P3 Cycle 20 Months'}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? '竞品研究对标' : 'Competitive Benchmarking'}>CheckMate-649, KEYNOTE-859, ATTRACTION-4</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}

export default DataCollectionStep
