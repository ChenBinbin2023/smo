import React, { useEffect } from 'react'
import { Typography } from 'antd'
import { useTypewriter } from './useTypewriter'
import TodoList, { TodoItem } from './TodoList'
import { Message } from './types'

const { Text } = Typography

interface MessageBubbleProps {
    message: Message
    onTypingUpdate?: () => void
}

// Render text with @mentions highlighted
const renderWithMentions = (text: string, color?: string, mentionColor?: string) => {
    const parts = text.split(/(@\S+)/g)
    return parts.map((part, i) => {
        if (part.startsWith('@')) {
            return <Text key={i} style={{ color: mentionColor || '#1890ff', fontWeight: 500 }}>{part}</Text>
        }
        return <span key={i} style={{ color }}>{part}</span>
    })
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onTypingUpdate }) => {
    const { displayedText } = useTypewriter(message.content, 30, message.typing)

    // Notify parent when typing updates to trigger scroll
    useEffect(() => {
        if (message.typing && onTypingUpdate) {
            onTypingUpdate()
        }
    }, [displayedText, message.typing, onTypingUpdate])

    if (message.todoList) {
        const todoItems: TodoItem[] = message.todoList.map((item, index) => {
            // Find the index of the first incomplete item
            const firstIncompleteIndex = message.todoList!.findIndex(t => !t.completed)

            let status: 'completed' | 'loading' | 'pending' = 'pending'

            if (item.completed) {
                status = 'completed'
            } else if (index === firstIncompleteIndex) {
                // If all items are completed, findIndex returns -1, keeping logic safe as index won't match -1
                // Actually if findIndex is -1 it means everything is completed, but we handle item.completed first.
                // So if we are here, item is NOT completed.
                // If index match firstIncompleteIndex, it is the current loading step.
                status = 'loading'
            } else {
                status = 'pending'
            }

            return {
                text: item.text,
                status
            }
        })

        return (
            <div className="space-y-2">
                {message.content && (
                    <Text strong className="block mb-2">{renderWithMentions(message.content)}</Text>
                )}
                <TodoList items={todoItems} />
            </div>
        )
    }

    const textColor = message.role === 'user' ? 'white' : 'inherit'
    const mentionColor = message.role === 'user' ? 'white' : '#1890ff'
    const displayContent = message.typing ? displayedText : message.content

    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {renderWithMentions(displayContent, textColor, mentionColor)}
        </span>
    )
}

export default MessageBubble
