import React, { useState, useRef, useEffect } from 'react'
import { Card, Row, Col, Input, Button, Avatar, Typography, Space, Tag, Table, Badge, Drawer, Divider, List, Empty, Tabs } from 'antd'
import {
    RobotOutlined, UserOutlined, SendOutlined, AuditOutlined,
    FileTextOutlined, CalendarOutlined, BankOutlined, EyeOutlined,
    CheckCircleOutlined, LinkOutlined, PaperClipOutlined, GlobalOutlined,
    SafetyCertificateOutlined, ExperimentOutlined, CheckCircleFilled,
    LoadingOutlined, DeploymentUnitOutlined, ShareAltOutlined,
    AlertOutlined, ProjectOutlined, SolutionOutlined, ArrowLeftOutlined,
    TagsOutlined, AimOutlined, BulbOutlined, ReadOutlined, ThunderboltOutlined,
    SearchOutlined, BarChartOutlined, HourglassOutlined
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { mockRegulations, Regulation } from './regulatoryMockData'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// --- Types ---
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface PlanningStep {
    id: string;
    title: string;
    description: string;
    status: 'waiting' | 'running' | 'done';
    duration?: string;
}

interface MatchedProject {
    key: string;
    id: string;
    name: string;
    phase: string;
    indication: string;
    matchedKeywords: string[];
    matchScore: number;
    status: string;
    sponsor: string;
    pi: string;
    sites: number;
    enrolled: number;
    target: number;
    startDate: string;
    expectedEnd: string;
    therapeutic: string;
}

interface MatchedProposal {
    key: string;
    id: string;
    name: string;
    projectId: string;
    version: string;
    matchedKeywords: string[];
    matchScore: number;
    status: string;
    createdDate: string;
    approvedDate: string;
    author: string;
    chapters: { name: string; pages: number }[];
    endpoints: string[];
    inclusionCriteria: string[];
}

// View states
type ViewState = 'list' | 'screening' | 'screeningReport' | 'evaluatingProject' | 'evaluatingProposal' | 'projectReport' | 'proposalReport' | 'interpreting' | 'interpretReport';

// Mock matched projects data
const mockMatchedProjects: MatchedProject[] = [
    { key: '1', id: 'PRJ-2025-001', name: '非小细胞肺癌三期临床试验 (EGFR-TKI)', phase: 'III期', indication: '非小细胞肺癌', matchedKeywords: ['非小细胞肺癌', '三期试验', 'EGFR'], matchScore: 95, status: '入组中', sponsor: '恒瑞医药', pi: '陈教授 (复旦肿瘤)', sites: 28, enrolled: 156, target: 300, startDate: '2024-06-15', expectedEnd: '2026-12-31', therapeutic: 'EGFR-TKI 靶向治疗' },
    { key: '2', id: 'PRJ-2025-008', name: 'ALK阳性肺癌二线治疗研究', phase: 'II期', indication: '肺癌', matchedKeywords: ['肺癌', 'ALK', '二线治疗'], matchScore: 88, status: '入组中', sponsor: '百济神州', pi: '李主任 (上海胸科)', sites: 15, enrolled: 48, target: 120, startDate: '2025-01-10', expectedEnd: '2027-06-30', therapeutic: 'ALK 抑制剂' },
    { key: '3', id: 'PRJ-2024-156', name: '肺腺癌免疫联合治疗探索', phase: 'II期', indication: '肺腺癌', matchedKeywords: ['肺癌', '免疫治疗'], matchScore: 82, status: '随访中', sponsor: '君实生物', pi: '王教授 (中山肿瘤)', sites: 22, enrolled: 180, target: 180, startDate: '2024-03-01', expectedEnd: '2026-09-30', therapeutic: 'PD-1 + 化疗' },
    { key: '4', id: 'PRJ-2024-089', name: 'ROS1重排肺癌靶向治疗', phase: 'III期', indication: '非小细胞肺癌', matchedKeywords: ['非小细胞肺癌', '三期试验', 'ROS1'], matchScore: 78, status: '入组中', sponsor: '辉瑞制药', pi: '张教授 (北京肿瘤)', sites: 32, enrolled: 89, target: 240, startDate: '2024-08-20', expectedEnd: '2027-02-28', therapeutic: 'ROS1 抑制剂' },
]

const mockMatchedProposals: MatchedProposal[] = [
    { key: '1', id: 'PRP-2025-001-A', name: 'EGFR-TKI三期试验执行方案 v2.1', projectId: 'PRJ-2025-001', version: 'v2.1', matchedKeywords: ['终点设计', 'PFS评估', '入排标准'], matchScore: 92, status: '执行中', createdDate: '2024-05-01', approvedDate: '2024-06-10', author: '临床运营部', chapters: [{ name: '研究背景', pages: 12 }, { name: '研究目标', pages: 8 }, { name: '研究设计', pages: 25 }, { name: '入排标准', pages: 15 }, { name: '终点设计', pages: 18 }], endpoints: ['PFS (主要终点)', 'OS (次要终点)', 'ORR', 'DCR', '安全性'], inclusionCriteria: ['EGFR突变阳性', '晚期 NSCLC', 'PS 0-1', '无脑转移'] },
    { key: '2', id: 'PRP-2025-008-A', name: 'ALK阳性肺癌研究方案', projectId: 'PRJ-2025-008', version: 'v1.3', matchedKeywords: ['脑转移评估', '安全性监测'], matchScore: 85, status: '执行中', createdDate: '2024-11-15', approvedDate: '2025-01-05', author: '临床运营部', chapters: [{ name: '研究背景', pages: 10 }, { name: '研究设计', pages: 20 }, { name: '入排标准', pages: 12 }, { name: '安全性监测', pages: 22 }], endpoints: ['CNS-PFS', 'PFS', 'ORR', 'iCR'], inclusionCriteria: ['ALK重排阳性', '允许脑转移', 'PS 0-2'] },
    { key: '3', id: 'PRP-2024-156-B', name: '免疫联合治疗方案修订版', projectId: 'PRJ-2024-156', version: 'v3.0', matchedKeywords: ['免疫相关不良事件', 'PRO评估'], matchScore: 79, status: '待更新', createdDate: '2024-01-20', approvedDate: '2024-02-28', author: '医学部', chapters: [{ name: '研究背景', pages: 8 }, { name: 'irAE管理', pages: 30 }, { name: 'PRO评估', pages: 15 }], endpoints: ['ORR', 'PFS', 'irAE发生率', 'PRO评分'], inclusionCriteria: ['PD-L1 TPS≥50%', '无驱动基因', 'PS 0-1'] },
    { key: '4', id: 'PRP-2024-089-A', name: 'ROS1靶向治疗执行方案', projectId: 'PRJ-2024-089', version: 'v2.0', matchedKeywords: ['终点设计', '生存分析'], matchScore: 75, status: '执行中', createdDate: '2024-07-01', approvedDate: '2024-08-15', author: '临床运营部', chapters: [{ name: '研究设计', pages: 22 }, { name: '终点设计', pages: 16 }, { name: '统计分析计划', pages: 20 }], endpoints: ['PFS', 'OS', 'ORR', 'DoR'], inclusionCriteria: ['ROS1重排阳性', '晚期 NSCLC', '无系统治疗史'] },
    { key: '5', id: 'PRP-2025-001-B', name: 'EGFR-TKI安全性监测附件', projectId: 'PRJ-2025-001', version: 'v1.0', matchedKeywords: ['安全性监测', '不良事件报告'], matchScore: 71, status: '执行中', createdDate: '2024-06-01', approvedDate: '2024-06-10', author: '药物警戒部', chapters: [{ name: 'AE分级标准', pages: 10 }, { name: 'SAE报告流程', pages: 8 }, { name: '剂量调整规则', pages: 12 }], endpoints: ['AE发生率', 'SAE发生率', '剂量调整率'], inclusionCriteria: [] },
]

const RegulatoryReview: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '您好！我是法规审查助理。您可以向我咨询药品临床试验相关法规、合规要求或政策解读，我将协助您快速查找和理解相关规定。' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // View and planning states
    const [viewState, setViewState] = useState<ViewState>('list')
    const [currentRegulation, setCurrentRegulation] = useState<Regulation | null>(null)
    const [planningSteps, setPlanningSteps] = useState<PlanningStep[]>([])
    const [stepIndex, setStepIndex] = useState(0)
    const [isPlanning, setIsPlanning] = useState(false)
    const [isThinking, setIsThinking] = useState(false)
    const [displayedThinkingText, setDisplayedThinkingText] = useState('')
    const [thinkingText, setThinkingText] = useState('')

    // Detail drawer states
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
    const [detailDrawerType, setDetailDrawerType] = useState<'project' | 'proposal'>('project')
    const [selectedProject, setSelectedProject] = useState<MatchedProject | null>(null)
    const [selectedProposal, setSelectedProposal] = useState<MatchedProposal | null>(null)

    // Evaluation target
    const [evaluatingProject, setEvaluatingProject] = useState<MatchedProject | null>(null)
    const [evaluatingProposal, setEvaluatingProposal] = useState<MatchedProposal | null>(null)

    // Batch evaluation state
    const [selectedProjectKeys, setSelectedProjectKeys] = useState<React.Key[]>([])
    const [selectedProposalKeys, setSelectedProposalKeys] = useState<React.Key[]>([])
    const [batchEvaluatingProjects, setBatchEvaluatingProjects] = useState<MatchedProject[]>([])
    const [batchEvaluatingProposals, setBatchEvaluatingProposals] = useState<MatchedProposal[]>([])

    const handleBatchEvaluateProjects = () => {
        if (!currentRegulation || selectedProjectKeys.length === 0) return
        const projects = mockMatchedProjects.filter(p => selectedProjectKeys.includes(p.key))
        setBatchEvaluatingProjects(projects)
        setEvaluatingProject(null) // Clear single selection
        // Use the first project for the planning step title or a generic one
        setPlanningSteps(generateProjectEvaluationSteps(projects[0], currentRegulation))
        // We'll treat the viewState as 'evaluatingProject' but handle batch rendering
        setViewState('evaluatingProject')
        setThinkingText(`正在批量解析 ${projects.length} 个项目的合规性。系统正在建立项目本体与法规本体的关联图谱，逐层分析合规差距与潜在风险……`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleBatchEvaluateProposals = () => {
        if (!currentRegulation || selectedProposalKeys.length === 0) return
        const proposals = mockMatchedProposals.filter(p => selectedProposalKeys.includes(p.key))
        setBatchEvaluatingProposals(proposals)
        setEvaluatingProposal(null) // Clear single selection
        setPlanningSteps(generateProposalEvaluationSteps(proposals[0], currentRegulation))
        setViewState('evaluatingProposal')
        setThinkingText(`正在批量解析 ${proposals.length} 个方案的合规性。系统正在建立方案条款与法规条款的对应关系，逐条分析需要修订的内容……`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = (text: string = inputValue) => {
        if (!text) return
        const newMsgs: Message[] = [...messages, { role: 'user' as const, content: text }]
        setMessages(newMsgs)
        setInputValue('')
        setIsProcessing(true)

        // Parse command and trigger GUI actions
        const regMatch = text.match(/《(.*?)》/)
        if (regMatch) {
            const regTitle = regMatch[1]
            // Fuzzy match: check if Regulation title includes the search term (ignoring suffixes like version/source)
            // or if the search term includes the Regulation title
            const foundReg = mockRegulations.find(r => r.title.includes(regTitle) || regTitle.includes(r.title))

            if (foundReg) {
                setTimeout(() => {
                    setIsProcessing(false)
                    if (text.includes('解读')) {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `正在为您解读法规《${foundReg.title}》，请在右侧查看详细规划与报告。`
                        }])
                        handleInterpretRegulation(foundReg)
                    } else if (text.includes('筛查')) {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `正在为您筛查受法规《${foundReg.title}》影响的项目，请在右侧查看详细规划与报告。`
                        }])
                        handleScreenRegulation(foundReg)
                    } else {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `已找到法规《${foundReg.title}》。您可以发送"解读"或"筛查"来启动相关分析。`
                        }])
                        handleViewRegulation(foundReg)
                    }
                }, 800)
                return
            }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `正在为您检索与"${text}"相关的法规条文...该功能正在开发中，敬请期待。`
            }])
            setIsProcessing(false)
        }, 1500)
    }

    const handleViewRegulation = (record: Regulation) => {
        setSelectedRegulation(record)
        setDrawerVisible(true)
    }


    // Generate screening steps
    const generateScreeningSteps = (regulation: Regulation): PlanningStep[] => {
        const diseaseTerms = regulation.scope.slice(0, 2).join('、')
        const categoryOntology = `[法规本体:${regulation.category}]`

        return [
            { id: '1', title: '法规本体解构与关键信息提取', description: `解析法规核心要素 → ${categoryOntology}；提取关键病症：${diseaseTerms}；识别核心参数与指标要求`, status: 'waiting' },
            { id: '2', title: '本体知识图谱映射', description: `将法规条款映射至 [适应症本体]、[试验设计本体]、[终点指标本体]；构建法规-实体关联路径`, status: 'waiting' },
            { id: '3', title: '受影响项目筛查', description: `基于 [项目-适应症-试验阶段] 关系路径，检索可能受影响的在研项目；匹配${regulation.relatedTrialTypes.slice(0, 2).join('、')}类型项目`, status: 'waiting' },
            { id: '4', title: '受影响的方案 (Proposal) 筛查', description: `扫描项目执行方案中的入排标准、终点设计、安全性监测条款；筛选与新法规要求存在差异的方案`, status: 'waiting' },
            { id: '5', title: '生成筛查报告', description: `汇总筛查结果，输出受影响项目与方案清单，为后续合规评估提供数据基础`, status: 'waiting' }
        ]
    }

    // Generate project evaluation steps
    const generateProjectEvaluationSteps = (project: MatchedProject, regulation: Regulation): PlanningStep[] => {
        return [
            { id: '1', title: '法规本体深度解析', description: `解构法规 [${regulation.category}] 核心条款；提取对 ${project.indication} 适应症的具体要求`, status: 'waiting' },
            { id: '2', title: '项目本体映射分析', description: `解析项目 ${project.id} 的适应症本体、试验阶段本体、终点设计本体；建立项目-法规关联图谱`, status: 'waiting' },
            { id: '3', title: '合规差距深入研究', description: `对比项目当前状态与法规要求；识别入排标准、终点设计、安全监测等维度的差异点`, status: 'waiting' },
            { id: '4', title: '影响量化评估', description: `评估合规调整对项目进度、成本、入组的影响；生成风险等级与优先级建议`, status: 'waiting' },
            { id: '5', title: '生成项目评估报告', description: `整合分析结果，输出项目合规评估报告，包含具体整改建议与时间线`, status: 'waiting' }
        ]
    }

    // Generate proposal evaluation steps
    const generateProposalEvaluationSteps = (proposal: MatchedProposal, regulation: Regulation): PlanningStep[] => {
        return [
            { id: '1', title: '法规本体深度解析', description: `解构法规 [${regulation.category}] 核心条款；提取对执行方案的具体技术要求`, status: 'waiting' },
            { id: '2', title: '方案本体映射分析', description: `解析方案 ${proposal.id} (${proposal.version}) 的设计本体；建立方案条款-法规条款对应关系`, status: 'waiting' },
            { id: '3', title: '条款级差异深入研究', description: `逐条对比方案内容与法规要求；标记需修订的具体章节与条款`, status: 'waiting' },
            { id: '4', title: '修订工作量评估', description: `评估方案修订范围、审批流程影响、中心通知要求；生成修订优先级`, status: 'waiting' },
            { id: '5', title: '生成方案评估报告', description: `整合分析结果，输出方案修订建议报告，包含具体修改点与版本升级计划`, status: 'waiting' }
        ]
    }

    const handleScreenRegulation = (record: Regulation) => {
        setCurrentRegulation(record)
        setPlanningSteps(generateScreeningSteps(record))
        setViewState('screening')
        setThinkingText("正在深度解析法规文本结构与核心条款，基于 SMO 本体知识图谱建立法规-项目关联映射。系统正在启动筛查算子，逐一扫描在研项目与执行方案，识别可能受该法规影响的对象……")
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleEvaluateProject = (project: MatchedProject) => {
        if (!currentRegulation) return
        setEvaluatingProject(project)
        setPlanningSteps(generateProjectEvaluationSteps(project, currentRegulation))
        setViewState('evaluatingProject')
        setThinkingText(`正在深度解析法规对项目 ${project.name} 的影响。系统正在建立项目本体与法规本体的关联图谱，逐层分析合规差距与潜在风险……`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleEvaluateProposal = (proposal: MatchedProposal) => {
        if (!currentRegulation) return
        setEvaluatingProposal(proposal)
        setPlanningSteps(generateProposalEvaluationSteps(proposal, currentRegulation))
        setViewState('evaluatingProposal')
        setThinkingText(`正在深度解析法规对方案 ${proposal.name} 的影响。系统正在建立方案条款与法规条款的对应关系，逐条分析需要修订的内容……`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    // Generate interpretation steps
    const generateInterpretationSteps = (regulation: Regulation): PlanningStep[] => {
        return [
            { id: '1', title: '法规文本深入思考', description: `系统正在对法规《${regulation.title.slice(0, 20)}...》进行语义解构，识别核心条款、定义术语、适用范围边界`, status: 'waiting' },
            { id: '2', title: '搜索关联信息', description: `检索本体知识库中的关联法规、历史版本对比、行业案例；匹配 [${regulation.category}] 领域的最佳实践`, status: 'waiting' },
            { id: '3', title: '评估影响范围', description: `分析法规对 CRO 业务链条的影响：项目立项、方案设计、中心选择、数据管理、统计分析等环节`, status: 'waiting' },
            { id: '4', title: '生成解读报告', description: `整合分析洞察，输出法规深度解读报告，包含核心要点摘要、实操指南、合规检查清单`, status: 'waiting' }
        ]
    }

    const handleInterpretRegulation = (record: Regulation) => {
        setCurrentRegulation(record)
        setPlanningSteps(generateInterpretationSteps(record))
        setViewState('interpreting')
        setThinkingText("正在启动法规深度解读引擎，调用 SMO 本体知识图谱进行语义解构。系统将结合历史法规演变、行业最佳实践，为您生成专业的法规解读报告……")
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleViewProject = (project: MatchedProject) => {
        setSelectedProject(project)
        setDetailDrawerType('project')
        setDetailDrawerVisible(true)
    }

    const handleViewProposal = (proposal: MatchedProposal) => {
        setSelectedProposal(proposal)
        setDetailDrawerType('proposal')
        setDetailDrawerVisible(true)
    }

    // Typewriter effect for thinking
    useEffect(() => {
        if (isThinking) {
            if (displayedThinkingText.length < thinkingText.length) {
                const timer = setTimeout(() => {
                    setDisplayedThinkingText(thinkingText.slice(0, displayedThinkingText.length + 1))
                }, 15)
                return () => clearTimeout(timer)
            } else {
                const timer = setTimeout(() => {
                    setIsThinking(false)
                    const startSteps = [...planningSteps]
                    startSteps[0].status = 'running'
                    setPlanningSteps(startSteps)
                    setStepIndex(1)
                    setIsPlanning(true)
                }, 800)
                return () => clearTimeout(timer)
            }
        }
    }, [isThinking, displayedThinkingText, thinkingText, planningSteps])

    // Step processing
    useEffect(() => {
        if (isPlanning && stepIndex < planningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500
            const timer = setTimeout(() => {
                const nextSteps = [...planningSteps]
                if (stepIndex > 0) {
                    nextSteps[stepIndex - 1].status = 'done'
                    nextSteps[stepIndex - 1].duration = `+${(randomDelay / 1000).toFixed(1)}s`
                }
                nextSteps[stepIndex].status = 'running'
                setPlanningSteps(nextSteps)
                setStepIndex(prev => prev + 1)
            }, randomDelay)
            return () => clearTimeout(timer)
        } else if (isPlanning && stepIndex === planningSteps.length) {
            const randomDelay = Math.random() * 1500 + 500
            const timer = setTimeout(() => {
                const finalSteps = [...planningSteps]
                finalSteps[finalSteps.length - 1].status = 'done'
                finalSteps[finalSteps.length - 1].duration = `+${(randomDelay / 1000).toFixed(1)}s`
                setPlanningSteps(finalSteps)
                setIsPlanning(false)
                setTimeout(() => {
                    if (viewState === 'screening') {
                        setViewState('screeningReport')
                    } else if (viewState === 'evaluatingProject') {
                        setViewState('projectReport')
                    } else if (viewState === 'evaluatingProposal') {
                        setViewState('proposalReport')
                    } else if (viewState === 'interpreting') {
                        setViewState('interpretReport')
                    }
                }, 500)
            }, randomDelay)
            return () => clearTimeout(timer)
        }
    }, [isPlanning, stepIndex, planningSteps, viewState])

    const handleBackToList = () => {
        setViewState('list')
        setCurrentRegulation(null)
        setPlanningSteps([])
        setStepIndex(0)
        setIsPlanning(false)
        setIsThinking(false)
        setEvaluatingProject(null)
        setEvaluatingProposal(null)
    }

    const handleBackToScreeningReport = () => {
        setViewState('screeningReport')
        setPlanningSteps([])
        setStepIndex(0)
        setIsPlanning(false)
        setIsThinking(false)
        setEvaluatingProject(null)
        setEvaluatingProposal(null)
        setBatchEvaluatingProjects([])
        setBatchEvaluatingProposals([])
    }

    const getSourceColor = (sourceCode: string) => {
        const colors: Record<string, string> = { NMPA: 'red', FDA: 'blue', EMA: 'purple', PMDA: 'orange', ICH: 'green' }
        return colors[sourceCode] || 'default'
    }

    const columns = [
        {
            title: '法规名称', dataIndex: 'title', key: 'title',
            render: (text: string, record: Regulation) => (
                <div className="max-w-[320px]">
                    <Text strong className="text-gray-800 hover:text-blue-600 cursor-pointer text-xs leading-tight block" onClick={() => handleViewRegulation(record)}>{text}</Text>
                </div>
            ),
        },
        { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: 110, render: (text: string) => <Text type="secondary" className="text-xs">{text}</Text>, sorter: (a: Regulation, b: Regulation) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime(), defaultSortOrder: 'descend' as const },
        { title: '来源', dataIndex: 'source', key: 'source', width: 100, render: (_: string, record: Regulation) => <Tag color={getSourceColor(record.sourceCode)} className="text-xs">{record.sourceCode}</Tag>, filters: [{ text: 'NMPA 中国', value: 'NMPA' }, { text: 'FDA 美国', value: 'FDA' }, { text: 'EMA 欧洲', value: 'EMA' }, { text: 'PMDA 日本', value: 'PMDA' }, { text: 'ICH 国际', value: 'ICH' }], onFilter: (value: any, record: Regulation) => record.sourceCode === value },
        { title: '分类', dataIndex: 'category', key: 'category', width: 90, render: (text: string) => <Tag className="text-xs">{text}</Tag> },
        { title: '状态', dataIndex: 'status', key: 'status', width: 70, render: (status: string) => { const config = { active: { color: 'green', text: '现行' }, updated: { color: 'orange', text: '已修订' }, pending: { color: 'cyan', text: '待生效' } }; const { color, text } = config[status as keyof typeof config] || { color: 'default', text: status }; return <Badge color={color} text={<span className="text-xs">{text}</span>} /> } },
        { title: '操作', key: 'action', width: 150, render: (_: any, record: Regulation) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewRegulation(record)}>查看</Button><Button type="link" size="small" className="p-0 text-xs text-blue-500" icon={<BulbOutlined />} onClick={() => handleInterpretRegulation(record)}>解读</Button><Button type="link" size="small" className="p-0 text-xs text-orange-500" icon={<AlertOutlined />} onClick={() => handleScreenRegulation(record)}>筛查</Button></Space> },
    ]

    // Project list columns for screening report
    const projectColumns = [
        { title: '项目编号', dataIndex: 'id', key: 'id', width: 120, render: (text: string, record: MatchedProject) => <Text strong className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleViewProject(record)}>{text}</Text> },
        { title: '项目名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text className="text-xs">{text}</Text> },
        { title: '阶段', dataIndex: 'phase', key: 'phase', width: 70, render: (text: string) => <Tag color="blue" className="text-xs">{text}</Tag> },
        { title: '命中关键词', dataIndex: 'matchedKeywords', key: 'matchedKeywords', width: 180, render: (keywords: string[]) => <div className="flex flex-wrap gap-1">{keywords.map((kw, i) => <Tag key={i} color="orange" className="text-xs">{kw}</Tag>)}</div> },
        { title: '匹配度', dataIndex: 'matchScore', key: 'matchScore', width: 80, render: (score: number) => <Badge color={score >= 90 ? 'red' : score >= 80 ? 'orange' : 'blue'} text={<span className="text-xs font-bold">{score}%</span>} /> },
        { title: '操作', key: 'action', width: 110, render: (_: any, record: MatchedProject) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewProject(record)}>查看</Button><Button type="link" size="small" className="p-0 text-xs text-green-600" icon={<AimOutlined />} onClick={() => handleEvaluateProject(record)}>评估</Button></Space> },
    ]

    // Proposal list columns for screening report
    const proposalColumns = [
        { title: '方案编号', dataIndex: 'id', key: 'id', width: 140, render: (text: string, record: MatchedProposal) => <Text strong className="text-xs text-purple-600 hover:text-purple-800 cursor-pointer" onClick={() => handleViewProposal(record)}>{text}</Text> },
        { title: '方案名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text className="text-xs">{text}</Text> },
        { title: '版本', dataIndex: 'version', key: 'version', width: 60, render: (text: string) => <Tag className="text-xs">{text}</Tag> },
        { title: '命中关键词', dataIndex: 'matchedKeywords', key: 'matchedKeywords', width: 180, render: (keywords: string[]) => <div className="flex flex-wrap gap-1">{keywords.map((kw, i) => <Tag key={i} color="purple" className="text-xs">{kw}</Tag>)}</div> },
        { title: '匹配度', dataIndex: 'matchScore', key: 'matchScore', width: 80, render: (score: number) => <Badge color={score >= 90 ? 'red' : score >= 80 ? 'orange' : 'purple'} text={<span className="text-xs font-bold">{score}%</span>} /> },
        { title: '操作', key: 'action', width: 110, render: (_: any, record: MatchedProposal) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewProposal(record)}>查看</Button><Button type="link" size="small" className="p-0 text-xs text-green-600" icon={<AimOutlined />} onClick={() => handleEvaluateProposal(record)}>评估</Button></Space> },
    ]

    // Render planning steps UI
    const renderPlanningSteps = (title: string, statusTag: string) => (
        <Card bordered={false} className="glass-card h-full overflow-hidden" title={
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={viewState === 'screening' ? handleBackToList : handleBackToScreeningReport} />
                    <DeploymentUnitOutlined className="text-orange-500" />
                    <span className="text-sm">{title}</span>
                </div>
                <Tag color="orange" icon={<LoadingOutlined />}>{statusTag}</Tag>
            </div>
        } bodyStyle={{ padding: '24px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
            <div className="max-w-3xl mx-auto">
                {isThinking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 bg-orange-50/30 border border-orange-100 rounded-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <RobotOutlined className="text-orange-500 animate-bounce" />
                            <Text strong className="text-orange-700">AI 正在解析</Text>
                        </div>
                        <Text className="text-gray-600 leading-relaxed min-h-[3em]">
                            {displayedThinkingText}
                            <span className="animate-pulse inline-block w-2 h-4 ml-1 bg-orange-400 align-middle"></span>
                        </Text>
                    </motion.div>
                )}
                {!isThinking && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <Title level={5} style={{ margin: 0 }}><Space><AlertOutlined className="text-orange-500" />执行流程</Space></Title>
                        </div>
                        <div className="space-y-3">
                            {planningSteps.map((step, i) => (
                                <motion.div key={step.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-xl flex items-center shadow-sm transition-all ${step.status === 'running' ? 'bg-orange-50/80 border border-orange-200' : step.status === 'done' ? 'bg-green-50/40 border border-green-100' : 'bg-white border border-gray-100'}`}>
                                    <div className="mr-4">
                                        {step.status === 'done' ? <Avatar size="small" className="bg-green-500" icon={<CheckCircleFilled />} /> : step.status === 'running' ? <Avatar size="small" className="bg-orange-500" icon={<LoadingOutlined />} /> : <Avatar size="small" className="bg-gray-200" icon={<div className="w-1 h-1 bg-white" />} />}
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
            </div>
        </Card>
    )

    // Helper to render a single project report
    const renderSingleProjectReport = (project: MatchedProject, regulation: Regulation) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <ProjectOutlined className="text-blue-500 text-lg" />
                        <Text strong className="text-lg">法规审查评估报告</Text>
                    </div>
                    <Tag color="orange">中等风险</Tag>
                </div>
                <Paragraph className="text-sm text-gray-600 mb-2">
                    项目 <Text strong>{project.id}</Text> - {project.name}
                </Paragraph>
                <Paragraph className="text-sm text-gray-600 mb-0">
                    评估法规: 《{regulation.title}》
                </Paragraph>
            </div>

            {/* Risk Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-red-600">2</div><Text type="secondary" className="text-xs">高风险项</Text></div>
                <div className="bg-orange-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-orange-600">3</div><Text type="secondary" className="text-xs">中风险项</Text></div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-yellow-600">4</div><Text type="secondary" className="text-xs">低风险项</Text></div>
                <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-green-600">5</div><Text type="secondary" className="text-xs">已合规</Text></div>
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    {/* Compliance Gap Analysis */}
                    <Card size="small" title={<><AlertOutlined className="text-red-500 mr-2" />合规差距分析</>} className="mb-4">
                        <div className="space-y-2">
                            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">入排标准不符合</Text><Tag color="red">高</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>ECOG PS 要求 0-2 → 0-1；当前方案允许 PS=2 患者入组</Text>
                                <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">新增</Tag>要求基线 ctDNA 检测；当前方案无此要求</Text>
                            </div>
                            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">主要终点设计需调整</Text><Tag color="red">高</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>PFS 评估窗 8周±7天 → 6周±3天；当前设计超出允许范围</Text>
                                <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">新增</Tag>需引入 IRC 独立评估；当前仅有研究者评估</Text>
                            </div>
                            <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">安全性监测待更新</Text><Tag color="orange">中</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>SAE 报告时限 72h → 24h；当前 SOP 需同步修订</Text>
                            </div>
                            <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">数据管理规范需修订</Text><Tag color="orange">中</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>数据锁库时限 90天 → 60天；需更新 DM 计划</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    {/* Impact Assessment */}
                    <Card size="small" title={<><BarChartOutlined className="text-blue-500 mr-2" />影响评估</>} className="mb-4">
                        <div className="space-y-3">
                            <div><Text className="text-xs text-gray-500">进度影响</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }} /></div><Text className="text-xs">延期 2-3 月</Text></div></div>
                            <div><Text className="text-xs text-gray-500">成本影响</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }} /></div><Text className="text-xs">+15%</Text></div></div>
                            <div><Text className="text-xs text-gray-500">入组影响</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} /></div><Text className="text-xs">暂停 1 月</Text></div></div>
                            <Divider className="my-2" />
                            <div className="flex items-center justify-between"><Text strong className="text-sm">综合风险等级</Text><Tag color="orange">中等</Tag></div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Rectification Plan */}
            <Card size="small" title={<><AimOutlined className="text-green-500 mr-2" />整改计划与时间线</>} className="mb-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="red">P0</Tag><span className="text-sm">修订入排标准并提交伦理</span></div><Text type="secondary" className="text-xs">7 工作日</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="red">P0</Tag><span className="text-sm">调整主要终点评估方法</span></div><Text type="secondary" className="text-xs">14 工作日</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="orange">P1</Tag><span className="text-sm">更新安全性监测 SOP</span></div><Text type="secondary" className="text-xs">10 工作日</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="orange">P1</Tag><span className="text-sm">数据管理规范修订</span></div><Text type="secondary" className="text-xs">7 工作日</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="yellow">P2</Tag><span className="text-sm">知情同意书版本更新</span></div><Text type="secondary" className="text-xs">5 工作日</Text></div>
                </div>
            </Card>

            {/* Recommendations */}
            <Card size="small" title={<><BulbOutlined className="text-yellow-500 mr-2" />AI 整改建议</>} className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="space-y-2">
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" /><Text className="text-sm"><Text strong>紧急：</Text>建议立即暂停新受试者入组，待入排标准修订完成后恢复</Text></div>
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" /><Text className="text-sm"><Text strong>重要：</Text>需与申办方沟通终点调整对统计分析计划的影响</Text></div>
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" /><Text className="text-sm"><Text strong>建议：</Text>对已入组受试者进行回顾性评估，确认是否需要补充评估</Text></div>
                </div>
            </Card>
        </motion.div>
    )

    // Helper to render a single proposal report
    const renderSingleProposalReport = (proposal: MatchedProposal, regulation: Regulation) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl mb-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <SolutionOutlined className="text-purple-500 text-lg" />
                        <Text strong className="text-lg">法规审查评估报告</Text>
                    </div>
                    <Tag color="orange">需要修订</Tag>
                </div>
                <Paragraph className="text-sm text-gray-600 mb-2">
                    方案 <Text strong>{proposal.id}</Text> ({proposal.version}) - {proposal.name}
                </Paragraph>
                <Paragraph className="text-sm text-gray-600 mb-0">
                    评估法规: 《{regulation.title}》
                </Paragraph>
            </div>

            {/* Revision Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-red-600">3</div><Text type="secondary" className="text-xs">必须修订</Text></div>
                <div className="bg-orange-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-orange-600">2</div><Text type="secondary" className="text-xs">建议修订</Text></div>
                <div className="bg-blue-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-blue-600">12</div><Text type="secondary" className="text-xs">涉及页面</Text></div>
                <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-green-600">8</div><Text type="secondary" className="text-xs">无需修改</Text></div>
            </div>

            {/* Clause-level Analysis */}
            <Card size="small" title={<><FileTextOutlined className="text-purple-500 mr-2" />条款级差异分析</>} className="mb-4">
                <div className="space-y-2">
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">第4章 入排标准</Text><Tag color="red">必须修订</Tag></div>
                        <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>4.2.1 年龄限制：需放宽至 12-17 岁青少年</Text>
                        <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">新增</Tag>4.3.5 排除标准：新增既往免疫治疗史限制</Text>
                    </div>
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">第6章 终点设计</Text><Tag color="red">必须修订</Tag></div>
                        <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>6.1 主要终点：PFS 定义需包含中心影像评估</Text>
                        <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">调整</Tag>6.2 评估窗口：从 8w±7d 收紧至 6w±3d</Text>
                    </div>
                    <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">第8章 安全性监测</Text><Tag color="orange">建议修订</Tag></div>
                        <Text type="secondary" className="text-xs block"><Tag color="blue" className="mr-1">流程</Tag>8.4 SAE 报告：更新为电子系统直报流程</Text>
                    </div>
                    <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">第9章 数据管理</Text><Tag color="orange">建议修订</Tag></div>
                        <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">新增</Tag>9.3 远程监查：补充 eSource 数据核查要求</Text>
                    </div>
                </div>
            </Card>

            <Row gutter={16}>
                <Col span={12}>
                    {/* Related Document Impact */}
                    <Card size="small" title={<><LinkOutlined className="text-blue-500 mr-2" />关联文档影响</>} className="mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">知情同意书 (ICF)</span><Text type="secondary" className="text-xs">需更新风险告知章节</Text></div>
                                <Tag color="red">必须修订</Tag>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">研究者手册 (IB)</span><Text type="secondary" className="text-xs">更新安全性参考信息</Text></div>
                                <Tag color="orange">建议修订</Tag>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">病例报告表 (CRF)</span><Text type="secondary" className="text-xs">无需变更字段</Text></div>
                                <Tag color="green">无重影响</Tag>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">统计分析计划 (SAP)</span><Text type="secondary" className="text-xs">需同步终点定义</Text></div>
                                <Tag color="orange">建议修订</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    {/* Revision Time & Cost Estimation */}
                    <Card size="small" title={<><HourglassOutlined className="text-blue-500 mr-2" />修订耗时与资源评估</>} className="mb-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">医学撰写 (MW)</span>
                                <div className="text-right"><Text strong>24 小时</Text><div className="text-xs text-gray-400">约 3 人天</div></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">临床运营 (CO)</span>
                                <div className="text-right"><Text strong>16 小时</Text><div className="text-xs text-gray-400">约 2 人天</div></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">质量控制 (QC)</span>
                                <div className="text-right"><Text strong>8 小时</Text><div className="text-xs text-gray-400">约 1 人天</div></div>
                            </div>
                            <Divider className="my-2" />
                            <div className="bg-gray-50 p-2 rounded">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-600">预计修订周期</span>
                                    <Text strong className="text-sm">1.5 周</Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">预估内部成本</span>
                                    <Text type="warning" strong className="text-sm">¥ 12,500</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* AI Recommendations */}
            <Card size="small" title={<><BulbOutlined className="text-yellow-500 mr-2" />AI 修订建议</>} className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="space-y-2">
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" /><Text className="text-sm"><Text strong>优先修订：</Text>建议优先修订第4章入排标准，对进行中的入组影响最大</Text></div>
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" /><Text className="text-sm"><Text strong>并行处理：</Text>终点设计与安全性监测修订可并行进行，加快整体进度</Text></div>
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" /><Text className="text-sm"><Text strong>注意事项：</Text>新版本发布后需进行全员培训，建议提前准备培训材料</Text></div>
                </div>
            </Card>
        </motion.div>
    )

    // Render right panel based on view state
    const renderRightPanel = () => {
        if (viewState === 'list') {
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2"><AuditOutlined className="text-blue-500" /><span>法规库</span><Tag color="blue">{mockRegulations.length} 条法规</Tag></div>
                        <Text type="secondary" className="text-xs">最后更新: 2026-01-19</Text>
                    </div>
                } bodyStyle={{ padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    <Table dataSource={mockRegulations} columns={columns} pagination={{ pageSize: 10, showSizeChanger: false, showQuickJumper: true, showTotal: (total) => `共 ${total} 条法规`, size: 'small' }} size="small" rowClassName="hover:bg-blue-50/30 cursor-pointer transition-colors" />
                </Card>
            )
        }

        if (viewState === 'screening' && currentRegulation) {
            return renderPlanningSteps(`筛查 ${currentRegulation.title.slice(0, 20)}...`, '筛查执行中')
        }

        if (viewState === 'evaluatingProject' && currentRegulation && (evaluatingProject || batchEvaluatingProjects.length > 0)) {
            const title = evaluatingProject ? `评估项目: ${evaluatingProject.name.slice(0, 15)}...` : `批量评估项目 (共${batchEvaluatingProjects.length}个)...`
            return renderPlanningSteps(title, '评估执行中')
        }

        if (viewState === 'evaluatingProposal' && currentRegulation && (evaluatingProposal || batchEvaluatingProposals.length > 0)) {
            const title = evaluatingProposal ? `评估方案: ${evaluatingProposal.name.slice(0, 15)}...` : `批量评估方案 (共${batchEvaluatingProposals.length}个)...`
            return renderPlanningSteps(title, '评估执行中')
        }

        if (viewState === 'screeningReport' && currentRegulation) {
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToList} />
                            <FileTextOutlined className="text-green-500" />
                            <span className="text-sm">筛查报告: {currentRegulation.title.slice(0, 18)}...</span>
                        </div>
                        <Space><Badge status="success" text="筛查完成" /><Button size="small" icon={<ShareAltOutlined />}>分享</Button><Button size="small" type="primary">导出 PDF</Button></Space>
                    </div>
                } bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckCircleOutlined className="text-green-500 text-lg" />
                                <Text strong className="text-base">法规影响筛查报告</Text>
                            </div>
                            <Paragraph className="text-sm text-gray-600 mb-0">
                                针对《{currentRegulation.title}》的影响筛查已完成。共筛查出 <Text strong className="text-orange-600">{mockMatchedProjects.length}</Text> 个可能受影响的项目和 <Text strong className="text-purple-600">{mockMatchedProposals.length}</Text> 个可能受影响的方案。
                            </Paragraph>
                        </div>

                        <Tabs defaultActiveKey="projects" items={[
                            {
                                key: 'projects',
                                label: <span><ProjectOutlined /> 受影响项目 ({mockMatchedProjects.length})</span>,
                                children: (
                                    <div className="space-y-2">
                                        <div className="flex justify-end">
                                            <Button type="primary" size="small" disabled={selectedProjectKeys.length === 0} onClick={handleBatchEvaluateProjects} icon={<AimOutlined />}>
                                                批量评估 ({selectedProjectKeys.length})
                                            </Button>
                                        </div>
                                        <Table
                                            rowSelection={{ type: 'checkbox', selectedRowKeys: selectedProjectKeys, onChange: (keys) => setSelectedProjectKeys(keys) }}
                                            dataSource={mockMatchedProjects}
                                            columns={projectColumns}
                                            pagination={false}
                                            size="small"
                                            rowClassName="hover:bg-blue-50/30"
                                        />
                                    </div>
                                )

                            },
                            {
                                key: 'proposals',
                                label: <span><SolutionOutlined /> 受影响方案 ({mockMatchedProposals.length})</span>,
                                children: (
                                    <div className="space-y-2">
                                        <div className="flex justify-end">
                                            <Button type="primary" size="small" disabled={selectedProposalKeys.length === 0} onClick={handleBatchEvaluateProposals} icon={<AimOutlined />}>
                                                批量评估 ({selectedProposalKeys.length})
                                            </Button>
                                        </div>
                                        <Table
                                            rowSelection={{ type: 'checkbox', selectedRowKeys: selectedProposalKeys, onChange: (keys) => setSelectedProposalKeys(keys) }}
                                            dataSource={mockMatchedProposals}
                                            columns={proposalColumns}
                                            pagination={false}
                                            size="small"
                                            rowClassName="hover:bg-purple-50/30"
                                        />
                                    </div>
                                )
                            }
                        ]} />
                    </motion.div>
                </Card>
            )
        }

        if (viewState === 'projectReport' && currentRegulation && (evaluatingProject || batchEvaluatingProjects.length > 0)) {
            const projectsToRender = evaluatingProject ? [evaluatingProject] : batchEvaluatingProjects
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToScreeningReport} />
                            <div className="ml-2 flex flex-col">
                                <span className="text-sm font-bold">法规审查评估报告 {projectsToRender.length > 1 ? `(共${projectsToRender.length}份)` : ''}</span>
                            </div>
                        </div>
                        <Space><Badge status="success" text="评估完成" /><Button size="small" icon={<ShareAltOutlined />}>分享</Button><Button size="small" type="primary">导出 PDF</Button></Space>
                    </div>
                } bodyStyle={{ padding: '20px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    {projectsToRender.map((proj, index) => (
                        <div key={proj.id}>
                            {renderSingleProjectReport(proj, currentRegulation)}
                            {index < projectsToRender.length - 1 && <Divider />}
                        </div>
                    ))}
                </Card>
            )
        }

        if (viewState === 'proposalReport' && currentRegulation && (evaluatingProposal || batchEvaluatingProposals.length > 0)) {
            const proposalsToRender = evaluatingProposal ? [evaluatingProposal] : batchEvaluatingProposals
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToScreeningReport} />
                            <div className="ml-2 flex flex-col">
                                <span className="text-sm font-bold">法规审查评估报告 {proposalsToRender.length > 1 ? `(共${proposalsToRender.length}份)` : ''}</span>
                            </div>
                        </div>
                        <Space><Badge status="success" text="评估完成" /><Button size="small" icon={<ShareAltOutlined />}>分享</Button><Button size="small" type="primary">导出 PDF</Button></Space>
                    </div>
                } bodyStyle={{ padding: '20px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    {proposalsToRender.map((prop, index) => (
                        <div key={prop.id}>
                            {renderSingleProposalReport(prop, currentRegulation)}
                            {index < proposalsToRender.length - 1 && <Divider />}
                        </div>
                    ))}
                </Card>
            )
        }

        if (viewState === 'interpreting' && currentRegulation) {
            return renderPlanningSteps(`解读《${currentRegulation.title.slice(0, 18)}...》`, '解读执行中')
        }

        if (viewState === 'interpretReport' && currentRegulation) {
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToList} />
                            <ReadOutlined className="text-blue-500" />
                            <span className="text-sm">法规解读报告</span>
                        </div>
                        <Space><Badge status="success" text="解读完成" /><Button size="small" icon={<ShareAltOutlined />}>分享</Button><Button size="small" type="primary">导出 PDF</Button></Space>
                    </div>
                } bodyStyle={{ padding: '20px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Report Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-5">
                            <div className="flex items-start justify-between mb-3">
                                <Tag color={getSourceColor(currentRegulation.sourceCode)}>{currentRegulation.source}</Tag>

                            </div>
                            <Text strong className="text-lg text-gray-800 block mb-2">{currentRegulation.title}</Text>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span><CalendarOutlined className="mr-1" />发布: {currentRegulation.publishDate}</span>
                                <span><CheckCircleOutlined className="mr-1" />生效: {currentRegulation.effectiveDate}</span>
                                <span>文号: {currentRegulation.documentNumber}</span>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <Card size="small" title={<><ThunderboltOutlined className="text-yellow-500 mr-2" />核心速览</>} className="mb-4">
                            <Paragraph className="text-sm text-gray-700 mb-3">{currentRegulation.summary}</Paragraph>
                            <div className="grid grid-cols-6 gap-3 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-blue-600">{currentRegulation.keyPoints.length}</div>
                                    <Text type="secondary" className="text-xs">核心要点</Text>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-green-600">{currentRegulation.scope.length}</div>
                                    <Text type="secondary" className="text-xs">适用范围</Text>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-orange-600">{currentRegulation.impactAreas.length}</div>
                                    <Text type="secondary" className="text-xs">影响领域</Text>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-purple-600">{currentRegulation.relatedTrialTypes.length}</div>
                                    <Text type="secondary" className="text-xs">试验类型</Text>
                                </div>
                                <div className="bg-cyan-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-cyan-600">{currentRegulation.attachments.length}</div>
                                    <Text type="secondary" className="text-xs">相关附件</Text>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-red-600">{mockMatchedProjects.length}</div>
                                    <Text type="secondary" className="text-xs">潜在影响项目</Text>
                                </div>
                            </div>
                            <Divider className="my-3" />
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">法规分类</div>
                                    <Tag color="blue">{currentRegulation.category}</Tag>
                                </Col>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">发布来源</div>
                                    <Tag color={getSourceColor(currentRegulation.sourceCode)}>{currentRegulation.source}</Tag>
                                </Col>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">法规状态</div>
                                    <Tag color={currentRegulation.status === 'active' ? 'green' : 'orange'}>{currentRegulation.status === 'active' ? '现行有效' : '已修订'}</Tag>
                                </Col>
                            </Row>
                        </Card>

                        <Row gutter={16}>
                            <Col span={12}>
                                {/* Key Changes - Specific Values */}
                                <Card size="small" title={<><ThunderboltOutlined className="text-red-500 mr-2" />关键变更点<Tag color="red" className="ml-2">需特别注意</Tag></>} className="mb-4">
                                    <div className="space-y-2">
                                        <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                            <Text strong className="text-sm block">PFS 评估时间窗</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>8周 ± 7天</Tag><span className="text-gray-400">→</span><Tag color="red">6周 ± 3天</Tag></div>
                                        </div>
                                        <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                                            <Text strong className="text-sm block">SAE 报告时限</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>72小时</Tag><span className="text-gray-400">→</span><Tag color="orange">24小时</Tag></div>
                                        </div>
                                        <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                                            <Text strong className="text-sm block">ECOG PS 入组标准</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>0-2</Tag><span className="text-gray-400">→</span><Tag color="yellow">0-1</Tag></div>
                                        </div>
                                        <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                                            <Text strong className="text-sm block">脑转移评估频率</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>12周</Tag><span className="text-gray-400">→</span><Tag color="blue">8周</Tag></div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                {/* Process Changes */}
                                <Card size="small" title={<><DeploymentUnitOutlined className="text-purple-500 mr-2" />流程调整要求</>} className="mb-4">
                                    <div className="space-y-2">
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">新增 | 独立影像评估</Text>
                                            <Text className="text-xs text-gray-600 block">III期试验必须引入 IRC 独立评估</Text>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">调整 | 知情同意流程</Text>
                                            <Text className="text-xs text-gray-600 block">新增电子签名要求，支持远程知情</Text>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">调整 | 数据锁库流程</Text>
                                            <Text className="text-xs text-gray-600 block">末例出组后锁库时间 90天→60天</Text>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">新增 | PRO 评估要求</Text>
                                            <Text className="text-xs text-gray-600 block">肿瘤试验需纳入生活质量评估</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Specific Metrics Table */}
                        <Card size="small" title={<><BarChartOutlined className="text-blue-500 mr-2" />核心指标对照表</>} className="mb-4">
                            <Table size="small" pagination={false} dataSource={[
                                { key: '1', item: '主要终点 ORR 阈值', oldVal: '≥30%', newVal: '≥35%', impact: '高' },
                                { key: '2', item: 'DLT 观察期', oldVal: '21天', newVal: '28天', impact: '中' },
                                { key: '3', item: '剂量递增规则', oldVal: '3+3设计', newVal: 'mTPI-2', impact: '高' },
                                { key: '4', item: '随访周期', oldVal: '2年', newVal: '3年', impact: '中' },
                                { key: '5', item: '样本量计算 α', oldVal: '0.05 单侧', newVal: '0.025 单侧', impact: '高' },
                            ]} columns={[
                                { title: '评估项目', dataIndex: 'item', key: 'item', render: (t: string) => <Text className="text-xs">{t}</Text> },
                                { title: '原要求', dataIndex: 'oldVal', key: 'oldVal', render: (t: string) => <Tag className="text-xs">{t}</Tag> },
                                { title: '新要求', dataIndex: 'newVal', key: 'newVal', render: (t: string) => <Tag color="blue" className="text-xs">{t}</Tag> },
                                { title: '影响', dataIndex: 'impact', key: 'impact', render: (t: string) => <Tag color={t === '高' ? 'red' : 'orange'} className="text-xs">{t}</Tag> },
                            ]} />
                        </Card>

                        {/* Attention Items */}
                        <Card size="small" title={<><AlertOutlined className="text-orange-500 mr-2" />特别关注事项</>} className="mb-4 border-orange-200 bg-orange-50/30">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 p-2 bg-white rounded"><Tag color="red">重要</Tag><Text className="text-sm flex-1">新法规要求所有 <Text strong>EGFR/ALK 阳性患者</Text>必须提供基线 <Text strong>ctDNA 检测报告</Text>，影响现有入组流程</Text></div>
                                <div className="flex items-start gap-2 p-2 bg-white rounded"><Tag color="red">重要</Tag><Text className="text-sm flex-1"><Text strong>脑转移患者</Text>入组需额外提供 <Text strong>增强 MRI</Text>（非 CT），成本增加约 ¥800/例</Text></div>
                                <div className="flex items-start gap-2 p-2 bg-white rounded"><Tag color="orange">注意</Tag><Text className="text-sm flex-1">生存随访要求从 <Text strong>电话随访</Text> 调整为 <Text strong>门诊复查</Text>，每季度一次</Text></div>
                                <div className="flex items-start gap-2 p-2 bg-white rounded"><Tag color="orange">注意</Tag><Text className="text-sm flex-1">统计分析需增加 <Text strong>亚组分析</Text>：PD-L1表达水平、基线转移部位数量</Text></div>
                            </div>
                        </Card>

                        {/* AI Recommendations */}
                        <Card size="small" title={<><AimOutlined className="text-green-500 mr-2" />AI 行动建议</>} className="bg-gradient-to-r from-green-50 to-blue-50">
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" /><Text className="text-sm"><Text strong>立即行动：</Text>更新入排标准中的 ECOG PS 要求（0-2→0-1），评估对当前入组池的影响，预计筛选失败率上升约 15%</Text></div>
                                <div className="flex items-start space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" /><Text className="text-sm"><Text strong>短期计划：</Text>与中心实验室确认 ctDNA 检测能力，当前约 60% 中心具备条件，其余需外送检测</Text></div>
                                <div className="flex items-start space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" /><Text className="text-sm"><Text strong>成本预算：</Text>预计单个受试者成本增加 ¥2,500-3,000（含 ctDNA、MRI、延长随访）</Text></div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="mt-4 flex gap-3">
                            <Button type="primary" icon={<AlertOutlined />} onClick={() => handleScreenRegulation(currentRegulation)}>筛查受影响项目</Button>
                            <Button icon={<LinkOutlined />} onClick={() => window.open(currentRegulation.officialUrl, '_blank')}>查看原文</Button>
                        </div>
                    </motion.div>
                </Card>
            )
        }

        return null
    }

    return (
        <div className="h-full overflow-hidden p-2">
            <Row gutter={20} className="h-full">
                {/* Left Side: CUI */}
                <Col span={7} className="h-full">
                    <Card bordered={false} className="flex flex-col glass-card h-full" title={<div className="flex items-center space-x-2"><RobotOutlined className="text-blue-500" /><span>法规审查助理</span></div>} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 12px' }}>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 scrollbar-thin">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Avatar icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} className={msg.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-green-500 mr-2'} size="small" />
                                            <div className={`p-3 rounded-lg text-sm overflow-hidden ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                                <Text style={{ color: msg.role === 'user' ? 'white' : 'inherit' }}>{msg.content}</Text>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="flex space-x-2">
                                <TextArea value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="输入法规查询问题..." autoSize={{ minRows: 1, maxRows: 4 }} onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleSend() } }} className="rounded-lg" />
                                <Button type="primary" icon={<SendOutlined />} onClick={() => handleSend()} loading={isProcessing} className="rounded-lg h-auto" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('解读法规《E6(R3) Good Clinical Practice: Modernized GCP for Clinical Electronic Systems》')}>解读 ICH E6(R3)</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('筛查法规《抗肿瘤药物临床试验终点技术指导原则（2025年修订版）》')}>筛查 抗肿瘤终点</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('筛查法规《以患者为中心的药物临床试验设计技术指导原则》')}>筛查 患者中心</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend('筛查法规《真实世界证据支持药物研发的技术指导原则（2025年更新）》')}>筛查 RWE 指导原则</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Dynamic Panel */}
                <Col span={17} className="h-full">{renderRightPanel()}</Col>
            </Row>

            {/* Regulation Detail Drawer */}
            <Drawer title={<div className="flex items-center space-x-2"><FileTextOutlined className="text-blue-500" /><span>法规详情</span></div>} placement="right" width={560} open={drawerVisible} onClose={() => setDrawerVisible(false)} styles={{ body: { padding: '16px' } }}>
                {selectedRegulation && (
                    <div className="space-y-5">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <Tag color={getSourceColor(selectedRegulation.sourceCode)}>{selectedRegulation.source}</Tag>
                                <Badge color={selectedRegulation.status === 'active' ? 'green' : selectedRegulation.status === 'updated' ? 'orange' : 'cyan'} text={selectedRegulation.status === 'active' ? '现行有效' : selectedRegulation.status === 'updated' ? '已修订' : '待生效'} />
                            </div>
                            <Text strong className="text-base text-gray-800 leading-snug block">{selectedRegulation.title}</Text>
                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                <span><CalendarOutlined className="mr-1" />发布: {selectedRegulation.publishDate}</span>
                                <span><CheckCircleOutlined className="mr-1" />生效: {selectedRegulation.effectiveDate}</span>
                            </div>
                            <div className="mt-2"><Text type="secondary" className="text-xs">文号: {selectedRegulation.documentNumber}</Text></div>
                        </div>
                        <div><div className="flex items-center space-x-2 mb-2"><SafetyCertificateOutlined className="text-blue-500" /><Text strong>法规概要</Text></div><Paragraph className="text-sm text-gray-600 mb-0 leading-relaxed">{selectedRegulation.summary}</Paragraph></div>
                        <Divider className="my-3" />
                        <div><div className="flex items-center space-x-2 mb-2"><GlobalOutlined className="text-green-500" /><Text strong>适用范围</Text></div><div className="flex flex-wrap gap-2">{selectedRegulation.scope.map((item, idx) => <Tag key={idx} color="green" className="text-xs">{item}</Tag>)}</div></div>
                        <div><div className="flex items-center space-x-2 mb-2"><ExperimentOutlined className="text-orange-500" /><Text strong>核心要点</Text></div><List size="small" dataSource={selectedRegulation.keyPoints} renderItem={(item: string) => <List.Item className="py-1.5 px-0 border-0"><div className="flex items-start space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" /><Text className="text-sm text-gray-700">{item}</Text></div></List.Item>} /></div>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2">相关试验类型</Text><div className="flex flex-wrap gap-2">{selectedRegulation.relatedTrialTypes.map((item, idx) => <Tag key={idx} color="blue" className="text-xs">{item}</Tag>)}</div></div>
                        <div><Text strong className="block mb-2">影响领域</Text><div className="flex flex-wrap gap-2">{selectedRegulation.impactAreas.map((item, idx) => <Tag key={idx} color="purple" className="text-xs">{item}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <div><div className="flex items-center space-x-2 mb-2"><PaperClipOutlined className="text-gray-500" /><Text strong>相关附件</Text></div><div className="space-y-2">{selectedRegulation.attachments.map((att, idx) => <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"><div className="flex items-center space-x-2"><FileTextOutlined className="text-blue-500" /><Text className="text-sm">{att.name}</Text></div><Tag className="text-xs">{att.type.toUpperCase()}</Tag></div>)}</div></div>
                        <div className="bg-blue-50 p-3 rounded-lg"><div className="flex items-center space-x-2"><LinkOutlined className="text-blue-500" /><Text strong className="text-sm">官方链接</Text></div><a href={selectedRegulation.officialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all mt-1 block">{selectedRegulation.officialUrl}</a></div>
                        <Button type="primary" icon={<AlertOutlined />} block size="large" className="mt-4" onClick={() => { setDrawerVisible(false); handleScreenRegulation(selectedRegulation) }}>筛查此法规对在研项目的影响</Button>
                    </div>
                )}
            </Drawer>

            {/* Project/Proposal Detail Drawer */}
            <Drawer title={<div className="flex items-center space-x-2">{detailDrawerType === 'project' ? <ProjectOutlined className="text-blue-500" /> : <SolutionOutlined className="text-purple-500" />}<span>{detailDrawerType === 'project' ? '项目详情' : '方案详情'}</span></div>} placement="right" width={520} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)} styles={{ body: { padding: '16px' } }}>
                {detailDrawerType === 'project' && selectedProject && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <Text strong className="text-lg text-blue-600 block mb-2">{selectedProject.id}</Text>
                            <Text className="text-base text-gray-800 block">{selectedProject.name}</Text>
                            <div className="flex items-center gap-2 mt-3"><Tag color="blue">{selectedProject.phase}</Tag><Tag>{selectedProject.indication}</Tag><Badge color={selectedProject.status === '入组中' ? 'green' : 'blue'} text={selectedProject.status} /></div>
                        </div>
                        <div><Text strong className="block mb-2"><TagsOutlined className="mr-1" />命中关键词</Text><div className="flex flex-wrap gap-2">{selectedProject.matchedKeywords.map((kw, i) => <Tag key={i} color="orange">{kw}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">申办方</div><Text strong className="text-sm">{selectedProject.sponsor}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">主要研究者</div><Text strong className="text-sm">{selectedProject.pi}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">治疗方案</div><Text className="text-sm">{selectedProject.therapeutic}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">参与中心</div><Text className="text-sm">{selectedProject.sites} 家</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2">入组进度</Text><div className="flex items-center gap-3"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(selectedProject.enrolled / selectedProject.target) * 100}%` }} /></div><Text className="text-sm">{selectedProject.enrolled}/{selectedProject.target}</Text></div></div>
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">开始日期</div><Text className="text-sm">{selectedProject.startDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">预计结束</div><Text className="text-sm">{selectedProject.expectedEnd}</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        {/* Key Milestones */}
                        <div><Text strong className="block mb-2"><CalendarOutlined className="mr-1" />关键里程碑</Text>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded"><span className="text-sm"><CheckCircleOutlined className="text-green-500 mr-2" />伦理批件获取</span><Tag color="green">已完成</Tag></div>
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded"><span className="text-sm"><CheckCircleOutlined className="text-green-500 mr-2" />首家中心启动</span><Tag color="green">已完成</Tag></div>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded"><span className="text-sm"><LoadingOutlined className="text-blue-500 mr-2" />50% 入组达成</span><Tag color="blue">进行中</Tag></div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><span className="text-sm text-gray-400">100% 入组完成</span><Tag>待开始</Tag></div>
                            </div>
                        </div>
                        <Divider className="my-3" />
                        {/* View Full Project Link */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <Button type="link" icon={<ProjectOutlined />} className="p-0 text-sm" onClick={(e) => { e.preventDefault(); /* 不跳转 */ }}>查看完整项目详情 →</Button>
                            <Text type="secondary" className="text-xs block mt-1">跳转至项目管理系统查看详细信息</Text>
                        </div>
                        <Button type="primary" icon={<AimOutlined />} block onClick={() => { setDetailDrawerVisible(false); handleEvaluateProject(selectedProject) }}>评估此项目的合规影响</Button>
                    </div>
                )}
                {detailDrawerType === 'proposal' && selectedProposal && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <Text strong className="text-lg text-purple-600 block mb-2">{selectedProposal.id}</Text>
                            <Text className="text-base text-gray-800 block">{selectedProposal.name}</Text>
                            <div className="flex items-center gap-2 mt-3"><Tag>{selectedProposal.version}</Tag><Tag color="blue">项目: {selectedProposal.projectId}</Tag><Badge color={selectedProposal.status === '执行中' ? 'green' : 'orange'} text={selectedProposal.status} /></div>
                        </div>
                        <div><Text strong className="block mb-2"><TagsOutlined className="mr-1" />命中关键词</Text><div className="flex flex-wrap gap-2">{selectedProposal.matchedKeywords.map((kw, i) => <Tag key={i} color="purple">{kw}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">编制部门</div><Text strong className="text-sm">{selectedProposal.author}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">创建日期</div><Text className="text-sm">{selectedProposal.createdDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">批准日期</div><Text className="text-sm">{selectedProposal.approvedDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">当前版本</div><Text className="text-sm">{selectedProposal.version}</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2"><FileTextOutlined className="mr-1" />方案章节</Text><div className="space-y-1">{selectedProposal.chapters.map((ch, i) => <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded text-sm"><span>{ch.name}</span><Tag className="text-xs">{ch.pages} 页</Tag></div>)}</div></div>
                        <div><Text strong className="block mb-2"><ExperimentOutlined className="mr-1" />终点设计</Text><div className="flex flex-wrap gap-2">{selectedProposal.endpoints.map((ep, i) => <Tag key={i} color="blue" className="text-xs">{ep}</Tag>)}</div></div>
                        {selectedProposal.inclusionCriteria.length > 0 && <div><Text strong className="block mb-2"><SafetyCertificateOutlined className="mr-1" />关键入排标准</Text><div className="flex flex-wrap gap-2">{selectedProposal.inclusionCriteria.map((ic, i) => <Tag key={i} color="green" className="text-xs">{ic}</Tag>)}</div></div>}
                        <Divider className="my-3" />
                        {/* Revision History */}
                        <div><Text strong className="block mb-2"><CalendarOutlined className="mr-1" />版本历史</Text>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded text-sm"><span>{selectedProposal.version} (当前)</span><Text type="secondary" className="text-xs">{selectedProposal.approvedDate}</Text></div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm text-gray-400"><span>v{parseFloat(selectedProposal.version.replace('v', '')) - 0.1 > 0 ? (parseFloat(selectedProposal.version.replace('v', '')) - 0.1).toFixed(1) : '1.0'}</span><Text type="secondary" className="text-xs">历史版本</Text></div>
                            </div>
                        </div>
                        {/* Compliance Status */}
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2"><Text strong className="text-sm"><SafetyCertificateOutlined className="mr-1" />合规状态</Text><Tag color="green">已审核</Tag></div>
                            <Text type="secondary" className="text-xs">上次合规审查: {selectedProposal.approvedDate}</Text>
                        </div>
                        <Divider className="my-3" />
                        {/* View Full Proposal Link */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <Button type="link" icon={<SolutionOutlined />} className="p-0 text-sm" onClick={(e) => { e.preventDefault(); /* 不跳转 */ }}>查看完整方案文档 →</Button>
                            <Text type="secondary" className="text-xs block mt-1">跳转至文档管理系统查看详细内容</Text>
                        </div>
                        <Button type="primary" icon={<AimOutlined />} block onClick={() => { setDetailDrawerVisible(false); handleEvaluateProposal(selectedProposal) }}>评估此方案的修订影响</Button>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

export default RegulatoryReview
