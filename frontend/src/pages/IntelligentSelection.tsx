import { useState, useEffect } from 'react'
import {
    Card,
    Input,
    Button,
    List,
    Badge,
    Tag,
    Typography,
    Space,
    Divider,
    Row,
    Col,
    Avatar,
    Table,
    Progress,
    Tooltip,
    Empty,
    Drawer,
    Descriptions,
    Segmented
} from 'antd'
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    InfoCircleOutlined,
    CheckCircleFilled,
    WarningOutlined,
    SecurityScanOutlined,
    LineChartOutlined,
    DeploymentUnitOutlined,
    HistoryOutlined,
    FileSearchOutlined,
    ExperimentOutlined
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useScheme } from '../context/SchemeContext'
import StepNavigation from '../components/StepNavigation'
import SchemeSelector from '../components/SchemeSelector'
import ComplianceCheckCenter from '../components/ComplianceCheck'
import SimulationCenter from '../components/Simulation'
import CenterComparison from './CenterComparison'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const IntelligentSelection: React.FC = () => {
    const { currentStep, setCurrentStep, currentScheme, allInstitutions } = useScheme()
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '您好！我是您的AI选址助手。请告诉我想寻找什么样的临床试验中心。' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [selectedCenters, setSelectedCenters] = useState<string[]>([])
    const [portraitVisible, setPortraitVisible] = useState(false)
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null)

    // Mock Requirements Data
    const mockRequirements = [
        {
            id: 'req-1',
            title: 'CTR20240001: NSCLC III 期 PD-1 临床试验',
            indication: '非小细胞肺癌 (NSCLC)',
            phase: 'III 期',
            drugType: 'PD-1 单抗',
            targetEnrollment: 200,
            duration: '24个月',
            mainCriteria: '经病理学确认的、不能手术切除的 III 期非小细胞肺癌...',
            status: '已发布'
        },
        {
            id: 'req-2',
            title: 'CTR20240002: 脑膜瘤 I 期研究',
            indication: '脑膜瘤',
            phase: 'I 期',
            drugType: '小分子抑制剂',
            targetEnrollment: 30,
            duration: '18个月',
            mainCriteria: '经组织学或细胞学证实的局部晚期或转移性实体瘤...',
            status: '草稿'
        },
        {
            id: 'req-3',
            title: 'CTR20230508: 乳腺癌 II 期试验',
            indication: 'HER2+ 乳腺癌',
            phase: 'II 期',
            drugType: 'ADC 药物',
            targetEnrollment: 120,
            duration: '12个月',
            mainCriteria: '既往接受过曲妥珠单抗和紫杉类药物治疗的、HER2 阳性...',
            status: '已发布'
        }
    ]

    const [selectedRequirementId, setSelectedRequirementId] = useState<string>(mockRequirements[0].id)
    const selectedRequirement = mockRequirements.find(r => r.id === selectedRequirementId)

    const mockRecommendations = [
        {
            id: '1',
            name: '复旦大学附属肿瘤医院',
            region: '华东',
            pi: '陈XX',
            rate: 4.5,
            rateTrend: 'up',
            reliability: '高',
            risk: '低',
            tags: ['三甲', '合作历史优', 'NSCLC经验丰富'],
            score: 96,
            regTags: ['HGR优化报备', 'SMODE审计'],
            ethicsApproval: '15天',
            contractApproval: '12天',
            sivPreparation: '6天',
            piLoad: '3.2项',
            crcRatio: '1:1.5',
            contractHistory: '22天'
        },
        {
            id: '2',
            name: '中山大学肿瘤防治中心',
            region: '华南',
            pi: '周XX',
            rate: 3.8,
            rateTrend: 'stable',
            reliability: '高',
            risk: '低',
            tags: ['三甲', '启动快', '华南龙头'],
            score: 92,
            regTags: ['GCP认证', '数据安全'],
            ethicsApproval: '12天',
            contractApproval: '10天',
            sivPreparation: '5天',
            piLoad: '2.8项',
            crcRatio: '1:1.2',
            contractHistory: '18天'
        },
        {
            id: '3',
            name: '北京肿瘤医院',
            region: '华北',
            pi: '张XX',
            rate: 3.5,
            rateTrend: 'down',
            reliability: '中',
            risk: '中',
            tags: ['三甲', '负荷较高', '知名中心'],
            score: 88,
            regTags: ['GCP认证'],
            ethicsApproval: '20天',
            contractApproval: '25天',
            sivPreparation: '8天',
            piLoad: '4.5项',
            crcRatio: '1:2',
            contractHistory: '30天'
        },
        {
            id: '4',
            name: '浙江省肿瘤医院',
            region: '华东',
            pi: '王XX',
            rate: 3.8,
            rateTrend: 'stable',
            reliability: '高',
            risk: '中',
            tags: ['三甲', '入组稳定'],
            score: 90,
            regTags: ['GCP认证'],
            ethicsApproval: '20天',
            contractApproval: '18天',
            sivPreparation: '7天',
            piLoad: '3.5项',
            crcRatio: '1:1.3',
            contractHistory: '25天'
        }
    ]

    const handleSendMessage = () => {
        if (!inputValue) return
        const newMessages = [...messages, { role: 'user', content: inputValue }]
        setMessages(newMessages)
        setInputValue('')

        setTimeout(() => {
            setMessages([...newMessages, {
                role: 'assistant',
                content: `已识别需求：找华东地区做过PD-1试验、入组速率高于3人/月的三甲医院。正在检索...`
            }])
            setTimeout(() => {
                setShowResults(true)
                setCurrentStep('recommendation')
            }, 1000)
        }, 800)
    }

    const handleStepChange = (step: string) => {
        if (step === 'recommendation') setShowResults(true)
    }

    const showInstitutionPortrait = (id: string) => {
        setSelectedInstitutionId(id)
        setPortraitVisible(true)
    }

    const columns = [
        { title: '机构名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: '地区', dataIndex: 'region', key: 'region' },
        { title: 'PI', dataIndex: 'pi', key: 'pi' },
        {
            title: '预计月入组',
            dataIndex: 'rate',
            key: 'rate',
            render: (val: number) => <Badge status="processing" text={`${val} 人/月`} />
        },
        {
            title: '综合评分',
            dataIndex: 'score',
            key: 'score',
            render: (val: number) => (
                <Progress
                    percent={val}
                    size="small"
                    strokeColor={val > 90 ? '#52c41a' : '#1677ff'}
                    format={p => `${p}`}
                />
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" size="small" onClick={() => showInstitutionPortrait(record.id)}>画像</Button>
                    {record.risk === '中' && (
                        <Tooltip title="存在合规关注点">
                            <Tag icon={<SecurityScanOutlined />} color="warning">关注</Tag>
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ]

    const renderCUIPanel = () => (
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
                            <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <Text style={{ color: msg.role === 'user' ? 'white' : 'inherit' }}>{msg.content}</Text>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <TextArea
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="描述您的选址需求..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        onPressEnter={e => {
                            if (!e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        className="rounded-lg"
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} className="rounded-lg h-auto" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => setInputValue('找华东地区做过 PD-1 试验的三甲医院')}>PD-1 经验机构</Tag>
                    <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => setInputValue('北京地区 NSCLC 入组速率 Top 5')}>北京 Top 5</Tag>
                </div>
            </div>
        </Card>
    )

    const renderRequirementStep = () => (
        <Row gutter={20}>
            <Col span={10}>
                <Card title="临床试验需求列表" className="glass-card" bodyStyle={{ padding: 0 }}>
                    <div>
                        <List
                            dataSource={mockRequirements}
                            renderItem={item => (
                                <List.Item
                                    className={`cursor-pointer px-4 hover:bg-blue-50 transition-colors ${selectedRequirementId === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                                    onClick={() => setSelectedRequirementId(item.id)}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<ExperimentOutlined />} className={item.status === '已发布' ? 'bg-green-500' : 'bg-gray-400'} />}
                                        title={<Text strong className={selectedRequirementId === item.id ? 'text-blue-600' : ''}>{item.title}</Text>}
                                        description={
                                            <Space size={4}>
                                                <Tag>{item.indication}</Tag>
                                                <Tag color="blue">{item.phase}</Tag>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </Card>
            </Col>
            <Col span={14}>
                <Card
                    title="需求详情预览"
                    className="glass-card"
                    extra={<Button type="primary" onClick={() => setCurrentStep('recommendation')}>确认并开始中心推荐</Button>}
                >                    {selectedRequirement ? (
                    <div className="space-y-6">
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="需求名称">{selectedRequirement.title}</Descriptions.Item>
                            <Descriptions.Item label="适应症">{selectedRequirement.indication}</Descriptions.Item>
                            <Descriptions.Item label="试验分期">{selectedRequirement.phase}</Descriptions.Item>
                            <Descriptions.Item label="药物类型">{selectedRequirement.drugType}</Descriptions.Item>
                            <Descriptions.Item label="目标入组">{selectedRequirement.targetEnrollment} 例</Descriptions.Item>
                            <Descriptions.Item label="预计周期">{selectedRequirement.duration}</Descriptions.Item>
                        </Descriptions>
                        <div>
                            <Title level={5}>主要准入标准</Title>
                            <Paragraph type="secondary" style={{ padding: 12, background: '#fafafa', borderRadius: 8 }}>
                                {selectedRequirement.mainCriteria}
                            </Paragraph>
                        </div>
                    </div>
                ) : <Empty description="请选择一个需求进行预览" />}
                </Card>
            </Col>
        </Row>
    )

    const renderGUIDynamic = () => {
        if (currentStep === 'requirement') {
            return renderRequirementStep()
        }

        if (currentStep === 'recommendation') {
            return (
                <motion.div
                    key="recommendation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <Card bordered={false} title="AI 推荐中心列表" className="glass-card" extra={
                        <Space>
                            <Button icon={<FileSearchOutlined />}>导出分析报告</Button>
                            <Button
                                type="primary"
                                disabled={selectedCenters.length === 0}
                                onClick={() => setCurrentStep('comparison')}
                            >
                                开始中心对比 ({selectedCenters.length})
                            </Button>
                        </Space>
                    }>
                        <Row justify="space-between" align="middle" className="mb-4">
                            <Space>
                                <Tag color="blue" icon={<CheckCircleFilled />}>匹配度 &gt; 85%</Tag>
                                <Tag color="green" icon={<SecurityScanOutlined />}>风险管控中</Tag>
                                <Text type="secondary">共找到 {mockRecommendations.length} 个符合条件的中心</Text>
                            </Space>
                            <Button type="dashed" icon={<DeploymentUnitOutlined />}>手动添加机构</Button>
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={mockRecommendations}
                            rowKey="id"
                            rowSelection={{
                                selectedRowKeys: selectedCenters,
                                onChange: (keys) => setSelectedCenters(keys as string[])
                            }}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Card bordered={false} title="区域覆盖分析" className="glass-card">
                                <Row gutter={16} align="middle">
                                    <Col span={10}>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">85%</div>
                                            <div className="text-xs text-gray-400">华东区核心覆盖</div>
                                        </div>
                                    </Col>
                                    <Col span={14}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs"><span>华东 (4)</span><span>100%</span></div>
                                            <Progress percent={100} size="small" showInfo={false} />
                                            <div className="flex justify-between text-xs"><span>华北 (2)</span><span>75%</span></div>
                                            <Progress percent={75} size="small" showInfo={false} status="active" />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false} title="入组加速预测" className="glass-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Text type="secondary">预计相比历史提升</Text>
                                        <Title level={2} style={{ margin: 0, color: '#52c41a' }}>+22% <Text style={{ fontSize: 14, color: '#666' }}>效率</Text></Title>
                                    </div>
                                    <LineChartOutlined style={{ fontSize: 40, color: '#52c41a' }} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </motion.div>
            )
        }

        if (currentStep === 'comparison') {
            return <CenterComparison />
        }

        if (currentStep === 'compliance') {
            return <ComplianceCheckCenter />
        }

        if (currentStep === 'simulation') {
            return <SimulationCenter />
        }

        return null
    }

    const portraitData = allInstitutions.find(i => i.id === selectedInstitutionId)

    return (
        <div className="h-full overflow-hidden p-2">
            <Row gutter={20} className="h-full">
                {/* Left Side: CUI */}
                <Col span={7} className="h-full">
                    {renderCUIPanel()}
                </Col>

                {/* Right Side: Step Control + GUI Content */}
                <Col span={17} className="h-full flex flex-col space-y-4">
                    <Card className="glass-card py-2" bodyStyle={{ padding: '8px 24px' }}>
                        <div className="flex items-center justify-between">
                            <SchemeSelector />
                            <div className="flex items-center space-x-4">
                                <Badge status="processing" text="选址策略：肿瘤标准 v2" />
                                <Button type="text" icon={<HistoryOutlined />}>策略日志</Button>
                            </div>
                        </div>
                    </Card>

                    <StepNavigation onStepChange={handleStepChange} />

                    <div className="flex-1 overflow-y-auto relative scrollbar-thin pr-2">
                        <AnimatePresence mode="wait">
                            {renderGUIDynamic()}
                        </AnimatePresence>
                    </div>
                </Col>
            </Row>

            {/* Institution Portrait Drawer */}
            <Drawer
                title={portraitData?.name + " - 机构详情画像"}
                placement="right"
                width={700}
                onClose={() => setPortraitVisible(false)}
                open={portraitVisible}
                extra={
                    <Space>
                        <Button onClick={() => setPortraitVisible(false)}>取消</Button>
                        <Button type="primary" onClick={() => {
                            if (portraitData && !selectedCenters.includes(portraitData.id)) {
                                setSelectedCenters([...selectedCenters, portraitData.id])
                            }
                            setPortraitVisible(false)
                        }}>添加至对比流</Button>
                    </Space>
                }
            >
                {portraitData ? (
                    <div className="space-y-6">
                        <section>
                            <Title level={5}><Space><InfoCircleOutlined />基本情况</Space></Title>
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label="所属地区">{portraitData.region}</Descriptions.Item>
                                <Descriptions.Item label="主要 PI">{portraitData.pi}</Descriptions.Item>
                                <Descriptions.Item label="预计月入组">{portraitData.rate} 人/月</Descriptions.Item>
                                <Descriptions.Item label="信誉等级">{portraitData.reliability}</Descriptions.Item>
                            </Descriptions>
                        </section>

                        <section>
                            <Title level={5}>历史绩效 (近3年)</Title>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-blue-50">
                                        <div className="text-xl font-bold">122d</div>
                                        <div className="text-xs text-gray-400">平均启动周期</div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-green-50">
                                        <div className="text-xl font-bold">94%</div>
                                        <div className="text-xs text-gray-400">FPI 按时完成率</div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-orange-50">
                                        <div className="text-xl font-bold">0.8</div>
                                        <div className="text-xs text-gray-400">平均 Query 率</div>
                                    </Card>
                                </Col>
                            </Row>
                        </section>

                        <section>
                            <Title level={5}>监管/合规认证</Title>
                            <Space wrap>
                                {portraitData.regTags.map(tag => <Tag key={tag} color="cyan">{tag}</Tag>)}
                                <Tag color="blue">ISO 9001 认证</Tag>
                                <Tag color="purple">HGR 快速审批中心</Tag>
                            </Space>
                        </section>

                        <section>
                            <Title level={5}>设施与设备</Title>
                            <List
                                size="small"
                                dataSource={['专用临床试验药房 (GCP)', '超低温冰箱 (-80℃)', '应急电力系统', '独立的伦理审查办公室']}
                                renderItem={item => <List.Item><CheckCircleFilled className="text-green-500 mr-2" />{item}</List.Item>}
                            />
                        </section>
                    </div>
                ) : <Empty />}
            </Drawer>
        </div>
    )
}

export default IntelligentSelection
