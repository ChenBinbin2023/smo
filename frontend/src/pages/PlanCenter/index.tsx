import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'antd'
import ChatInterface from './ChatInterface'
import PlanList from './PlanList'
import WorkflowView from './WorkflowView'
import { mockPlansEn, mockPlansZh, stepsDataZh, stepsDataEn } from './mockData'
import { Message, ProposalOption } from './types'
import { useLanguage } from '../../context/LanguageContext'

const PlanCenter: React.FC = () => {
    const { t, language } = useLanguage();
    const [viewMode, setViewMode] = useState<'list' | 'workflow'>('list')
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
    const [currentRFP, setCurrentRFP] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState<number>(0)
    const [stepStatus, setStepStatus] = useState<'idle' | 'loading' | 'completed'>('idle')
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

    // Initial message based on language
    const initialMessageContent = language === 'zh'
        ? '您好！我是临床方案生成中心。请输入 /生成方案 开始创建新方案。'
        : 'Hello! I am the Clinical Plan Generation Center. Please enter /generate_plan to start creating a new plan.';

    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: initialMessageContent }
    ])

    // Effect to update initial message when language changes (optional, but good for UX if user hasn't started)
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                role: 'assistant',
                content: language === 'zh'
                    ? '您好！我是临床方案生成中心。请输入 /生成方案 开始创建新方案。'
                    : 'Hello! I am the Clinical Plan Generation Center. Please enter /generate_plan to start creating a new plan.'
            }])
        }
    }, [language])

    const [inputValue, setInputValue] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    // Sub-statuses
    const [siteSelectionSubStatus, setSiteSelectionSubStatus] = useState<'idle' | 'center-loading' | 'center-done' | 'scenario-loading' | 'completed'>('idle')
    const [riskComplianceSubStatus, setRiskComplianceSubStatus] = useState<'idle' | 'mapping' | 'mapping-done' | 'conflict' | 'conflict-done' | 'report' | 'completed'>('idle')
    const [hasAddedRegion, setHasAddedRegion] = useState(false)
    const [hasCompressedTimeline, setHasCompressedTimeline] = useState(false)
    const [geneticApprovalCompleted, setGeneticApprovalCompleted] = useState(false)
    const [isRevising, setIsRevising] = useState(false)
    const [proposalSelected, setProposalSelected] = useState(false)
    const [selectedProposal, setSelectedProposal] = useState<ProposalOption | null>(null)
    const workflowTimerRef = useRef<any[]>([])

    // Expert proposals - defined based on language or both
    // Ideally we should switch based on language. 
    // Since this is inside the component, we can define it dynamically or have separate objects.

    const expertProposalsZh: ProposalOption[] = [
        {
            id: 'bd-proposal',
            expert: 'BD',
            title: '增加中心数量',
            description: '将中心数量从 50 家增加至 60 家，预计入组周期压缩至 20 个月',
            pros: [
                '入组周期最短（20个月）',
                '竞品已进入临床阶段，缩短周期能大幅提升竞标优势'
            ],
            cons: [
                '需重新评估 GCP 合规能力',
                '中心管理复杂度增加，质控成本增加15%'
            ]
        },
        {
            id: 'clinical-proposal',
            expert: '临床专家',
            title: '优化入组策略',
            description: '缩短筛选期 + Tier1 中心激励奖金 + 备选中心机制，预计周期 22 个月',
            pros: [
                '质控成本不增加',
                '现有中心质量有保障',
                '无需额外合规审批'
            ],
            cons: [
                '激励奖金需额外预算'
            ]
        }
    ]

    const expertProposalsEn: ProposalOption[] = [
        {
            id: 'bd-proposal',
            expert: 'BD',
            title: 'Increase Number of Sites',
            description: 'Increase sites from 50 to 60, expected to compress enrollment cycle to 20 months',
            pros: [
                'Shortest enrollment cycle (20 months)',
                'Competitors entered clinical phase, shorter cycle improves bidding advantage'
            ],
            cons: [
                'Need to re-evaluate GCP compliance capacity',
                'Increased site management complexity, QC cost +15%'
            ]
        },
        {
            id: 'clinical-proposal',
            expert: 'Clinical Expert',
            title: 'Optimize Enrollment Strategy',
            description: 'Shorten screening + Tier1 incentives + backup sites, expected cycle 22 months',
            pros: [
                'No increase in QC costs',
                'Existing sites quality assured',
                'No extra compliance approval needed'
            ],
            cons: [
                'Incentive bonuses require extra budget'
            ]
        }
    ]

    const expertProposals = language === 'zh' ? expertProposalsZh : expertProposalsEn;

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            workflowTimerRef.current.forEach(timer => clearTimeout(timer))
        }
    }, [])

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message])
    }

    const executeRequirementAnalysis = (rfpTitle: string) => {
        const timers: any[] = []

        // Set step status to loading
        setStepStatus('loading')

        // Step 1: Initial message with typing effect
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? `正在分析 ${rfpTitle}` : `Analyzing ${rfpTitle}`,
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                typing: true
            })
        }, 800)
        timers.push(timer1)

        // Step 2: Show todo list
        const todoStepsZh = [
            { text: '解压提案文件', completed: false },
            { text: '分析RFP邀请函', completed: false },
            { text: '解析临床方案摘要', completed: false },
            { text: '审查工作范围说明书', completed: false },
            { text: '检查报价网格模板', completed: false },
            { text: '分析研究假设清单', completed: false }
        ]

        const todoStepsEn = [
            { text: 'Unzip Proposal Files', completed: false },
            { text: 'Analyze RFP Invitation', completed: false },
            { text: 'Parse Protocol Synopsis', completed: false },
            { text: 'Review Scope of Work', completed: false },
            { text: 'Check Budget Grid Template', completed: false },
            { text: 'Analyze Study Assumptions', completed: false }
        ]

        const todoSteps = language === 'zh' ? todoStepsZh : todoStepsEn;

        // Show initial todo list
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? `正在分析 ${rfpTitle}` : `Analyzing ${rfpTitle}`,
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                todoList: todoSteps
            })
        }, 2000)
        timers.push(timer2)

        // Update todo items one by one
        let currentDelay = 2500
        todoSteps.forEach((_, index) => {
            const itemDelay = 500 + Math.random() * 1500 // Random delay between 500-2000ms
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = todoSteps.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    // Update the last message (todo list)
                    const lastMsgIndex = newMessages.length - 1
                    if (newMessages[lastMsgIndex].todoList) {
                        newMessages[lastMsgIndex] = {
                            ...newMessages[lastMsgIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // Final completion message with summary
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? `分析摘要：该RFP为Phase III随机对照研究，计划入组480例晚期胃癌患者，涉及40个中心，投标截止2月15日。详情见右侧 →`
                    : `Analysis Summary: Phase III RCT, 480 advanced gastric cancer patients, 40 sites, submission due Feb 15. Details on right →`,
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                typing: true
            })
            setStepStatus('completed')
            setCompletedSteps([0])
        }, currentDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = timers
    }

    const handleSend = () => {
        if (!inputValue) return
        if (isProcessing) return; // Prevent double submission

        addMessage({ role: 'user', content: inputValue })

        // Extract mentioned expert from message
        const mentionMatch = inputValue.match(/@(\S+)/)
        const mentionedExpert = mentionMatch ? mentionMatch[1] : null

        // Check command
        const isGenerateCommand = inputValue.trim().startsWith('/生成方案') || inputValue.trim().startsWith('/generate_plan')

        const savedInput = inputValue
        setInputValue('')

        if (isGenerateCommand) {
            // Extract RFP title
            const rfpMatch = savedInput.match(/(\/生成方案|\/generate_plan)\s+(.+)/)
            const rfpTitle = rfpMatch ? rfpMatch[2] : (language === 'zh' ? '未命名提案' : 'Untitled Proposal')

            setCurrentRFP(rfpTitle)

            // Switch to workflow view
            setTimeout(() => {
                addMessage({
                    role: 'assistant',
                    content: language === 'zh' ? '收到，正在组织专家协作...' : 'Received, organizing expert collaboration...',
                    agentName: language === 'zh' ? '项目经理' : 'Project Manager'
                })

                setViewMode('workflow')
                setActiveStep(0)
                setCompletedSteps([])

                // Start requirement analysis after a short delay
                executeRequirementAnalysis(rfpTitle)
            }, 500)
        } else if ((savedInput.includes('压缩') && savedInput.includes('20个月')) || (savedInput.toLowerCase().includes('compress') && (savedInput.includes('20') || savedInput.toLowerCase().includes('months')))) {
            // Timeline compression command
            setTimeout(() => {
                executeTimelineCompression()
            }, 500)
        } else if ((savedInput.includes('增加') && savedInput.includes('西南')) || savedInput.includes('增加区域') || savedInput.toLowerCase().includes('add region')) {
            // Add region command
            setTimeout(() => {
                executeAddRegion()
            }, 500)
        } else if (savedInput.includes('遗传资源审批') || savedInput.includes('补充遗传资源') || savedInput.toLowerCase().includes('hgr') || savedInput.toLowerCase().includes('genetic')) {
            // Genetic approval supplement command
            setTimeout(() => {
                executeGeneticApproval()
            }, 500)
        } else {
            // Regular message handling
            setTimeout(() => {
                addMessage({
                    role: 'assistant',
                    content: language === 'zh' ? '已收到您的指令，请在右侧操作区继续。' : 'Command received, please continue in the right panel.',
                    agentName: mentionedExpert || (language === 'zh' ? '系统' : 'System')
                })
            }, 500)
        }
    }

    const handleSelectPlan = (planId: string) => {
        setCurrentPlanId(planId)
        setViewMode('workflow')

        const currentMockPlans = language === 'zh' ? mockPlansZh : mockPlansEn;
        const plan = currentMockPlans.find(p => p.id === planId)
        let initialActiveStep = 0
        let initialCompletedSteps: number[] = []

        if (plan?.status === 'in-progress') {
            // Plan 1: Enter Center Selection (Step 3), steps 0-3 done
            initialActiveStep = 3
            initialCompletedSteps = [0, 1, 2, 3]
            setSiteSelectionSubStatus('completed')
        } else if (plan?.status === 'completed') {
            // Plan 2: Enter Delivery (Step 7), steps 0-6 done
            initialActiveStep = 7
            initialCompletedSteps = [0, 1, 2, 3, 4, 5, 6]
            setSiteSelectionSubStatus('completed')
            setRiskComplianceSubStatus('completed')
        } else if (plan?.status === 'draft') {
            // Plan 3: Enter Review Collaboration (Step 6), steps 0-5 done
            initialActiveStep = 6
            initialCompletedSteps = [0, 1, 2, 3, 4, 5]
            setSiteSelectionSubStatus('completed')
            setRiskComplianceSubStatus('completed')
        }

        setActiveStep(initialActiveStep)
        setCompletedSteps(initialCompletedSteps)
        setStepStatus('completed')

        const stepsData = language === 'zh' ? stepsDataZh : stepsDataEn;

        addMessage({
            role: 'assistant',
            content: language === 'zh'
                ? `已打开方案: ${plan?.name}。当前进度：${stepsData[initialActiveStep].title}。`
                : `Opened plan: ${plan?.name}. Current progress: ${stepsData[initialActiveStep].title}.`,
            agentName: language === 'zh' ? '项目经理' : 'Project Manager'
        })
    }

    const handleNextStep = () => {
        if (activeStep < 7) {
            const nextStep = activeStep + 1

            // 如果下一步已经完成，直接跳转，不触发 CUI 对话
            if (completedSteps.includes(nextStep)) {
                setActiveStep(nextStep)
                setStepStatus('completed')
                return
            }

            setCompletedSteps(prev => [...prev, activeStep])
            setActiveStep(nextStep)
            setStepStatus('loading')

            // Step 1 -> Step 2: Data Collection
            if (nextStep === 1) {
                executeDataCollection()
            } else if (nextStep === 2) {
                // Step 2 -> Step 3: Feasibility Assessment
                executeFeasibilityAssessment()
            } else if (nextStep === 3) {
                // Step 3 -> Step 4: Site Selection
                executeSiteSelection()
            } else if (nextStep === 4) {
                // Step 4 -> Step 5: Risk & Compliance
                executeRiskCompliance()
            } else if (nextStep === 5) {
                // Step 5: Drafting
                executeDrafting()
            } else if (nextStep === 6) {
                // Step 6: Review
                executeReview()
            } else if (nextStep === 7) {
                // Step 7: Delivery
                executeDelivery()
            } else {
                // Default behavior for other steps
                addMessage({
                    role: 'assistant',
                    content: language === 'zh' ? '步骤已完成，进入下一步。' : 'Step completed, moving to next step.',
                    agentName: language === 'zh' ? '项目经理' : 'Project Manager'
                })
                setStepStatus('completed')
            }
        }
    }

    const executeDataCollection = () => {
        const timers: any[] = []

        // Project Manager delegates to Data Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@数据专家 请进行资料收集。' : '@DataExpert Please proceed with data collection.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // Data Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在进行数据收集...' : 'Received, proceeding with data collection...',
                agentName: language === 'zh' ? '数据专家' : 'Data Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for data collection
        const todoStepsZh = [
            { text: '聚合历史项目数据', completed: false },
            { text: '中心/研究者画像分析', completed: false },
            { text: '入组与执行数据整理', completed: false },
            { text: '法规/伦理条款梳理', completed: false },
            { text: '外部基准数据对标', completed: false }
        ]
        const todoStepsEn = [
            { text: 'Aggregate Historical Data', completed: false },
            { text: 'Analyze Site/PI Profiles', completed: false },
            { text: 'Organize Enrollment Data', completed: false },
            { text: 'Review Reg/Ethics Terms', completed: false },
            { text: 'External Benchmarking', completed: false }
        ]
        const todoSteps = language === 'zh' ? todoStepsZh : todoStepsEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在收集数据资料' : 'Collecting data and materials',
                agentName: language === 'zh' ? '数据专家' : 'Data Expert',
                todoList: todoSteps
            })
        }, 2500)
        timers.push(timer3)

        // Update todo items one by one
        let currentDelay = 3000
        todoSteps.forEach((_, index) => {
            const itemDelay = 600 + Math.random() * 1200
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = todoSteps.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMsgIndex = newMessages.length - 1
                    if (newMessages[lastMsgIndex].todoList) {
                        newMessages[lastMsgIndex] = {
                            ...newMessages[lastMsgIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // Final message
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '数据收集完成。已整合12个历史项目、35家候选中心画像、入组率基准数据，详情见右侧 →'
                    : 'Data collection complete. Integrated 12 historical projects, 35 site profiles, and enrollment benchmarks. See details on right →',
                agentName: language === 'zh' ? '数据专家' : 'Data Expert',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeFeasibilityAssessment = () => {
        const timers: any[] = []

        // Project Manager delegates to Feasibility Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@可行性评估专家 请进行可行性评估分析。' : '@FeasibilityExpert Please perform feasibility assessment.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // Feasibility Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在进行可行性评估...' : 'Received, conducting feasibility assessment...',
                agentName: language === 'zh' ? '可行性评估专家' : 'Feasibility Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for feasibility assessment
        const todoStepsZh = [
            { text: '入组空间评估', completed: false },
            { text: '区域策略可行性', completed: false },
            { text: '资源与周期测算', completed: false },
            { text: '关键风险初筛', completed: false }
        ]
        const todoStepsEn = [
            { text: 'Enrollment Space Eval', completed: false },
            { text: 'Regional Strategy Feasibility', completed: false },
            { text: 'Resource & Cycle Estimation', completed: false },
            { text: 'Key Risk Screening', completed: false }
        ]
        const todoSteps = language === 'zh' ? todoStepsZh : todoStepsEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行可行性评估' : 'Performing feasibility assessment',
                agentName: language === 'zh' ? '可行性评估专家' : 'Feasibility Expert',
                todoList: todoSteps
            })
        }, 2500)
        timers.push(timer3)

        // Update todo items one by one
        let currentDelay = 3000
        todoSteps.forEach((_, index) => {
            const itemDelay = 800 + Math.random() * 1500
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = todoSteps.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMsgIndex = newMessages.length - 1
                    if (newMessages[lastMsgIndex].todoList) {
                        newMessages[lastMsgIndex] = {
                            ...newMessages[lastMsgIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // Final message
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '可行性评估完成。预计月入组速率0.52例/中心/月，建议40家中心、24个月周期，已识别3项关键风险，详情见右侧 →'
                    : 'Feasibility assessment complete. Est. enrollment rate 0.52 pts/site/month. Suggest 40 sites, 24M period. 3 key risks identified. See details on right →',
                agentName: language === 'zh' ? '可行性评估专家' : 'Feasibility Expert',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeSiteSelection = () => {
        const timers: any[] = []
        setSiteSelectionSubStatus('center-loading')

        // Project Manager delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@中心选择专家 请进行中心选择分析。' : '@SiteSelectionExpert Please conduct site selection analysis.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // Site Selection Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在进行中心选择分析...' : 'Received, conducting site selection analysis...',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for site selection
        const siteSelectionTodosZh = [
            { text: '候选池生成', completed: false },
            { text: '分层筛选', completed: false },
            { text: '组合优化', completed: false }
        ]
        const siteSelectionTodosEn = [
            { text: 'Candidate Pool Generation', completed: false },
            { text: 'Tiered Screening', completed: false },
            { text: 'Portfolio Optimization', completed: false }
        ]
        const siteSelectionTodos = language === 'zh' ? siteSelectionTodosZh : siteSelectionTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行中心选择' : 'Performing site selection',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                todoList: siteSelectionTodos
            })
        }, 2500)
        timers.push(timer3)

        // Update todo items one by one
        let currentDelay = 3000
        siteSelectionTodos.forEach((_, index) => {
            const itemDelay = 600 + Math.random() * 1200
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = siteSelectionTodos.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMsgIndex = newMessages.length - 1
                    if (newMessages[lastMsgIndex].todoList) {
                        newMessages[lastMsgIndex] = {
                            ...newMessages[lastMsgIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // Center selection expert completion message
        const centerDoneTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '中心选择完成。已从120家候选中心筛选出40家推荐中心，详情见右侧 →'
                    : 'Site selection complete. Filtered 40 recommended sites from 120 candidates. See details on right →',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
            setSiteSelectionSubStatus('center-done')
        }, currentDelay + 800)
        timers.push(centerDoneTimer)

        // Project Manager delegates to Scenario Expert
        const scenarioStartDelay = currentDelay + 2000
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@情景推演专家 请对选定中心进行情景推演分析。' : '@ScenarioExpert Please conduct scenario simulation for selected sites.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // Scenario Expert starts work
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在进行情景推演...' : 'Received, conducting scenario simulation...',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // Show todo list for scenario simulation
        const scenarioTodosZh = [
            { text: '入组速率推演', completed: false },
            { text: '周期测算推演', completed: false },
            { text: '资源负载推演', completed: false }
        ]
        const scenarioTodosEn = [
            { text: 'Enrollment Rate Simulation', completed: false },
            { text: 'Timeline Projection', completed: false },
            { text: 'Resource Loading Simulation', completed: false }
        ]
        const scenarioTodos = language === 'zh' ? scenarioTodosZh : scenarioTodosEn

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行情景推演' : 'Performing scenario simulation',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                todoList: scenarioTodos
            })
        }, scenarioStartDelay + 2000)
        timers.push(timer6)

        // Update scenario todo items
        let scenarioDelay = scenarioStartDelay + 2500
        scenarioTodos.forEach((_, index) => {
            const itemDelay = 700 + Math.random() * 1300
            scenarioDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = scenarioTodos.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMsgIndex = newMessages.length - 1
                    if (newMessages[lastMsgIndex].todoList) {
                        newMessages[lastMsgIndex] = {
                            ...newMessages[lastMsgIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, scenarioDelay)
            timers.push(timer)
        })

        // Final completion message
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '情景推演完成。乐观情景24个月完成入组，基准情景28个月，保守情景32个月，详情见右侧 →'
                    : 'Scenario simulation complete. Optimistic: 24M, Baseline: 28M, Conservative: 32M for enrollment. See details on right →',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
            setStepStatus('completed')
        }, scenarioDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeRiskCompliance = () => {
        const timers: any[] = []
        // 1. PM delegates to Compliance Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@合规专家 请对当前方案进行法规/伦理要求映射与冲突识别。' : '@ComplianceExpert Please map regulations/ethics requirements and identify conflicts for the current plan.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Compliance Expert starts Mapping
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在进行方案要素法规映射...' : 'Received, mapping plan elements to regulations...',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for mapping
        const mappingTodosZh = [
            { text: 'ICH-GCP 条款扫描', completed: false },
            { text: '中国GCP符合性检查', completed: false },
            { text: '伦理审查要素提取', completed: false }
        ]
        const mappingTodosEn = [
            { text: 'ICH-GCP Clause Scanning', completed: false },
            { text: 'China GCP Compliance Check', completed: false },
            { text: 'Ethics Review Element Extraction', completed: false }
        ]
        const mappingTodos = language === 'zh' ? mappingTodosZh : mappingTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在扫描法规库' : 'Scanning regulation library',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert',
                todoList: mappingTodos
            })
        }, 2500)
        timers.push(timer3)

        // Update mapping todos
        let currentDelay = 3000
        mappingTodos.forEach((_, index) => {
            currentDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = mappingTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // Mapping done, start Conflict Detection
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '法规映射完成。正在识别方案与法规的潜在冲突点...' : 'Regulation mapping complete. Identifying potential conflicts between plan and regulations...',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert',
                typing: true
            })
        }, currentDelay + 1000)
        timers.push(timer4)

        // Conflict detection delay
        const conflictDelay = currentDelay + 3000
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '已识别1个高风险冲突点（安慰剂对照伦理风险）。' : 'Identified 1 high-risk conflict (placebo-controlled ethical risk).',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert'
            })
        }, conflictDelay)

        timers.push(timer5)

        // Generate Report
        const reportDelay = conflictDelay + 2000
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在生成最终合规风险报告...' : 'Generating final compliance risk report...',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert',
                typing: true
            })
        }, reportDelay)
        timers.push(timer6)

        const finalDelay = reportDelay + 2500
        const timer7 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '合规报告已生成。综合评分85分，结论：通过（需修订）。详情见右侧 →'
                    : 'Compliance report generated. Score: 85. Conclusion: Pass (Revision Required). See details on right →',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert',
                typing: true
            })
            setRiskComplianceSubStatus('completed')
            setStepStatus('completed')
        }, finalDelay)
        timers.push(timer7)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeTimelineCompression = () => {
        const timers: any[] = []
        setSiteSelectionSubStatus('center-loading') // Re-use loading state for center list
        setHasCompressedTimeline(false) // Reset first

        // 1. PM delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@中心选择专家 客户要求将基准情景压缩至20个月，请重新筛选候选中心。' : '@SiteSelectionExpert Client requires compressing baseline scenario to 20 months, please re-screen candidates.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Site Selection Expert starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到。正在调整筛选策略，增加Tier 1中心权重...' : 'Received. Adjusting screening strategy, increasing Tier 1 weight...',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show re-screening todos
        const rescreeningTodosZh = [
            { text: '调整中心分层权重', completed: false },
            { text: '重新匹配高入组率中心', completed: false },
            { text: '更新情景推演模型', completed: false }
        ]
        const rescreeningTodosEn = [
            { text: 'Adjust Tier Weighting', completed: false },
            { text: 'Re-match High Enrollment Sites', completed: false },
            { text: 'Update Simulation Model', completed: false }
        ]
        const rescreeningTodos = language === 'zh' ? rescreeningTodosZh : rescreeningTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在重新筛选中心' : 'Re-screening sites',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                todoList: rescreeningTodos
            })
        }, 2500)
        timers.push(timer3)

        // 4. Update Todos
        let currentDelay = 3000
        rescreeningTodos.forEach((_, index) => {
            currentDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = rescreeningTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // 5. Center Selection Completion
        const centerDoneTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '筛选完成。已新增一家高潜力中心（天津肿瘤医院），基准情景预计缩短至20个月。详情见右侧 →'
                    : 'Screening complete. Added one high-potential site (Tianjin Tumor Hospital), baseline scenario projected to 20 months. See details on right →',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
            setSiteSelectionSubStatus('center-done') // Mark center done
            setHasCompressedTimeline(true) // 中心选择完成后立即更新数据
        }, currentDelay + 1000)
        timers.push(centerDoneTimer)

        // 6. PM delegates to Scenario Expert
        const scenarioStartDelay = currentDelay + 2500
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@情景推演专家 中心列表已更新（新增天津肿瘤医院），请重新推演入组周期。' : '@ScenarioExpert Site list updated (added Tianjin Tumor Hospital), please re-simulate enrollment cycle.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // 7. Scenario Expert starts
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在基于新中心列表进行周期推演...' : 'Received, re-simulating timeline based on new site list...',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // 8. Scenario Todos
        const scenarioTodosZh = [
            { text: '新组合入组速率测算', completed: false },
            { text: '关键路径重新分析', completed: false },
            { text: '资源瓶颈评估', completed: false }
        ]
        const scenarioTodosEn = [
            { text: 'New Portfolio Rate Estimate', completed: false },
            { text: 'Critical Path Re-analysis', completed: false },
            { text: 'Resource Bottleneck Eval', completed: false }
        ]
        const scenarioTodos = language === 'zh' ? scenarioTodosZh : scenarioTodosEn

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行情景推演' : 'Performing scenario simulation',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                todoList: scenarioTodos
            })
        }, scenarioStartDelay + 2000)
        timers.push(timer6)

        // 9. Update Scenario Todos
        let finalDelay = scenarioStartDelay + 2500
        scenarioTodos.forEach((_, index) => {
            finalDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = scenarioTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, finalDelay)
            timers.push(timer)
        })

        // 10. Completion
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '推演完成。优化后基准情景缩短至20个月，满足客户预期。详情见右侧 →'
                    : 'Simulation complete. Optimized baseline scenario shortened to 20 months, meeting client expectations. See details on right →',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
        }, finalDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeDrafting = () => {
        const timers: any[] = []

        // 1. PM delegates to Medical Writer
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@医学方案撰写专家 请根据前期分析结果进行方案撰写，注意版本控制和一致性检查。' : '@MedicalWriter Please draft the plan based on previous analysis, with focus on version control and consistency.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Medical Writer starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在整合分析结果，准备开始方案撰写...' : 'Received, integrating analysis results and preparing to draft...',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show Todo List
        const draftingTodosZh = [
            { text: '结构化方案成稿', completed: false },
            { text: '多版本对比与追踪', completed: false },
            { text: '分析结果一致性检查', completed: false },
            { text: '关键假设清单校验', completed: false }
        ]
        const draftingTodosEn = [
            { text: 'Structured Plan Drafting', completed: false },
            { text: 'Version Tracking', completed: false },
            { text: 'Consistency Check', completed: false },
            { text: 'Assumption Checklist Validation', completed: false }
        ]
        const draftingTodos = language === 'zh' ? draftingTodosZh : draftingTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行方案撰写' : 'Drafting the plan',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                todoList: draftingTodos
            })
        }, 2500)
        timers.push(timer3)

        // 4. Update Todos
        let currentDelay = 3000
        draftingTodos.forEach((_, index) => {
            const itemDelay = 1000 + Math.random() * 1000
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = draftingTodos.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // 5. Completion
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '方案撰写完成。已生成v1.2版本，包含完整章节、变更追踪及一致性检查报告。详情见右侧 →'
                    : 'Plan drafting complete. Version 1.2 generated, including full chapters, change tracking, and consistency report. See details on right →',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeReview = () => {
        const timers: any[] = []

        // ==================== 第一轮评审 ====================
        // 1. PM initiates Review
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@临床专家 @合规专家 @BD 请开始多维度综合评审。' : '@ClinicalExpert @ComplianceExpert @BD Please start multi-dimensional comprehensive review.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Clinical Expert - 审查通过
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到。正在进行临床科学性与操作性审查...' : 'Received. Conducting clinical scientific and operational review...',
                agentName: language === 'zh' ? '临床专家' : 'Clinical Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        const clinicalTodosZh = [
            { text: '设计科学性校验', completed: false },
            { text: '入排标准逻辑检查', completed: false },
            { text: '安全性监测方案评估', completed: false }
        ]
        const clinicalTodosEn = [
            { text: 'Scientific Design Validation', completed: false },
            { text: 'I/E Criteria Logic Check', completed: false },
            { text: 'Safety Monitoring Plan Eval', completed: false }
        ]
        const clinicalTodos = language === 'zh' ? clinicalTodosZh : clinicalTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在审查临床模块' : 'Reviewing clinical module',
                agentName: language === 'zh' ? '临床专家' : 'Clinical Expert',
                todoList: clinicalTodos
            })
        }, 2500)
        timers.push(timer3)

        let currentDelay = 3000
        clinicalTodos.forEach((_, index) => {
            currentDelay += 600
            const timer = setTimeout(() => {
                const updatedTodos = clinicalTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = { ...newMessages[lastIndex], todoList: updatedTodos }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '临床模块审查通过。方案设计科学合理，入排标准严谨。'
                    : 'Clinical module review passed. Plan design is scientifically sound with rigorous I/E criteria.',
                agentName: language === 'zh' ? '临床专家' : 'Clinical Expert'
            })
        }, currentDelay + 800)
        timers.push(timer4)

        // 3. BD - 提出争议
        const bdStartDelay = currentDelay + 1500
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '⚠️ 商务评估发现问题：当前50家中心的入组周期预计24个月，**建议增加至60家中心**以将周期压缩至20个月，提升竞标优势。'
                    : '⚠️ Business assessment issue: Current 50 sites projected at 24M period. **Suggest increasing to 60 sites** to compress cycle to 20M and enhance bidding advantage.',
                agentName: 'BD'
            })
        }, bdStartDelay)
        timers.push(timer5)

        // 4. 临床专家 - 反对
        const debateDelay = bdStartDelay + 2000
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '⚠️ 不同意增加中心。会导致入组量稀释、质控成本增加15%。建议优化入组策略替代。'
                    : '⚠️ Disagree with increasing sites. Will lead to enrollment dilution and 15% increase in QC costs. Suggest optimizing enrollment strategy instead.',
                agentName: language === 'zh' ? '临床专家' : 'Clinical Expert'
            })
        }, debateDelay)
        timers.push(timer6)

        // 5. 合规专家补充
        const complianceDelay = debateDelay + 1500
        const timer7 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '补充：如增加中心需重新评估GCP合规能力，伦理审查延长2-4周。'
                    : 'Supplement: Increasing sites requires GCP compliance re-evaluation, ethics review extended by 2-4 weeks.',
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert'
            })
        }, complianceDelay)
        timers.push(timer7)

        // 6. 项目经理协调 - 展示方案选择，等待用户决策
        const pmMediateDelay = complianceDelay + 2000
        const timer8 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '各位专家意见分歧较大，请选择要采纳的方案：' : 'Significant expert disagreement, please select proposal to adopt:',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                proposalOptions: expertProposals
            })
            // 暂停流程，等待用户选择
        }, pmMediateDelay)
        timers.push(timer8)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    // 用户选择方案后执行的修订流程
    const executeProposalRevision = (proposal: ProposalOption) => {
        const timers: any[] = []

        // 根据选择的方案生成不同的修订内容
        const isBDProposal = proposal.id === 'bd-proposal'

        const revisionTodosZh = isBDProposal
            ? [
                { text: '更新中心数量：50家→60家', completed: false },
                { text: '重新评估 GCP 合规能力', completed: false },
                { text: '更新伦理审查时间线', completed: false },
                { text: '更新入组周期预测：24个月→20个月', completed: false }
            ]
            : [
                { text: '缩短筛选期：28天→21天', completed: false },
                { text: '增加Tier 1中心激励奖金条款', completed: false },
                { text: '补充2家备选中心应急机制', completed: false },
                { text: '更新入组周期预测：24个月→22个月', completed: false }
            ]
        const revisionTodosEn = isBDProposal
            ? [
                { text: 'Update Sites: 50 -> 60', completed: false },
                { text: 'Re-eval GCP Compliance', completed: false },
                { text: 'Update Ethics Timeline', completed: false },
                { text: 'Update Enrollment Projection: 24M -> 20M', completed: false }
            ]
            : [
                { text: 'Shorten Screening: 28D -> 21D', completed: false },
                { text: 'Add Tier 1 Incentives', completed: false },
                { text: 'Add 2 Backup Sites Contingency', completed: false },
                { text: 'Update Enrollment Projection: 24M -> 22M', completed: false }
            ]
        const revisionTodos = language === 'zh' ? revisionTodosZh : revisionTodosEn

        const revisionDescription = language === 'zh'
            ? (isBDProposal ? '补充中心扩展方案' : '补充入组策略优化内容')
            : (isBDProposal ? 'supplementary site expansion plan' : 'supplementary enrollment strategy optimization')

        const finalCycle = isBDProposal ? '20' : '22'

        // 回退到方案撰写步骤
        setActiveStep(5)
        setStepStatus('completed')
        setIsRevising(true)

        // 开始修订
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? `收到。正在修订方案，${revisionDescription}...` : `Received. Revising the plan, ${revisionDescription}...`,
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                typing: true
            })
        }, 500)
        timers.push(timer1)

        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在修订方案' : 'Revising the plan',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                todoList: revisionTodos
            })
        }, 1500)
        timers.push(timer2)

        let revisionDelay = 2000
        revisionTodos.forEach((_, index) => {
            revisionDelay += 800
            const timer = setTimeout(() => {
                const updatedTodos = revisionTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = { ...newMessages[lastIndex], todoList: updatedTodos }
                    }
                    return newMessages
                })
            }, revisionDelay)
            timers.push(timer)
        })

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? `✅ 方案修订完成。已在第3节（研究设计）和第6节（访视与评估）${revisionDescription}。请重新进入评审。`
                    : `✅ Plan revision complete. Refined Section 3 (Study Design) and Section 6 (Visits & Eval) with ${revisionDescription}. Please re-enter review.`,
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer'
            })
            setIsRevising(false)
        }, revisionDelay + 1000)
        timers.push(timer3)

        // ==================== 第二轮评审 ====================
        const reReviewDelay = revisionDelay + 2500
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '方案已修订完成。@临床专家 @合规专家 @BD 请进行二次评审确认。'
                    : 'Plan revision complete. @ClinicalExpert @ComplianceExpert @BD please conduct second review.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
            // 切换回评审步骤，设置为 loading 状态
            setActiveStep(6)
            setStepStatus('loading')
        }, reReviewDelay)
        timers.push(timer4)

        // 临床专家确认
        const clinicalConfirmDelay = reReviewDelay + 1500
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: isBDProposal
                    ? (language === 'zh'
                        ? `✅ 二次审查通过。虽然增加中心会导致入组量稀释、质控成本增加15%，但并非严重问题且用户已做出选择。`
                        : `✅ Second review passed. Increased sites lead to enrollment dilution and 15% more QC costs, but not a critical issue and user choice is honored.`)
                    : (language === 'zh'
                        ? `✅ 二次审查通过。入组策略优化方案符合预期，可有效压缩周期同时保障数据质量。`
                        : `✅ Second review passed. Enrollment optimization meets expectations, effectively compressing cycle while ensuring data quality.`),
                agentName: language === 'zh' ? '临床专家' : 'Clinical Expert'
            })
        }, clinicalConfirmDelay)
        timers.push(timer5)

        // BD确认
        const bdConfirmDelay = clinicalConfirmDelay + 1500
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: isBDProposal
                    ? (language === 'zh'
                        ? `✅ 商务评估通过。${finalCycle}个月周期竞争力强，中心管理成本在可控范围。`
                        : `✅ Business assessment passed. ${finalCycle}M cycle is highly competitive, site management costs are manageable.`)
                    : (language === 'zh'
                        ? `✅ 商务评估通过。虽然${finalCycle}个月周期比预期略长，但激励奖金方案可行，用户已做出选择。`
                        : `✅ Business assessment passed. Although ${finalCycle}M cycle is slightly longer than expected, the incentive plan is feasible and user choice honored.`),
                agentName: 'BD'
            })
        }, bdConfirmDelay)
        timers.push(timer6)

        // 合规专家确认
        const complianceConfirmDelay = bdConfirmDelay + 1500
        const timer7 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: isBDProposal
                    ? (language === 'zh'
                        ? '✅ 合规审查通过。新增中心的 GCP 合规评估已纳入，伦理审查时间线已更新。'
                        : '✅ Compliance review passed. GCP assessment for new sites included, ethics timeline updated.')
                    : (language === 'zh'
                        ? '✅ 合规审查通过。修订内容符合ICH-GCP及国内监管要求，无额外合规风险。'
                        : '✅ Compliance review passed. Revisions meet ICH-GCP and local requirements, no additional risks.'),
                agentName: language === 'zh' ? '合规专家' : 'Compliance Expert'
            })
        }, complianceConfirmDelay)
        timers.push(timer7)

        // PM 总结
        const finishDelay = complianceConfirmDelay + 2000
        const timer8 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '✅ 二次评审全票通过！方案已定稿，评审报告已生成，详情见右侧 →'
                    : '✅ Second review passed unanimously! Plan finalized, review report generated. See details on right →',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                typing: true
            })
            setStepStatus('completed')
        }, finishDelay)
        timers.push(timer8)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    // 处理用户选择方案
    const handleProposalSelect = (proposal: ProposalOption) => {
        setProposalSelected(true)
        setSelectedProposal(proposal)

        // 添加一条消息记录用户的选择
        addMessage({
            role: 'assistant',
            content: language === 'zh'
                ? `已采纳 ${proposal.expert} 的方案「${proposal.title}」\n\n@医学方案撰写专家 请回到方案撰写阶段进行修订。`
                : `Adopted ${proposal.expert}'s proposal "${proposal.title}"\n\n@MedicalWriter Please return to the drafting stage for revision.`,
            agentName: language === 'zh' ? '项目经理' : 'Project Manager'
        })

        // 延迟执行修订流程
        setTimeout(() => {
            executeProposalRevision(proposal)
        }, 1000)
    }

    const executeDelivery = () => {
        const timers: any[] = []

        // 1. PM announces start
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '评审已通过，正在进行最终交付存单与资产归档...' : 'Review passed, proceeding with final delivery and asset archiving...',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                typing: true
            })
        }, 500)
        timers.push(timer1)

        // 2. Show Todo List
        const deliveryTodosZh = [
            { text: '交付打包', completed: false },
            { text: '证据链打包', completed: false },
            { text: '决策日志', completed: false },
            { text: '复盘摘要', completed: false },
            { text: '经验/规则回写', completed: false },
            { text: '可复用资产生成', completed: false }
        ]
        const deliveryTodosEn = [
            { text: 'Delivery Packaging', completed: false },
            { text: 'Evidence Chain Packaging', completed: false },
            { text: 'Decision Log', completed: false },
            { text: 'Recap Summary', completed: false },
            { text: 'Exp/Rule Feedback', completed: false },
            { text: 'Reusable Asset Gen', completed: false }
        ]
        const deliveryTodos = language === 'zh' ? deliveryTodosZh : deliveryTodosEn

        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在处理交付存单' : 'Processing delivery documents',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                todoList: deliveryTodos
            })
        }, 2000)
        timers.push(timer2)

        // 3. Process Todos
        let currentDelay = 2500
        deliveryTodos.forEach((_, index) => {
            const itemDelay = 600 + Math.random() * 800
            currentDelay += itemDelay

            const timer = setTimeout(() => {
                const updatedTodos = deliveryTodos.map((step, i) => ({
                    ...step,
                    completed: i <= index
                }))

                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // 4. Final Completion
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '交付存单已完成，相关资产已沉淀至知识库。最终交付包已准备就绪，请下载。'
                    : 'Delivery complete, assets archived. Final delivery package is ready for download.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const handleBackToList = () => {
        // Clear all timers
        workflowTimerRef.current.forEach(timer => clearTimeout(timer))
        workflowTimerRef.current = []

        setViewMode('list')
        setCurrentPlanId(null)
        setCurrentRFP(null)
        setActiveStep(0)
        setStepStatus('idle')
        setCompletedSteps([])
        addMessage({
            role: 'assistant',
            content: language === 'zh' ? '已返回方案列表。' : 'Returned to plan list.',
            agentName: language === 'zh' ? '项目经理' : 'Project Manager'
        })
    }

    const handleRFPSelect = () => {
        // RFP selection handled by input field update, no need for system message
    }

    const handleStepClick = (step: number) => {
        // 只允许点击已完成的步骤或当前步骤
        if (step > activeStep && !completedSteps.includes(step)) {
            return // 不能跳到未完成的未来步骤
        }

        // 如果目标步骤已完成，直接跳转，不触发 CUI 对话
        if (completedSteps.includes(step)) {
            setActiveStep(step)
            setStepStatus('completed')
            return
        }

        // 如果是当前步骤，不做任何操作
        if (step === activeStep) {
            return
        }
    }



    const executeAddRegion = () => {
        const timers: any[] = []
        setSiteSelectionSubStatus('center-loading')
        setHasAddedRegion(false)

        // 1. PM delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@中心选择专家 申请增加西南区域以提升入组速度，请重新评估候选中心。' : '@SiteSelectionExpert Requesting Southwest region to accelerate enrollment, please re-evaluate candidates.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Site Selection Expert starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到。正在扩展区域筛选范围，匹配西南区域优质中心...' : 'Received. Expanding regional scope, matching premium sites in Southwest region...',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show screening todos
        const screeningTodosZh = [
            { text: '西南区域中心初筛', completed: false },
            { text: '研究者KOL匹配', completed: false },
            { text: '既往GCP合规检查', completed: false }
        ]
        const screeningTodosEn = [
            { text: 'Southwest Site Screening', completed: false },
            { text: 'PI KOL Matching', completed: false },
            { text: 'Past GCP Compliance Check', completed: false }
        ]
        const screeningTodos = language === 'zh' ? screeningTodosZh : screeningTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行区域中心筛选' : 'Performing regional site screening',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                todoList: screeningTodos
            })
        }, 2500)
        timers.push(timer3)

        // 4. Update Screening Todos
        let currentDelay = 3000
        screeningTodos.forEach((_, index) => {
            currentDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = screeningTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // 5. Center Selection Done
        const centerDoneTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '中心筛选完成。已推荐四川华西医院作为西南区域牵头中心。'
                    : 'Site screening complete. Recommended West China Hospital as the lead site for Southwest region.',
                agentName: language === 'zh' ? '中心选择专家' : 'Site Selection Expert',
                typing: true
            })
            setSiteSelectionSubStatus('center-done')
            setHasAddedRegion(true) // 中心选择完成后立即更新数据
        }, currentDelay + 1000)
        timers.push(centerDoneTimer)

        // 6. PM delegates to Scenario Expert
        const scenarioStartDelay = currentDelay + 2500
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@情景推演专家 请基于新增中心进行入组潜力与周期推演。' : '@ScenarioExpert Please simulate enrollment potential and cycle based on added sites.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // 7. Scenario Expert starts
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在重新进行多中心情景模拟...' : 'Received, re-conducting multi-center scenario simulation...',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // 8. Scenario Todos
        const scenarioTodosZh = [
            { text: '新增区域入组速率模拟', completed: false },
            { text: '物流配送周期测算', completed: false },
            { text: '整体项目周期更新', completed: false }
        ]
        const scenarioTodosEn = [
            { text: 'New Region Rate Simulation', completed: false },
            { text: 'Logistics Timeline Estimate', completed: false },
            { text: 'Overall Project Timeline Update', completed: false }
        ]
        const scenarioTodos = language === 'zh' ? scenarioTodosZh : scenarioTodosEn

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在进行情景推演' : 'Performing scenario simulation',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                todoList: scenarioTodos
            })
        }, scenarioStartDelay + 2000)
        timers.push(timer6)

        // 9. Update Scenario Todos
        let finalDelay = scenarioStartDelay + 2500
        scenarioTodos.forEach((_, index) => {
            finalDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = scenarioTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, finalDelay)
            timers.push(timer)
        })

        // 10. Completion
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '推演完成。新增西南区域后，乐观情景预计提前2个月完成，覆盖区域增至4个。详情见右侧 →'
                    : 'Simulation complete. With Southwest region, optimistic scenario is 2 months earlier, coverage increased to 4 regions. See details on right →',
                agentName: language === 'zh' ? '情景推演专家' : 'Scenario Expert',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
        }, finalDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeGeneticApproval = () => {
        const timers: any[] = []

        // 1. PM delegates to Medical Writer
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '@医学方案撰写专家 请在方案中补充遗传资源审批相关说明。' : '@MedicalWriter Please supplement genetic resource approval details in the plan.',
                agentName: language === 'zh' ? '项目经理' : 'Project Manager'
            })
        }, 500)
        timers.push(timer1)

        // 2. Medical Writer acknowledges
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '收到，正在补充遗传资源审批说明...' : 'Received, supplementing genetic resource approval details...',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                typing: true
            })
            setIsRevising(true)
        }, 1500)
        timers.push(timer2)

        // 3. Show todos
        const approvalTodosZh = [
            { text: '查阅《人类遗传资源管理条例》要求', completed: false },
            { text: '补充遗传资源采集审批流程', completed: false },
            { text: '完善样本出境审批说明', completed: false },
            { text: '更新知情同意书相关条款', completed: false }
        ]
        const approvalTodosEn = [
            { text: 'Review HGR Management Regs', completed: false },
            { text: 'Add HGR Collection Approval Flow', completed: false },
            { text: 'Refine Sample Export Details', completed: false },
            { text: 'Update Informed Consent Clauses', completed: false }
        ]
        const approvalTodos = language === 'zh' ? approvalTodosZh : approvalTodosEn

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh' ? '正在补充遗传资源审批内容' : 'Supplementing genetic resource approval content',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                todoList: approvalTodos
            })
        }, 2500)
        timers.push(timer3)

        // 4. Update todos
        let currentDelay = 3000
        approvalTodos.forEach((_, index) => {
            currentDelay += 800 + Math.random() * 800
            const timer = setTimeout(() => {
                const updatedTodos = approvalTodos.map((step, i) => ({ ...step, completed: i <= index }))
                setMessages(prev => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1
                    if (newMessages[lastIndex].todoList) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            todoList: updatedTodos
                        }
                    }
                    return newMessages
                })
            }, currentDelay)
            timers.push(timer)
        })

        // 5. Completion
        const finalTimer = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: language === 'zh'
                    ? '遗传资源审批说明已补充完成。已在方案第13节添加遗传资源采集与出境审批流程，并更新了知情同意书相关条款。合规要点核验已全部通过，详情见右侧 →'
                    : 'Genetic resource approval details supplemented. Added HGR collection and export flows in Section 13, and updated informed consent clauses. All compliance verified. See details on right →',
                agentName: language === 'zh' ? '医学方案撰写专家' : 'Medical Writer',
                typing: true
            })
            setGeneticApprovalCompleted(true)
            setIsRevising(false)
        }, currentDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }


    return (
        <div className="h-full overflow-hidden p-2 flex flex-col">
            <Row gutter={20} className="flex-1 overflow-hidden">
                {/* Left Side: CUI */}
                <Col span={7} className="h-full">
                    <ChatInterface
                        messages={messages}
                        inputValue={inputValue}
                        isProcessing={isProcessing}
                        onInputChange={setInputValue}
                        onSend={handleSend}
                        onSelectRFP={handleRFPSelect}
                        viewMode={viewMode}
                        showAddRegionAction={activeStep === 3 && stepStatus === 'completed'}
                        onAddRegion={() => setInputValue(language === 'zh' ? '我需要增加一个西南区域的中心，请重新评估' : 'I need to add a center in the Southwest region, please re-evaluate')}
                        showTimelineCompressionAction={activeStep === 3 && stepStatus === 'completed'}
                        onTimelineCompression={() => setInputValue(language === 'zh' ? '我需要加快进度，将基准情景压缩至20个月' : 'I need to compress the timeline to 20 months')}
                        showGeneticApprovalAction={activeStep === 5 && stepStatus === 'completed' && !geneticApprovalCompleted}
                        onGeneticApproval={() => setInputValue(language === 'zh' ? '请补充遗传资源审批相关说明' : 'Please supplement genetic resource approval details')}
                        onSelectProposal={handleProposalSelect}
                        proposalSelected={proposalSelected}
                    />
                </Col>

                {/* Right Side: Plan List or Workflow */}
                <Col span={17} className="h-full flex flex-col">
                    {viewMode === 'list' ? (
                        <PlanList onSelectPlan={handleSelectPlan} />
                    ) : (
                        <WorkflowView
                            activeStep={activeStep}
                            stepStatus={stepStatus}
                            completedSteps={completedSteps}
                            onNextStep={handleNextStep}
                            onBackToList={handleBackToList}
                            onStepClick={handleStepClick}
                            siteSelectionSubStatus={siteSelectionSubStatus}
                            hasAddedRegion={hasAddedRegion}
                            riskComplianceSubStatus={riskComplianceSubStatus}
                            hasCompressedTimeline={hasCompressedTimeline}
                            geneticApprovalCompleted={geneticApprovalCompleted}
                            isRevising={isRevising}
                        />
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default PlanCenter
