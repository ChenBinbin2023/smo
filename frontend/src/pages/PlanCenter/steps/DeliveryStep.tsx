import React, { useState } from 'react'
import { Card, Button, Typography, Divider, Descriptions, Tabs, Table, Tag, Result, Space } from 'antd'
import {
    CheckCircleOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    HistoryOutlined,
    CloudDownloadOutlined,
    MailOutlined,
    FileExcelOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const DeliveryStep: React.FC = () => {
    const [downloaded, setDownloaded] = useState(false)

    const dataSource = [
        {
            key: '1',
            name: '临床试验方案 (Design Protocol)',
            version: 'v1.0 (Final)',
            type: 'PDF / Word',
            size: '2.4 MB',
            status: 'Signed'
        },
        {
            key: '2',
            name: '方案摘要 (Synopsis)',
            version: 'v1.0',
            type: 'PDF',
            size: '0.8 MB',
            status: 'Ready'
        },
        {
            key: '3',
            name: '中心选择列表 (Site Selection List)',
            version: 'Tier 1',
            type: 'Excel',
            size: '156 KB',
            status: 'Ready'
        },
        {
            key: '4',
            name: '预算估算表 (Budget Estimation)',
            version: 'Final',
            type: 'Excel',
            size: '98 KB',
            status: 'Approved'
        },
        {
            key: '5',
            name: '合规性扫描报告 (Compliance Report)',
            version: 'v1.0',
            type: 'PDF',
            size: '1.2 MB',
            status: 'Passed'
        },
    ]

    const columns = [
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: '格式',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => {
                if (text.includes('PDF')) return <Tag icon={<FilePdfOutlined />}>{text}</Tag>
                if (text.includes('Excel')) return <Tag icon={<FileExcelOutlined />} color="green">{text}</Tag>
                return <Tag icon={<FileWordOutlined />} color="blue">{text}</Tag>
            }
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => <Tag icon={<CheckCircleOutlined />} color="success">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: () => <Button type="link" icon={<CloudDownloadOutlined />}>下载</Button>
        }
    ]

    return (
        <Card bordered={false} className="shadow-sm flex flex-col h-full bg-gray-50" styles={{ body: { padding: '40px', flex: 1, overflowY: 'auto' } }}>
            <div className="max-w-5xl mx-auto w-full bg-white p-10 shadow rounded-lg">
                {!downloaded ? (
                    <div className="text-center mb-10">
                        <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} className="mb-4" />
                        <Title level={2}>方案生成工作已圆满完成！</Title>
                        <Paragraph className="text-lg text-gray-500">
                            The Protocol Generation Workflow is successfully completed.
                        </Paragraph>
                        <Paragraph>
                            所有交付物已通过多方评审与合规性校验，现已打包生成完毕。您可以直接下载或发送至指定邮箱。
                        </Paragraph>
                        <Space size="middle" className="mt-4">
                            <Button type="primary" size="large" icon={<CloudDownloadOutlined />} onClick={() => setDownloaded(true)}>
                                一键下载交付包 (ZIP)
                            </Button>
                            <Button size="large" icon={<MailOutlined />}>
                                发送至邮箱
                            </Button>
                            <Button size="large" icon={<HistoryOutlined />}>
                                归档至 DMS
                            </Button>
                        </Space>
                    </div>
                ) : (
                    <Result
                        status="success"
                        title="下载已开始"
                        subTitle="交付包 GC-001_Final_Package.zip 正在下载中..."
                        extra={[
                            <Button type="primary" key="console" onClick={() => setDownloaded(false)}>
                                返回详情页
                            </Button>,
                            <Button key="buy">查看归档记录</Button>,
                        ]}
                    />
                )}

                <Divider />

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4} style={{ margin: 0 }}>交付物清单 (Deliverables)</Title>
                        <Tag color="blue" icon={<SafetyCertificateOutlined />}>All Documents Validated</Tag>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                    />
                </div>

                <div className="mt-10 p-6 bg-gray-50 rounded border border-gray-200">
                    <Descriptions title="项目摘要 (Project Summary)" bordered column={1}>
                        <Descriptions.Item label="项目编号">GC-001-301</Descriptions.Item>
                        <Descriptions.Item label="治疗领域">Oncology / Gastric Cancer</Descriptions.Item>
                        <Descriptions.Item label="方案设计时长">1 Day(s)</Descriptions.Item>
                        <Descriptions.Item label="生成日期">2026-01-20</Descriptions.Item>
                        <Descriptions.Item label="参与专家" span={2}>
                            Project Manager, Biostatistician, Medical Monitor, Regulatory Specialist, Ops Lead, BD
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </Card>
    )
}

export default DeliveryStep
