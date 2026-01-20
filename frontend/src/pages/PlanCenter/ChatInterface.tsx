import React, { useRef, useEffect, useState } from 'react'
import { Card, Input, Button, Avatar, Typography, Mentions, Modal, List, Tag } from 'antd'
import { RobotOutlined, UserOutlined, SendOutlined, FileTextOutlined, ScheduleOutlined, DatabaseOutlined, SolutionOutlined, AuditOutlined, SafetyCertificateOutlined, AimOutlined, ExperimentOutlined, BarChartOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Message, RFPProposal, ProposalOption } from './types'
import { expertRoles, systemCommands, rfpProposals } from './mockData'
import TodoList from './TodoList'
import { useTypewriter } from './useTypewriter'
import MessageBubble from './MessageBubble'

const { Text } = Typography

// 不同角色对应的头像图标和颜色
const getAgentAvatar = (agentName?: string): { icon: React.ReactNode, color: string } => {
    switch (agentName) {
        case '项目经理':
            return { icon: <UserOutlined />, color: '#1890ff' }
        case '数据专家':
            return { icon: <DatabaseOutlined />, color: '#52c41a' }
        case '可行性评估专家':
            return { icon: <BarChartOutlined />, color: '#faad14' }
        case '中心选择专家':
            return { icon: <AimOutlined />, color: '#13c2c2' }
        case '情景推演专家':
            return { icon: <ExperimentOutlined />, color: '#722ed1' }
        case '合规专家':
            return { icon: <SafetyCertificateOutlined />, color: '#eb2f96' }
        case '审核专家':
            return { icon: <AuditOutlined />, color: '#fa8c16' }
        case '系统':
        default:
            return { icon: <RobotOutlined />, color: '#13c2c2' }
    }
}

interface ChatInterfaceProps {
    messages: Message[];
    inputValue: string;
    isProcessing: boolean;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onSelectRFP?: (rfp: RFPProposal) => void;
    viewMode?: 'list' | 'workflow';
    showAddRegionAction?: boolean;
    onAddRegion?: () => void;
    showTimelineCompressionAction?: boolean;
    onTimelineCompression?: () => void;
    showGeneticApprovalAction?: boolean;
    onGeneticApproval?: () => void;
    onSelectProposal?: (proposal: ProposalOption) => void;
    proposalSelected?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    inputValue,
    isProcessing,
    onInputChange,
    onSend,
    onSelectRFP,
    viewMode = 'list',
    showAddRegionAction = false,
    onAddRegion,
    showTimelineCompressionAction = false,
    onTimelineCompression,
    showGeneticApprovalAction = false,
    onGeneticApproval,
    onSelectProposal,
    proposalSelected = false
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showRFPModal, setShowRFPModal] = useState(false)
    const [showProposalModal, setShowProposalModal] = useState(false)
    const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
    const [currentPrefix, setCurrentPrefix] = useState<'@' | '/' | null>(null)
    const hasAutoOpenedProposalModal = useRef(false)

    // 获取当前的方案选项（从最新的包含 proposalOptions 的消息中）
    const currentProposalOptions = messages
        .slice()
        .reverse()
        .find(msg => msg.proposalOptions && msg.proposalOptions.length > 0)?.proposalOptions

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // 自动弹出方案选择 Modal
    useEffect(() => {
        if (currentProposalOptions && currentProposalOptions.length > 0 && !proposalSelected && !hasAutoOpenedProposalModal.current) {
            hasAutoOpenedProposalModal.current = true
            // 延迟一点弹出，让消息先显示
            const timer = setTimeout(() => {
                setShowProposalModal(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [currentProposalOptions, proposalSelected])

    // 重置自动弹出标记
    useEffect(() => {
        if (proposalSelected) {
            hasAutoOpenedProposalModal.current = false
        }
    }, [proposalSelected])

    const handleProposalConfirm = () => {
        if (selectedProposalId && currentProposalOptions && onSelectProposal) {
            const selected = currentProposalOptions.find(p => p.id === selectedProposalId)
            if (selected) {
                onSelectProposal(selected)
                setShowProposalModal(false)
                setSelectedProposalId(null)
            }
        }
    }

    const handleInputChange = (value: string) => {
        onInputChange(value)

        // Check if user typed /生成方案
        if (value.trim() === '/生成方案' || value.trim() === '/生成方案 ') {
            setShowRFPModal(true)
        }
    }

    const handleRFPSelect = (rfp: RFPProposal) => {
        setShowRFPModal(false)
        onInputChange(`/生成方案 ${rfp.title}`)
        onSelectRFP?.(rfp)
    }

    const handleSendWithCheck = () => {
        // If input is just /生成方案, show modal instead
        if (inputValue.trim() === '/生成方案') {
            setShowRFPModal(true)
            return
        }
        onSend()
    }

    const handleQuickAction = (text: string) => {
        onInputChange(text)
    }

    // Get quick actions based on view mode
    const getQuickActions = () => {
        // Hide quick actions in workflow mode
        return []
    }

    // Get options based on current prefix
    const getOptions = () => {
        if (currentPrefix === '@') {
            return expertRoles.map(role => ({
                value: role.label,
                label: (
                    <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-gray-500">{role.description}</div>
                    </div>
                )
            }))
        } else if (currentPrefix === '/') {
            return systemCommands.map(cmd => ({
                value: cmd.value,
                label: (
                    <div>
                        <div className="font-medium">{cmd.label}</div>
                        <div className="text-xs text-gray-500">{cmd.description}</div>
                    </div>
                )
            }))
        }
        return []
    }

    return (
        <>
            <Card bordered={false} className="flex flex-col glass-card h-full" title={
                <div className="flex items-center space-x-2">
                    <RobotOutlined className="text-blue-500" />
                    <span>AI 对话交互</span>
                </div>
            } styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px 12px' } }}>
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 scrollbar-thin">
                    {messages.map((msg, i) => {
                        const agentAvatarInfo = msg.role === 'assistant' ? getAgentAvatar(msg.agentName) : null
                        return (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Avatar
                                        icon={msg.role === 'user' ? <UserOutlined /> : agentAvatarInfo?.icon}
                                        style={msg.role === 'user' ? undefined : { backgroundColor: agentAvatarInfo?.color }}
                                        className={`flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500 ml-2' : 'mr-2'}`}
                                        size="small"
                                    />
                                    <div className="flex flex-col min-w-0">
                                        {msg.role === 'assistant' && (
                                            <div className="text-xs text-gray-500 mb-1 ml-1">
                                                {msg.agentName || '系统'}
                                            </div>
                                        )}
                                        <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            <MessageBubble
                                                message={msg}
                                                onTypingUpdate={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                                onShowProposalModal={() => setShowProposalModal(true)}
                                                proposalSelected={proposalSelected}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                        <Mentions
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="输入 @ 提及专家 或 / 使用指令..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            onPressEnter={e => {
                                if (!e.shiftKey) {
                                    e.preventDefault()
                                    handleSendWithCheck()
                                }
                            }}
                            onSearch={(text, prefix) => {
                                setCurrentPrefix(prefix as '@' | '/')
                            }}
                            className="rounded-lg flex-1"
                            prefix={['@', '/']}
                            options={getOptions()}
                        />
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSendWithCheck} loading={isProcessing} className="rounded-lg h-auto" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {getQuickActions().map((action, idx) => (
                            <Tag
                                key={idx}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleQuickAction(action.value)}
                            >
                                {action.label}
                            </Tag>
                        ))}
                        {showAddRegionAction && (
                            <Tag
                                className="cursor-pointer"
                                onClick={onAddRegion}
                            >
                                增加区域
                            </Tag>
                        )}
                        {showTimelineCompressionAction && (
                            <Tag
                                className="cursor-pointer"
                                onClick={onTimelineCompression}
                            >
                                加快进度
                            </Tag>
                        )}
                        {showGeneticApprovalAction && (
                            <Tag
                                className="cursor-pointer"
                                onClick={onGeneticApproval}
                            >
                                补充遗传资源审批
                            </Tag>
                        )}
                    </div>
                </div>
            </Card>

            <Modal
                title="选择 RFP 提案"
                open={showRFPModal}
                onCancel={() => setShowRFPModal(false)}
                footer={null}
                width={700}
            >
                <List
                    dataSource={rfpProposals}
                    renderItem={rfp => (
                        <List.Item
                            className="cursor-pointer hover:bg-gray-50 px-4 rounded"
                            onClick={() => handleRFPSelect(rfp)}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                                title={<span className="font-medium">{rfp.title}</span>}
                                description={
                                    <div>
                                        <div className="mb-1">{rfp.description}</div>
                                        <div className="space-x-2">
                                            <Tag color="blue">{rfp.phase}</Tag>
                                            <Tag>{rfp.indication}</Tag>
                                            <Tag color="green">{rfp.sponsor}</Tag>
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            {/* 方案选择 Modal */}
            <Modal
                title="专家意见分歧 - 请选择要采纳的方案"
                open={showProposalModal}
                onCancel={() => setShowProposalModal(false)}
                width={700}
                footer={[
                    <Button key="cancel" onClick={() => setShowProposalModal(false)}>
                        取消
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        disabled={!selectedProposalId}
                        onClick={handleProposalConfirm}
                    >
                        采纳选中方案
                    </Button>
                ]}
            >
                {currentProposalOptions && (
                    <div className="space-y-4">
                        <div className="text-gray-600 mb-4">
                            各位专家意见分歧较大，请选择一个方案继续推进：
                        </div>
                        {currentProposalOptions.map(proposal => (
                            <div
                                key={proposal.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedProposalId === proposal.id
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedProposalId(proposal.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        checked={selectedProposalId === proposal.id}
                                        onChange={() => setSelectedProposalId(proposal.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag icon={<UserOutlined />} color="blue">{proposal.expert}</Tag>
                                            <Text strong className="text-base">{proposal.title}</Text>
                                        </div>
                                        <Text className="text-gray-600 block mb-3">{proposal.description}</Text>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-50 rounded-lg p-3">
                                                <div className="text-green-700 font-medium mb-2 flex items-center gap-1">
                                                    <CheckCircleOutlined /> 优点
                                                </div>
                                                <ul className="list-disc list-inside text-green-600 text-sm space-y-1">
                                                    {proposal.pros.map((pro, i) => (
                                                        <li key={i}>{pro}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-red-50 rounded-lg p-3">
                                                <div className="text-red-700 font-medium mb-2 flex items-center gap-1">
                                                    <CloseCircleOutlined /> 缺点
                                                </div>
                                                <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                                                    {proposal.cons.map((con, i) => (
                                                        <li key={i}>{con}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    )
}

export default ChatInterface
