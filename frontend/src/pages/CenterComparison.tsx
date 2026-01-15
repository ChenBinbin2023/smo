import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Row, Col, Progress, Alert } from 'antd';
import { CheckCircleFilled, BarChartOutlined, BulbOutlined } from '@ant-design/icons';
import { useScheme } from '../context/SchemeContext';
import { Institution } from '../types';

const { Title, Text } = Typography;

const CenterComparison: React.FC = () => {
    const { getSchemeInstitutions, allInstitutions } = useScheme();
    const institutions = getSchemeInstitutions();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (institutions.length > 0) {
            setSelectedIds(institutions.map(i => i.id));
        } else {
            // Default to first few from allInstitutions if scheme is empty
            setSelectedIds(allInstitutions.slice(0, 3).map(i => i.id));
        }
    }, [institutions, allInstitutions]);

    const displayInstitutions = allInstitutions.filter(i => selectedIds.includes(i.id));

    const columns = [
        {
            title: '对比指标',
            dataIndex: 'indicator',
            key: 'indicator',
            width: 150,
            fixed: 'left' as const,
            render: (text: string) => <Text strong>{text}</Text>
        },
        ...displayInstitutions.map(inst => ({
            title: inst.name,
            key: inst.id,
            align: 'center' as const,
            render: (_: any, record: any) => {
                const value = record.values[inst.id];
                return record.render ? record.render(value, inst) : value;
            }
        })),
        {
            title: '结论建议',
            dataIndex: 'conclusion',
            key: 'conclusion',
            width: 200,
            fixed: 'right' as const,
            render: (text: string) => (
                <div className="flex items-start space-x-1">
                    <BulbOutlined className="text-yellow-500 mt-1" />
                    <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>
                </div>
            )
        }
    ];

    const comparisonData = [
        {
            key: 'score',
            indicator: '综合评分',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.score])),
            conclusion: '复旦肿瘤综合指标最优，为首选中心。',
            render: (v: number) => <Progress percent={v} size="small" strokeColor={v > 90 ? '#52c41a' : '#1677ff'} />
        },
        {
            key: 'rate',
            indicator: '预计月入组',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.rate])),
            conclusion: '华东区整体入组速率高于平均。',
            render: (v: number) => <Tag color="blue">{v} 人/月</Tag>
        },
        {
            key: 'ethics',
            indicator: '伦理审批',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.ethicsApproval])),
            conclusion: '中山中心审批最快，仅需12天。',
        },
        {
            key: 'contract',
            indicator: '合同周期',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.contractApproval])),
            conclusion: '北京肿瘤历史周期较长。',
        },
        {
            key: 'pi_load',
            indicator: 'PI 在研项目',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.piLoad])),
            conclusion: '张PI负荷超过临界值(4项)。',
            render: (v: string) => <Text type={parseFloat(v) > 4 ? 'danger' : 'secondary'}>{v}</Text>
        },
        {
            key: 'crc',
            indicator: 'CRC 配置',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.crcRatio])),
            conclusion: '资源配置充足，满足 1:1.5 要求。',
        }
    ];

    return (
        <div className="space-y-4">
            <Card bordered={false} className="glass-card" title={
                <div className="flex justify-between items-center w-full">
                    <Space>
                        <BarChartOutlined />
                        <span>中心推荐策略对比</span>
                    </Space>
                    <Space>
                        <Button size="small">策略调整</Button>
                        <Button type="primary" size="small">确认此中心组合</Button>
                    </Space>
                </div>
            }>
                <Table
                    columns={columns as any}
                    dataSource={comparisonData}
                    pagination={false}
                    size="small"
                    scroll={{ x: 'max-content' }}
                    bordered
                />

                <div className="mt-6">
                    <Alert
                        message="AI 优选建议"
                        description={
                            <div className="mt-2 text-sm text-gray-600">
                                基于当前 <Text strong>NSCLC III期项目</Text> 需求，系统推荐优先启动 <Text strong>复旦肿瘤</Text> 和 <Text strong>中山肿瘤</Text>。
                                这两个中心在既往相似项目中表现出更强的入组启动协同效率。
                                注意：<Text type="warning">北京肿瘤</Text> 存在高 PI 负荷风险，建议作为备选中心。
                            </div>
                        }
                        type="info"
                        showIcon
                        icon={<BulbOutlined />}
                    />
                </div>
            </Card>
        </div>
    );
};

export default CenterComparison;
