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
import { useLanguage } from '../../../context/LanguageContext'

const { Title, Paragraph, Text } = Typography

const DeliveryStep: React.FC = () => {
    const { language } = useLanguage()
    const [downloaded, setDownloaded] = useState(false)

    const dataSourceZh = [
        { key: '1', name: '临床试验方案 (Design Protocol)', version: 'v1.0 (Final)', type: 'PDF / Word', size: '2.4 MB', status: '已签署' },
        { key: '2', name: '方案摘要 (Synopsis)', version: 'v1.0', type: 'PDF', size: '0.8 MB', status: '就绪' },
        { key: '3', name: '中心选择列表 (Site Selection List)', version: 'Tier 1', type: 'Excel', size: '156 KB', status: '就绪' },
        { key: '4', name: '预算估算表 (Budget Estimation)', version: 'Final', type: 'Excel', size: '98 KB', status: '已批准' },
        { key: '5', name: '合规性扫描报告 (Compliance Report)', version: 'v1.0', type: 'PDF', size: '1.2 MB', status: '已通过' },
    ]
    const dataSourceEn = [
        { key: '1', name: 'Clinical Study Protocol', version: 'v1.0 (Final)', type: 'PDF / Word', size: '2.4 MB', status: 'Signed' },
        { key: '2', name: 'Protocol Synopsis', version: 'v1.0', type: 'PDF', size: '0.8 MB', status: 'Ready' },
        { key: '3', name: 'Site Selection List', version: 'Tier 1', type: 'Excel', size: '156 KB', status: 'Ready' },
        { key: '4', name: 'Budget Estimation', version: 'Final', type: 'Excel', size: '98 KB', status: 'Approved' },
        { key: '5', name: 'Compliance Report', version: 'v1.0', type: 'PDF', size: '1.2 MB', status: 'Passed' },
    ]
    const dataSource = language === 'zh' ? dataSourceZh : dataSourceEn

    const columns = [
        { title: language === 'zh' ? '文件名称' : 'Document Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: language === 'zh' ? '版本' : 'Version', dataIndex: 'version', key: 'version' },
        {
            title: language === 'zh' ? '格式' : 'Format', dataIndex: 'type', key: 'type', render: (text: string) => {
                if (text.includes('PDF')) return <Tag icon={<FilePdfOutlined />}>{text}</Tag>
                if (text.includes('Excel')) return <Tag icon={<FileExcelOutlined />} color="green">{text}</Tag>
                return <Tag icon={<FileWordOutlined />} color="blue">{text}</Tag>
            }
        },
        { title: language === 'zh' ? '大小' : 'Size', dataIndex: 'size', key: 'size' },
        { title: language === 'zh' ? '状态' : 'Status', dataIndex: 'status', key: 'status', render: (text: string) => <Tag icon={<CheckCircleOutlined />} color="success">{text}</Tag> },
        { title: language === 'zh' ? '操作' : 'Action', key: 'action', render: () => <Button type="link" icon={<CloudDownloadOutlined />}>{language === 'zh' ? '下载' : 'Download'}</Button> }
    ]

    return (
        <Card bordered={false} className="shadow-sm flex flex-col h-full bg-gray-50" styles={{ body: { padding: '40px', flex: 1, overflowY: 'auto' } }}>
            <div className="max-w-5xl mx-auto w-full bg-white p-10 shadow rounded-lg">
                {!downloaded ? (
                    <div className="text-center mb-10">
                        <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} className="mb-4" />
                        <Title level={2}>{language === 'zh' ? '方案生成工作已圆满完成！' : 'Protocol Generation Completed!'}</Title>
                        <Paragraph className="text-lg text-gray-500">
                            The Protocol Generation Workflow is successfully completed.
                        </Paragraph>
                        <Paragraph>
                            {language === 'zh'
                                ? '所有交付物已通过多方评审与合规性校验，现已打包生成完毕。您可以直接下载或发送至指定邮箱。'
                                : 'All deliverables have passed multi-party review and compliance validation, and are now packaged. You can download them directly or send them to a specified email.'}
                        </Paragraph>
                        <Space size="middle" className="mt-4">
                            <Button type="primary" size="large" icon={<CloudDownloadOutlined />} onClick={() => setDownloaded(true)}>
                                {language === 'zh' ? '一键下载交付包 (ZIP)' : 'Download Full Package (ZIP)'}
                            </Button>
                            <Button size="large" icon={<MailOutlined />}>
                                {language === 'zh' ? '发送至邮箱' : 'Send to Email'}
                            </Button>
                            <Button size="large" icon={<HistoryOutlined />}>
                                {language === 'zh' ? '归档至 DMS' : 'Archive to DMS'}
                            </Button>
                        </Space>
                    </div>
                ) : (
                    <Result
                        status="success"
                        title={language === 'zh' ? '下载已开始' : 'Download Started'}
                        subTitle={language === 'zh' ? '交付包 GC-001_Final_Package.zip 正在下载中...' : 'Deliverable package GC-001_Final_Package.zip is downloading...'}
                        extra={[
                            <Button type="primary" key="console" onClick={() => setDownloaded(false)}>
                                {language === 'zh' ? '返回详情页' : 'Back to Details'}
                            </Button>,
                            <Button key="buy">{language === 'zh' ? '查看归档记录' : 'View Archive Log'}</Button>,
                        ]}
                    />
                )}

                <Divider />

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4} style={{ margin: 0 }}>{language === 'zh' ? '交付物清单' : 'Deliverables List'} (Deliverables)</Title>
                        <Tag color="blue" icon={<SafetyCertificateOutlined />}>{language === 'zh' ? '所有文档已验证' : 'All Documents Validated'}</Tag>
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
                    <Descriptions title={language === 'zh' ? '项目摘要' : 'Project Summary'} bordered column={1}>
                        <Descriptions.Item label={language === 'zh' ? '项目编号' : 'Project ID'}>GC-001-301</Descriptions.Item>
                        <Descriptions.Item label={language === 'zh' ? '治疗领域' : 'Therapeutic Area'}>Oncology / Gastric Cancer</Descriptions.Item>
                        <Descriptions.Item label={language === 'zh' ? '方案设计时长' : 'Design Duration'}>1 Day(s)</Descriptions.Item>
                        <Descriptions.Item label={language === 'zh' ? '生成日期' : 'Generation Date'}>2026-01-20</Descriptions.Item>
                        <Descriptions.Item label={language === 'zh' ? '参与专家' : 'Experts Involved'} span={2}>
                            Project Manager, Biostatistician, Medical Monitor, Regulatory Specialist, Ops Lead, BD
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </Card>
    )
}

export default DeliveryStep


