import React from 'react'
import { CheckCircleFilled, LoadingOutlined, ClockCircleOutlined } from '@ant-design/icons'

export interface TodoItem {
    text: string
    status: 'pending' | 'completed' | 'loading'
}

interface TodoListProps {
    items: TodoItem[]
}

const TodoList: React.FC<TodoListProps> = ({ items }) => {
    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                    {item.status === 'completed' ? (
                        <CheckCircleFilled className="text-green-500 mt-1" />
                    ) : item.status === 'loading' ? (
                        <LoadingOutlined className="text-blue-500 mt-1" />
                    ) : (
                        <ClockCircleOutlined className="text-gray-400 mt-1" />
                    )}
                    <span className={`${item.status === 'completed' ? 'text-gray-500' :
                        item.status === 'loading' ? 'text-blue-600 font-medium' :
                            'text-gray-400'
                        }`}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default TodoList
