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
import { useLanguage } from '../context/LanguageContext'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// --- Types ---
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const IntelligentSelection: React.FC = () => {
    const { t, language } = useLanguage()
    const { currentStep, setCurrentStep, currentScheme, allInstitutions } = useScheme()
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: t('aiSelectionAssistantGreeting') }
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
            title: language === 'zh' ? 'CTR20240001: NSCLC III 期 PD-1 临床试验' : 'CTR20240001: NSCLC Phase III PD-1 Trial',
            indication: language === 'zh' ? '非小细胞肺癌 (NSCLC)' : 'Non-Small Cell Lung Cancer (NSCLC)',
            phase: language === 'zh' ? 'III 期' : 'Phase III',
            drugType: language === 'zh' ? 'PD-1 单抗' : 'PD-1 Monoclonal Antibody',
            targetEnrollment: 200,
            duration: language === 'zh' ? '24个月' : '24 Months',
            mainCriteria: language === 'zh' ? '经病理学确认的、不能手术切除的 III 期非小细胞肺癌...' : 'Pathologically confirmed, unresectable Phase III NSCLC...',
            status: language === 'zh' ? '已发布' : 'Published'
        },
        {
            id: 'req-2',
            title: language === 'zh' ? 'CTR20240002: 脑膜瘤 I 期研究' : 'CTR20240002: Meningioma Phase I Study',
            indication: language === 'zh' ? '脑膜瘤' : 'Meningioma',
            phase: language === 'zh' ? 'I 期' : 'Phase I',
            drugType: language === 'zh' ? '小分子抑制剂' : 'Small Molecule Inhibitor',
            targetEnrollment: 30,
            duration: language === 'zh' ? '18个月' : '18 Months',
            mainCriteria: language === 'zh' ? '经组织学或细胞学证实的局部晚期或转移性实体瘤...' : 'Histologically or cytologically confirmed locally advanced or metastatic solid tumors...',
            status: language === 'zh' ? '草稿' : 'Draft'
        },
        {
            id: 'req-3',
            title: language === 'zh' ? 'CTR20230508: 乳腺癌 II 期试验' : 'CTR20230508: Breast Cancer Phase II Trial',
            indication: language === 'zh' ? 'HER2+ 乳腺癌' : 'HER2+ Breast Cancer',
            phase: language === 'zh' ? 'II 期' : 'Phase II',
            drugType: language === 'zh' ? 'ADC 药物' : 'ADC Drug',
            targetEnrollment: 120,
            duration: language === 'zh' ? '12个月' : '12 Months',
            mainCriteria: language === 'zh' ? '既往接受过曲妥珠单抗和紫杉类药物治疗的、HER2 阳性...' : 'HER2-positive patients who have previously received Trastuzumab and Taxanes...',
            status: language === 'zh' ? '已发布' : 'Published'
        }
    ]

    const [selectedRequirementId, setSelectedRequirementId] = useState<string>(mockRequirements[0].id)
    const selectedRequirement = mockRequirements.find(r => r.id === selectedRequirementId)

    const mockRecommendations = [
        {
            id: '1',
            name: language === 'zh' ? '复旦大学附属肿瘤医院' : 'Fudan University Cancer Hospital',
            region: language === 'zh' ? '华东' : 'East China',
            pi: language === 'zh' ? '陈XX' : 'Dr. Chen',
            rate: 4.5,
            rateTrend: 'up',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '低' : 'Low',
            tags: language === 'zh' ? ['三甲', '合作历史优', 'NSCLC经验丰富'] : ['Grade A', 'Good History', 'NSCLC Expert'],
            score: 96,
            regTags: language === 'zh' ? ['HGR优化报备', 'SMODE审计'] : ['HGR Optimized', 'SMODE Audit'],
            ethicsApproval: language === 'zh' ? '15天' : '15 Days',
            contractApproval: language === 'zh' ? '12天' : '12 Days',
            sivPreparation: language === 'zh' ? '6天' : '6 Days',
            piLoad: language === 'zh' ? '3.2项' : '3.2 Projects',
            crcRatio: '1:1.5',
            contractHistory: language === 'zh' ? '22天' : '22 Days'
        },
        {
            id: '2',
            name: language === 'zh' ? '中山大学肿瘤防治中心' : 'Sun Yat-sen University Cancer Center',
            region: language === 'zh' ? '华南' : 'South China',
            pi: language === 'zh' ? '周XX' : 'Dr. Zhou',
            rate: 3.8,
            rateTrend: 'stable',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '低' : 'Low',
            tags: language === 'zh' ? ['三甲', '启动快', '华南龙头'] : ['Grade A', 'Fast Startup', 'South China Leader'],
            score: 92,
            regTags: language === 'zh' ? ['GCP认证', '数据安全'] : ['GCP Cert', 'Data Security'],
            ethicsApproval: language === 'zh' ? '12天' : '12 Days',
            contractApproval: language === 'zh' ? '10天' : '10 Days',
            sivPreparation: language === 'zh' ? '5天' : '5 Days',
            piLoad: language === 'zh' ? '2.8项' : '2.8 Projects',
            crcRatio: '1:1.2',
            contractHistory: language === 'zh' ? '18天' : '18 Days'
        },
        {
            id: '3',
            name: language === 'zh' ? '北京肿瘤医院' : 'Beijing Cancer Hospital',
            region: language === 'zh' ? '华北' : 'North China',
            pi: language === 'zh' ? '张XX' : 'Dr. Zhang',
            rate: 3.5,
            rateTrend: 'down',
            reliability: language === 'zh' ? '中' : 'Medium',
            risk: language === 'zh' ? '中' : 'Medium',
            tags: language === 'zh' ? ['三甲', '负荷较高', '知名中心'] : ['Grade A', 'High Load', 'Famous Center'],
            score: 88,
            regTags: language === 'zh' ? ['GCP认证'] : ['GCP Cert'],
            ethicsApproval: language === 'zh' ? '20天' : '20 Days',
            contractApproval: language === 'zh' ? '25天' : '25 Days',
            sivPreparation: language === 'zh' ? '8天' : '8 Days',
            piLoad: language === 'zh' ? '4.5项' : '4.5 Projects',
            crcRatio: '1:2',
            contractHistory: language === 'zh' ? '30天' : '30 Days'
        },
        {
            id: '4',
            name: language === 'zh' ? '浙江省肿瘤医院' : 'Zhejiang Cancer Hospital',
            region: language === 'zh' ? '华东' : 'East China',
            pi: language === 'zh' ? '王XX' : 'Dr. Wang',
            rate: 3.8,
            rateTrend: 'stable',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '中' : 'Medium',
            tags: language === 'zh' ? ['三甲', '入组稳定'] : ['Grade A', 'Stable Enrollment'],
            score: 90,
            regTags: language === 'zh' ? ['GCP认证'] : ['GCP Cert'],
            ethicsApproval: language === 'zh' ? '20天' : '20 Days',
            contractApproval: language === 'zh' ? '18天' : '18 Days',
            sivPreparation: language === 'zh' ? '7天' : '7 Days',
            piLoad: language === 'zh' ? '3.5项' : '3.5 Projects',
            crcRatio: '1:1.3',
            contractHistory: language === 'zh' ? '25天' : '25 Days'
        }
    ]

    const handleSendMessage = () => {
        if (!inputValue) return
        const newMessages: Message[] = [...messages, { role: 'user', content: inputValue }]
        setMessages(newMessages)
        setInputValue('')

        setTimeout(() => {
            const aiResponse = language === 'zh'
                ? `已识别需求：找华东地区做过PD-1试验、入组速率高于3人/月的三甲医院。正在检索...`
                : `Identified requirement: Find Grade A tertiary hospitals in East China with PD-1 trial experience and enrollment rate > 3/month. Searching...`;

            setMessages([...newMessages, {
                role: 'assistant',
                content: aiResponse
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
        { title: t('institutionName'), dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: t('regionLabel'), dataIndex: 'region', key: 'region' },
        { title: t('pi'), dataIndex: 'pi', key: 'pi' },
        {
            title: t('estimatedMonthlyEnrollment'),
            dataIndex: 'rate',
            key: 'rate',
            render: (val: number) => <Badge status="processing" text={`${val} ${language === 'zh' ? '人/月' : 'pts/mo'}`} />
        },
        {
            title: t('enrollmentTotal'),
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
            title: t('action'),
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" size="small" onClick={() => showInstitutionPortrait(record.id)}>{t('portrait')}</Button>
                    {(record.risk === '中' || record.risk === 'Medium') && (
                        <Tooltip title={t('complianceNote')}>
                            <Tag icon={<SecurityScanOutlined />} color="warning">{t('attentionTag')}</Tag>
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
                        placeholder={t('selectionRequirementPlaceholder')}
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
                    <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => setInputValue(language === 'zh' ? '找华东地区做过 PD-1 试验的三甲医院' : 'Looking for Grade A tertiary hospitals in East China with PD-1 experience')}>{language === 'zh' ? 'PD-1 经验机构' : 'PD-1 Experience'}</Tag>
                    <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => setInputValue(language === 'zh' ? '北京地区 NSCLC 入组速率 Top 5' : 'Top 5 NSCLC enrollment rate in Beijing')}>{language === 'zh' ? '其它' : 'Others'}</Tag>
                </div>
            </div>
        </Card>
    )

    const renderRequirementStep = () => (
        <Row gutter={20}>
            <Col span={10}>
                <Card title={t('requirementListTitle')} className="glass-card" bodyStyle={{ padding: 0 }}>
                    <div>
                        <List
                            dataSource={mockRequirements}
                            renderItem={item => (
                                <List.Item
                                    className={`cursor-pointer px-4 hover:bg-blue-50 transition-colors ${selectedRequirementId === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                                    onClick={() => setSelectedRequirementId(item.id)}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<ExperimentOutlined />} className={(item.status === '已发布' || item.status === 'Published') ? 'bg-green-500' : 'bg-gray-400'} />}
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
                    title={t('requirementDetailPreviewTitle')}
                    className="glass-card"
                    extra={<Button type="primary" onClick={() => setCurrentStep('recommendation')}>{t('confirmAndStartRecommendation')}</Button>}
                >                    {selectedRequirement ? (
                    <div className="space-y-6">
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label={t('requirementName')}>{selectedRequirement.title}</Descriptions.Item>
                            <Descriptions.Item label={t('indication')}>{selectedRequirement.indication}</Descriptions.Item>
                            <Descriptions.Item label={t('trialPhase')}>{selectedRequirement.phase}</Descriptions.Item>
                            <Descriptions.Item label={t('drugType')}>{selectedRequirement.drugType}</Descriptions.Item>
                            <Descriptions.Item label={t('targetEnrollment')}>{selectedRequirement.targetEnrollment} {language === 'zh' ? '例' : 'cases'}</Descriptions.Item>
                            <Descriptions.Item label={t('expectedCycle')}>{selectedRequirement.duration}</Descriptions.Item>
                        </Descriptions>
                        <div>
                            <Title level={5}>{t('mainInclusionCriteria')}</Title>
                            <Paragraph type="secondary" style={{ padding: 12, background: '#fafafa', borderRadius: 8 }}>
                                {selectedRequirement.mainCriteria}
                            </Paragraph>
                        </div>
                    </div>
                ) : <Empty description={t('selectRequirementPreview')} />}
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
                    <Card bordered={false} title={t('aiRecommendedCentersTitle')} className="glass-card" extra={
                        <Space>
                            <Button icon={<FileSearchOutlined />}>{t('exportAnalysisReport')}</Button>
                            <Button
                                type="primary"
                                disabled={selectedCenters.length === 0}
                                onClick={() => setCurrentStep('comparison')}
                            >
                                {t('startCenterComparison')} ({selectedCenters.length})
                            </Button>
                        </Space>
                    }>
                        <Row justify="space-between" align="middle" className="mb-4">
                            <Space>
                                <Tag color="blue" icon={<CheckCircleFilled />}>{language === 'zh' ? '匹配度 > 85%' : 'Match > 85%'}</Tag>
                                <Tag color="green" icon={<SecurityScanOutlined />}>{language === 'zh' ? '风险管控中' : 'Risk under control'}</Tag>
                                <Text type="secondary">{t('foundCentersPrefix')}{mockRecommendations.length}{t('foundCentersSuffix')}</Text>
                            </Space>
                            <Button type="dashed" icon={<DeploymentUnitOutlined />}>{t('manualAddInstitution')}</Button>
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
                            <Card bordered={false} title={t('regionalCoverageAnalysisTitle')} className="glass-card">
                                <Row gutter={16} align="middle">
                                    <Col span={10}>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">85%</div>
                                            <div className="text-xs text-gray-400">{t('coreCoverage')} ({language === 'zh' ? '华东区' : 'East China'})</div>
                                        </div>
                                    </Col>
                                    <Col span={14}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs"><span>{language === 'zh' ? '华东 (4)' : 'East China (4)'}</span><span>100%</span></div>
                                            <Progress percent={100} size="small" showInfo={false} />
                                            <div className="flex justify-between text-xs"><span>{language === 'zh' ? '华北 (2)' : 'North China (2)'}</span><span>75%</span></div>
                                            <Progress percent={75} size="small" showInfo={false} status="active" />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false} title={t('enrollmentAccelerationForecastTitle')} className="glass-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Text type="secondary">{t('expectedEfficiencyImprovement')}</Text>
                                        <Title level={2} style={{ margin: 0, color: '#52c41a' }}>+22% <Text style={{ fontSize: 14, color: '#666' }}>{t('efficiency')}</Text></Title>
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
                                <Badge status="processing" text={`${t('selectionStrategy')}：${language === 'zh' ? '肿瘤标准 v2' : 'Oncology Std v2'}`} />
                                <Button type="text" icon={<HistoryOutlined />}>{t('strategyLog')}</Button>
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
                title={portraitData?.name + " - " + t('institutionPortraitTitle')}
                placement="right"
                width={700}
                onClose={() => setPortraitVisible(false)}
                open={portraitVisible}
                extra={
                    <Space>
                        <Button onClick={() => setPortraitVisible(false)}>{language === 'zh' ? '取消' : 'Cancel'}</Button>
                        <Button type="primary" onClick={() => {
                            if (portraitData && !selectedCenters.includes(portraitData.id)) {
                                setSelectedCenters([...selectedCenters, portraitData.id])
                            }
                            setPortraitVisible(false)
                        }}>{t('addToComparisonFlow')}</Button>
                    </Space>
                }
            >
                {portraitData ? (
                    <div className="space-y-6">
                        <section>
                            <Title level={5}><Space><InfoCircleOutlined />{t('basicInfo')}</Space></Title>
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label={t('regionLabel')}>{portraitData.region}</Descriptions.Item>
                                <Descriptions.Item label={t('pi')}>{portraitData.pi}</Descriptions.Item>
                                <Descriptions.Item label={t('estimatedMonthlyEnrollment')}>{portraitData.rate} {language === 'zh' ? '人/月' : 'pts/mo'}</Descriptions.Item>
                                <Descriptions.Item label={language === 'zh' ? '信誉等级' : 'Reliability'}>{portraitData.reliability}</Descriptions.Item>
                            </Descriptions>
                        </section>

                        <section>
                            <Title level={5}>{t('historicalPerformanceTitle')}</Title>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-blue-50">
                                        <div className="text-xl font-bold">122d</div>
                                        <div className="text-xs text-gray-400">{t('avgStartupCycleLabel')}</div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-green-50">
                                        <div className="text-xl font-bold">94%</div>
                                        <div className="text-xs text-gray-400">{t('fpiOnTimeRateLabel')}</div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card size="small" className="text-center bg-orange-50">
                                        <div className="text-xl font-bold">0.8</div>
                                        <div className="text-xs text-gray-400">{t('avgQueryRateLabel')}</div>
                                    </Card>
                                </Col>
                            </Row>
                        </section>

                        <section>
                            <Title level={5}>{t('regComplianceCertTitle')}</Title>
                            <Space wrap>
                                {portraitData.regTags.map(tag => <Tag key={tag} color="cyan">{tag}</Tag>)}
                                <Tag color="blue">{language === 'zh' ? 'ISO 9001 认证' : 'ISO 9001 Certified'}</Tag>
                                <Tag color="purple">{language === 'zh' ? 'HGR 快速审批中心' : 'HGR Fast Track'}</Tag>
                            </Space>
                        </section>

                        <section>
                            <Title level={5}>{t('facilitiesEquipmentTitle')}</Title>
                            <List
                                size="small"
                                dataSource={language === 'zh'
                                    ? ['专用临床试验药房 (GCP)', '超低温冰箱 (-80℃)', '应急电力系统', '独立的伦理审查办公室']
                                    : ['Dedicated GCP Pharmacy', 'Ultra-low Temp Freezer (-80℃)', 'Emergency Power System', 'Independent Ethics Office']}
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
