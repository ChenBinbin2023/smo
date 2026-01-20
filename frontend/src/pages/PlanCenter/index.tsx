import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'antd'
import ChatInterface from './ChatInterface'
import PlanList from './PlanList'
import WorkflowView from './WorkflowView'
import { mockPlans, stepsData } from './mockData'
import { Message, ProposalOption } from './types'

const PlanCenter: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'workflow'>('list')
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
    const [currentRFP, setCurrentRFP] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState<number>(0)
    const [stepStatus, setStepStatus] = useState<'idle' | 'loading' | 'completed'>('idle')
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '您好！我是临床方案生成中心。请输入 /生成方案 开始创建新方案。' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    // 中心选定步骤的子状态：'idle' | 'center-loading' | 'center-done' | 'scenario-loading' | 'completed'
    // 中心选定步骤的子状态：'idle' | 'center-loading' | 'center-done' | 'scenario-loading' | 'completed'
    const [siteSelectionSubStatus, setSiteSelectionSubStatus] = useState<'idle' | 'center-loading' | 'center-done' | 'scenario-loading' | 'completed'>('idle')
    const [riskComplianceSubStatus, setRiskComplianceSubStatus] = useState<'idle' | 'mapping' | 'mapping-done' | 'conflict' | 'conflict-done' | 'report' | 'completed'>('idle')
    const [hasAddedRegion, setHasAddedRegion] = useState(false)
    const [hasCompressedTimeline, setHasCompressedTimeline] = useState(false)
    const [geneticApprovalCompleted, setGeneticApprovalCompleted] = useState(false)
    const [isRevising, setIsRevising] = useState(false)
    const [proposalSelected, setProposalSelected] = useState(false)
    const [selectedProposal, setSelectedProposal] = useState<ProposalOption | null>(null)
    const workflowTimerRef = useRef<NodeJS.Timeout[]>([])

    // 专家方案选项
    const expertProposals: ProposalOption[] = [
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
        const timers: NodeJS.Timeout[] = []

        // Set step status to loading
        setStepStatus('loading')

        // Step 1: Initial message with typing effect
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: `正在分析 ${rfpTitle}`,
                agentName: '项目经理',
                typing: true
            })
        }, 800)
        timers.push(timer1)

        // Step 2: Show todo list
        const todoSteps = [
            { text: '解压提案文件', completed: false },
            { text: '分析RFP邀请函', completed: false },
            { text: '解析临床方案摘要', completed: false },
            { text: '审查工作范围说明书', completed: false },
            { text: '检查报价网格模板', completed: false },
            { text: '分析研究假设清单', completed: false }
        ]

        // Show initial todo list
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: `正在分析 ${rfpTitle}`,
                agentName: '项目经理',
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
                content: `分析摘要：该RFP为Phase III随机对照研究，计划入组480例晚期胃癌患者，涉及40个中心，投标截止2月15日。详情见右侧 →`,
                agentName: '项目经理',
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

        addMessage({ role: 'user', content: inputValue })

        // Extract mentioned expert from message
        const mentionMatch = inputValue.match(/@(\S+)/)
        const mentionedExpert = mentionMatch ? mentionMatch[1] : null

        // Check if this is a /生成方案 command
        const isGenerateCommand = inputValue.trim().startsWith('/生成方案')

        const savedInput = inputValue
        setInputValue('')

        if (isGenerateCommand) {
            // Extract RFP title
            const rfpMatch = savedInput.match(/\/生成方案\s+(.+)/)
            const rfpTitle = rfpMatch ? rfpMatch[1] : '未命名提案'

            setCurrentRFP(rfpTitle)

            // Switch to workflow view
            setTimeout(() => {
                addMessage({
                    role: 'assistant',
                    content: '收到，正在组织专家协作...',
                    agentName: '项目经理'
                })

                setViewMode('workflow')
                setActiveStep(0)
                setCompletedSteps([])

                // Start requirement analysis after a short delay
                executeRequirementAnalysis(rfpTitle)
            }, 500)
        } else if (inputValue.includes('压缩') && inputValue.includes('20个月')) {
            // Timeline compression command
            setTimeout(() => {
                executeTimelineCompression()
            }, 500)
        } else if ((inputValue.includes('增加') && inputValue.includes('西南')) || inputValue.includes('增加区域')) {
            // Add region command
            setTimeout(() => {
                executeAddRegion()
            }, 500)
        } else if (inputValue.includes('遗传资源审批') || inputValue.includes('补充遗传资源')) {
            // Genetic approval supplement command
            setTimeout(() => {
                executeGeneticApproval()
            }, 500)
        } else {
            // Regular message handling
            setTimeout(() => {
                addMessage({
                    role: 'assistant',
                    content: '已收到您的指令，请在右侧操作区继续。',
                    agentName: mentionedExpert || '系统'
                })
            }, 500)
        }
    }

    const handleSelectPlan = (planId: string) => {
        setCurrentPlanId(planId)
        setViewMode('workflow')

        const plan = mockPlans.find(p => p.id === planId)
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

        addMessage({
            role: 'assistant',
            content: `已打开方案: ${plan?.name}。当前进度：${stepsData[initialActiveStep].title}。`,
            agentName: '项目经理'
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
                    content: `步骤已完成，进入下一步。`,
                    agentName: '项目经理'
                })
                setStepStatus('completed')
            }
        }
    }

    const executeDataCollection = () => {
        const timers: NodeJS.Timeout[] = []

        // Project Manager delegates to Data Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@数据专家 请进行资料收集。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // Data Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在进行数据收集...',
                agentName: '数据专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for data collection
        const todoSteps = [
            { text: '聚合历史项目数据', completed: false },
            { text: '中心/研究者画像分析', completed: false },
            { text: '入组与执行数据整理', completed: false },
            { text: '法规/伦理条款梳理', completed: false },
            { text: '外部基准数据对标', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在收集数据资料',
                agentName: '数据专家',
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
                content: '数据收集完成。已整合12个历史项目、35家候选中心画像、入组率基准数据，详情见右侧 →',
                agentName: '数据专家',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeFeasibilityAssessment = () => {
        const timers: NodeJS.Timeout[] = []

        // Project Manager delegates to Feasibility Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@可行性评估专家 请进行可行性评估分析。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // Feasibility Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在进行可行性评估...',
                agentName: '可行性评估专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for feasibility assessment
        const todoSteps = [
            { text: '入组空间评估', completed: false },
            { text: '区域策略可行性', completed: false },
            { text: '资源与周期测算', completed: false },
            { text: '关键风险初筛', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行可行性评估',
                agentName: '可行性评估专家',
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
                content: '可行性评估完成。预计月入组速率0.52例/中心/月，建议40家中心、24个月周期，已识别3项关键风险，详情见右侧 →',
                agentName: '可行性评估专家',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeSiteSelection = () => {
        const timers: NodeJS.Timeout[] = []
        setSiteSelectionSubStatus('center-loading')

        // Project Manager delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@中心选择专家 请进行中心选择分析。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // Site Selection Expert starts work
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在进行中心选择分析...',
                agentName: '中心选择专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for site selection
        const siteSelectionTodos = [
            { text: '候选池生成', completed: false },
            { text: '分层筛选', completed: false },
            { text: '组合优化', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行中心选择',
                agentName: '中心选择专家',
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
                content: '中心选择完成。已从120家候选中心筛选出40家推荐中心，详情见右侧 →',
                agentName: '中心选择专家',
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
                content: '@情景推演专家 请对选定中心进行情景推演分析。',
                agentName: '项目经理'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // Scenario Expert starts work
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在进行情景推演...',
                agentName: '情景推演专家',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // Show todo list for scenario simulation
        const scenarioTodos = [
            { text: '入组速率推演', completed: false },
            { text: '周期测算推演', completed: false },
            { text: '资源负载推演', completed: false }
        ]

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行情景推演',
                agentName: '情景推演专家',
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
                content: '情景推演完成。乐观情景24个月完成入组，基准情景28个月，保守情景32个月，详情见右侧 →',
                agentName: '情景推演专家',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
            setStepStatus('completed')
        }, scenarioDelay + 800)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeRiskCompliance = () => {
        const timers: NodeJS.Timeout[] = []
        // Start process



        // 1. PM delegates to Compliance Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@合规专家 请对当前方案进行法规/伦理要求映射与冲突识别。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Compliance Expert starts Mapping
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在进行方案要素法规映射...',
                agentName: '合规专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // Show todo list for mapping
        const mappingTodos = [
            { text: 'ICH-GCP 条款扫描', completed: false },
            { text: '中国GCP符合性检查', completed: false },
            { text: '伦理审查要素提取', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在扫描法规库',
                agentName: '合规专家',
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
                content: '法规映射完成。正在识别方案与法规的潜在冲突点...',
                agentName: '合规专家',
                typing: true
            })
        }, currentDelay + 1000)
        timers.push(timer4)

        // Conflict detection delay
        const conflictDelay = currentDelay + 3000
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '已识别1个高风险冲突点（安慰剂对照伦理风险）。',
                agentName: '合规专家'
            })
        }, conflictDelay)

        timers.push(timer5)

        // Generate Report
        const reportDelay = conflictDelay + 2000
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在生成最终合规风险报告...',
                agentName: '合规专家',
                typing: true
            })
        }, reportDelay)
        timers.push(timer6)

        const finalDelay = reportDelay + 2500
        const timer7 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '合规报告已生成。综合评分85分，结论：通过（需修订）。详情见右侧 →',
                agentName: '合规专家',
                typing: true
            })
            setRiskComplianceSubStatus('completed')
            setStepStatus('completed')
        }, finalDelay)
        timers.push(timer7)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]

    }

    const executeTimelineCompression = () => {
        const timers: NodeJS.Timeout[] = []
        setSiteSelectionSubStatus('center-loading') // Re-use loading state for center list
        setHasCompressedTimeline(false) // Reset first

        // 1. PM delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@中心选择专家 客户要求将基准情景压缩至20个月，请重新筛选候选中心。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Site Selection Expert starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到。正在调整筛选策略，增加Tier 1中心权重...',
                agentName: '中心选择专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show re-screening todos
        const rescreeningTodos = [
            { text: '调整中心分层权重', completed: false },
            { text: '重新匹配高入组率中心', completed: false },
            { text: '更新情景推演模型', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在重新筛选中心',
                agentName: '中心选择专家',
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
                content: '筛选完成。已新增一家高潜力中心（天津肿瘤医院），基准情景预计缩短至20个月。详情见右侧 →',
                agentName: '中心选择专家',
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
                content: '@情景推演专家 中心列表已更新（新增天津肿瘤医院），请重新推演入组周期。',
                agentName: '项目经理'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // 7. Scenario Expert starts
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在基于新中心列表进行周期推演...',
                agentName: '情景推演专家',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // 8. Scenario Todos
        const scenarioTodos = [
            { text: '新组合入组速率测算', completed: false },
            { text: '关键路径重新分析', completed: false },
            { text: '资源瓶颈评估', completed: false }
        ]

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行情景推演',
                agentName: '情景推演专家',
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
                content: '推演完成。优化后基准情景缩短至20个月，满足客户预期。详情见右侧 →',
                agentName: '情景推演专家',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
        }, finalDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeDrafting = () => {
        const timers: NodeJS.Timeout[] = []

        // 1. PM delegates to Medical Writer
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@医学方案撰写专家 请根据前期分析结果进行方案撰写，注意版本控制和一致性检查。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Medical Writer starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在整合分析结果，准备开始方案撰写...',
                agentName: '医学方案撰写专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show Todo List
        const draftingTodos = [
            { text: '结构化方案成稿', completed: false },
            { text: '多版本对比与追踪', completed: false },
            { text: '分析结果一致性检查', completed: false },
            { text: '关键假设清单校验', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行方案撰写',
                agentName: '医学方案撰写专家',
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
                content: '方案撰写完成。已生成v1.2版本，包含完整章节、变更追踪及一致性检查报告。详情见右侧 →',
                agentName: '医学方案撰写专家',
                typing: true
            })
            setStepStatus('completed')
        }, currentDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeReview = () => {
        const timers: NodeJS.Timeout[] = []

        // ==================== 第一轮评审 ====================
        // 1. PM initiates Review
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@临床专家 @合规专家 @BD 请开始多维度综合评审。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Clinical Expert - 审查通过
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到。正在进行临床科学性与操作性审查...',
                agentName: '临床专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        const clinicalTodos = [
            { text: '设计科学性校验', completed: false },
            { text: '入排标准逻辑检查', completed: false },
            { text: '安全性监测方案评估', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在审查临床模块',
                agentName: '临床专家',
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
                content: '临床模块审查通过。方案设计科学合理，入排标准严谨。',
                agentName: '临床专家'
            })
        }, currentDelay + 800)
        timers.push(timer4)

        // 3. BD - 提出争议
        const bdStartDelay = currentDelay + 1500
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '⚠️ 商务评估发现问题：当前50家中心的入组周期预计24个月，**建议增加至60家中心**以将周期压缩至20个月，提升竞标优势。',
                agentName: 'BD'
            })
        }, bdStartDelay)
        timers.push(timer5)

        // 4. 临床专家 - 反对
        const debateDelay = bdStartDelay + 2000
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '⚠️ 不同意增加中心。会导致入组量稀释、质控成本增加15%。建议优化入组策略替代。',
                agentName: '临床专家'
            })
        }, debateDelay)
        timers.push(timer6)

        // 5. 合规专家补充
        const complianceDelay = debateDelay + 1500
        const timer7 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '补充：如增加中心需重新评估GCP合规能力，伦理审查延长2-4周。',
                agentName: '合规专家'
            })
        }, complianceDelay)
        timers.push(timer7)

        // 6. 项目经理协调 - 展示方案选择，等待用户决策
        const pmMediateDelay = complianceDelay + 2000
        const timer8 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '各位专家意见分歧较大，请选择要采纳的方案：',
                agentName: '项目经理',
                proposalOptions: expertProposals
            })
            // 暂停流程，等待用户选择
        }, pmMediateDelay)
        timers.push(timer8)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    // 用户选择方案后执行的修订流程
    const executeProposalRevision = (proposal: ProposalOption) => {
        const timers: NodeJS.Timeout[] = []

        // 根据选择的方案生成不同的修订内容
        const isBDProposal = proposal.id === 'bd-proposal'

        const revisionTodos = isBDProposal
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

        const revisionDescription = isBDProposal
            ? '补充中心扩展方案'
            : '补充入组策略优化内容'

        const finalCycle = isBDProposal ? '20' : '22'

        // 回退到方案撰写步骤
        setActiveStep(5)
        setStepStatus('completed')
        setIsRevising(true)

        // 开始修订
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: `收到。正在修订方案，${revisionDescription}...`,
                agentName: '医学方案撰写专家',
                typing: true
            })
        }, 500)
        timers.push(timer1)

        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在修订方案',
                agentName: '医学方案撰写专家',
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
                content: `✅ 方案修订完成。已在第3节（研究设计）和第6节（访视与评估）${revisionDescription}。请重新进入评审。`,
                agentName: '医学方案撰写专家'
            })
            setIsRevising(false)
        }, revisionDelay + 1000)
        timers.push(timer3)

        // ==================== 第二轮评审 ====================
        const reReviewDelay = revisionDelay + 2500
        const timer4 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '方案已修订完成。@临床专家 @合规专家 @BD 请进行二次评审确认。',
                agentName: '项目经理'
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
                    ? `✅ 二次审查通过。虽然增加中心会导致入组量稀释、质控成本增加15%，但并非严重问题且用户已做出选择。`
                    : `✅ 二次审查通过。入组策略优化方案符合预期，可有效压缩周期同时保障数据质量。`,
                agentName: '临床专家'
            })
        }, clinicalConfirmDelay)
        timers.push(timer5)

        // BD确认
        const bdConfirmDelay = clinicalConfirmDelay + 1500
        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: isBDProposal
                    ? `✅ 商务评估通过。${finalCycle}个月周期竞争力强，中心管理成本在可控范围。`
                    : `✅ 商务评估通过。虽然${finalCycle}个月周期比预期略长，但激励奖金方案可行，用户已做出选择。`,
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
                    ? '✅ 合规审查通过。新增中心的 GCP 合规评估已纳入，伦理审查时间线已更新。'
                    : '✅ 合规审查通过。修订内容符合ICH-GCP及国内监管要求，无额外合规风险。',
                agentName: '合规专家'
            })
        }, complianceConfirmDelay)
        timers.push(timer7)

        // PM 总结
        const finishDelay = complianceConfirmDelay + 2000
        const timer8 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '✅ 二次评审全票通过！方案已定稿，评审报告已生成，详情见右侧 →',
                agentName: '项目经理',
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
            content: `已采纳 ${proposal.expert} 的方案「${proposal.title}」\n\n@医学方案撰写专家 请回到方案撰写阶段进行修订。`,
            agentName: '项目经理'
        })

        // 延迟执行修订流程
        setTimeout(() => {
            executeProposalRevision(proposal)
        }, 1000)
    }

    const executeDelivery = () => {
        const timers: NodeJS.Timeout[] = []

        // 1. PM announces start
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '评审已通过，正在进行最终交付存单与资产归档...',
                agentName: '项目经理',
                typing: true
            })
        }, 500)
        timers.push(timer1)

        // 2. Show Todo List
        const deliveryTodos = [
            { text: '交付打包', completed: false },
            { text: '证据链打包', completed: false },
            { text: '决策日志', completed: false },
            { text: '复盘摘要', completed: false },
            { text: '经验/规则回写', completed: false },
            { text: '可复用资产生成', completed: false }
        ]

        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在处理交付存单',
                agentName: '项目经理',
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
                content: '交付存单已完成，相关资产已沉淀至知识库。最终交付包已准备就绪，请下载。',
                agentName: '项目经理',
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
            content: '已返回方案列表。',
            agentName: '项目经理'
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
        const timers: NodeJS.Timeout[] = []
        setSiteSelectionSubStatus('center-loading')
        setHasAddedRegion(false)

        // 1. PM delegates to Site Selection Expert
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@中心选择专家 申请增加西南区域以提升入组速度，请重新评估候选中心。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Site Selection Expert starts
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到。正在扩展区域筛选范围，匹配西南区域优质中心...',
                agentName: '中心选择专家',
                typing: true
            })
        }, 1500)
        timers.push(timer2)

        // 3. Show screening todos
        const screeningTodos = [
            { text: '西南区域中心初筛', completed: false },
            { text: '研究者KOL匹配', completed: false },
            { text: '既往GCP合规检查', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行区域中心筛选',
                agentName: '中心选择专家',
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
                content: '中心筛选完成。已推荐四川华西医院作为西南区域牵头中心。',
                agentName: '中心选择专家',
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
                content: '@情景推演专家 请基于新增中心进行入组潜力与周期推演。',
                agentName: '项目经理'
            })
            setSiteSelectionSubStatus('scenario-loading')
        }, scenarioStartDelay)
        timers.push(timer4)

        // 7. Scenario Expert starts
        const timer5 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在重新进行多中心情景模拟...',
                agentName: '情景推演专家',
                typing: true
            })
        }, scenarioStartDelay + 1000)
        timers.push(timer5)

        // 8. Scenario Todos
        const scenarioTodos = [
            { text: '新增区域入组速率模拟', completed: false },
            { text: '物流配送周期测算', completed: false },
            { text: '整体项目周期更新', completed: false }
        ]

        const timer6 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在进行情景推演',
                agentName: '情景推演专家',
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
                content: '推演完成。新增西南区域后，乐观情景预计提前2个月完成，覆盖区域增至4个。详情见右侧 →',
                agentName: '情景推演专家',
                typing: true
            })
            setSiteSelectionSubStatus('completed')
        }, finalDelay + 1000)
        timers.push(finalTimer)

        workflowTimerRef.current = [...workflowTimerRef.current, ...timers]
    }

    const executeGeneticApproval = () => {
        const timers: NodeJS.Timeout[] = []

        // 1. PM delegates to Medical Writer
        const timer1 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '@医学方案撰写专家 请在方案中补充遗传资源审批相关说明。',
                agentName: '项目经理'
            })
        }, 500)
        timers.push(timer1)

        // 2. Medical Writer acknowledges
        const timer2 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '收到，正在补充遗传资源审批说明...',
                agentName: '医学方案撰写专家',
                typing: true
            })
            setIsRevising(true)
        }, 1500)
        timers.push(timer2)

        // 3. Show todos
        const approvalTodos = [
            { text: '查阅《人类遗传资源管理条例》要求', completed: false },
            { text: '补充遗传资源采集审批流程', completed: false },
            { text: '完善样本出境审批说明', completed: false },
            { text: '更新知情同意书相关条款', completed: false }
        ]

        const timer3 = setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '正在补充遗传资源审批内容',
                agentName: '医学方案撰写专家',
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
                content: '遗传资源审批说明已补充完成。已在方案第13节添加遗传资源采集与出境审批流程，并更新了知情同意书相关条款。合规要点核验已全部通过，详情见右侧 →',
                agentName: '医学方案撰写专家',
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
                        onAddRegion={() => setInputValue('我需要增加一个西南区域的中心，请重新评估')}
                        showTimelineCompressionAction={activeStep === 3 && stepStatus === 'completed'}
                        onTimelineCompression={() => setInputValue('我需要 加快进度，将基准情景压缩至20个月')}
                        showGeneticApprovalAction={activeStep === 5 && stepStatus === 'completed' && !geneticApprovalCompleted}
                        onGeneticApproval={() => setInputValue('请补充遗传资源审批相关说明')}
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
