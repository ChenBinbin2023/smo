import React from 'react'
import { Card, Button, Tag, Table } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'
import { PlanItem } from './types'
import { mockPlans } from './mockData'

interface PlanListProps {
    onSelectPlan: (planId: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ onSelectPlan }) => {
    const statusColors = {
        'draft': 'default',
        'in-progress': 'processing',
        'completed': 'success'
    }

    const statusLabels = {
        'draft': '草稿',
        'in-progress': '进行中',
        'completed': '已完成'
    }

    const columns = [
        {
            title: '方案名称',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: '适应症',
            dataIndex: 'indication',
            key: 'indication',
        },
        {
            title: '分期',
            dataIndex: 'phase',
            key: 'phase',
        },
        {
            title: '申办方',
            dataIndex: 'sponsor',
            key: 'sponsor',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: keyof typeof statusColors) => (
                <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: PlanItem) => (
                <Button
                    type="link"
                    icon={<FolderOpenOutlined />}
                    onClick={() => onSelectPlan(record.id)}
                >
                    打开
                </Button>
            )
        }
    ]

    return (
        <div className="h-full p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">方案列表</h2>
            <Table
                columns={columns}
                dataSource={mockPlans}
                rowKey="id"
                pagination={false}
            />
        </div>
    )
}

export default PlanList
