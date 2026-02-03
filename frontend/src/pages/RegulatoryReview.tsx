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
import {
    mockRegulationsEn,
    mockRegulationsZh,
    Regulation,
    MatchedProject,
    MatchedProposal,
    mockMatchedProjectsEn,
    mockMatchedProjectsZh,
    mockMatchedProposalsEn,
    mockMatchedProposalsZh
} from './regulatoryMockData'
import { useLanguage } from '../context/LanguageContext'

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

// View states
type ViewState = 'list' | 'screening' | 'screeningReport' | 'evaluatingProject' | 'evaluatingProposal' | 'projectReport' | 'proposalReport' | 'interpreting' | 'interpretReport';

const RegulatoryReview: React.FC = () => {
    const { t, language } = useLanguage();
    const mockRegulations = language === 'zh' ? mockRegulationsZh : mockRegulationsEn;
    const mockMatchedProjects = language === 'zh' ? mockMatchedProjectsZh : mockMatchedProjectsEn;
    const mockMatchedProposals = language === 'zh' ? mockMatchedProposalsZh : mockMatchedProposalsEn;

    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: language === 'zh' ? '您好！我是法规审查助理。您可以向我咨询药品临床试验相关法规、合规要求或政策解读，我将协助您快速查找和理解相关规定。' : 'Hello! I am the Regulatory Review Assistant. You can ask me about clinical trial regulations, compliance requirements, or policy interpretations.' }
    ])

    // Update initial message on language change
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                role: 'assistant',
                content: language === 'zh' ? '您好！我是法规审查助理。您可以向我咨询药品临床试验相关法规、合规要求或政策解读，我将协助您快速查找和理解相关规定。' : 'Hello! I am the Regulatory Review Assistant. You can ask me about clinical trial regulations, compliance requirements, or policy interpretations.'
            }])
        }
    }, [language])

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
        const lowerText = text.toLowerCase()
        const isInterpret = lowerText.includes('解读') || lowerText.includes('interpret')
        const isScreen = lowerText.includes('筛查') || lowerText.includes('screen')

        // Match Chinese 《Title》 or English "Title" or just fuzzy match
        const regMatch = text.match(/《(.*?)》/) || text.match(/"(.*?)"/) || text.match(/'(.*?)'/)
        let searchTitle = regMatch ? regMatch[1] : ''

        if (!searchTitle) {
            // If no brackets/quotes, try to extract title after command keyword
            searchTitle = text
                .replace(/^(解读法规|筛查法规|解读|筛查|Interpret|Screen)\s*/i, '')
                .trim();
        }

        if (searchTitle) {
            // Fuzzy match: check if Regulation title includes the search term (ignoring suffixes like version/source)
            // or if the search term includes the Regulation title
            let foundReg = mockRegulations.find(r =>
                r.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
                searchTitle.toLowerCase().includes(r.title.toLowerCase())
            )

            // If not found in current language, try the other language dataset
            if (!foundReg) {
                const altRegulations = language === 'zh' ? mockRegulationsEn : mockRegulationsZh;
                const altFoundReg = altRegulations.find(r =>
                    r.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
                    searchTitle.toLowerCase().includes(r.title.toLowerCase())
                );

                if (altFoundReg) {
                    // Map back to current language record by ID
                    foundReg = mockRegulations.find(r => r.id === altFoundReg.id);
                }
            }

            if (foundReg) {
                setTimeout(() => {
                    setIsProcessing(false)
                    if (isInterpret) {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: language === 'zh'
                                ? `正在为您解读法规《${foundReg!.title}》，请在右侧查看详细规划与报告。`
                                : `Interpreting regulation "${foundReg!.title}" for you. Please check detailed plan and report on the right.`
                        }])
                        handleInterpretRegulation(foundReg!)
                    } else if (isScreen) {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: language === 'zh'
                                ? `正在为您筛查受法规《${foundReg!.title}》影响的项目，请在右侧查看详细规划与报告。`
                                : `Screening projects affected by regulation "${foundReg!.title}". Please check detailed plan and report on the right.`
                        }])
                        handleScreenRegulation(foundReg!)
                    } else {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: language === 'zh'
                                ? `已找到法规《${foundReg!.title}》。您可以发送"解读"或"筛查"来启动相关分析。`
                                : `Found regulation "${foundReg!.title}". You can send "Interpret" or "Screen" to start analysis.`
                        }])
                        handleViewRegulation(foundReg!)
                    }
                }, 800)
                return
            }
        }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: language === 'zh'
                    ? `正在为您检索与"${text}"相关的法规条文...该功能正在开发中，敬请期待。`
                    : `Searching for regulations related to "${text}"... This feature is under development, please stay tuned.`
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
        const diseaseTerms = regulation.scope.slice(0, 2).join(language === 'zh' ? '、' : ', ')
        const categoryOntology = language === 'zh' ? `[法规本体:${regulation.category}]` : `[Reg Ontology:${regulation.category}]`

        return [
            {
                id: '1',
                title: language === 'zh' ? '法规本体解构与关键信息提取' : 'Reg Ontology Deconstruction & Key Info Extraction',
                description: language === 'zh'
                    ? `解析法规核心要素 → ${categoryOntology}；提取关键病症：${diseaseTerms}；识别核心参数与指标要求`
                    : `Parsing core elements → ${categoryOntology}; Extracting diseases: ${diseaseTerms}; Identifying core parameters`,
                status: 'waiting'
            },
            {
                id: '2',
                title: language === 'zh' ? '本体知识图谱映射' : 'Ontology Knowledge Graph Mapping',
                description: language === 'zh'
                    ? `将法规条款映射至 [适应症本体]、[试验设计本体]、[终点指标本体]；构建法规-实体关联路径`
                    : `Mapping clauses to [Indication], [Design], [Endpoint] ontologies; Building reg-entity paths`,
                status: 'waiting'
            },
            {
                id: '3',
                title: language === 'zh' ? '受影响项目筛查' : 'Affected Projects Screening',
                description: language === 'zh'
                    ? `基于 [项目-适应症-试验阶段] 关系路径，检索可能受影响的在研项目；匹配${regulation.relatedTrialTypes.slice(0, 2).join('、')}类型项目`
                    : `Retrieving affected projects based on [Project-Indication-Phase] paths; Matching ${regulation.relatedTrialTypes.slice(0, 2).join(', ')} types`,
                status: 'waiting'
            },
            {
                id: '4',
                title: language === 'zh' ? '受影响的方案 (Proposal) 筛查' : 'Affected Proposals Screening',
                description: language === 'zh'
                    ? `扫描项目执行方案中的入排标准、终点设计、安全性监测条款；筛选与新法规要求存在差异的方案`
                    : `Scanning inclusion/exclusion, endpoints, safety monitoring in proposals; Filtering non-compliant ones`,
                status: 'waiting'
            },
            {
                id: '5',
                title: language === 'zh' ? '生成筛查报告' : 'Generating Screening Report',
                description: language === 'zh'
                    ? `汇总筛查结果，输出受影响项目与方案清单，为后续合规评估提供数据基础`
                    : `Consolidating results, outputting list of affected projects and proposals`,
                status: 'waiting'
            }
        ]
    }

    // Generate project evaluation steps
    const generateProjectEvaluationSteps = (project: MatchedProject, regulation: Regulation): PlanningStep[] => {
        return [
            {
                id: '1',
                title: language === 'zh' ? '法规本体深度解析' : 'Deep Reg Ontology Analysis',
                description: language === 'zh'
                    ? `解构法规 [${regulation.category}] 核心条款；提取对 ${project.indication} 适应症的具体要求`
                    : `Deconstructing [${regulation.category}] clauses; Extracting requirements for ${project.indication}`,
                status: 'waiting'
            },
            {
                id: '2',
                title: language === 'zh' ? '项目本体映射分析' : 'Project Ontology Mapping',
                description: language === 'zh'
                    ? `解析项目 ${project.id} 的适应症本体、试验阶段本体、终点设计本体；建立项目-法规关联图谱`
                    : `Parsing ${project.id} indication, phase, endpoint ontologies; Building project-reg graph`,
                status: 'waiting'
            },
            {
                id: '3',
                title: language === 'zh' ? '合规差距深入研究' : 'Compliance Gap In-depth Research',
                description: language === 'zh'
                    ? `对比项目当前状态与法规要求；识别入排标准、终点设计、安全监测等维度的差异点`
                    : `Comparing current status with reg requirements; Identifying gaps in criteria, endpoints, etc.`,
                status: 'waiting'
            },
            {
                id: '4',
                title: language === 'zh' ? '影响量化评估' : 'Impact Quantitative Assessment',
                description: language === 'zh'
                    ? `评估合规调整对项目进度、成本、入组的影响；生成风险等级与优先级建议`
                    : `Assessing impact on timeline, cost, enrollment; Generating risk levels and priorities`,
                status: 'waiting'
            },
            {
                id: '5',
                title: language === 'zh' ? '生成项目评估报告' : 'Generating Project Evaluation Report',
                description: language === 'zh'
                    ? `整合分析结果，输出项目合规评估报告，包含具体整改建议与时间线`
                    : `Consolidating analysis results into report with remediation suggestions and timeline`,
                status: 'waiting'
            }
        ]
    }

    // Generate proposal evaluation steps
    const generateProposalEvaluationSteps = (proposal: MatchedProposal, regulation: Regulation): PlanningStep[] => {
        return [
            {
                id: '1',
                title: language === 'zh' ? '法规本体深度解析' : 'Deep Reg Ontology Analysis',
                description: language === 'zh'
                    ? `解构法规 [${regulation.category}] 核心条款；提取对执行方案的具体技术要求`
                    : `Deconstructing [${regulation.category}] clauses; Extracting technical requirements for proposals`,
                status: 'waiting'
            },
            {
                id: '2',
                title: language === 'zh' ? '方案本体映射分析' : 'Proposal Ontology Mapping',
                description: language === 'zh'
                    ? `解析方案 ${proposal.id} (${proposal.version}) 的设计本体；建立方案条款-法规条款对应关系`
                    : `Parsing ${proposal.id} (${proposal.version}) design ontology; Mapping proposal clauses to reg clauses`,
                status: 'waiting'
            },
            {
                id: '3',
                title: language === 'zh' ? '条款级差异深入研究' : 'Clause-level Gap Research',
                description: language === 'zh'
                    ? `逐条对比方案内容与法规要求；标记需修订的具体章节与条款`
                    : `Comparing proposal content with reg requirements item by item; Marking chapters for revision`,
                status: 'waiting'
            },
            {
                id: '4',
                title: language === 'zh' ? '修订工作量评估' : 'Revision Workload Assessment',
                description: language === 'zh'
                    ? `评估方案修订范围、审批流程影响、中心通知要求；生成修订优先级`
                    : `Assessing revision scope, approval impact, site notification needs; Generating priorities`,
                status: 'waiting'
            },
            {
                id: '5',
                title: language === 'zh' ? '生成方案评估报告' : 'Generating Proposal Evaluation Report',
                description: language === 'zh'
                    ? `整合分析结果，输出方案修订建议报告，包含具体修改点与版本升级计划`
                    : `Consolidating analysis results into revision report with specific changes and update plans`,
                status: 'waiting'
            }
        ]
    }

    const handleScreenRegulation = (record: Regulation) => {
        setCurrentRegulation(record)
        setPlanningSteps(generateScreeningSteps(record))
        setViewState('screening')
        setThinkingText(language === 'zh'
            ? "正在深度解析法规文本结构与核心条款，基于 SMO 本体知识图谱建立法规-项目关联映射。系统正在启动筛查算子，逐一扫描在研项目与执行方案，识别可能受该法规影响的对象……"
            : "Parsing reg structure and core clauses, building reg-project mappings based on SMO Ontology. Starting screening operators to scan projects and proposals...")
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleEvaluateProject = (project: MatchedProject) => {
        if (!currentRegulation) return
        setEvaluatingProject(project)
        setPlanningSteps(generateProjectEvaluationSteps(project, currentRegulation))
        setViewState('evaluatingProject')
        setThinkingText(language === 'zh'
            ? `正在深度解析法规对项目 ${project.name} 的影响。系统正在建立项目本体与法规本体的关联图谱，逐层分析合规差距与潜在风险……`
            : `Deeply analyzing impact of reg on project ${project.name}. Building project-reg graph to analyze gaps and risks...`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleEvaluateProposal = (proposal: MatchedProposal) => {
        if (!currentRegulation) return
        setEvaluatingProposal(proposal)
        setPlanningSteps(generateProposalEvaluationSteps(proposal, currentRegulation))
        setViewState('evaluatingProposal')
        setThinkingText(language === 'zh'
            ? `正在深度解析法规对方案 ${proposal.name} 的影响。系统正在建立方案条款与法规条款的对应关系，逐条分析需要修订的内容……`
            : `Deeply analyzing impact of reg on proposal ${proposal.name}. Mapping proposal clauses to reg clauses to identify revisions...`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    // Generate interpretation steps
    const generateInterpretationSteps = (regulation: Regulation): PlanningStep[] => {
        return [
            {
                id: '1',
                title: language === 'zh' ? '法规文本深入思考' : 'Deep Reg Text Reflection',
                description: language === 'zh'
                    ? `系统正在对法规《${regulation.title.slice(0, 20)}...》进行语义解构，识别核心条款、定义术语、适用范围边界`
                    : `Semantically deconstructing "${regulation.title.slice(0, 20)}..."; Identifying core clauses, terms, and scope`,
                status: 'waiting'
            },
            {
                id: '2',
                title: language === 'zh' ? '搜索关联信息' : 'Searching Related Info',
                description: language === 'zh'
                    ? `检索本体知识库中的关联法规、历史版本对比、行业案例；匹配 [${regulation.category}] 领域的最佳实践`
                    : `Retrieving related regs, version history, and industry cases; Matching best practices in [${regulation.category}]`,
                status: 'waiting'
            },
            {
                id: '3',
                title: language === 'zh' ? '评估影响范围' : 'Assessing Impact Scope',
                description: language === 'zh'
                    ? `分析法规对 CRO 业务链条的影响：项目立项、方案设计、中心选择、数据管理、统计分析等环节`
                    : `Analyzing impact on CRO chain: Startup, Design, Site Selection, DM, Stats, etc.`,
                status: 'waiting'
            },
            {
                id: '4',
                title: language === 'zh' ? '生成解读报告' : 'Generating Interpretation Report',
                description: language === 'zh'
                    ? `整合分析洞察，输出法规深度解读报告，包含核心要点摘要、实操指南、合规检查清单`
                    : `Consolidating insights into deep interpretation report with summaries, guides, and checklists`,
                status: 'waiting'
            }
        ]
    }

    const handleInterpretRegulation = (record: Regulation) => {
        setCurrentRegulation(record)
        setPlanningSteps(generateInterpretationSteps(record))
        setViewState('interpreting')
        setThinkingText(language === 'zh'
            ? "正在启动法规深度解读引擎，调用 SMO 本体知识图谱进行语义解构。系统将结合历史法规演变、行业最佳实践，为您生成专业的法规解读报告……"
            : "Starting deep interpretation engine, using SMO Ontology for semantic deconstruction. Generating professional report combined with history and best practices...")
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

    const handleBatchEvaluateProjects = () => {
        if (!currentRegulation || selectedProjectKeys.length === 0) return
        const projects = mockMatchedProjects.filter((p: MatchedProject) => selectedProjectKeys.includes(p.key))
        setBatchEvaluatingProjects(projects)
        setEvaluatingProject(null) // Clear single selection
        // Use the first project for the planning step title or a generic one
        setPlanningSteps(generateProjectEvaluationSteps(projects[0], currentRegulation))
        // We'll treat the viewState as 'evaluatingProject' but handle batch rendering
        setViewState('evaluatingProject')
        setThinkingText(language === 'zh'
            ? `正在批量解析 ${projects.length} 个项目的合规性。系统正在建立项目本体与法规本体的关联图谱，逐层分析合规差距与潜在风险……`
            : `Batch analyzing compliance for ${projects.length} projects. Building project-reg graph to analyze gaps and risks...`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

    const handleBatchEvaluateProposals = () => {
        if (!currentRegulation || selectedProposalKeys.length === 0) return
        const proposals = mockMatchedProposals.filter((p: MatchedProposal) => selectedProposalKeys.includes(p.key))
        setBatchEvaluatingProposals(proposals)
        setEvaluatingProposal(null) // Clear single selection
        setPlanningSteps(generateProposalEvaluationSteps(proposals[0], currentRegulation))
        setViewState('evaluatingProposal')
        setThinkingText(language === 'zh'
            ? `正在批量解析 ${proposals.length} 个方案的合规性。系统正在建立方案条款与法规条款的对应关系，逐条分析需要修订的内容……`
            : `Batch analyzing compliance for ${proposals.length} proposals. Mapping proposal clauses to reg clauses to identify revisions...`)
        setIsThinking(true)
        setDisplayedThinkingText('')
        setStepIndex(0)
    }

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
            title: language === 'zh' ? '法规名称' : 'Regulation Name', dataIndex: 'title', key: 'title',
            render: (text: string, record: Regulation) => (
                <div className="max-w-[320px]">
                    <Text strong className="text-gray-800 hover:text-blue-600 cursor-pointer text-xs leading-tight block" onClick={() => handleViewRegulation(record)}>{text}</Text>
                </div>
            ),
        },
        { title: language === 'zh' ? '发布日期' : 'Publish Date', dataIndex: 'publishDate', key: 'publishDate', width: 110, render: (text: string) => <Text type="secondary" className="text-xs">{text}</Text>, sorter: (a: Regulation, b: Regulation) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime(), defaultSortOrder: 'descend' as const },
        { title: language === 'zh' ? '来源' : 'Source', dataIndex: 'source', key: 'source', width: 100, render: (_: string, record: Regulation) => <Tag color={getSourceColor(record.sourceCode)} className="text-xs">{record.sourceCode}</Tag>, filters: [{ text: language === 'zh' ? 'NMPA 中国' : 'NMPA China', value: 'NMPA' }, { text: language === 'zh' ? 'FDA 美国' : 'FDA US', value: 'FDA' }, { text: language === 'zh' ? 'EMA 欧洲' : 'EMA Europe', value: 'EMA' }, { text: language === 'zh' ? 'PMDA 日本' : 'PMDA Japan', value: 'PMDA' }, { text: language === 'zh' ? 'ICH 国际' : 'ICH International', value: 'ICH' }], onFilter: (value: any, record: Regulation) => record.sourceCode === value },
        { title: language === 'zh' ? '分类' : 'Category', dataIndex: 'category', key: 'category', width: 90, render: (text: string) => <Tag className="text-xs">{text}</Tag> },
        { title: language === 'zh' ? '状态' : 'Status', dataIndex: 'status', key: 'status', width: 70, render: (status: string) => { const config = { active: { color: 'green', text: language === 'zh' ? '现行' : 'Active' }, updated: { color: 'orange', text: language === 'zh' ? '已修订' : 'Updated' }, pending: { color: 'cyan', text: language === 'zh' ? '待生效' : 'Pending' } }; const { color, text } = config[status as keyof typeof config] || { color: 'default', text: status }; return <Badge color={color} text={<span className="text-xs">{text}</span>} /> } },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', width: 150, render: (_: any, record: Regulation) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewRegulation(record)}>{language === 'zh' ? '查看' : 'View'}</Button><Button type="link" size="small" className="p-0 text-xs text-blue-500" icon={<BulbOutlined />} onClick={() => handleInterpretRegulation(record)}>{language === 'zh' ? '解读' : 'Interpret'}</Button><Button type="link" size="small" className="p-0 text-xs text-orange-500" icon={<AlertOutlined />} onClick={() => handleScreenRegulation(record)}>{language === 'zh' ? '筛查' : 'Screen'}</Button></Space> },
    ]

    // Project list columns for screening report
    const projectColumns = [
        { title: language === 'zh' ? '项目编号' : 'Project ID', dataIndex: 'id', key: 'id', width: 120, render: (text: string, record: MatchedProject) => <Text strong className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleViewProject(record)}>{text}</Text> },
        { title: language === 'zh' ? '项目名称' : 'Project Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text className="text-xs">{text}</Text> },
        { title: language === 'zh' ? '阶段' : 'Phase', dataIndex: 'phase', key: 'phase', width: 70, render: (text: string) => <Tag color="blue" className="text-xs">{text}</Tag> },
        { title: language === 'zh' ? '命中关键词' : 'Hit Keywords', dataIndex: 'matchedKeywords', key: 'matchedKeywords', width: 180, render: (keywords: string[]) => <div className="flex flex-wrap gap-1">{keywords.map((kw, i) => <Tag key={i} color="orange" className="text-xs">{kw}</Tag>)}</div> },
        { title: language === 'zh' ? '匹配度' : 'Matching', dataIndex: 'matchScore', key: 'matchScore', width: 80, render: (score: number) => <Badge color={score >= 90 ? 'red' : score >= 80 ? 'orange' : 'blue'} text={<span className="text-xs font-bold">{score}%</span>} /> },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', width: 110, render: (_: any, record: MatchedProject) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewProject(record)}>{language === 'zh' ? '查看' : 'View'}</Button><Button type="link" size="small" className="p-0 text-xs text-green-600" icon={<AimOutlined />} onClick={() => handleEvaluateProject(record)}>{language === 'zh' ? '评估' : 'Evaluate'}</Button></Space> },
    ]

    // Proposal list columns for screening report
    const proposalColumns = [
        { title: language === 'zh' ? '方案编号' : 'Proposal ID', dataIndex: 'id', key: 'id', width: 140, render: (text: string, record: MatchedProposal) => <Text strong className="text-xs text-purple-600 hover:text-purple-800 cursor-pointer" onClick={() => handleViewProposal(record)}>{text}</Text> },
        { title: language === 'zh' ? '方案名称' : 'Proposal Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text className="text-xs">{text}</Text> },
        { title: language === 'zh' ? '版本' : 'Version', dataIndex: 'version', key: 'version', width: 60, render: (text: string) => <Tag className="text-xs">{text}</Tag> },
        { title: language === 'zh' ? '命中关键词' : 'Hit Keywords', dataIndex: 'matchedKeywords', key: 'matchedKeywords', width: 180, render: (keywords: string[]) => <div className="flex flex-wrap gap-1">{keywords.map((kw, i) => <Tag key={i} color="purple" className="text-xs">{kw}</Tag>)}</div> },
        { title: language === 'zh' ? '匹配度' : 'Matching', dataIndex: 'matchScore', key: 'matchScore', width: 80, render: (score: number) => <Badge color={score >= 90 ? 'red' : score >= 80 ? 'orange' : 'purple'} text={<span className="text-xs font-bold">{score}%</span>} /> },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', width: 110, render: (_: any, record: MatchedProposal) => <Space size="small"><Button type="link" size="small" className="p-0 text-xs" icon={<EyeOutlined />} onClick={() => handleViewProposal(record)}>{language === 'zh' ? '查看' : 'View'}</Button><Button type="link" size="small" className="p-0 text-xs text-green-600" icon={<AimOutlined />} onClick={() => handleEvaluateProposal(record)}>{language === 'zh' ? '评估' : 'Evaluate'}</Button></Space> },
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
                            <Text strong className="text-orange-700">{language === 'zh' ? 'AI 正在解析' : 'AI Analyzing'}</Text>
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
                            <Title level={5} style={{ margin: 0 }}><Space><AlertOutlined className="text-orange-500" />{language === 'zh' ? '执行流程' : 'Execution Flow'}</Space></Title>
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
                        <Text strong className="text-lg">{t('assessmentReport')}</Text>
                    </div>
                    <Tag color="orange">{language === 'zh' ? '中等风险' : 'Medium Risk'}</Tag>
                </div>
                <Paragraph className="text-sm text-gray-600 mb-2">
                    {language === 'zh' ? '项目' : 'Project'} <Text strong>{project.id}</Text> - {project.name}
                </Paragraph>
                <Paragraph className="text-sm text-gray-600 mb-0">
                    {language === 'zh' ? '评估法规' : 'Evaluating Reg'}: 《{regulation.title}》
                </Paragraph>
            </div>

            {/* Risk Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-red-600">2</div><Text type="secondary" className="text-xs">{t('highRisk')}</Text></div>
                <div className="bg-orange-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-orange-600">3</div><Text type="secondary" className="text-xs">{t('mediumRisk')}</Text></div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-yellow-600">4</div><Text type="secondary" className="text-xs">{t('lowRisk')}</Text></div>
                <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-green-600">5</div><Text type="secondary" className="text-xs">{t('compliant')}</Text></div>
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    {/* Compliance Gap Analysis */}
                    <Card size="small" title={<><AlertOutlined className="text-red-500 mr-2" />{t('clausesAnalysis')}</>} className="mb-4">
                        <div className="space-y-2">
                            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">{language === 'zh' ? '入排标准不符合' : 'Inclusion/Exclusion Non-compliant'}</Text><Tag color="red">{language === 'zh' ? '高' : 'High'}</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">{language === 'zh' ? '调整' : 'Adjust'}</Tag>{language === 'zh' ? 'ECOG PS 要求 0-2 → 0-1；当前方案允许 PS=2 患者入组' : 'ECOG PS 0-2 → 0-1; current protocol allows PS=2'}</Text>
                                <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">{language === 'zh' ? '新增' : 'New'}</Tag>{language === 'zh' ? '要求基线 ctDNA 检测；当前方案无此要求' : 'Requires baseline ctDNA; current protocol missing'}</Text>
                            </div>
                            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">{language === 'zh' ? '主要终点设计需调整' : 'Primary Endpoint Adjustment'}</Text><Tag color="red">{language === 'zh' ? '高' : 'High'}</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">{language === 'zh' ? '调整' : 'Adjust'}</Tag>{language === 'zh' ? 'PFS 评估窗 8周±7天 → 6周±3天；当前设计超出允许范围' : 'PFS window 8w±7d → 6w±3d; current exceeds range'}</Text>
                                <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">{language === 'zh' ? '新增' : 'New'}</Tag>{language === 'zh' ? '需引入 IRC 独立评估；当前仅有研究者评估' : 'Requires IRC; current only Investigator assessment'}</Text>
                            </div>
                            <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                                <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">{language === 'zh' ? '安全性监测待更新' : 'Safety Monitoring Update'}</Text><Tag color="orange">{t('mediumRisk')}</Tag></div>
                                <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">{language === 'zh' ? '调整' : 'Adjust'}</Tag>{language === 'zh' ? 'SAE 报告时限 72h → 24h；当前 SOP 需同步修订' : 'SAE reporting 72h → 24h; SOP needs revision'}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    {/* Impact Assessment */}
                    <Card size="small" title={<><BarChartOutlined className="text-blue-500 mr-2" />{t('impactAssessment')}</>} className="mb-4">
                        <div className="space-y-3">
                            <div><Text className="text-xs text-gray-500">{language === 'zh' ? '进度影响' : 'Timeline Impact'}</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }} /></div><Text className="text-xs">{language === 'zh' ? '延期 2-3 月' : 'Delay 2-3 months'}</Text></div></div>
                            <div><Text className="text-xs text-gray-500">{language === 'zh' ? '成本影响' : 'Cost Impact'}</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }} /></div><Text className="text-xs">+15%</Text></div></div>
                            <div><Text className="text-xs text-gray-500">{language === 'zh' ? '入组影响' : 'Enrollment Impact'}</Text><div className="flex items-center gap-2"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} /></div><Text className="text-xs">{language === 'zh' ? '暂停 1 月' : 'Pause 1 month'}</Text></div></div>
                            <Divider className="my-2" />
                            <div className="flex items-center justify-between"><Text strong className="text-sm">{language === 'zh' ? '综合风险等级' : 'Overall Risk Level'}</Text><Tag color="orange">{language === 'zh' ? '中等' : 'Medium'}</Tag></div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Rectification Plan */}
            <Card size="small" title={<><AimOutlined className="text-green-500 mr-2" />{t('remediationPlan')}</>} className="mb-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="red">P0</Tag><span className="text-sm">{language === 'zh' ? '修订入排标准并提交伦理' : 'Revise criteria & submit to EC'}</span></div><Text type="secondary" className="text-xs">7 {language === 'zh' ? '工作日' : 'Workdays'}</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="red">P0</Tag><span className="text-sm">{language === 'zh' ? '调整主要终点评估方法' : 'Adjust primary endpoint method'}</span></div><Text type="secondary" className="text-xs">14 {language === 'zh' ? '工作日' : 'Workdays'}</Text></div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded"><div className="flex items-center gap-2"><Tag color="orange">P1</Tag><span className="text-sm">{language === 'zh' ? '更新安全性监测 SOP' : 'Update safety monitoring SOP'}</span></div><Text type="secondary" className="text-xs">10 {language === 'zh' ? '工作日' : 'Workdays'}</Text></div>
                </div>
            </Card>

            {/* Recommendations */}
            <Card size="small" title={<><BulbOutlined className="text-yellow-500 mr-2" />{t('aiRecommendations')}</>} className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="space-y-2">
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" /><Text className="text-sm"><Text strong>{language === 'zh' ? '紧急' : 'Urgent'}:</Text> {language === 'zh' ? '建议立即暂停新受试者入组，待入排标准修订完成后恢复' : 'Recommend pauing enrollment until criteria revision complete'}</Text></div>
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" /><Text className="text-sm"><Text strong>{language === 'zh' ? '重要' : 'Important'}:</Text> {language === 'zh' ? '需与申办方沟通终点调整对统计分析计划的影响' : 'Need to discuss endpoint impact on SAP with Sponsor'}</Text></div>
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
                        <Text strong className="text-lg">{t('assessmentReport')}</Text>
                    </div>
                    <Tag color="orange">{t('mustRevise')}</Tag>
                </div>
                <Paragraph className="text-sm text-gray-600 mb-2">
                    {language === 'zh' ? '方案' : 'Proposal'} <Text strong>{proposal.id}</Text> ({proposal.version}) - {proposal.name}
                </Paragraph>
                <Paragraph className="text-sm text-gray-600 mb-0">
                    {language === 'zh' ? '评估法规' : 'Evaluating Reg'}: 《{regulation.title}》
                </Paragraph>
            </div>

            {/* Revision Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-red-600">3</div><Text type="secondary" className="text-xs">{t('mustRevise')}</Text></div>
                <div className="bg-orange-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-orange-600">2</div><Text type="secondary" className="text-xs">{t('suggestedRevise')}</Text></div>
                <div className="bg-blue-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-blue-600">12</div><Text type="secondary" className="text-xs">{language === 'zh' ? '涉及页面' : 'Pages'}</Text></div>
                <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-xl font-bold text-green-600">8</div><Text type="secondary" className="text-xs">{t('noImpact')}</Text></div>
            </div>

            {/* Clause-level Analysis */}
            <Card size="small" title={<><FileTextOutlined className="text-purple-500 mr-2" />{t('clausesAnalysis')}</>} className="mb-4">
                <div className="space-y-2">
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-1"><Text strong className="text-sm">{language === 'zh' ? '第4章 入排标准' : 'Chapter 4: Inclusion/Exclusion'}</Text><Tag color="red">{t('mustRevise')}</Tag></div>
                        <Text type="secondary" className="text-xs block"><Tag color="red" className="mr-1">{language === 'zh' ? '调整' : 'Adjust'}</Tag>{language === 'zh' ? '4.2.1 年龄限制：需放宽至 12-17 岁青少年' : '4.2.1 Age: relax to 12-17 years old'}</Text>
                        <Text type="secondary" className="text-xs block"><Tag color="purple" className="mr-1">{language === 'zh' ? '新增' : 'New'}</Tag>{language === 'zh' ? '4.3.5 排除标准：新增既往免疫治疗史限制' : '4.3.5 Exclusion: add previous immunotherapy restriction'}</Text>
                    </div>
                </div>
            </Card>

            <Row gutter={16}>
                <Col span={12}>
                    {/* Related Document Impact */}
                    <Card size="small" title={<><LinkOutlined className="text-blue-500 mr-2" />{t('relatedDocImpact')}</>} className="mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">{language === 'zh' ? '知情同意书 (ICF)' : 'ICF'}</span><Text type="secondary" className="text-xs">{language === 'zh' ? '需更新风险告知章节' : 'Update risk disclosure'}</Text></div>
                                <Tag color="red">{t('mustRevise')}</Tag>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex flex-col"><span className="text-sm">{language === 'zh' ? '病例报告表 (CRF)' : 'CRF'}</span><Text type="secondary" className="text-xs">{language === 'zh' ? '无需变更字段' : 'No changes'}</Text></div>
                                <Tag color="green">{t('noImpact')}</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    {/* Revision Time & Cost Estimation */}
                    <Card size="small" title={<><HourglassOutlined className="text-blue-500 mr-2" />{t('resourceEstimation')}</>} className="mb-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{language === 'zh' ? '医学撰写 (MW)' : 'Med Writing (MW)'}</span>
                                <div className="text-right"><Text strong>24 {language === 'zh' ? '小时' : 'Hours'}</Text><div className="text-xs text-gray-400">{language === 'zh' ? '约 3 人天' : '~3 Mandays'}</div></div>
                            </div>
                            <Divider className="my-2" />
                            <div className="bg-gray-50 p-2 rounded">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-600">{language === 'zh' ? '预计修订周期' : 'Est. Revision Cycle'}</span>
                                    <Text strong className="text-sm">11 {language === 'zh' ? '天' : 'Days'}</Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">{language === 'zh' ? '预估内部成本' : 'Est. Internal Cost'}</span>
                                    <Text type="warning" strong className="text-sm">¥ 12,500</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* AI Recommendations */}
            <Card size="small" title={<><BulbOutlined className="text-yellow-500 mr-2" />{t('aiRecommendations')}</>} className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="space-y-2">
                    <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" /><Text className="text-sm"><Text strong>{language === 'zh' ? '优先修订' : 'Priority'}:</Text> {language === 'zh' ? '建议优先修订第4章入排标准，对进行中的入组影响最大' : 'Prioritize Ch4 revision as it impacts ongoing enrollment most'}</Text></div>
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
                        <div className="flex items-center space-x-2"><AuditOutlined className="text-blue-500" /><span>{language === 'zh' ? '法规库' : 'Regulations Library'}</span><Tag color="blue">{mockRegulations.length} {language === 'zh' ? '条法规' : 'Regulations'}</Tag></div>
                        <Text type="secondary" className="text-xs">{language === 'zh' ? '最后更新' : 'Last Updated'}: 2026-01-19</Text>
                    </div>
                } bodyStyle={{ padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    <Table dataSource={mockRegulations} columns={columns} pagination={{ pageSize: 10, showSizeChanger: false, showQuickJumper: true, showTotal: (total) => language === 'zh' ? `共 ${total} 条法规` : `Total ${total} regulations`, size: 'small' }} size="small" rowClassName="hover:bg-blue-50/30 cursor-pointer transition-colors" />
                </Card>
            )
        }

        if (viewState === 'screening' && currentRegulation) {
            return renderPlanningSteps(language === 'zh' ? `筛查 ${currentRegulation.title.slice(0, 20)}...` : `Screening ${currentRegulation.title.slice(0, 20)}...`, language === 'zh' ? '筛查执行中' : 'Screening in progress')
        }

        if (viewState === 'evaluatingProject' && currentRegulation && (evaluatingProject || batchEvaluatingProjects.length > 0)) {
            const title = evaluatingProject
                ? (language === 'zh' ? `评估项目: ${evaluatingProject.name.slice(0, 15)}...` : `Eval Project: ${evaluatingProject.name.slice(0, 15)}...`)
                : (language === 'zh' ? `批量评估项目 (共${batchEvaluatingProjects.length}个)...` : `Batch Eval Projects (${batchEvaluatingProjects.length})...`)
            return renderPlanningSteps(title, language === 'zh' ? '评估执行中' : 'Evaluation in progress')
        }

        if (viewState === 'evaluatingProposal' && currentRegulation && (evaluatingProposal || batchEvaluatingProposals.length > 0)) {
            const title = evaluatingProposal
                ? (language === 'zh' ? `评估方案: ${evaluatingProposal.name.slice(0, 15)}...` : `Eval Proposal: ${evaluatingProposal.name.slice(0, 15)}...`)
                : (language === 'zh' ? `批量评估方案 (共${batchEvaluatingProposals.length}个)...` : `Batch Eval Proposals (${batchEvaluatingProposals.length})...`)
            return renderPlanningSteps(title, language === 'zh' ? '评估执行中' : 'Evaluation in progress')
        }

        if (viewState === 'screeningReport' && currentRegulation) {
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToList} />
                            <FileTextOutlined className="text-green-500" />
                            <span className="text-sm">{t('screeningReport')}: {currentRegulation.title.slice(0, 18)}...</span>
                        </div>
                        <Space><Badge status="success" text={t('screeningComplete')} /><Button size="small" icon={<ShareAltOutlined />}>{t('share')}</Button><Button size="small" type="primary">{t('exportPDF')}</Button></Space>
                    </div>
                } bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)', overflow: 'auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckCircleOutlined className="text-green-500 text-lg" />
                                <Text strong className="text-base">{language === 'zh' ? '法规影响筛查报告' : 'Reg Impact Screening Report'}</Text>
                            </div>
                            <Paragraph className="text-sm text-gray-600 mb-0">
                                {language === 'zh'
                                    ? `针对《${currentRegulation.title}》的影响筛查已完成。共筛查出`
                                    : `Impact screening for "${currentRegulation.title}" complete. Found`} <Text strong className="text-orange-600">{mockMatchedProjects.length}</Text> {language === 'zh' ? '个可能受影响的项目和' : 'affected projects and'} <Text strong className="text-purple-600">{mockMatchedProposals.length}</Text> {language === 'zh' ? '个可能受影响的方案。' : 'affected proposals.'}
                            </Paragraph>
                        </div>

                        <Tabs defaultActiveKey="projects" items={[
                            {
                                key: 'projects',
                                label: <span><ProjectOutlined /> {t('affectedProjects')} ({mockMatchedProjects.length})</span>,
                                children: (
                                    <div className="space-y-2">
                                        <div className="flex justify-end">
                                            <Button type="primary" size="small" disabled={selectedProjectKeys.length === 0} onClick={handleBatchEvaluateProjects} icon={<AimOutlined />}>
                                                {t('batchEvaluate')} ({selectedProjectKeys.length})
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
                                label: <span><SolutionOutlined /> {t('affectedProposals')} ({mockMatchedProposals.length})</span>,
                                children: (
                                    <div className="space-y-2">
                                        <div className="flex justify-end">
                                            <Button type="primary" size="small" disabled={selectedProposalKeys.length === 0} onClick={handleBatchEvaluateProposals} icon={<AimOutlined />}>
                                                {t('batchEvaluate')} ({selectedProposalKeys.length})
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
                                <span className="text-sm font-bold">{t('assessmentReport')} {projectsToRender.length > 1 ? `(${language === 'zh' ? `共${projectsToRender.length}份` : `Total ${projectsToRender.length}`})` : ''}</span>
                            </div>
                        </div>
                        <Space><Badge status="success" text={t('evaluatingComplete')} /><Button size="small" icon={<ShareAltOutlined />}>{t('share')}</Button><Button size="small" type="primary">{t('exportPDF')}</Button></Space>
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
                                <span className="text-sm font-bold">{t('assessmentReport')} {proposalsToRender.length > 1 ? `(${language === 'zh' ? `共${proposalsToRender.length}份` : `Total ${proposalsToRender.length}`})` : ''}</span>
                            </div>
                        </div>
                        <Space><Badge status="success" text={t('evaluatingComplete')} /><Button size="small" icon={<ShareAltOutlined />}>{t('share')}</Button><Button size="small" type="primary">{t('exportPDF')}</Button></Space>
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
            return renderPlanningSteps(language === 'zh' ? `解读《${currentRegulation.title.slice(0, 18)}...》` : `Interpreting "${currentRegulation.title.slice(0, 18)}..."`, language === 'zh' ? '解读执行中' : 'Interpretation in progress')
        }

        if (viewState === 'interpretReport' && currentRegulation) {
            return (
                <Card bordered={false} className="glass-card h-full overflow-hidden" title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button type="text" icon={<ArrowLeftOutlined />} size="small" onClick={handleBackToList} />
                            <ReadOutlined className="text-blue-500" />
                            <span className="text-sm">{language === 'zh' ? '法规解读报告' : 'Regulation Interpretation Report'}</span>
                        </div>
                        <Space><Badge status="success" text={t('interpretingComplete')} /><Button size="small" icon={<ShareAltOutlined />}>{t('share')}</Button><Button size="small" type="primary">{t('exportPDF')}</Button></Space>
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
                                <span><CalendarOutlined className="mr-1" />{language === 'zh' ? '发布' : 'Published'}: {currentRegulation.publishDate}</span>
                                <span><CheckCircleOutlined className="mr-1" />{language === 'zh' ? '生效' : 'Effective'}: {currentRegulation.effectiveDate}</span>
                                <span>{language === 'zh' ? '文号' : 'Doc No'}: {currentRegulation.documentNumber}</span>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <Card size="small" title={<><ThunderboltOutlined className="text-yellow-500 mr-2" />{t('coreInsights')}</>} className="mb-4">
                            <Paragraph className="text-sm text-gray-700 mb-3">{currentRegulation.summary}</Paragraph>
                            <div className="grid grid-cols-6 gap-3 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-blue-600">{currentRegulation.keyPoints.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '核心要点' : 'Key Points'}</Text>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-green-600">{currentRegulation.scope.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '适用范围' : 'Scope'}</Text>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-orange-600">{currentRegulation.impactAreas.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '影响领域' : 'Impact Areas'}</Text>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-purple-600">{currentRegulation.relatedTrialTypes.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '试验类型' : 'Trial Types'}</Text>
                                </div>
                                <div className="bg-cyan-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-cyan-600">{currentRegulation.attachments.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '相关附件' : 'Attachments'}</Text>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg text-center">
                                    <div className="text-xl font-bold text-red-600">{mockMatchedProjects.length}</div>
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? '潜在影响项目' : 'Affected Projects'}</Text>
                                </div>
                            </div>
                            <Divider className="my-3" />
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">{language === 'zh' ? '法规分类' : 'Category'}</div>
                                    <Tag color="blue">{currentRegulation.category}</Tag>
                                </Col>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">{language === 'zh' ? '发布来源' : 'Source'}</div>
                                    <Tag color={getSourceColor(currentRegulation.sourceCode)}>{currentRegulation.source}</Tag>
                                </Col>
                                <Col span={8}>
                                    <div className="text-xs text-gray-500 mb-1">{language === 'zh' ? '法规状态' : 'Status'}</div>
                                    <Tag color={currentRegulation.status === 'active' ? 'green' : 'orange'}>{currentRegulation.status === 'active' ? (language === 'zh' ? '现行有效' : 'Active') : (language === 'zh' ? '已修订' : 'Revised')}</Tag>
                                </Col>
                            </Row>
                        </Card>

                        <Row gutter={16}>
                            <Col span={12}>
                                {/* Key Changes - Specific Values */}
                                <Card size="small" title={<><ThunderboltOutlined className="text-red-500 mr-2" />{t('keyChanges')}<Tag color="red" className="ml-2">{language === 'zh' ? '需特别注意' : 'Priority'}</Tag></>} className="mb-4">
                                    <div className="space-y-2">
                                        <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                            <Text strong className="text-sm block">{language === 'zh' ? 'PFS 评估时间窗' : 'PFS Window'}</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>8{language === 'zh' ? '周' : 'w'} ± 7{language === 'zh' ? '天' : 'd'}</Tag><span className="text-gray-400">→</span><Tag color="red">6{language === 'zh' ? '周' : 'w'} ± 3{language === 'zh' ? '天' : 'd'}</Tag></div>
                                        </div>
                                        <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-500">
                                            <Text strong className="text-sm block">{language === 'zh' ? 'SAE 报告时限' : 'SAE Reporting'}</Text>
                                            <div className="flex items-center gap-2 mt-1"><Tag>72{language === 'zh' ? '小时' : 'h'}</Tag><span className="text-gray-400">→</span><Tag color="orange">24{language === 'zh' ? '小时' : 'h'}</Tag></div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                {/* Process Changes */}
                                <Card size="small" title={<><DeploymentUnitOutlined className="text-purple-500 mr-2" />{t('processChanges')}</>} className="mb-4">
                                    <div className="space-y-2">
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">{language === 'zh' ? '新增 | 独立影像评估' : 'New | IRC'}</Text>
                                            <Text className="text-xs text-gray-600 block">{language === 'zh' ? 'III期试验必须引入 IRC 独立评估' : 'Phase III must include IRC'}</Text>
                                        </div>
                                        <div className="p-2 bg-purple-50 rounded">
                                            <Text strong className="text-xs">{language === 'zh' ? '调整 | 知情同意流程' : 'Adjust | Consent'}</Text>
                                            <Text className="text-xs text-gray-600 block">{language === 'zh' ? '新增电子签名要求，支持远程知情' : 'E-signature for remote consent'}</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Specific Metrics Table */}
                        <Card size="small" title={<><BarChartOutlined className="text-blue-500 mr-2" />{t('metricsTable')}</>} className="mb-4">
                            <Table size="small" pagination={false} dataSource={[
                                { key: '1', item: language === 'zh' ? '主要终点 ORR 阈值' : 'Primary Endpoint ORR', oldVal: '≥30%', newVal: '≥35%', impact: language === 'zh' ? '高' : 'High' },
                                { key: '2', item: language === 'zh' ? 'DLT 观察期' : 'DLT Observation', oldVal: '21天', newVal: '28天', impact: language === 'zh' ? '中' : 'Med' },
                            ]} columns={[
                                { title: language === 'zh' ? '评估项目' : 'Item', dataIndex: 'item', key: 'item', render: (t: string) => <Text className="text-xs">{t}</Text> },
                                { title: language === 'zh' ? '原要求' : 'Old', dataIndex: 'oldVal', key: 'oldVal', render: (t: string) => <Tag className="text-xs">{t}</Tag> },
                                { title: language === 'zh' ? '新要求' : 'New', dataIndex: 'newVal', key: 'newVal', render: (t: string) => <Tag color="blue" className="text-xs">{t}</Tag> },
                                { title: language === 'zh' ? '影响' : 'Impact', dataIndex: 'impact', key: 'impact', render: (t: string) => <Tag color={t === '高' || t === 'High' ? 'red' : 'orange'} className="text-xs">{t}</Tag> },
                            ]} />
                        </Card>

                        {/* Attention Items */}
                        <Card size="small" title={<><AlertOutlined className="text-orange-500 mr-2" />{t('attentionItems')}</>} className="mb-4 border-orange-200 bg-orange-50/30">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 p-2 bg-white rounded"><Tag color="red">{language === 'zh' ? '重要' : 'Important'}</Tag><Text className="text-sm flex-1">{language === 'zh' ? '新法规要求所有 EGFR/ALK 阳性患者必须提供基线 ctDNA 检测报告' : 'New reg requires baseline ctDNA for all EGFR/ALK positive patients'}</Text></div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="mt-4 flex gap-3">
                            <Button type="primary" icon={<AlertOutlined />} onClick={() => handleScreenRegulation(currentRegulation)}>{t('screenAffected')}</Button>
                            <Button icon={<LinkOutlined />} onClick={() => window.open(currentRegulation.officialUrl, '_blank')}>{t('viewOriginal')}</Button>
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
                    <Card bordered={false} className="flex flex-col glass-card h-full" title={<div className="flex items-center space-x-2"><RobotOutlined className="text-blue-500" /><span>{t('regReviewAssistant')}</span></div>} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 12px' }}>
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
                                <TextArea value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={t('inputPlaceholder')} autoSize={{ minRows: 1, maxRows: 4 }} onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleSend() } }} className="rounded-lg" />
                                <Button type="primary" icon={<SendOutlined />} onClick={() => handleSend()} loading={isProcessing} className="rounded-lg h-auto" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '解读法规《E6(R3) Good Clinical Practice: Modernized GCP for Clinical Electronic Systems》' : 'Interpret ICH E6(R3)')}>{language === 'zh' ? '解读 ICH E6(R3)' : 'Interpret ICH E6(R3)'}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '筛查法规《抗肿瘤药物临床试验终点技术指导原则（2025年修订版）》' : 'Screen Oncology Endpoints')}>{language === 'zh' ? '筛查 抗肿瘤终点' : 'Screen Oncology Endpoints'}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '筛查法规《以患者为中心的药物临床试验设计技术指导原则》' : 'Screen Patient Centered')}>{language === 'zh' ? '筛查 患者中心' : 'Screen Patient Centered'}</Tag>
                                <Tag className="cursor-pointer hover:bg-gray-100" onClick={() => handleSend(language === 'zh' ? '筛查法规《真实世界证据支持药物研发的技术指导原则（2025年更新）》' : 'Screen RWE')}>{language === 'zh' ? '筛查 RWE 指导原则' : 'Screen RWE'}</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Dynamic Panel */}
                <Col span={17} className="h-full">{renderRightPanel()}</Col>
            </Row>

            {/* Regulation Detail Drawer */}
            <Drawer title={<div className="flex items-center space-x-2"><FileTextOutlined className="text-blue-500" /><span>{t('regDetails')}</span></div>} placement="right" width={560} open={drawerVisible} onClose={() => setDrawerVisible(false)} styles={{ body: { padding: '16px' } }}>
                {selectedRegulation && (
                    <div className="space-y-5">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <Tag color={getSourceColor(selectedRegulation.sourceCode)}>{selectedRegulation.source}</Tag>
                                <Badge color={selectedRegulation.status === 'active' ? 'green' : selectedRegulation.status === 'updated' ? 'orange' : 'cyan'} text={selectedRegulation.status === 'active' ? t('activeStatus') : selectedRegulation.status === 'updated' ? t('revisedStatus') : t('pendingStatus')} />
                            </div>
                            <Text strong className="text-base text-gray-800 leading-snug block">{selectedRegulation.title}</Text>
                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                                <span><CalendarOutlined className="mr-1" />{t('published')}: {selectedRegulation.publishDate}</span>
                                <span><CheckCircleOutlined className="mr-1" />{t('effective')}: {selectedRegulation.effectiveDate}</span>
                            </div>
                            <div className="mt-2"><Text type="secondary" className="text-xs">{t('docNo')}: {selectedRegulation.documentNumber}</Text></div>
                        </div>
                        <div><div className="flex items-center space-x-2 mb-2"><SafetyCertificateOutlined className="text-blue-500" /><Text strong>{t('regSummary')}</Text></div><Paragraph className="text-sm text-gray-600 mb-0 leading-relaxed">{selectedRegulation.summary}</Paragraph></div>
                        <Divider className="my-3" />
                        <div><div className="flex items-center space-x-2 mb-2"><GlobalOutlined className="text-green-500" /><Text strong>{t('applicationScope')}</Text></div><div className="flex flex-wrap gap-2">{selectedRegulation.scope.map((item, idx) => <Tag key={idx} color="green" className="text-xs">{item}</Tag>)}</div></div>
                        <div><div className="flex items-center space-x-2 mb-2"><ExperimentOutlined className="text-orange-500" /><Text strong>{t('keyPoints')}</Text></div><List size="small" dataSource={selectedRegulation.keyPoints} renderItem={(item: string) => <List.Item className="py-1.5 px-0 border-0"><div className="flex items-start space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" /><Text className="text-sm text-gray-700">{item}</Text></div></List.Item>} /></div>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2">{t('relatedTrialTypes')}</Text><div className="flex flex-wrap gap-2">{selectedRegulation.relatedTrialTypes.map((item, idx) => <Tag key={idx} color="blue" className="text-xs">{item}</Tag>)}</div></div>
                        <div><Text strong className="block mb-2">{t('impactAreas')}</Text><div className="flex flex-wrap gap-2">{selectedRegulation.impactAreas.map((item, idx) => <Tag key={idx} color="purple" className="text-xs">{item}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <div><div className="flex items-center space-x-2 mb-2"><PaperClipOutlined className="text-gray-500" /><Text strong>{language === 'zh' ? '相关附件' : 'Related Attachments'}</Text></div><div className="space-y-2">{selectedRegulation.attachments.map((att, idx) => <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"><div className="flex items-center space-x-2"><FileTextOutlined className="text-blue-500" /><Text className="text-sm">{att.name}</Text></div><Tag className="text-xs">{att.type.toUpperCase()}</Tag></div>)}</div></div>
                        <div className="bg-blue-50 p-3 rounded-lg"><div className="flex items-center space-x-2"><LinkOutlined className="text-blue-500" /><Text strong className="text-sm">{language === 'zh' ? '官方链接' : 'Official Link'}</Text></div><a href={selectedRegulation.officialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all mt-1 block">{selectedRegulation.officialUrl}</a></div>
                        <Button type="primary" icon={<AlertOutlined />} block size="large" className="mt-4" onClick={() => { setDrawerVisible(false); handleScreenRegulation(selectedRegulation) }}>{t('screeningImpactBtn')}</Button>
                    </div>
                )}
            </Drawer>

            {/* Project/Proposal Detail Drawer */}
            <Drawer title={<div className="flex items-center space-x-2">{detailDrawerType === 'project' ? <ProjectOutlined className="text-blue-500" /> : <SolutionOutlined className="text-purple-500" />}<span>{detailDrawerType === 'project' ? (language === 'zh' ? '项目详情' : 'Project Details') : (language === 'zh' ? '方案详情' : 'Proposal Details')}</span></div>} placement="right" width={520} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)} styles={{ body: { padding: '16px' } }}>
                {detailDrawerType === 'project' && selectedProject && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <Text strong className="text-lg text-blue-600 block mb-2">{selectedProject.id}</Text>
                            <Text className="text-base text-gray-800 block">{selectedProject.name}</Text>
                            <div className="flex items-center gap-2 mt-3"><Tag color="blue">{selectedProject.phase}</Tag><Tag>{selectedProject.indication}</Tag><Badge color={selectedProject.status === '入组中' || selectedProject.status === 'Enrolling' ? 'green' : 'blue'} text={selectedProject.status} /></div>
                        </div>
                        <div><Text strong className="block mb-2"><TagsOutlined className="mr-1" />{t('hitKeywords')}</Text><div className="flex flex-wrap gap-2">{selectedProject.matchedKeywords.map((kw, i) => <Tag key={i} color="orange">{kw}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">{t('sponsor')}</div><Text strong className="text-sm">{selectedProject.sponsor}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('pi')}</div><Text strong className="text-sm">{selectedProject.pi}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('therapeutic')}</div><Text className="text-sm">{selectedProject.therapeutic}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('sites')}</div><Text className="text-sm">{selectedProject.sites} {language === 'zh' ? '家' : ''}</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2">{t('enrollmentProgress')}</Text><div className="flex items-center gap-3"><div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(selectedProject.enrolled / selectedProject.target) * 100}%` }} /></div><Text className="text-sm">{selectedProject.enrolled}/{selectedProject.target}</Text></div></div>
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">{t('startDate')}</div><Text className="text-sm">{selectedProject.startDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('expectedEnd')}</div><Text className="text-sm">{selectedProject.expectedEnd}</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        {/* Key Milestones */}
                        <div><Text strong className="block mb-2"><CalendarOutlined className="mr-1" />{t('keyMilestones')}</Text>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded"><span className="text-sm"><CheckCircleOutlined className="text-green-500 mr-2" />{language === 'zh' ? '伦理批件获取' : 'EC Approval'}</span><Tag color="green">{t('completed')}</Tag></div>
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded"><span className="text-sm"><CheckCircleOutlined className="text-green-500 mr-2" />{language === 'zh' ? '首家中心启动' : 'First Site Activated'}</span><Tag color="green">{t('completed')}</Tag></div>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded"><span className="text-sm"><LoadingOutlined className="text-blue-500 mr-2" />{language === 'zh' ? '50% 入组达成' : '50% Enrollment'}</span><Tag color="blue">{t('inProgress')}</Tag></div>
                            </div>
                        </div>
                        <Divider className="my-3" />
                        {/* View Full Project Link */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <Button type="link" icon={<ProjectOutlined />} className="p-0 text-sm">{t('viewFullProject')}</Button>
                            <Text type="secondary" className="text-xs block mt-1">{t('jumpToSystem')}</Text>
                        </div>
                        <Button type="primary" icon={<AimOutlined />} block onClick={() => { setDetailDrawerVisible(false); handleEvaluateProject(selectedProject) }}>{t('evaluateComplianceBtn')}</Button>
                    </div>
                )}
                {detailDrawerType === 'proposal' && selectedProposal && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                            <Text strong className="text-lg text-purple-600 block mb-2">{selectedProposal.id}</Text>
                            <Text className="text-base text-gray-800 block">{selectedProposal.name}</Text>
                            <div className="flex items-center gap-2 mt-3"><Tag>{selectedProposal.version}</Tag><Tag color="blue">{language === 'zh' ? '项目' : 'Project'}: {selectedProposal.projectId}</Tag><Badge color={selectedProposal.status === '执行中' || selectedProposal.status === 'In Use' ? 'green' : 'orange'} text={selectedProposal.status} /></div>
                        </div>
                        <div><Text strong className="block mb-2"><TagsOutlined className="mr-1" />{t('hitKeywords')}</Text><div className="flex flex-wrap gap-2">{selectedProposal.matchedKeywords.map((kw, i) => <Tag key={i} color="purple">{kw}</Tag>)}</div></div>
                        <Divider className="my-3" />
                        <Row gutter={[16, 12]}>
                            <Col span={12}><div className="text-xs text-gray-500">{t('department')}</div><Text strong className="text-sm">{selectedProposal.author}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('createdDate')}</div><Text className="text-sm">{selectedProposal.createdDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('approvedDate')}</div><Text className="text-sm">{selectedProposal.approvedDate}</Text></Col>
                            <Col span={12}><div className="text-xs text-gray-500">{t('version')}</div><Text className="text-sm">{selectedProposal.version}</Text></Col>
                        </Row>
                        <Divider className="my-3" />
                        <div><Text strong className="block mb-2"><FileTextOutlined className="mr-1" />{t('proposalChapters')}</Text><div className="space-y-1">{selectedProposal.chapters.map((ch, i) => <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded text-sm"><span>{ch.name}</span><Tag className="text-xs">{ch.pages} {language === 'zh' ? '页' : 'pages'}</Tag></div>)}</div></div>
                        <div><Text strong className="block mb-2"><ExperimentOutlined className="mr-1" />{t('endpoints')}</Text><div className="flex flex-wrap gap-2">{selectedProposal.endpoints.map((ep, i) => <Tag key={i} color="blue" className="text-xs">{ep}</Tag>)}</div></div>
                        {selectedProposal.inclusionCriteria.length > 0 && <div><Text strong className="block mb-2"><SafetyCertificateOutlined className="mr-1" />{t('keyInclusionExclusion')}</Text><div className="flex flex-wrap gap-2">{selectedProposal.inclusionCriteria.map((ic, i) => <Tag key={i} color="green" className="text-xs">{ic}</Tag>)}</div></div>}
                        <Divider className="my-3" />
                        {/* Revision History */}
                        <div><Text strong className="block mb-2"><CalendarOutlined className="mr-1" />{t('versionHistory')}</Text>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded text-sm"><span>{selectedProposal.version} ({language === 'zh' ? '当前' : 'Current'})</span><Text type="secondary" className="text-xs">{selectedProposal.approvedDate}</Text></div>
                            </div>
                        </div>
                        {/* Compliance Status */}
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2"><Text strong className="text-sm"><SafetyCertificateOutlined className="mr-1" />{t('complianceStatus')}</Text><Tag color="green">{t('audited')}</Tag></div>
                            <Text type="secondary" className="text-xs">{t('lastAudited')}: {selectedProposal.approvedDate}</Text>
                        </div>
                        <Divider className="my-3" />
                        {/* View Full Proposal Link */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <Button type="link" icon={<SolutionOutlined />} className="p-0 text-sm">{t('viewFullProposal')}</Button>
                            <Text type="secondary" className="text-xs block mt-1">{t('jumpToDocSystem')}</Text>
                        </div>
                        <Button type="primary" icon={<AimOutlined />} block onClick={() => { setDetailDrawerVisible(false); handleEvaluateProposal(selectedProposal) }}>{t('evaluateRevisionBtn')}</Button>
                    </div>
                )}
            </Drawer>
        </div>
    )
}

export default RegulatoryReview
