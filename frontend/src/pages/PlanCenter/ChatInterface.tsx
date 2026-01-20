import React, { useRef, useEffect, useState } from 'react'
import { Card, Input, Button, Avatar, Typography, Mentions, Modal, List, Tag } from 'antd'
import { RobotOutlined, UserOutlined, SendOutlined, FileTextOutlined, ScheduleOutlined, DatabaseOutlined, SolutionOutlined, AuditOutlined, SafetyCertificateOutlined, AimOutlined, ExperimentOutlined, BarChartOutlined } from '@ant-design/icons'
import { Message, RFPProposal } from './types'
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
    onGeneticApproval
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showRFPModal, setShowRFPModal] = useState(false)
    const [currentPrefix, setCurrentPrefix] = useState<'@' | '/' | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

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
        </>
    )
}

export default ChatInterface
