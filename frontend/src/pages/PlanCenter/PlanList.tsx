import React from 'react'
import { Card, Button, Tag, Table } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'
import { PlanItem } from './types'
import { mockPlansZh, mockPlansEn } from './mockData'
import { useLanguage } from '../../context/LanguageContext'

interface PlanListProps {
    onSelectPlan: (planId: string) => void;
}

const PlanList: React.FC<PlanListProps> = ({ onSelectPlan }) => {
    const { language } = useLanguage()

    const mockPlans = language === 'zh' ? mockPlansZh : mockPlansEn

    const statusColors = {
        'draft': 'default',
        'in-progress': 'processing',
        'completed': 'success'
    }

    const statusLabels = {
        'draft': language === 'zh' ? '草稿' : 'Draft',
        'in-progress': language === 'zh' ? '进行中' : 'In Progress',
        'completed': language === 'zh' ? '已完成' : 'Completed'
    }

    const columns = [
        {
            title: language === 'zh' ? '方案名称' : 'Plan Name',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: language === 'zh' ? '适应症' : 'Indication',
            dataIndex: 'indication',
            key: 'indication',
        },
        {
            title: language === 'zh' ? '分期' : 'Phase',
            dataIndex: 'phase',
            key: 'phase',
        },
        {
            title: language === 'zh' ? '申办方' : 'Sponsor',
            dataIndex: 'sponsor',
            key: 'sponsor',
        },
        {
            title: language === 'zh' ? '创建时间' : 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: language === 'zh' ? '状态' : 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: keyof typeof statusColors) => (
                <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
            )
        },
        {
            title: language === 'zh' ? '操作' : 'Action',
            key: 'action',
            render: (_: any, record: PlanItem) => (
                <Button
                    type="link"
                    icon={<FolderOpenOutlined />}
                    onClick={() => onSelectPlan(record.id)}
                >
                    {language === 'zh' ? '打开' : 'Open'}
                </Button>
            )
        }
    ]

    return (
        <div className="h-full p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">{language === 'zh' ? '方案列表' : 'Plan List'}</h2>
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
