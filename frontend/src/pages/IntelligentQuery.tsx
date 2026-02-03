import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Card, Row, Col, Input, Button, List, Avatar, Typography, Space, Tag, Badge, Empty, Table, Divider, Statistic, Progress, Drawer } from 'antd'
import {
    RobotOutlined, UserOutlined, SendOutlined, CheckCircleFilled,
    LoadingOutlined, BookOutlined, DeploymentUnitOutlined,
    SearchOutlined, MedicineBoxOutlined, TeamOutlined, BarChartOutlined,
    ShareAltOutlined, AimOutlined, FilterOutlined, PieChartOutlined,
    BulbOutlined, ExperimentOutlined, FileTextOutlined, EyeOutlined
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { useLanguage } from '../context/LanguageContext'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// --- Types ---
interface PlanningStep {
    id: string;
    title: string;
    description: string;
    status: 'waiting' | 'running' | 'done';
    duration?: string;
}

interface Scenario {
    id: string;
    query: string;
    reportTitle: string;
    planningSteps: PlanningStep[];
    renderResult: () => React.ReactNode;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    reportId?: string;
    reportTitle?: string;
}

const IntelligentQuery: React.FC = () => {
    const { t, language } = useLanguage()
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: t('aiAssistantGreetingQuery') }
    ])
    const [inputValue, setInputValue] = useState('')
    const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null) // Stores the ID of the active scenario
    const [currentScenarioPlanningSteps, setCurrentScenarioPlanningSteps] = useState<PlanningStep[]>([]) // Stores the mutable planning steps for the active scenario
    const [isThinking, setIsThinking] = useState(false)
    const [displayedThinkingText, setDisplayedThinkingText] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [stepIndex, setStepIndex] = useState(-1)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false)
    const [selectedPI, setSelectedPI] = useState<any>(null)
    const [viewingReportId, setViewingReportId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fullThinkingText = t('thinkingDeepAnalysis')

    // --- Scenarios Mock Data ---
    const scenarios: Scenario[] = useMemo(() => [
        {
            id: 'lung-cancer',
            query: language === 'zh' ? '擅长肺癌三期临床试验的研究者' : 'PIs specialized in Lung Cancer Phase III trials',
            reportTitle: language === 'zh' ? '肺癌 III 期临床试验 PI 深度推荐报告' : 'Lung Cancer Phase III Clinical Trial PI Deep Recommendation Report',
            planningSteps: [
                { id: '1', title: language === 'zh' ? '意图拆解与本体映射' : 'Intent Decomposition & Ontology Mapping', description: language === 'zh' ? '识别主体：“肺癌” -> [适应症本体:ICD-11:2C25]；约束：“三期” -> [试验分期本体:Phase III]' : 'Identifying subject: "Lung Cancer" -> [Indication:ICD-11:2C25]; Constraint: "Phase III" -> [Phase:Phase III]', status: 'waiting' },
                { id: '2', title: language === 'zh' ? '本体关联查询' : 'Ontology Relation Query', description: language === 'zh' ? '基于 [研究者-精通-适应症] 关系路径，从本体知识库中锁定 120 位相关 PI' : 'Based on [PI-Expert-Indication] relationship paths, identified 120 related PIs from ontology knowledge base', status: 'waiting' },
                { id: '3', title: language === 'zh' ? '数据算子调用' : 'Data Operator Invocation', description: language === 'zh' ? '调用 [绩效评估算子]：计算近5年内三期试验的入组速率、FPI 达成率' : 'Invoking [Performance Evaluation Operator]: Calculating enrollment rates and FPI achievement rates in Phase III trials over the last 5 years', status: 'waiting' },
                { id: '4', title: language === 'zh' ? '综合评分建模' : 'Comprehensive Scoring Modeling', description: language === 'zh' ? '融合本体权重（经验值力加权、竞争项目负荷）生成匹配报告' : 'Fusing ontology weights (Experience weighting, Competitive project load) to generate match reports', status: 'waiting' },
                { id: '5', title: language === 'zh' ? '生成报告' : 'Generate Report', description: language === 'zh' ? '整合研究者绩效与本体匹配度，生成专家推荐决策报告' : 'Integrating PI performance and ontology matching degree to generate expert recommendation decision reports', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title={language === 'zh' ? "最优匹配 PI" : "Best Matching PI"} value={3} suffix={language === 'zh' ? "位" : " PIs"} valueStyle={{ color: '#1677ff' }} /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title={language === 'zh' ? "平均历史 FPI" : "Avg Historical FPI"} value={14} suffix={language === 'zh' ? "天" : " Days"} /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title={language === 'zh' ? "入组加速潜力" : "Enrollment Acceleration Potential"} value={25} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title={language === 'zh' ? "合规可信度" : "Compliance Credibility"} value={language === 'zh' ? "高" : "High"} valueStyle={{ color: '#faad14' }} /></Card></Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={15}>
                            <Table
                                size="small"
                                pagination={false}
                                dataSource={[
                                    { key: '1', name: language === 'zh' ? '陈教授' : 'Prof. Chen', institution: language === 'zh' ? '复旦大学附属肿瘤医院' : 'Fudan University Cancer Hospital', score: 98, rate: language === 'zh' ? '4.5人/月' : '4.5 pts/mo', siv: language === 'zh' ? '12天' : '12d', team: language === 'zh' ? '12人' : '12 members' },
                                    { key: '2', name: language === 'zh' ? '李主任' : 'Dr. Li', institution: language === 'zh' ? '上海交通大学附属胸科医院' : 'Shanghai Chest Hospital', score: 95, rate: language === 'zh' ? '3.8人/月' : '3.8 pts/mo', siv: language === 'zh' ? '15天' : '15d', team: language === 'zh' ? '8人' : '8 members' },
                                    { key: '3', name: language === 'zh' ? '王教授' : 'Prof. Wang', institution: language === 'zh' ? '中山大学肿瘤防治中心' : 'Sun Yat-sen University Cancer Center', score: 92, rate: language === 'zh' ? '3.5人/月' : '3.5 pts/mo', siv: language === 'zh' ? '18天' : '18d', team: language === 'zh' ? '15人' : '15 members' }
                                ]}
                                columns={[
                                    { title: language === 'zh' ? '顶级 PI' : 'Top PI', dataIndex: 'name', key: 'name', render: (t) => <Space><Avatar size="small" icon={<UserOutlined />} /> <Text strong>{t}</Text></Space> },
                                    { title: language === 'zh' ? '综合评分' : 'Overall Score', dataIndex: 'score', key: 'score', render: (s) => <Progress size="small" percent={s} strokeColor="#52c41a" /> },
                                    { title: language === 'zh' ? '入组速率' : 'Enrollment Rate', dataIndex: 'rate', key: 'rate' },
                                    { title: language === 'zh' ? '团队规模' : 'Team Size', dataIndex: 'team', key: 'team' },
                                    { title: t('action'), key: 'action', render: (_, record) => <Button type="link" size="small" onClick={() => { setSelectedPI(record); setIsDrawerVisible(true); }}>{t('view')}</Button> }
                                ]}
                            />
                            <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <ExperimentOutlined style={{ fontSize: 48 }} />
                                </div>
                                <div className="flex items-center space-x-2 mb-3 text-indigo-700">
                                    <BulbOutlined />
                                    <Text strong className="text-indigo-700">{language === 'zh' ? 'AI 本体决策建议' : 'AI Ontology Decision Suggestion'}</Text>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            {language === 'zh' ? (
                                                <>若您的项目 <Text strong>极其关注入组加速 (FPI/LPI)</Text>：建议首选 <Text strong className="text-blue-600">王教授 (中山肿瘤)</Text>。其历史入组斜率最陡，且当前带组负荷较低。</>
                                            ) : (
                                                <>If your project <Text strong>focuses heavily on enrollment speed (FPI/LPI)</Text>: Prof. Wang (SYSUCC) is the preferred choice. His historical enrollment slope is the steepest, and current workload is low.</>
                                            )}
                                        </Text>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            {language === 'zh' ? (
                                                <>若您的项目 <Text strong>追求极高的数据质量与学术背书</Text>：建议首选 <Text strong className="text-indigo-600">陈教授 (复旦肿瘤)</Text>。其 SCI 影响力及 GCP 合规节点分值全库领先。</>
                                            ) : (
                                                <>If your project <Text strong>pursues high data quality and academic endorsement</Text>: Prof. Chen (Fudan) is the preferred choice. His SCI influence and GCP compliance scores lead the entire database.</>
                                            )}
                                        </Text>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            {language === 'zh' ? (
                                                <>若您的项目 <Text strong>属于复杂疑难或罕见靶点</Text>：建议首选 <Text strong className="text-green-600">李主任 (上海胸科)</Text>。本体库显示其对于 ALK/ROS1 等细分靶点的既往研究深度最优。</>
                                            ) : (
                                                <>If your project <Text strong>belongs to complex or rare targets</Text>: Dr. Li (Shanghai Chest Hospital) is the preferred choice. The ontology database shows his historical research depth for sub-targets like ALK/ROS1 is optimal.</>
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={9}>
                            <Card size="small" title={language === 'zh' ? "Top 3 PI 维度匹配对标 (本体模型评价)" : "Top 3 PI Dimensional Benchmarking (Ontology Model)"} className="h-full shadow-sm">
                                <ReactECharts option={{
                                    legend: { data: [language === 'zh' ? '陈教授' : 'Prof. Chen', language === 'zh' ? '李主任' : 'Dr. Li', language === 'zh' ? '王教授' : 'Prof. Wang'], bottom: 0, textStyle: { fontSize: 10 } },
                                    radar: {
                                        indicator: [
                                            { name: language === 'zh' ? 'SCI 影响力' : 'SCI Influence', max: 100 },
                                            { name: language === 'zh' ? 'GCP 合规性' : 'GCP Compliance', max: 100 },
                                            { name: language === 'zh' ? '历史表现' : 'Hist Performance', max: 100 },
                                            { name: language === 'zh' ? '团队资源' : 'Team Resources', max: 100 },
                                            { name: language === 'zh' ? '响应速度' : 'Response Speed', max: 100 }
                                        ],
                                        radius: '50%',
                                        center: ['50%', '45%']
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [95, 100, 92, 85, 90], name: language === 'zh' ? '陈教授' : 'Prof. Chen', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [88, 95, 85, 92, 95], name: language === 'zh' ? '李主任' : 'Dr. Li', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } },
                                            { value: [92, 88, 95, 90, 80], name: language === 'zh' ? '王教授' : 'Prof. Wang', areaStyle: { color: 'rgba(250, 140, 22, 0.1)' } }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                            </Card>
                        </Col>
                    </Row>

                    <Card size="small" title={language === 'zh' ? "各年度肺癌三期试验入组趋势分析 (Top 3 对等对比)" : "Annual Lung Cancer Phase III Enrollment Trend (Top 3 Comparison)"}>
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis' },
                            legend: { data: [language === 'zh' ? '陈教授' : 'Prof. Chen', language === 'zh' ? '李主任' : 'Dr. Li', language === 'zh' ? '王教授' : 'Prof. Wang'], bottom: 0 },
                            xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'] },
                            yAxis: { type: 'value', name: language === 'zh' ? '入组数' : 'Enrolled' },
                            series: [
                                { name: language === 'zh' ? '陈教授' : 'Prof. Chen', type: 'line', smooth: true, data: [12, 18, 15, 20, 25, 28], itemStyle: { color: '#1677ff' } },
                                { name: language === 'zh' ? '李主任' : 'Dr. Li', type: 'line', smooth: true, data: [8, 12, 11, 16, 22, 24], itemStyle: { color: '#52c41a' } },
                                { name: language === 'zh' ? '王教授' : 'Prof. Wang', type: 'line', smooth: true, data: [15, 14, 18, 19, 20, 26], itemStyle: { color: '#fa8c16' } }
                            ]
                        }} style={{ height: 260 }} />
                    </Card>
                </div>
            )
        },
        {
            id: 'similar-case',
            query: language === 'zh' ? '阿可替尼三期非小细胞肺癌研究 (ALEX-3)' : 'Alectinib Phase III NSCLC study (ALEX-3)',
            reportTitle: language === 'zh' ? 'ALEX-3 相似项目特征比对与中心重用建议报告' : 'ALEX-3 Similar Project Feature Comparison & Site Reuse Recommendation Report',
            planningSteps: [
                { id: '1', title: language === 'zh' ? '目标项目特征降维' : 'Target Project Feature Dimensionality Reduction', description: language === 'zh' ? '提取 ALEX-3 核心本体：[适应症:NSCLC] [靶点:EGFR/ALK] [三期试验] [二线治疗]' : 'Extracting ALEX-3 core ontology: [Indication:NSCLC] [Target:EGFR/ALK] [Phase III] [Second-line]', status: 'waiting' },
                { id: '2', title: language === 'zh' ? '基于向量空间检索' : 'Vector Space Based Retrieval', description: language === 'zh' ? '应用 [语义指纹算法] 在历史 500+ 肺癌项目中计算相似度权重' : 'Applying [Semantic Fingerprint Algorithm] to calculate similarity weights across 500+ historical lung cancer projects', status: 'waiting' },
                { id: '3', title: language === 'zh' ? '关联本体溯源' : 'Associated Ontology Traceability', description: language === 'zh' ? '检索 [项目-中心-表现] 知识图谱，提取 3 项高相似项目的执行基准' : 'Retrieving [Project-Site-Performance] knowledge graph to extract execution benchmarks of 3 highly similar projects', status: 'waiting' },
                { id: '4', title: language === 'zh' ? '共性风险因子分析' : 'Common Risk Factor Analysis', description: language === 'zh' ? '挖掘相似项目中常见的筛选失败、脱落率等 [风险本体] 节点' : 'Mining common [Risk Ontology] nodes such as screening failures and dropout rates in similar projects', status: 'waiting' },
                { id: '5', title: language === 'zh' ? '生成报告' : 'Generate Report', description: language === 'zh' ? '汇总项目相似度表现及中心重用建议，输出临床规划决策报告' : 'Summarizing project similarity performance and site reuse suggestions to output clinical planning decision reports', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    {/* Module 0: Similar Case Library Alignment (Specific Projects) */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <BookOutlined className="text-blue-600" />
                            <Text strong>{language === 'zh' ? '相似项目库深度对标 (3项核心参考)' : 'Similar Project In-depth Comparison (3 Core Refs)'}</Text>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                {
                                    code: 'ALX-201',
                                    name: language === 'zh' ? 'ALK+ 晚期肺癌一线研究' : 'ALK+ Advanced Lung Cancer 1L Study',
                                    pi: language === 'zh' ? '李教授 (华西)' : 'Prof. Li (Huaxi)',
                                    status: language === 'zh' ? '已结项' : 'Closed',
                                    centers: 18,
                                    duration: language === 'zh' ? '14.2个月' : '14.2 Months',
                                    outcome: language === 'zh' ? '成功达标' : 'Target Met',
                                    color: 'blue'
                                },
                                {
                                    code: 'LUNG-7',
                                    name: language === 'zh' ? '三代 TKI 联合抗血管生成' : '3rd Gen TKI + Anti-angiogenic',
                                    pi: language === 'zh' ? '陈教授 (复旦)' : 'Prof. Chen (Fudan)',
                                    status: language === 'zh' ? '入组完成' : 'Enrollment Met',
                                    centers: 12,
                                    duration: language === 'zh' ? '12.5个月' : '12.5 Months',
                                    showRisk: true,
                                    outcome: language === 'zh' ? '样本量充足' : 'Sufficient Sample',
                                    color: 'indigo'
                                },
                                {
                                    code: 'EGFR-PRO',
                                    name: language === 'zh' ? '双靶点序贯治疗探索' : 'Dual-target Sequential Therapy',
                                    pi: language === 'zh' ? '王博士 (胸科)' : 'Dr. Wang (Chest)',
                                    status: language === 'zh' ? '进行中' : 'In Progress',
                                    centers: 15,
                                    duration: language === 'zh' ? '预计18个月' : 'Est. 18 Months',
                                    outcome: language === 'zh' ? '招募中' : 'Recruiting',
                                    color: 'cyan'
                                }
                            ].map((proj, i) => (
                                <Card key={i} size="small" className={`border-l-4 border-l-${proj.color}-500 shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <Text strong className="text-blue-600 text-xs">{proj.code}</Text>
                                        <Tag color={proj.status === (language === 'zh' ? '已结项' : 'Closed') ? 'success' : 'processing'}>{proj.status}</Tag>
                                    </div>
                                    <div className="text-[11px] font-bold mb-2 line-clamp-1">{proj.name}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">PI</Text>
                                            <Text>{proj.pi}</Text>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">{language === 'zh' ? '覆盖中心' : 'Covered Sites'}</Text>
                                            <Text>{proj.centers} {language === 'zh' ? '家' : 'Sites'}</Text>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">{language === 'zh' ? '执行周期' : 'Execution Cycle'}</Text>
                                            <Text>{proj.duration}</Text>
                                        </div>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div className="flex items-center text-[10px]">
                                            <Badge status={proj.showRisk ? 'warning' : 'success'} />
                                            <Text className="ml-1 truncate" type={proj.showRisk ? 'warning' : 'success'}>{proj.outcome}</Text>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Module 1: Historical Efficiency Benchmark */}
                    <Card size="small" title={language === 'zh' ? "历史项目执行耗时分布 (SIV + 招募)" : "Historical Project Execution Time (SIV + Enrollment)"} className="shadow-sm">
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                            legend: { data: [language === 'zh' ? 'SIV 准备耗时' : 'SIV Prep Time', language === 'zh' ? '入组完成耗时' : 'Enrollment Time'], bottom: 0 },
                            grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                            xAxis: { type: 'value', name: language === 'zh' ? '月' : 'Mo' },
                            yAxis: { type: 'category', data: ['PRO-NSCLC', 'ALX-201', language === 'zh' ? '行业基准线' : 'Industry Baseline'] },
                            series: [
                                { name: language === 'zh' ? 'SIV 准备耗时' : 'SIV Prep Time', type: 'bar', stack: 'total', data: [3.2, 2.8, 4.5], itemStyle: { color: '#85a5ff' } },
                                { name: language === 'zh' ? '入组完成耗时' : 'Enrollment Time', type: 'bar', stack: 'total', data: [12.5, 14.2, 18.0], itemStyle: { color: '#1677ff' } }
                            ]
                        }} style={{ height: 240 }} />
                        <div className="text-[11px] text-gray-400 mt-2 text-center">
                            {language === 'zh'
                                ? '* 数据提示：ALX-201 在华东区中心启动平均比行业快 1.7 个月，建议沿用其启动流程。'
                                : '* Data Insight: ALX-201 startup in East China is 1.7 mo faster than industry avg; suggested to reuse its process.'}
                        </div>
                    </Card>

                    <Row gutter={16}>
                        {/* Module 2: Key Performers Table */}
                        <Col span={14}>
                            <Card size="small" title={language === 'zh' ? "同类项核心中心与 PI 战绩 (Who & Where)" : "Core Sites & PI Performance in Similar Projects"} className="h-full shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', hospital: language === 'zh' ? '华西医院' : 'Huaxi Hospital', pi: language === 'zh' ? '李教授' : 'Prof. Li', rate: language === 'zh' ? '5.2/月' : '5.2/mo', quality: 98, note: language === 'zh' ? 'ALX-201 最高贡献量' : 'Highest contribution in ALX-201' },
                                        { key: '2', hospital: language === 'zh' ? '复旦肿瘤' : 'Fudan Cancer', pi: language === 'zh' ? '陈教授' : 'Prof. Chen', rate: language === 'zh' ? '4.8/月' : '4.8/mo', quality: 99, note: language === 'zh' ? 'GCP 无瑕疵中心' : 'GCP flawless site' },
                                        { key: '3', hospital: language === 'zh' ? '北京肿瘤' : 'Beijing Cancer', pi: language === 'zh' ? '张教授' : 'Prof. Zhang', rate: language === 'zh' ? '3.5/月' : '3.5/mo', quality: 95, note: language === 'zh' ? '入组最快启动' : 'Fastest enrollment startup' }
                                    ]}
                                    columns={[
                                        { title: language === 'zh' ? '核心机构' : 'Core Site', dataIndex: 'hospital', key: 'hospital' },
                                        { title: 'PI', dataIndex: 'pi', key: 'pi' },
                                        { title: language === 'zh' ? '入组速率' : 'Rate', dataIndex: 'rate', key: 'rate' },
                                        { title: language === 'zh' ? '质量分' : 'Quality', dataIndex: 'quality', key: 'quality' },
                                        { title: language === 'zh' ? '重用理由' : 'Reason to Reuse', dataIndex: 'note', key: 'note' }
                                    ]}
                                />
                            </Card>
                        </Col>

                        {/* Module 3: Failure Reason Analysis */}
                        <Col span={10}>
                            <Card size="small" title={language === 'zh' ? "相似项目筛选失败因果分析 (Why Failure)" : "Similar Project Screening Failure Analysis (Why Failure)"} className="h-full shadow-sm">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'item' },
                                    legend: { bottom: 0, textStyle: { fontSize: 10 } },
                                    series: [{
                                        type: 'pie',
                                        radius: ['40%', '60%'],
                                        center: ['50%', '45%'],
                                        data: [
                                            { value: 45, name: language === 'zh' ? '靶点变异频率不符' : 'Target Frequency Mismatch' },
                                            { value: 25, name: language === 'zh' ? '脑转移排除限制' : 'Brain Meta Exclusion' },
                                            { value: 15, name: language === 'zh' ? '前线治疗史不合' : 'Prior Therapy Mismatch' },
                                            { value: 15, name: language === 'zh' ? '其他医学评估' : 'Other Medical Assessment' }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                                <div className="mt-2 bg-red-50 p-2 rounded text-[11px] text-red-700">
                                    <Paragraph className="mb-0">
                                        <Text strong className="text-red-700">{language === 'zh' ? '风险预警：' : 'Risk Warning: '}</Text>
                                        {language === 'zh'
                                            ? 'ALX-201 在入组由于"伴随诊断不一致"导致了 12% 的脱落，建议本项目强化中心实验室质控。'
                                            : 'ALX-201 had 12% dropout due to "inconsistent companion diagnostics"; stronger central lab QC recommended for this project.'}
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Module 4: Execution Strategy */}
                    <Card size="small" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3 text-blue-700">
                                <BulbOutlined />
                                <Text strong className="text-blue-700">{language === 'zh' ? 'AI 相似项目执行建议' : 'AI Similar Project Execution Advice'}</Text>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                    <Text className="text-xs text-gray-700">
                                        <Text strong>{language === 'zh' ? '中心重用推荐' : 'Site Reuse Recommendation'}</Text>：{language === 'zh' ? 'ALX-201 覆盖的 18 家中心在 EGFR/ALK 靶点表现稳定。建议重用其中入组排名前 5 的中心，可有效减少 SIV 周期约 22 天。' : '18 sites from ALX-201 perform stably for EGFR/ALK. Reusing top 5 can reduce SIV cycle by ~22 days.'}
                                    </Text>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                    <Text className="text-xs text-gray-700">
                                        <Text strong>{language === 'zh' ? '风控预案' : 'Risk Management'}</Text>：{language === 'zh' ? '针对 12% 的历史筛选失败率，建议在纳排准则中对“脑转移状态”进行前置语义判定优化，预计可提升 15% 的入组确定性。' : 'Addressing 12% historical screen failure rate, optimizing "brain metastasis" criteria can improve enrollment certainty by 15%.'}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'multi-dim',
            query: language === 'zh' ? '华东地区病床数>500且GCP无违规的中心' : 'Centers in East China with bed count > 500 and no GCP violations',
            reportTitle: language === 'zh' ? '多维度中心准入筛选报告 (华东地区)' : 'Multi-dimensional Site Access Screening Report (East China)',
            planningSteps: [
                { id: '1', title: language === 'zh' ? '谓词逻辑转换' : 'Predicate Logic Transformation', description: language === 'zh' ? '转换：“华东” -> [RegionCode:31,32..]；“病床” -> [HospitalProperty:BedCount > 500]' : 'Transformation: "East China" -> [RegionCode:31,32..]; "Beds" -> [HospitalProperty:BedCount > 500]', status: 'waiting' },
                { id: '2', title: language === 'zh' ? '资质合规本体过滤' : 'Qualification Compliance Ontology Filtering', description: language === 'zh' ? '查询 [监管合规本体] 节点，剔除“黑名单”或“受限中”的机构' : 'Querying [Regulatory Compliance Ontology] nodes, excluding institutions in "Blacklist" or "Limited" status', status: 'waiting' },
                { id: '3', title: language === 'zh' ? '图引擎聚合结果' : 'Graph Engine Aggregation Results', description: language === 'zh' ? '执行图查询，获取满足所有约束节点的实例集合' : 'Executing graph query to get instance sets that satisfy all constraint nodes', status: 'waiting' },
                { id: '4', title: language === 'zh' ? '生成报告' : 'Generate Report', description: language === 'zh' ? '汇总多维度筛选结果，生成符合条件的中心准入白名单报告' : 'Summarizing multi-dimensional screening results to generate a whitelist report of qualified sites', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title={language === 'zh' ? "合格中心总数" : "Qualified Sites"} value={12} suffix={language === 'zh' ? "家" : ""} valueStyle={{ color: '#1677ff' }} /></Card></Col>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title={language === 'zh' ? "筛选效率提升" : "Efficiency Gain"} value={92} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title={language === 'zh' ? "整体风险评级" : "Overall Risk"} value={language === 'zh' ? "低风险" : "Low"} valueStyle={{ color: '#52c41a' }} /></Card></Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={10}>
                            <Card size="small" title={language === 'zh' ? "合规资质与人员状态对标" : "Compliance & Personnel Benchmarking"} className="h-full">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'item' },
                                    legend: { bottom: 0, textStyle: { fontSize: 10 } },
                                    series: [{
                                        type: 'pie',
                                        radius: ['45%', '70%'],
                                        center: ['50%', '45%'],
                                        avoidLabelOverlap: true,
                                        data: [
                                            { value: 8, name: language === 'zh' ? 'AAA 级 (运行卓越)' : 'AAA (Excellent)' },
                                            { value: 3, name: language === 'zh' ? 'AA 级 (稳定)' : 'AA (Stable)' },
                                            { value: 1, name: language === 'zh' ? 'A 级 (正常)' : 'A (Normal)' }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                            </Card>
                        </Col>
                        <Col span={14}>
                            <Card size="small" title={language === 'zh' ? "华东区各市分布明细 (合格中心)" : "Qualified Sites by City (East China)"} className="h-full">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                                    xAxis: { type: 'value' },
                                    yAxis: { type: 'category', data: language === 'zh' ? ['常州', '苏州', '杭州', '南京', '上海'] : ['Changzhou', 'Suzhou', 'Hangzhou', 'Nanjing', 'Shanghai'] },
                                    series: [{
                                        type: 'bar',
                                        data: [1, 2, 2, 3, 4],
                                        itemStyle: {
                                            color: {
                                                type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
                                                colorStops: [{ offset: 0, color: '#85a5ff' }, { offset: 1, color: '#1677ff' }]
                                            }
                                        }
                                    }]
                                }} style={{ height: 260 }} />
                            </Card>
                        </Col>
                    </Row>

                    <Card size="small" title={language === 'zh' ? "符合条件的中心详细名单 (华东白名单)" : "Qualified Sites Detail (East China Whitelist)"} className="shadow-sm">
                        <Table
                            size="small"
                            pagination={false}
                            dataSource={[
                                { key: '1', name: language === 'zh' ? '上海瑞金医院' : 'Shanghai Ruijin Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 1850, gcp: language === 'zh' ? '优' : 'Excellent', score: 98, region: language === 'zh' ? '上海' : 'Shanghai' },
                                { key: '2', name: language === 'zh' ? '南京鼓楼医院' : 'Nanjing Gulou Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 2200, gcp: language === 'zh' ? '优' : 'Excellent', score: 95, region: language === 'zh' ? '南京' : 'Nanjing' },
                                { key: '3', name: language === 'zh' ? '浙医二院' : 'Zhejiang Second Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 2100, gcp: language === 'zh' ? '良' : 'Good', score: 92, region: language === 'zh' ? '杭州' : 'Hangzhou' },
                                { key: '4', name: language === 'zh' ? '苏州大学附属第一医院' : 'Soochow First Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 1600, gcp: language === 'zh' ? '优' : 'Excellent', score: 94, region: language === 'zh' ? '苏州' : 'Suzhou' },
                                { key: '5', name: language === 'zh' ? '上海华山医院' : 'Shanghai Huashan Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 1500, gcp: language === 'zh' ? '优' : 'Excellent', score: 96, region: language === 'zh' ? '上海' : 'Shanghai' },
                                { key: '6', name: language === 'zh' ? '江苏省人民医院' : 'Jiangsu Provincial Hospital', level: language === 'zh' ? '三甲' : 'Grade A', beds: 2500, gcp: language === 'zh' ? '良' : 'Good', score: 91, region: language === 'zh' ? '南京' : 'Nanjing' }
                            ]}
                            columns={[
                                { title: language === 'zh' ? '中心名称' : 'Site Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                                { title: language === 'zh' ? '级别' : 'Level', dataIndex: 'level', key: 'level' },
                                { title: language === 'zh' ? '病床数' : 'Beds', dataIndex: 'beds', key: 'beds', sorter: (a: any, b: any) => a.beds - b.beds },
                                { title: language === 'zh' ? 'GCP 记录' : 'GCP Record', dataIndex: 'gcp', key: 'gcp', render: (t) => <Tag color={(t === '优' || t === 'Excellent') ? 'green' : 'blue'}>{t}</Tag> },
                                { title: language === 'zh' ? '地区' : 'Region', dataIndex: 'region', key: 'region' },
                                { title: language === 'zh' ? '评分' : 'Score', dataIndex: 'score', key: 'score', render: (s) => <Text className="text-blue-600 font-bold">{s}</Text> }
                            ]}
                        />
                    </Card>

                    <Card size="small" className="bg-blue-50/30 border-dashed border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-800 text-xs">
                            <BulbOutlined />
                            <Text className="text-blue-800">
                                <Text strong>{language === 'zh' ? 'AI 建议：' : 'AI Suggestion: '}</Text>
                                {language === 'zh'
                                    ? '针对华东区大容量中心筛选，上海与南京地区的中心在 [病床规模/GCP 连续性] 两个维度的本体匹配度最高，建议优先启动瑞金与鼓楼医院。'
                                    : 'For high-capacity site screening in East China, sites in Shanghai and Nanjing have the highest ontology matching in [Bed Scale/GCP Continuity]. Recommended to prioritize Ruijin and Gulou Hospital.'}
                            </Text>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'aggregation',
            query: language === 'zh' ? '各省肺癌试验中心的数量分布' : 'Distribution of Lung Cancer trial centers by province',
            reportTitle: language === 'zh' ? '全国肺癌临床试验中心地理分布热力图谱系统简报' : 'National Lung Cancer Clinical Trial Center Geographic Distribution Heatmap Briefing',
            planningSteps: [
                { id: '1', title: language === 'zh' ? '地理本体聚合' : 'Geographic Ontology Aggregation', description: language === 'zh' ? '应用 [行政区划本体] 树形结构，将 [研究中心] 实例按省级坐标聚合' : 'Applying [Administrative Division Ontology] tree structure to aggregate [Research Center] instances by provincial coordinates', status: 'waiting' },
                { id: '2', title: language === 'zh' ? '现状快照提取' : 'Status Snapshot Extraction', description: language === 'zh' ? '统计状态为“Active”的肺癌相关中心节点数量' : 'Counting the number of lung cancer related center nodes with "Active" status', status: 'waiting' },
                { id: '3', title: language === 'zh' ? '结果可视化降维' : 'Results Visualization Dimensionality Reduction', description: language === 'zh' ? '将高维图数据转换为二维地理分布坐标、' : 'Converting high-dimensional graph data into 2D geographic distribution coordinates', status: 'waiting' },
                { id: '4', title: language === 'zh' ? '生成报告' : 'Generate Report', description: language === 'zh' ? '完成地理空间聚合，生成全国中心分布热力 analysis 简报' : 'Compiling geospatial aggregation to generate national center distribution heatmap brief', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    {/* Module 1: China Province Panorama chart */}
                    <Card size="small" title={language === 'zh' ? "全国肺癌试验中心各省分布全景 (Top 15)" : "Lung Cancer Site Distribution Panorama (Top 15)"} className="shadow-sm">
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                            xAxis: {
                                type: 'category',
                                data: language === 'zh' ? ['上海', '江苏', '广东', '北京', '浙江', '四川', '山东', '湖北', '湖南', '河南', '陕西', '安徽', '重庆', '福建', '辽宁'] : ['Shanghai', 'Jiangsu', 'Guangdong', 'Beijing', 'Zhejiang', 'Sichuan', 'Shandong', 'Hubei', 'Hunan', 'Henan', 'Shaanxi', 'Anhui', 'Chongqing', 'Fujian', 'Liaoning'],
                                axisLabel: { interval: 0, fontSize: 10 }
                            },
                            yAxis: { type: 'value', name: language === 'zh' ? '中心数' : 'Sites' },
                            series: [{
                                data: [52, 48, 45, 42, 38, 30, 28, 25, 22, 20, 18, 16, 15, 14, 12],
                                type: 'bar',
                                itemStyle: {
                                    color: (params: any) => {
                                        const colors = ['#1677ff', '#1677ff', '#1677ff', '#1677ff', '#1677ff'];
                                        return params.dataIndex < 5 ? colors[params.dataIndex] : '#85a5ff';
                                    }
                                }
                            }]
                        }} style={{ height: 260 }} />
                    </Card>

                    <Row gutter={16}>
                        {/* Module 2: Province Resource Inventory Table */}
                        <Col span={13}>
                            <Card size="small" title={language === 'zh' ? "各省临床资源详情快照" : "Clinical Resources by Province Snapshot"} className="h-full shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', province: language === 'zh' ? '上海市' : 'Shanghai', sites: 52, active: 145, t3a: '96%', siv: '3.2m' },
                                        { key: '2', province: language === 'zh' ? '江苏省' : 'Jiangsu', sites: 48, active: 112, t3a: '88%', siv: '3.5m' },
                                        { key: '3', province: language === 'zh' ? '广东省' : 'Guangdong', sites: 45, active: 98, t3a: '92%', siv: '3.8m' },
                                        { key: '4', province: language === 'zh' ? '北京市' : 'Beijing', sites: 42, active: 156, t3a: '98%', siv: '4.2m' },
                                        { key: '5', province: language === 'zh' ? '浙江省' : 'Zhejiang', sites: 38, active: 85, t3a: '85%', siv: '3.6m' }
                                    ]}
                                    columns={[
                                        { title: language === 'zh' ? '省份' : 'Province', dataIndex: 'province', key: 'province', render: (t) => <Text strong>{t}</Text> },
                                        { title: language === 'zh' ? '中心数' : 'Sites', dataIndex: 'sites', key: 'sites' },
                                        { title: language === 'zh' ? '在研项目' : 'Ongoing Projects', dataIndex: 'active', key: 'active' },
                                        { title: language === 'zh' ? '三甲占比' : 'Grade A %', dataIndex: 't3a', key: 't3a' },
                                        { title: language === 'zh' ? '平均SIV' : 'Avg SIV', dataIndex: 'siv', key: 'siv', render: (s) => <Tag color="blue">{s}</Tag> }
                                    ]}
                                />
                            </Card>
                        </Col>

                        {/* Module 3: Core Province Comparison Radar */}
                        <Col span={11}>
                            <Card size="small" title={language === 'zh' ? "核心省份综合竞争力对标" : "Core Provinces Competitiveness Benchmarking"} className="h-full shadow-sm">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    legend: { data: [language === 'zh' ? '上海' : 'Shanghai', language === 'zh' ? '江苏' : 'Jiangsu', language === 'zh' ? '北京' : 'Beijing'], bottom: 0, textStyle: { fontSize: 10 } },
                                    radar: {
                                        indicator: [
                                            { name: language === 'zh' ? '中心规模' : 'Site Scale', max: 100 },
                                            { name: language === 'zh' ? '科研产出' : 'R&D Output', max: 100 },
                                            { name: language === 'zh' ? '启动速度' : 'Startup Speed', max: 100 },
                                            { name: language === 'zh' ? '病患流量' : 'Patient Pool', max: 100 },
                                            { name: language === 'zh' ? '政策支持' : 'Policy Support', max: 100 }
                                        ],
                                        radius: '55%',
                                        center: ['50%', '45%']
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [100, 95, 90, 85, 80], name: language === 'zh' ? '上海' : 'Shanghai', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [92, 85, 88, 95, 85], name: language === 'zh' ? '江苏' : 'Jiangsu', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } },
                                            { value: [95, 100, 75, 80, 90], name: language === 'zh' ? '北京' : 'Beijing', areaStyle: { color: 'rgba(250, 173, 20, 0.1)' } }
                                        ]
                                    }]
                                }} style={{ height: 280 }} />
                            </Card>
                        </Col>
                    </Row>

                    {/* Module 4: Strategy Advice */}
                    <Card size="small" className="bg-blue-50 border-blue-100">
                        <div className="flex items-center space-x-2 text-blue-800 text-xs">
                            <BulbOutlined />
                            <Text className="text-blue-800">
                                <Text strong>{language === 'zh' ? 'AI 跨省布局策略：' : 'AI Cross-province Strategy: '}</Text>
                                {language === 'zh'
                                    ? '针对肺癌试验，上海与北京具备最高质量的领军中心，建议作为项目首发；江苏与广东具备最成熟的执行效率（SIV 周期短），适合作为入组加速区。'
                                    : 'For lung cancer medicine trials, Shanghai and Beijing have top-tier leading sites for project launch; Jiangsu and Guangdong have optimal execution efficiency (short SIV), suitable for enrollment acceleration.'}
                            </Text>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'comparative-analysis',
            query: language === 'zh' ? 'T细胞血液病中心对比' : 'Comparison of T-cell Hematology Centers',
            reportTitle: language === 'zh' ? 'T 细胞血液病临床试验中心竞品比对报告' : 'T-cell Hematology Clinical Trial Center Competitor Comparison Report',
            planningSteps: [
                { id: '1', title: language === 'zh' ? '对比意图解析' : 'Comparison Intent Parsing', description: language === 'zh' ? '识别对比对象：[华西医院] vs [协和医院]；领域：[血液病:T细胞淋巴瘤]' : 'Identifying comparison objects: [Huaxi Hospital] vs [PUMCH]; Field: [Hematology: T-cell Lymphoma]', status: 'waiting' },
                { id: '2', title: language === 'zh' ? '核心性能底图调取' : 'Core Performance Base Map Retrieval', description: language === 'zh' ? '检索两家中心近3年细胞治疗类（CAR-T/TCR-T）试验的历史入组率及 SIV 耗时' : "Retrieving historical enrollment rates and SIV duration for cell therapy (CAR-T/TCR-T) trials at both centers over the last 3 years", status: 'waiting' },
                { id: '3', title: language === 'zh' ? '配套设施本体对标' : 'Supporting Facilities Ontology Benchmarking', description: language === 'zh' ? '对比 [洁净实验室等级] [血细胞分离机数量] 及 [OEC 认证状态] 本体节点' : 'Comparing [Clean Lab Grade] [Cell Separator Count] and [OEC Certification Status] ontology nodes', status: 'waiting' },
                { id: '4', title: language === 'zh' ? '生存分析模拟' : 'Survival Analysis Simulation', description: language === 'zh' ? '基于过往项目质量数据，评估两家中心在复杂血液病试验中的风险控制能力' : 'Assessing risk control capabilities of both centers in complex hematology trials based on past project quality data', status: 'waiting' },
                { id: '5', title: language === 'zh' ? '生成对比结论' : 'Generate Comparison Conclusion', description: language === 'zh' ? '综合效率、质量、设施三维度生成最终选址建议报告' : 'Generating final site recommendation report across efficiency, quality, and facilities dimensions', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card size="small" title={language === 'zh' ? "核心指标对标" : "Core Metrics Benchmarking"} className="shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', metric: language === 'zh' ? '平均入组速率' : 'Avg Enrollment Rate', huaxi: language === 'zh' ? '2.8人/月' : '2.8 pts/mo', xiehe: language === 'zh' ? '3.1人/月' : '3.1 pts/mo' },
                                        { key: '2', metric: language === 'zh' ? 'SIV 平均耗时' : 'Avg SIV Duration', huaxi: language === 'zh' ? '18天' : '18 Days', xiehe: language === 'zh' ? '14天' : '14 Days' },
                                        { key: '3', metric: language === 'zh' ? 'CRC 团队稳定性' : 'CRC Team Stability', huaxi: language === 'zh' ? '高' : 'High', xiehe: language === 'zh' ? '极高' : 'Very High' },
                                        { key: '4', metric: language === 'zh' ? '细胞治疗设施点' : 'Cell Therapy Facilities', huaxi: language === 'zh' ? '12个' : '12 Units', xiehe: language === 'zh' ? '15个' : '15 Units' }
                                    ]}
                                    columns={[
                                        { title: language === 'zh' ? '对比项' : 'Metric', dataIndex: 'metric', key: 'metric' },
                                        { title: language === 'zh' ? '华西医院' : 'Huaxi Hospital', dataIndex: 'huaxi', key: 'huaxi', render: (text) => <Text strong className="text-blue-600">{text}</Text> },
                                        { title: language === 'zh' ? '协和医院' : 'PUMCH', dataIndex: 'xiehe', key: 'xiehe', render: (text) => <Text strong className="text-green-600">{text}</Text> }
                                    ]}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" title={language === 'zh' ? "研发能力多维对标" : "R&D Capability Benchmarking"} className="h-full shadow-sm">
                                <ReactECharts option={{
                                    radar: {
                                        indicator: [
                                            { name: language === 'zh' ? '响应速度' : 'Response Speed', max: 100 },
                                            { name: language === 'zh' ? '设施完善度' : 'Facilities', max: 100 },
                                            { name: language === 'zh' ? '受试者基数' : 'Subject Base', max: 100 },
                                            { name: language === 'zh' ? 'PI 影响力' : 'PI Influence', max: 100 },
                                            { name: language === 'zh' ? '合规表现' : 'Compliance', max: 100 }
                                        ]
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [85, 80, 95, 90, 88], name: language === 'zh' ? '华西医院' : 'Huaxi Hospital', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [95, 98, 90, 95, 96], name: language === 'zh' ? '协和医院' : 'PUMCH', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } }
                                        ]
                                    }]
                                }} style={{ height: 250 }} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={14}>
                            <Card size="small" title={language === 'zh' ? "近半年 T 细胞类试验入组效率对比 (例/月)" : "Past 6m T-cell Trial Enrollment Efficiency (pts/mo)"}>
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    legend: { data: [language === 'zh' ? '华西医院' : 'Huaxi Hospital', language === 'zh' ? '协和医院' : 'PUMCH'], top: 0 },
                                    xAxis: { type: 'value' },
                                    yAxis: { type: 'category', data: ['CAR-T', 'TCR-T', 'TIL', language === 'zh' ? '其它细胞' : 'Others'] },
                                    series: [
                                        { name: language === 'zh' ? '华西医院' : 'Huaxi Hospital', type: 'bar', data: [3.2, 2.5, 1.8, 1.2], itemStyle: { color: '#1677ff' } },
                                        { name: language === 'zh' ? '协和医院' : 'PUMCH', type: 'bar', data: [3.8, 2.8, 2.2, 1.5], itemStyle: { color: '#52c41a' } }
                                    ]
                                }} style={{ height: 220 }} />
                            </Card>
                        </Col>
                        <Col span={10}>
                            <div className="h-full bg-green-50/50 border border-green-100 rounded-xl p-6 flex flex-col justify-center">
                                <div className="flex items-center space-x-2 text-green-700 mb-4">
                                    <CheckCircleFilled className="text-xl" />
                                    <Text strong className="text-lg">{language === 'zh' ? '本体决策引擎建议' : 'Ontology Decision Engine Suggestion'}</Text>
                                </div>
                                <Paragraph className="text-gray-600">
                                    {language === 'zh'
                                        ? <>综合评估显示，<Text strong className="text-green-600">协和医院</Text>在 T 细胞血液病领域拥有更优的 [SIV 启动效率] 和更全的 [GMP 洁净实验室配套]，建议作为本项目的首选中心。</>
                                        : <>Comprehensive assessment shows that <Text strong className="text-green-600">PUMCH</Text> has better [SIV startup efficiency] and more complete [GMP clean lab facilities] in the field of T-cell hematology, suggested as the primary site.</>}
                                </Paragraph>
                                <Button type="primary" ghost block size="large">{language === 'zh' ? '申请一键推样' : 'Apply for One-click Recommendation'}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
    ], [language]) // Re-create scenarios when language changes

    // Derived currentScenario object based on currentScenarioId and current language
    const currentScenario = useMemo(() => {
        if (!currentScenarioId) return null
        const baseScenario = scenarios.find(s => s.id === currentScenarioId)
        if (!baseScenario) return null
        // Combine base scenario with mutable planning steps
        return { ...baseScenario, planningSteps: currentScenarioPlanningSteps }
    }, [currentScenarioId, scenarios, currentScenarioPlanningSteps])

    // Effect to update planning steps when currentScenarioId changes (e.g., new query or language switch)
    useEffect(() => {
        if (currentScenarioId) {
            const baseScenario = scenarios.find(s => s.id === currentScenarioId)
            if (baseScenario) {
                // Initialize planning steps to 'waiting' when a new scenario is selected or language changes
                setCurrentScenarioPlanningSteps(baseScenario.planningSteps.map(step => ({ ...step, status: 'waiting' })))
            }
        } else {
            setCurrentScenarioPlanningSteps([])
        }
    }, [currentScenarioId, scenarios]) // Depend on scenarios to re-initialize on language change

    const handleSend = (text: string = inputValue) => {
        if (!text) return
        const newMsgs: Message[] = [...messages, { role: 'user' as const, content: text }]
        setMessages(newMsgs)
        setInputValue('')

        const lowerText = text.toLowerCase()
        let matchedScenario = scenarios.find(s =>
            lowerText.includes(s.query.toLowerCase()) ||
            (s.id === 'aggregation' && (lowerText.includes('分布') || lowerText.includes('distribution'))) ||
            (s.id === 'multi-dim' && (lowerText.includes('病床') || lowerText.includes('bed'))) ||
            (s.id === 'similar-case' && (lowerText.includes('相似') || lowerText.includes('similar') || lowerText.includes('alex-3'))) ||
            (s.id === 'comparative-analysis' && (lowerText.includes('对比') || lowerText.includes('comparison'))) ||
            (s.id === 'lung-cancer' && (lowerText.includes('pi') || lowerText.includes('研究者')))
        )
        if (!matchedScenario) matchedScenario = scenarios[0]

        // Reset and trigger thinking phase first
        setCurrentScenarioId(matchedScenario.id) // Set the ID
        setCurrentScenarioPlanningSteps(matchedScenario.planningSteps.map(s => ({ ...s, status: 'waiting' }))) // Initialize steps
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    // Typewriter effect logic
    useEffect(() => {
        if (isThinking) {
            if (displayedThinkingText.length < fullThinkingText.length) {
                const timer = setTimeout(() => {
                    setDisplayedThinkingText(fullThinkingText.slice(0, displayedThinkingText.length + 1))
                }, 15)
                return () => clearTimeout(timer)
            } else {
                // Thinking finished, wait a bit then start processing
                const timer = setTimeout(() => {
                    setIsThinking(false)
                    if (currentScenarioId) {
                        setCurrentScenarioPlanningSteps(prevSteps => {
                            const startSteps = [...prevSteps]
                            if (startSteps.length > 0) {
                                startSteps[0].status = 'running'
                            }
                            return startSteps
                        })
                        setStepIndex(1)
                    }
                    setIsProcessing(true)
                }, 800)
                return () => clearTimeout(timer)
            }
        }
    }, [isThinking, displayedThinkingText, fullThinkingText, currentScenarioId])

    useEffect(() => {
        if (isProcessing && currentScenarioId && currentScenarioPlanningSteps.length > 0 && stepIndex < currentScenarioPlanningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500 // 0.5-2 seconds
            const timer = setTimeout(() => {
                setCurrentScenarioPlanningSteps(prevSteps => {
                    const nextSteps = [...prevSteps]
                    if (stepIndex > 0) {
                        nextSteps[stepIndex - 1] = { ...nextSteps[stepIndex - 1], status: 'done', duration: `+${(randomDelay / 1000).toFixed(1)}s` }
                    }
                    if (stepIndex < nextSteps.length) {
                        nextSteps[stepIndex] = { ...nextSteps[stepIndex], status: 'running' }
                    }
                    return nextSteps
                })
                setStepIndex(prev => prev + 1)
            }, randomDelay)
            return () => clearTimeout(timer)
        } else if (isProcessing && currentScenarioId && currentScenarioPlanningSteps.length > 0 && stepIndex === currentScenarioPlanningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500 // 0.5-2 seconds
            const timer = setTimeout(() => {
                setCurrentScenarioPlanningSteps(prevSteps => {
                    const finalSteps = [...prevSteps]
                    if (finalSteps.length > 0) {
                        finalSteps[finalSteps.length - 1] = { ...finalSteps[finalSteps.length - 1], status: 'done', duration: `+${(randomDelay / 1000).toFixed(1)}s` }
                    }
                    return finalSteps
                })
                setIsProcessing(false)
                const completedScenario = scenarios.find(s => s.id === currentScenarioId)
                if (completedScenario) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: t('queryPlanningExecuted'),
                        reportId: completedScenario.id,
                        reportTitle: completedScenario.reportTitle
                    }])
                }
            }, randomDelay)
            return () => clearTimeout(timer)
        }
    }, [isProcessing, stepIndex, currentScenarioId, currentScenarioPlanningSteps, scenarios, t])

    return (
        <div className="h-full overflow-hidden p-2">
            <Row gutter={20} className="h-full">
                {/* Left Side: CUI */}
                <Col span={7} className="h-full">
                    <Card bordered={false} className="flex flex-col glass-card h-full" title={
                        <div className="flex items-center space-x-2">
                            <RobotOutlined className="text-blue-500" />
                            <span>{t('aiChatInteraction')}</span>
                        </div>
                    } bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 12px' }}>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 scrollbar-thin">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <Avatar
                                            icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                            className={msg.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-green-500 mr-2'}
                                            size="small"
                                        />
                                        <div className={`p-3 rounded-lg text-sm overflow-hidden ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            <Text style={{ color: msg.role === 'user' ? 'white' : 'inherit' }}>{msg.content}</Text>
                                            {msg.reportId && msg.reportTitle && (
                                                <div className="mt-2 pt-2 border-t border-gray-200 overflow-hidden">
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        className="p-0 h-auto text-blue-600 hover:text-blue-800 w-full"
                                                        onClick={() => {
                                                            // Find the matched scenario and set it as current
                                                            const targetScenario = scenarios.find(s => s.id === msg.reportId)
                                                            if (targetScenario) {
                                                                setCurrentScenarioId(targetScenario.id)
                                                                setCurrentScenarioPlanningSteps(targetScenario.planningSteps.map(s => ({ ...s, status: 'done' as const })))
                                                                setStepIndex(targetScenario.planningSteps.length)
                                                                setIsProcessing(false)
                                                                setIsThinking(false)
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1 w-full overflow-hidden">
                                                            <FileTextOutlined className="flex-shrink-0" />
                                                            <span className="truncate flex-1 min-w-0 text-left" title={msg.reportTitle}>《{msg.reportTitle}》</span>
                                                            <EyeOutlined className="flex-shrink-0" />
                                                        </div>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="flex space-x-2">
                                <TextArea
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder={t('semanticQueryInstructions')}
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    onPressEnter={e => {
                                        if (!e.shiftKey) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    className="rounded-lg"
                                />
                                <Button type="primary" icon={<SendOutlined />} onClick={() => handleSend()} loading={isProcessing} className="rounded-lg h-auto" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '擅长肺癌三期临床试验的研究者' : 'PIs specialized in Lung Cancer Phase III trials')}>{t('piRetrieval')}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '查找阿可替尼三期非小细胞肺癌研究的相似项目' : 'Search for similar projects to Alectinib Phase III NSCLC study')}>{t('similarProjectRetrieval')}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? 'T细胞血液病中心对比' : 'Comparison of T-cell Hematology Centers')}>{t('comparisonAnalysis')}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '华东地区病床数>500且GCP无违规的中心' : 'Centers in East China with bed count > 500 and no GCP violations')}>{t('multiDimScreening')}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '各省肺癌试验中心的数量分布' : 'Distribution of Lung Cancer trial centers by province')}>{t('nationalGeoDist')}</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Execution & Design View */}
                <Col span={17} className="h-full">
                    <Card
                        title={
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Space size="large">
                                        <Space>
                                            <DeploymentUnitOutlined className="text-blue-600" />
                                            <span>{(!isProcessing && !isThinking && currentScenario && stepIndex >= currentScenario.planningSteps.length) ? currentScenario.reportTitle : t('ontologyReasoningChain')}</span>
                                        </Space>
                                        {currentScenario && !isProcessing && stepIndex >= currentScenario.planningSteps.length && <Badge status="success" text={t('reportGenerated')} />}
                                    </Space>
                                </div>
                                {currentScenario && !isProcessing && stepIndex >= currentScenario.planningSteps.length && (
                                    <Space>
                                        <Button size="small" icon={<ShareAltOutlined />}>{t('share')}</Button>
                                        <Button size="small" type="primary">{t('exportPDF')}</Button>
                                    </Space>
                                )}
                            </div>
                        }
                        className="glass-card h-full"
                        bodyStyle={{ overflowY: 'auto', height: 'calc(100% - 56px)', padding: '24px' }}
                    >
                        {!currentScenario ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                                <ShareAltOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                                <Paragraph>{t('startSemanticAnalysisEngine')}</Paragraph>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                {isThinking && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mb-10 p-6 bg-purple-50/30 border border-purple-100 rounded-2xl"
                                    >
                                        <div className="flex items-center space-x-3 mb-4">
                                            <RobotOutlined className="text-purple-500 animate-bounce" />
                                            <Text strong className="text-purple-700">{t('aiThinkingDeeply')}</Text>
                                        </div>
                                        <div className="flex flex-col">
                                            <Text className="text-gray-600 leading-relaxed min-h-[3em]">
                                                {displayedThinkingText}
                                                <span className="animate-pulse inline-block w-2 h-4 ml-1 bg-purple-400 align-middle"></span>
                                            </Text>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Planning Flow */}
                                {!isThinking && isProcessing && (
                                    <div className="mb-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex-1">
                                                <Text type="secondary" className="block mb-2">
                                                    {t('queryPlanningExecuted')}
                                                </Text>
                                                <Title level={4} className="m-0 text-blue-600">{currentScenario?.reportTitle}</Title>
                                            </div>
                                            <Tag color="blue" icon={<LoadingOutlined />}>
                                                {t('reasoningInProgress')}
                                            </Tag>
                                        </div>
                                        <div className="space-y-3">
                                            {currentScenario.planningSteps.map((step, i) => (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className={`p-4 rounded-xl flex items-center shadow-sm transition-all ${step.status === 'running'
                                                        ? 'bg-blue-50/80 border border-blue-200'
                                                        : step.status === 'done'
                                                            ? 'bg-green-50/40 border border-green-100'
                                                            : 'bg-white border border-gray-100'
                                                        }`}
                                                >
                                                    <div className="mr-4">
                                                        {step.status === 'done' ? (
                                                            <Avatar size="small" className="bg-green-500" icon={<CheckCircleFilled />} />
                                                        ) : step.status === 'running' ? (
                                                            <Avatar size="small" className="bg-blue-500" icon={<LoadingOutlined />} />
                                                        ) : (
                                                            <Avatar size="small" className="bg-gray-200" icon={<div className="w-1 h-1 bg-white" />} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Text strong className={step.status === 'done' ? 'text-gray-400' : 'text-gray-800'}>{step.title}</Text>
                                                        <div className="text-[11px] text-gray-500">{step.description}</div>
                                                    </div>
                                                    {step.status === 'done' && <Text type="secondary" style={{ fontSize: 10 }}>{step.duration}</Text>}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Results View */}
                                <AnimatePresence>
                                    {!isProcessing && !isThinking && stepIndex >= currentScenario.planningSteps.length && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="report-container"
                                        >
                                            <Card bordered={false} className="shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/50">
                                                <div className="p-2">
                                                    {currentScenario.renderResult()}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Drawer
                title={language === 'zh' ? "研究者深度详情与本体画像" : "PI Deep Detail & Ontology Portrait"}
                placement="right"
                width={650}
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                maskStyle={{ backdropFilter: 'blur(4px)' }}
                bodyStyle={{ padding: 0 }}
            >
                {selectedPI && (
                    <div className="flex flex-col h-full bg-gray-50/30">
                        {/* Status Bar */}
                        <div className="bg-blue-600 px-6 py-2 flex justify-between items-center text-white text-xs">
                            <Space><AimOutlined /> <span>{language === 'zh' ? "实时本体匹配度" : "Real-time Ontology Match"}: {selectedPI.score}%</span></Space>
                            <span>{language === 'zh' ? "数据最后同步" : "Data Last Sync"}: {language === 'zh' ? "1小时前" : "1h ago"}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Profile Header */}
                            <section>
                                <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge status="processing" text={language === 'zh' ? "在研项目中" : "Ongoing Project"} />
                                    </div>
                                    <Avatar size={90} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPI.name}`} className="border-4 border-blue-50 shadow-lg" />
                                    <div className="flex-1">
                                        <Title level={3} style={{ margin: 0 }}>{selectedPI.name}</Title>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Tag color="blue">{language === 'zh' ? "主任医师" : "Chief Physician"}</Tag>
                                            <Tag color="cyan">{language === 'zh' ? "博士生导师" : "PhD Supervisor"}</Tag>
                                            <Tag color="purple">{language === 'zh' ? "学科带头人" : "Subject Leader"}</Tag>
                                            <Tag color="orange">{language === 'zh' ? "学会常委" : "Committee Member"}</Tag>
                                        </div>
                                        <Text type="secondary" className="block mt-3 text-sm">{selectedPI.hospital} · {language === 'zh' ? "肿瘤内科" : "Oncology"}</Text>
                                    </div>
                                </div>

                                {/* Core Metrics Grid */}
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {[
                                        { label: language === 'zh' ? '从业年限' : 'Experience', value: language === 'zh' ? '22年' : '22Y', icon: <BookOutlined /> },
                                        { label: language === 'zh' ? '最高影响因子' : 'Max IF', value: '52.1', icon: <BarChartOutlined /> },
                                        { label: language === 'zh' ? '带组经验' : 'PI Experience', value: language === 'zh' ? '15年+' : '15Y+', icon: <TeamOutlined /> }
                                    ].map((m, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                            <div className="text-blue-500 mb-1">{m.icon}</div>
                                            <div className="text-lg font-bold text-gray-800">{m.value}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Professional Roles */}
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <MedicineBoxOutlined className="text-blue-500" />
                                    <Text strong className="text-base">{language === 'zh' ? "任职详情" : "Professional Roles"}</Text>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <Text className="text-sm">{language === 'zh' ? "临床试验机构办公室 (GCP) 主任" : "GCP Office Director"}</Text>
                                        <Tag>{language === 'zh' ? "行政职务" : "Administrative"}</Tag>
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <Text className="text-sm">{language === 'zh' ? "中国抗癌协会肺癌专业委员会委员" : "Member of Lung Cancer Professional Committee"}</Text>
                                        <Tag>{language === 'zh' ? "学术兼职" : "Academic"}</Tag>
                                    </div>
                                </div>
                            </section>

                            {/* Team & Resources */}
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <TeamOutlined className="text-blue-500" />
                                    <Text strong className="text-base">{language === 'zh' ? "研究团队与资源" : "Research Team & Resources"}</Text>
                                </div>
                                <Card size="small" className="bg-white border-blue-100">
                                    <Paragraph className="text-gray-600 text-sm mb-0">
                                        {selectedPI.team}。{language === 'zh'
                                            ? <>团队拥有独立办公区约 200平米，配备 <Text strong className="text-blue-600">6 名专属 CRC</Text>，具备极强的 FPI 攻坚能力。
                                                过往项目平均入组速度处于全国前 3%，曾多次协助药监局进行 GCP 现场核查培训。</>
                                            : <>The team has ~200 sqm office, with <Text strong className="text-blue-600">6 dedicated CRCs</Text>. Strong FPI capability, enrollment speed in top 3% nationwide. Often assists NMPA for GCP audits.</>}
                                    </Paragraph>
                                </Card>
                            </section>

                            {/* Related Research */}
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <DeploymentUnitOutlined className="text-indigo-500" />
                                    <Text strong className="text-base">{language === 'zh' ? "本体关联研究 (学术影响力画像)" : "Ontology Research (Academic Influence)"}</Text>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: language === 'zh' ? '三代 TKI 在 NSCLC 三期临床中的安全性评价' : 'Safety evaluation of 3rd gen TKI in NSCLC Phase III', journal: 'Lancet Oncology', correlation: 98, highlight: language === 'zh' ? '定义了 EGFR 突变人群的治疗基准' : 'Defined treatment benchmark for EGFR mutations' },
                                        { title: language === 'zh' ? '基于生物标志物的肺癌晚期联合用药探索' : 'Biomarker-based combination therapy in advanced NSCLC', journal: 'Journal of Clinical Oncology', correlation: 92, highlight: language === 'zh' ? '提出了多靶点联合治疗新路径' : 'Proposed new multi-target combination path' },
                                        { title: language === 'zh' ? '中国人群肺癌五年生存率本体画像分析' : 'Ontology portrait of 5Y survival rate in Chinese lung cancer', journal: 'NEJM', correlation: 88, highlight: language === 'zh' ? '填补了亚洲人群真实世界研究空白' : 'Filled the gap in Asian real-world studies' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-bold text-gray-800 flex-1 pr-4">{item.title}</div>
                                                <Badge count={`${item.correlation}% ${language === 'zh' ? '关联' : 'Match'}`} style={{ backgroundColor: '#e6f7ff', color: '#1677ff', boxShadow: 'none' }} />
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <Text type="secondary" style={{ fontSize: 11 }}>{item.journal}</Text>
                                                <Text italic className="text-[10px] text-blue-400 bg-blue-50 px-2 py-0.5 rounded-md">{item.highlight}</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100">
                            <Button type="primary" block size="large" className="h-12 text-base font-bold shadow-lg shadow-blue-100 rounded-xl">
                                {language === 'zh' ? "选定该 PI 并发起中心调研 (Site Survey)" : "Select PI & Launch Site Survey"}
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

export default IntelligentQuery
