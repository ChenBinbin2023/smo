import React, { useState, useEffect, useRef } from 'react'
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
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '您好！我是集成本体认知的智能助理。请输入您的查询需求，我将通过知识图谱与本体架构为您精准规划和检索。' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
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

    const fullThinkingText = "正在深度解析您的语义意图，并基于 SMO 本体架构检索跨维度的相关节点与关联路径。系统正在构建一套最优的推理规划链条：首先调取领域知识图谱锁定核心实体，随后通过多模态算子评估入组速率与合规性权重，正动态分配特征计算资源，以确保检索结果的精准度与可落地性……"

    // --- Scenarios Mock Data ---
    const scenarios: Scenario[] = [
        {
            id: 'lung-cancer',
            query: '擅长肺癌三期临床试验的研究者',
            reportTitle: '肺癌 III 期临床试验 PI 深度推荐报告',
            planningSteps: [
                { id: '1', title: '意图拆解与本体映射', description: '识别主体：“肺癌” -> [适应症本体:ICD-11:2C25]；约束：“三期” -> [试验分期本体:Phase III]', status: 'waiting' },
                { id: '2', title: '本体关联查询', description: '基于 [研究者-精通-适应症] 关系路径，从本体知识库中锁定 120 位相关 PI', status: 'waiting' },
                { id: '3', title: '数据算子调用', description: '调用 [绩效评估算子]：计算近5年内三期试验的入组速率、FPI 达成率', status: 'waiting' },
                { id: '4', title: '综合评分建模', description: '融合本体权重（经验值力加权、竞争项目负荷）生成匹配报告', status: 'waiting' },
                { id: '5', title: '生成报告', description: '整合研究者绩效与本体匹配度，生成专家推荐决策报告', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title="最优匹配 PI" value={3} suffix="位" valueStyle={{ color: '#1677ff' }} /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title="平均历史 FPI" value={14} suffix="天" /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title="入组加速潜力" value={25} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                        <Col span={6}><Card size="small" className="text-center shadow-sm"><Statistic title="合规可信度" value="高" valueStyle={{ color: '#faad14' }} /></Card></Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={15}>
                            <Table
                                size="small"
                                pagination={false}
                                dataSource={[
                                    { key: '1', name: '陈教授', institution: '复旦大学附属肿瘤医院', score: 98, rate: '4.5人/月', siv: '12d', team: '12人' },
                                    { key: '2', name: '李主任', institution: '上海交通大学附属胸科医院', score: 95, rate: '3.8人/月', siv: '15d', team: '8人' },
                                    { key: '3', name: '王教授', institution: '中山大学肿瘤防治中心', score: 92, rate: '3.5人/月', siv: '18d', team: '15人' }
                                ]}
                                columns={[
                                    { title: '顶级 PI', dataIndex: 'name', key: 'name', render: (t) => <Space><Avatar size="small" icon={<UserOutlined />} /> <Text strong>{t}</Text></Space> },
                                    { title: '匹配评分', dataIndex: 'score', key: 'score', render: (s) => <Progress size="small" percent={s} strokeColor="#52c41a" /> },
                                    { title: '入组速率', dataIndex: 'rate', key: 'rate' },
                                    { title: '团队规模', dataIndex: 'team', key: 'team' },
                                    { title: '操作', key: 'action', render: (_, record) => <Button type="link" size="small" onClick={() => { setSelectedPI(record); setIsDrawerVisible(true); }}>查看</Button> }
                                ]}
                            />
                            <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <ExperimentOutlined style={{ fontSize: 48 }} />
                                </div>
                                <div className="flex items-center space-x-2 mb-3 text-indigo-700">
                                    <BulbOutlined />
                                    <Text strong className="text-indigo-700">AI 本体决策建议</Text>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            若您的项目 <Text strong>极其关注入组加速 (FPI/LPI)</Text>：建议首选 <Text strong className="text-blue-600">王教授 (中山肿瘤)</Text>。其历史入组斜率最陡，且当前带组负荷较低。
                                        </Text>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            若您的项目 <Text strong>追求极高的数据质量与学术背书</Text>：建议首选 <Text strong className="text-indigo-600">陈教授 (复旦肿瘤)</Text>。其 SCI 影响力及 GCP 合规节点分值全库领先。
                                        </Text>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                                        <Text className="text-sm text-gray-700">
                                            若您的项目 <Text strong>属于复杂疑难或罕见靶点</Text>：建议首选 <Text strong className="text-green-600">李主任 (上海胸科)</Text>。本体库显示其对于 ALK/ROS1 等细分靶点的既往研究深度最优。
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={9}>
                            <Card size="small" title="Top 3 PI 维度匹配对标 (本体模型评价)" className="h-full shadow-sm">
                                <ReactECharts option={{
                                    legend: { data: ['陈教授', '李主任', '王教授'], bottom: 0, textStyle: { fontSize: 10 } },
                                    radar: {
                                        indicator: [
                                            { name: 'SCI 影响力', max: 100 },
                                            { name: 'GCP 合规性', max: 100 },
                                            { name: '历史表现', max: 100 },
                                            { name: '团队资源', max: 100 },
                                            { name: '响应速度', max: 100 }
                                        ],
                                        radius: '50%',
                                        center: ['50%', '45%']
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [95, 100, 92, 85, 90], name: '陈教授', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [88, 95, 85, 92, 95], name: '李主任', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } },
                                            { value: [92, 88, 95, 90, 80], name: '王教授', areaStyle: { color: 'rgba(250, 140, 22, 0.1)' } }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                            </Card>
                        </Col>
                    </Row>

                    <Card size="small" title="各年度肺癌三期试验入组趋势分析 (Top 3 对等对比)">
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis' },
                            legend: { data: ['陈教授', '李主任', '王教授'], bottom: 0 },
                            xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'] },
                            yAxis: { type: 'value', name: '入组数' },
                            series: [
                                { name: '陈教授', type: 'line', smooth: true, data: [12, 18, 15, 20, 25, 28], itemStyle: { color: '#1677ff' } },
                                { name: '李主任', type: 'line', smooth: true, data: [8, 12, 11, 16, 22, 24], itemStyle: { color: '#52c41a' } },
                                { name: '王教授', type: 'line', smooth: true, data: [15, 14, 18, 19, 20, 26], itemStyle: { color: '#fa8c16' } }
                            ]
                        }} style={{ height: 260 }} />
                    </Card>
                </div>
            )
        },
        {
            id: 'similar-case',
            query: '阿可替尼三期非小细胞肺癌研究 (ALEX-3)',
            reportTitle: 'ALEX-3 相似项目特征比对与中心重用建议报告',
            planningSteps: [
                { id: '1', title: '目标项目特征降维', description: '提取 ALEX-3 核心本体：[适应症:NSCLC] [靶点:EGFR/ALK] [三期试验] [二线治疗]', status: 'waiting' },
                { id: '2', title: '基于向量空间检索', description: '应用 [语义指纹算法] 在历史 500+ 肺癌项目中计算相似度权重', status: 'waiting' },
                { id: '3', title: '关联本体溯源', description: '检索 [项目-中心-表现] 知识图谱，提取 3 项高相似项目的执行基准', status: 'waiting' },
                { id: '4', title: '共性风险因子分析', description: '挖掘相似项目中常见的筛选失败、脱落率等 [风险本体] 节点', status: 'waiting' },
                { id: '5', title: '生成报告', description: '汇总项目相似度表现及中心重用建议，输出临床规划决策报告', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    {/* Module 0: Similar Case Library Alignment (Specific Projects) */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <BookOutlined className="text-blue-600" />
                            <Text strong>相似项目库深度对标 (3项核心参考)</Text>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                {
                                    code: 'ALX-201',
                                    name: 'ALK+ 晚期肺癌一线研究',
                                    pi: '李教授 (华西)',
                                    status: '已结项',
                                    centers: 18,
                                    duration: '14.2个月',
                                    outcome: '成功达标',
                                    color: 'blue'
                                },
                                {
                                    code: 'LUNG-7',
                                    name: '三代 TKI 联合抗血管生成',
                                    pi: '陈教授 (复旦)',
                                    status: '入组完成',
                                    centers: 12,
                                    duration: '12.5个月',
                                    showRisk: true,
                                    outcome: '样本量充足',
                                    color: 'indigo'
                                },
                                {
                                    code: 'EGFR-PRO',
                                    name: '双靶点序贯治疗探索',
                                    pi: '王博士 (胸科)',
                                    status: '进行中',
                                    centers: 15,
                                    duration: '预计18个月',
                                    outcome: '招募中',
                                    color: 'cyan'
                                }
                            ].map((proj, i) => (
                                <Card key={i} size="small" className={`border-l-4 border-l-${proj.color}-500 shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <Text strong className="text-blue-600 text-xs">{proj.code}</Text>
                                        <Tag color={proj.status === '已结项' ? 'success' : 'processing'}>{proj.status}</Tag>
                                    </div>
                                    <div className="text-[11px] font-bold mb-2 line-clamp-1">{proj.name}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">PI</Text>
                                            <Text>{proj.pi}</Text>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">覆盖中心</Text>
                                            <Text>{proj.centers} 家</Text>
                                        </div>
                                        <div className="flex justify-between text-[10px]">
                                            <Text type="secondary">执行周期</Text>
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
                    <Card size="small" title="历史项目执行耗时分布 (SIV + 招募)" className="shadow-sm">
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                            legend: { data: ['SIV 准备耗时', '入组完成耗时'], bottom: 0 },
                            grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                            xAxis: { type: 'value', name: '月/月' },
                            yAxis: { type: 'category', data: ['PRO-NSCLC', 'ALX-201', '行业基准线'] },
                            series: [
                                { name: 'SIV 准备耗时', type: 'bar', stack: 'total', data: [3.2, 2.8, 4.5], itemStyle: { color: '#85a5ff' } },
                                { name: '入组完成耗时', type: 'bar', stack: 'total', data: [12.5, 14.2, 18.0], itemStyle: { color: '#1677ff' } }
                            ]
                        }} style={{ height: 240 }} />
                        <div className="text-[11px] text-gray-400 mt-2 text-center">
                            * 数据提示：ALX-201 在华东区中心启动平均比行业快 1.7 个月，建议沿用其启动流程。
                        </div>
                    </Card>

                    <Row gutter={16}>
                        {/* Module 2: Key Performers Table */}
                        <Col span={14}>
                            <Card size="small" title="同类项核心中心与 PI 战绩 (Who & Where)" className="h-full shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', hospital: '华西医院', pi: '李教授', rate: '5.2/月', quality: 98, note: 'ALX-201 最高贡献量' },
                                        { key: '2', hospital: '复旦肿瘤', pi: '陈教授', rate: '4.8/月', quality: 99, note: 'GCP 无瑕疵中心' },
                                        { key: '3', hospital: '中山肿瘤', pi: '林主任', rate: '4.2/月', quality: 95, note: 'ALK 复杂靶点经验丰' },
                                        { key: '4', hospital: '协和医院', pi: '张教授', rate: '3.8/月', quality: 96, note: 'SIV 速度极快' },
                                        { key: '5', hospital: '胸科医院', pi: '王博士', rate: '3.5/月', quality: 92, note: '适合做二线/后线' }
                                    ]}
                                    columns={[
                                        { title: '核心中心', dataIndex: 'hospital', key: 'hospital', render: (t) => <Text strong>{t}</Text> },
                                        { title: 'PI', dataIndex: 'pi', key: 'pi' },
                                        { title: '入组率', dataIndex: 'rate', key: 'rate', render: (r) => <Tag color="blue">{r}</Tag> },
                                        { title: '质量', dataIndex: 'quality', key: 'quality', render: (q) => <Badge status={q > 95 ? 'success' : 'processing'} text={q} /> }
                                    ]}
                                />
                                <div className="mt-3 text-[10px] text-gray-400 italic">
                                    上述 PI 在 ALK/ROS1 适应症上的历史病例转化率均高于 35%
                                </div>
                            </Card>
                        </Col>

                        {/* Module 3: Failure Reason Analysis */}
                        <Col span={10}>
                            <Card size="small" title="相似项目筛选失败因果分析 (Why Failure)" className="h-full shadow-sm">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'item' },
                                    legend: { bottom: 0, textStyle: { fontSize: 10 } },
                                    series: [{
                                        type: 'pie',
                                        radius: ['40%', '60%'],
                                        center: ['50%', '45%'],
                                        data: [
                                            { value: 45, name: '靶点变异频率不符' },
                                            { value: 25, name: '脑转移排除限制' },
                                            { value: 15, name: '前线治疗史不合' },
                                            { value: 15, name: '其他医学评估' }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                                <div className="mt-2 bg-red-50 p-2 rounded text-[11px] text-red-700">
                                    <Paragraph className="mb-0">
                                        <Text strong className="text-red-700">风险预警：</Text>
                                        ALX-201 在入组由于"伴随诊断不一致"导致了 12% 的脱落，建议本项目强化中心实验室质控。
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Module 4: Execution Strategy */}
                    <Card size="small" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-start space-x-4 p-2">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <RobotOutlined style={{ fontSize: 24 }} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-blue-800 mb-1">AI 针对 ALEX-3 的执行策略建议</div>
                                <div className="space-y-2">
                                    <Text className="text-xs text-blue-700 block">
                                        • <Text strong>中心布点</Text>：建议复刻 ALX-201 的核心 8 家华东及华南中心，这些中心在同类靶点的病例池饱和度极高。
                                    </Text>
                                    <Text className="text-xs text-blue-700 block">
                                        • <Text strong>PI 选择</Text>：优先激活华西李教授及中山林主任团队，理由是其团队专属 CRC 具备极强的 ALK 患者引流与全流程管理经验。
                                    </Text>
                                    <Text className="text-xs text-blue-700 block">
                                        • <Text strong>风控预案</Text>：针对 12% 的历史筛选失败率，建议在纳排准则中对“脑转移状态”进行前置语义判定优化，预计可提升 15% 的入组确定性。
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
            query: '华东地区病床数>500且GCP无违规的中心',
            reportTitle: '多维度中心准入筛选报告 (华东地区)',
            planningSteps: [
                { id: '1', title: '谓词逻辑转换', description: '转换：“华东” -> [RegionCode:31,32..]；“病床” -> [HospitalProperty:BedCount > 500]', status: 'waiting' },
                { id: '2', title: '资质合规本体过滤', description: '查询 [监管合规本体] 节点，剔除“黑名单”或“受限中”的机构', status: 'waiting' },
                { id: '3', title: '图引擎聚合结果', description: '执行图查询，获取满足所有约束节点的实例集合', status: 'waiting' },
                { id: '4', title: '生成报告', description: '汇总多维度筛选结果，生成符合条件的中心准入白名单报告', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title="合格中心总数" value={12} suffix="家" valueStyle={{ color: '#1677ff' }} /></Card></Col>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title="筛选效率提升" value={92} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                        <Col span={8}><Card className="text-center shadow-sm" size="small"><Statistic title="整体风险评级" value="低风险" valueStyle={{ color: '#52c41a' }} /></Card></Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={10}>
                            <Card size="small" title="合规资质与人员状态对标" className="h-full">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'item' },
                                    legend: { bottom: 0, textStyle: { fontSize: 10 } },
                                    series: [{
                                        type: 'pie',
                                        radius: ['45%', '70%'],
                                        center: ['50%', '45%'],
                                        avoidLabelOverlap: true,
                                        data: [
                                            { value: 8, name: 'AAA 级 (运行卓越)' },
                                            { value: 3, name: 'AA 级 (稳定)' },
                                            { value: 1, name: 'A 级 (正常)' }
                                        ]
                                    }]
                                }} style={{ height: 260 }} />
                            </Card>
                        </Col>
                        <Col span={14}>
                            <Card size="small" title="华东区各市分布明细 (合格中心)" className="h-full">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                                    xAxis: { type: 'value' },
                                    yAxis: { type: 'category', data: ['常州', '苏州', '杭州', '南京', '上海'] },
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

                    <Card size="small" title="符合条件的中心详细名单 (华东白名单)" className="shadow-sm">
                        <Table
                            size="small"
                            pagination={false}
                            dataSource={[
                                { key: '1', name: '上海瑞金医院', level: '三甲', beds: 1850, gcp: '优', score: 98, region: '上海' },
                                { key: '2', name: '南京鼓楼医院', level: '三甲', beds: 2200, gcp: '优', score: 95, region: '南京' },
                                { key: '3', name: '浙医二院', level: '三甲', beds: 2100, gcp: '良', score: 92, region: '杭州' },
                                { key: '4', name: '苏州大学附属第一医院', level: '三甲', beds: 1600, gcp: '优', score: 94, region: '苏州' },
                                { key: '5', name: '上海华山医院', level: '三甲', beds: 1500, gcp: '优', score: 96, region: '上海' },
                                { key: '6', name: '江苏省人民医院', level: '三甲', beds: 2500, gcp: '良', score: 91, region: '南京' }
                            ]}
                            columns={[
                                { title: '中心名称', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                                { title: '级别', dataIndex: 'level', key: 'level' },
                                { title: '病床数', dataIndex: 'beds', key: 'beds', sorter: (a: any, b: any) => a.beds - b.beds },
                                { title: 'GCP 记录', dataIndex: 'gcp', key: 'gcp', render: (t) => <Tag color={t === '优' ? 'green' : 'blue'}>{t}</Tag> },
                                { title: '地区', dataIndex: 'region', key: 'region' },
                                { title: '评分', dataIndex: 'score', key: 'score', render: (s) => <Text className="text-blue-600 font-bold">{s}</Text> }
                            ]}
                        />
                    </Card>

                    <Card size="small" className="bg-blue-50/30 border-dashed border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-800 text-xs">
                            <BulbOutlined />
                            <Text className="text-blue-800">
                                <Text strong>AI 建议：</Text>
                                针对华东区大容量中心筛选，上海与南京地区的中心在 [病床规模/GCP 连续性] 两个维度的本体匹配度最高，建议优先启动瑞金与鼓楼医院。
                            </Text>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'aggregation',
            query: '各省肺癌试验中心的数量分布',
            reportTitle: '全国肺癌临床试验中心地理分布热力图谱系统简报',
            planningSteps: [
                { id: '1', title: '地理本体聚合', description: '应用 [行政区划本体] 树形结构，将 [研究中心] 实例按省级坐标聚合', status: 'waiting' },
                { id: '2', title: '现状快照提取', description: '统计状态为“Active”的肺癌相关中心节点数量', status: 'waiting' },
                { id: '3', title: '结果可视化降维', description: '将高维图数据转换为二维地理分布坐标、', status: 'waiting' },
                { id: '4', title: '生成报告', description: '完成地理空间聚合，生成全国中心分布热力分析简报', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    {/* Module 1: China Province Panorama chart */}
                    <Card size="small" title="全国肺癌试验中心各省分布全景 (Top 15)" className="shadow-sm">
                        <ReactECharts option={{
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                            xAxis: { type: 'category', data: ['上海', '江苏', '广东', '北京', '浙江', '四川', '山东', '湖北', '湖南', '河南', '陕西', '安徽', '重庆', '福建', '辽宁'], axisLabel: { interval: 0, fontSize: 10 } },
                            yAxis: { type: 'value', name: '中心数' },
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
                            <Card size="small" title="各省临床资源详情快照" className="h-full shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', province: '上海市', sites: 52, active: 145, t3a: '96%', siv: '3.2m' },
                                        { key: '2', province: '江苏省', sites: 48, active: 112, t3a: '88%', siv: '3.5m' },
                                        { key: '3', province: '广东省', sites: 45, active: 98, t3a: '92%', siv: '3.8m' },
                                        { key: '4', province: '北京市', sites: 42, active: 156, t3a: '98%', siv: '4.2m' },
                                        { key: '5', province: '浙江省', sites: 38, active: 85, t3a: '85%', siv: '3.6m' }
                                    ]}
                                    columns={[
                                        { title: '省份', dataIndex: 'province', key: 'province', render: (t) => <Text strong>{t}</Text> },
                                        { title: '中心数', dataIndex: 'sites', key: 'sites' },
                                        { title: '在研项目', dataIndex: 'active', key: 'active' },
                                        { title: '三甲占比', dataIndex: 't3a', key: 't3a' },
                                        { title: '平均SIV', dataIndex: 'siv', key: 'siv', render: (s) => <Tag color="blue">{s}</Tag> }
                                    ]}
                                />
                            </Card>
                        </Col>

                        {/* Module 3: Core Province Comparison Radar */}
                        <Col span={11}>
                            <Card size="small" title="核心省份综合竞争力对标" className="h-full shadow-sm">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    legend: { data: ['上海', '江苏', '北京'], bottom: 0, textStyle: { fontSize: 10 } },
                                    radar: {
                                        indicator: [
                                            { name: '中心规模', max: 100 },
                                            { name: '科研产出', max: 100 },
                                            { name: '启动速度', max: 100 },
                                            { name: '病患流量', max: 100 },
                                            { name: '政策支持', max: 100 }
                                        ],
                                        radius: '55%',
                                        center: ['50%', '45%']
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [100, 95, 90, 85, 80], name: '上海', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [92, 85, 88, 95, 85], name: '江苏', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } },
                                            { value: [95, 100, 75, 80, 90], name: '北京', areaStyle: { color: 'rgba(250, 173, 20, 0.1)' } }
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
                                <Text strong>AI 跨省布局策略：</Text>
                                针对肺癌试验，<Text strong>上海与北京</Text>具备最高质量的领军中心，建议作为项目首发；<Text strong>江苏与广东</Text>具备最成熟的执行效率（SIV 周期短），适合作为入组加速区。
                            </Text>
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'comparative-analysis',
            query: 'T细胞血液病中心对比',
            reportTitle: 'T 细胞血液病临床试验中心竞品比对报告',
            planningSteps: [
                { id: '1', title: '对比意图解析', description: '识别对比对象：[华西医院] vs [协和医院]；领域：[血液病:T细胞淋巴瘤]', status: 'waiting' },
                { id: '2', title: '核心性能底图调取', description: '检索两家中心近3年细胞治疗类（CAR-T/TCR-T）试验的历史入组率及 SIV 耗时', status: 'waiting' },
                { id: '3', title: '配套设施本体对标', description: '对比 [洁净实验室等级] [血细胞分离机数量] 及 [OEC 认证状态] 本体节点', status: 'waiting' },
                { id: '4', title: '生存分析模拟', description: '基于过往项目质量数据，评估两家中心在复杂血液病试验中的风险控制能力', status: 'waiting' },
                { id: '5', title: '生成对比结论', description: '综合效率、质量、设施三维度生成最终选址建议报告', status: 'waiting' }
            ],
            renderResult: () => (
                <div className="space-y-6">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card size="small" title="核心指标对标" className="shadow-sm">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={[
                                        { key: '1', metric: '平均入组速率', huaxi: '2.8人/月', xiehe: '3.1人/月' },
                                        { key: '2', metric: 'SIV 平均耗时', huaxi: '18天', xiehe: '14天' },
                                        { key: '3', metric: 'CRC 团队稳定性', huaxi: '高', xiehe: '极高' },
                                        { key: '4', metric: '细胞治疗设施点', huaxi: '12个', xiehe: '15个' }
                                    ]}
                                    columns={[
                                        { title: '对比项', dataIndex: 'metric', key: 'metric' },
                                        { title: '华西医院', dataIndex: 'huaxi', key: 'huaxi', render: (text) => <Text strong className="text-blue-600">{text}</Text> },
                                        { title: '协和医院', dataIndex: 'xiehe', key: 'xiehe', render: (text) => <Text strong className="text-green-600">{text}</Text> }
                                    ]}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" title="研发能力多维对标" className="h-full shadow-sm">
                                <ReactECharts option={{
                                    radar: {
                                        indicator: [
                                            { name: '响应速度', max: 100 },
                                            { name: '设施完善度', max: 100 },
                                            { name: '受试者基数', max: 100 },
                                            { name: 'PI 影响力', max: 100 },
                                            { name: '合规表现', max: 100 }
                                        ]
                                    },
                                    series: [{
                                        type: 'radar',
                                        data: [
                                            { value: [85, 80, 95, 90, 88], name: '华西医院', areaStyle: { color: 'rgba(22, 119, 255, 0.1)' } },
                                            { value: [95, 98, 90, 95, 96], name: '协和医院', areaStyle: { color: 'rgba(82, 196, 26, 0.1)' } }
                                        ]
                                    }]
                                }} style={{ height: 250 }} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={14}>
                            <Card size="small" title="近半年 T 细胞类试验入组效率对比 (例/月)">
                                <ReactECharts option={{
                                    tooltip: { trigger: 'axis' },
                                    legend: { data: ['华西医院', '协和医院'], top: 0 },
                                    xAxis: { type: 'value' },
                                    yAxis: { type: 'category', data: ['CAR-T', 'TCR-T', 'TIL', '其它细胞'] },
                                    series: [
                                        { name: '华西医院', type: 'bar', data: [3.2, 2.5, 1.8, 1.2], itemStyle: { color: '#1677ff' } },
                                        { name: '协和医院', type: 'bar', data: [3.8, 2.8, 2.2, 1.5], itemStyle: { color: '#52c41a' } }
                                    ]
                                }} style={{ height: 220 }} />
                            </Card>
                        </Col>
                        <Col span={10}>
                            <div className="h-full bg-green-50/50 border border-green-100 rounded-xl p-6 flex flex-col justify-center">
                                <div className="flex items-center space-x-2 text-green-700 mb-4">
                                    <CheckCircleFilled className="text-xl" />
                                    <Text strong className="text-lg">本体决策引擎建议</Text>
                                </div>
                                <Paragraph className="text-gray-600">
                                    综合评估显示，<Text strong className="text-green-600">协和医院</Text>在 T 细胞血液病领域拥有更优的 [SIV 启动效率] 和更全的 [GMP 洁净实验室配套]，建议作为本项目的首选中心。
                                </Paragraph>
                                <Button type="primary" ghost block size="large">申请一键推样</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
    ]

    const handleSend = (text: string = inputValue) => {
        if (!text) return
        const newMsgs: Message[] = [...messages, { role: 'user' as const, content: text }]
        setMessages(newMsgs)
        setInputValue('')

        let matchedScenario = scenarios.find(s => text.includes(s.query) || (s.id === 'aggregation' && text.includes('分布')) || (s.id === 'multi-dim' && text.includes('病床')) || (s.id === 'similar-case' && (text.includes('相似') || text.includes('ALEX-3'))))
        if (!matchedScenario) matchedScenario = scenarios[0]

        // Reset and trigger thinking phase first
        setCurrentScenario({
            ...matchedScenario,
            planningSteps: matchedScenario.planningSteps.map(s => ({ ...s, status: 'waiting' }))
        })
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
                    if (currentScenario) {
                        const startSteps = [...currentScenario.planningSteps]
                        startSteps[0].status = 'running'
                        setCurrentScenario({ ...currentScenario, planningSteps: startSteps })
                        setStepIndex(1)
                    }
                    setIsProcessing(true)
                }, 800)
                return () => clearTimeout(timer)
            }
        }
    }, [isThinking, displayedThinkingText])

    useEffect(() => {
        if (isProcessing && currentScenario && stepIndex < currentScenario.planningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500 // 0.5-2 seconds
            const timer = setTimeout(() => {
                const nextSteps = [...currentScenario.planningSteps]
                if (stepIndex > 0) {
                    nextSteps[stepIndex - 1].status = 'done'
                    nextSteps[stepIndex - 1].duration = `+${(randomDelay / 1000).toFixed(1)}s`
                }
                nextSteps[stepIndex].status = 'running'

                setCurrentScenario({ ...currentScenario, planningSteps: nextSteps })
                setStepIndex(prev => prev + 1)
            }, randomDelay)
            return () => clearTimeout(timer)
        } else if (isProcessing && currentScenario && stepIndex === currentScenario.planningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500 // 0.5-2 seconds
            const timer = setTimeout(() => {
                const finalSteps = [...currentScenario.planningSteps]
                finalSteps[finalSteps.length - 1].status = 'done'
                finalSteps[finalSteps.length - 1].duration = `+${(randomDelay / 1000).toFixed(1)}s`
                const completedScenario = { ...currentScenario, planningSteps: finalSteps }
                setCurrentScenario(completedScenario)
                setIsProcessing(false)
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '查询规划已通过本体引擎执行完毕。已根据检索结果为您生成专属报告：',
                    reportId: completedScenario.id,
                    reportTitle: completedScenario.reportTitle
                }])
            }, randomDelay)
            return () => clearTimeout(timer)
        }
    }, [isProcessing, stepIndex, currentScenario])

    return (
        <div className="h-full overflow-hidden p-2">
            <Row gutter={20} className="h-full">
                {/* Left Side: CUI */}
                <Col span={7} className="h-full">
                    <Card bordered={false} className="flex flex-col glass-card h-full" title={
                        <div className="flex items-center space-x-2">
                            <RobotOutlined className="text-blue-500" />
                            <span>AI 对话交互</span>
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
                                                                setCurrentScenario({
                                                                    ...targetScenario,
                                                                    planningSteps: targetScenario.planningSteps.map(s => ({ ...s, status: 'done' as const }))
                                                                })
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
                                    placeholder="输入语义查询指令..."
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
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('擅长肺癌三期临床试验的研究者')}>肺癌 PI 检索</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('查找阿可替尼三期非小细胞肺癌研究的相似项目')}>相似项目检索</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('T细胞血液病中心对比')}>对比分析</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('华东地区病床数>500且GCP无违规的中心')}>多维度筛选</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('各省肺癌试验中心的数量分布')}>全国地理分布</Tag>
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
                                            <span>{(!isProcessing && !isThinking && currentScenario && stepIndex >= currentScenario.planningSteps.length) ? currentScenario.reportTitle : '本体推理链'}</span>
                                        </Space>
                                        {currentScenario && !isProcessing && stepIndex >= currentScenario.planningSteps.length && <Badge status="success" text="报告已生成" />}
                                    </Space>
                                </div>
                                {currentScenario && !isProcessing && stepIndex >= currentScenario.planningSteps.length && (
                                    <Space>
                                        <Button size="small" icon={<ShareAltOutlined />}>分享</Button>
                                        <Button size="small" type="primary">导出 PDF</Button>
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
                                <Paragraph>请从左侧输入指令，启动本体语义分析引擎</Paragraph>
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
                                            <Text strong className="text-purple-700">AI 正在深度思考</Text>
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
                                            <Title level={4} style={{ margin: 0 }}>本体推理链：{currentScenario.query}</Title>
                                            <Tag color="blue" icon={<LoadingOutlined />}>
                                                推理执行中
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
                title="研究者深度详情与本体画像"
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
                            <Space><AimOutlined /> <span>实时本体匹配度：{selectedPI.score}%</span></Space>
                            <span>数据最后同步：1小时前</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Profile Header */}
                            <section>
                                <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge status="processing" text="在研项目中" />
                                    </div>
                                    <Avatar size={90} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPI.name}`} className="border-4 border-blue-50 shadow-lg" />
                                    <div className="flex-1">
                                        <Title level={3} style={{ margin: 0 }}>{selectedPI.name}</Title>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Tag color="blue">主任医师</Tag>
                                            <Tag color="cyan">博士生导师</Tag>
                                            <Tag color="purple">学科带头人</Tag>
                                            <Tag color="orange">学会常委</Tag>
                                        </div>
                                        <Text type="secondary" className="block mt-3 text-sm">{selectedPI.hospital} · 肿瘤内科</Text>
                                    </div>
                                </div>

                                {/* Core Metrics Grid */}
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {[
                                        { label: '从业年限', value: '22年', icon: <BookOutlined /> },
                                        { label: '最高影响因子', value: '52.1', icon: <BarChartOutlined /> },
                                        { label: '带组经验', value: '15年+', icon: <TeamOutlined /> }
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
                                    <Text strong className="text-base">任职详情</Text>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <Text className="text-sm">临床试验机构办公室 (GCP) 主任</Text>
                                        <Tag>行政职务</Tag>
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <Text className="text-sm">中国抗癌协会肺癌专业委员会委员</Text>
                                        <Tag>学术兼职</Tag>
                                    </div>
                                </div>
                            </section>

                            {/* Team & Resources */}
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <TeamOutlined className="text-blue-500" />
                                    <Text strong className="text-base">研究团队与资源</Text>
                                </div>
                                <Card size="small" className="bg-white border-blue-100">
                                    <Paragraph className="text-gray-600 text-sm mb-0">
                                        {selectedPI.team}。团队拥有独立办公区约 200平米，配备 <Text strong className="text-blue-600">6 名专属 CRC</Text>，具备极强的 FPI 攻坚能力。
                                        过往项目平均入组速度处于全国前 3%，曾多次协助药监局进行 GCP 现场核查培训。
                                    </Paragraph>
                                </Card>
                            </section>

                            {/* Related Research */}
                            <section>
                                <div className="flex items-center space-x-2 mb-4">
                                    <DeploymentUnitOutlined className="text-indigo-500" />
                                    <Text strong className="text-base">本体关联研究 (学术影响力画像)</Text>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: '三代 TKI 在 NSCLC 三期临床中的安全性评价', journal: 'Lancet Oncology', correlation: 98, highlight: '定义了 EGFR 突变人群的治疗基准' },
                                        { title: '基于生物标志物的肺癌晚期联合用药探索', journal: 'Journal of Clinical Oncology', correlation: 92, highlight: '提出了多靶点联合治疗新路径' },
                                        { title: '中国人群肺癌五年生存率本体画像分析', journal: 'NEJM', correlation: 88, highlight: '填补了亚洲人群真实世界研究空白' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-bold text-gray-800 flex-1 pr-4">{item.title}</div>
                                                <Badge count={`${item.correlation}% 关联`} style={{ backgroundColor: '#e6f7ff', color: '#1677ff', boxShadow: 'none' }} />
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
                                选定该 PI 并发起中心调研 (Site Survey)
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

export default IntelligentQuery
