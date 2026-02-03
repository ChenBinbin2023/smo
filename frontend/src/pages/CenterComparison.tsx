import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Row, Col, Progress, Alert } from 'antd';
import { CheckCircleFilled, BarChartOutlined, BulbOutlined } from '@ant-design/icons';
import { useScheme } from '../context/SchemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Institution } from '../types';

const { Title, Text } = Typography;

const CenterComparison: React.FC = () => {
    const { getSchemeInstitutions, allInstitutions, setCurrentStep } = useScheme();
    const institutions = getSchemeInstitutions();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { language, t } = useLanguage();

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
            title: language === 'zh' ? '对比指标' : 'Indicator',
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
            title: language === 'zh' ? '结论建议' : 'Conclusion',
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
            indicator: language === 'zh' ? '综合评分' : 'Overall Score',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.score])),
            conclusion: language === 'zh' ? '复旦肿瘤综合指标最优，为首选中心。' : 'Fudan Cancer Center has the best overall indicators and is the primary site.',
            render: (v: number) => <Progress percent={v} size="small" strokeColor={v > 90 ? '#52c41a' : '#1677ff'} />
        },
        {
            key: 'rate',
            indicator: language === 'zh' ? '预计月入组' : 'Est. Monthly Enrollment',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.rate])),
            conclusion: language === 'zh' ? '华东区整体入组速率高于平均。' : 'Enrollment rate in East China is generally above average.',
            render: (v: number) => <Tag color="blue">{v} {language === 'zh' ? '人/月' : 'pts/mo'}</Tag>
        },
        {
            key: 'ethics',
            indicator: language === 'zh' ? '伦理审批' : 'Ethics Approval',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.ethicsApproval])),
            conclusion: language === 'zh' ? '中山中心审批最快，仅需12天。' : 'SYSUCC has the fastest approval, only 12 days.',
        },
        {
            key: 'contract',
            indicator: language === 'zh' ? '合同周期' : 'Contract Cycle',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.contractApproval])),
            conclusion: language === 'zh' ? '北京肿瘤历史周期较长。' : 'Beijing Cancer Hospital has a long historical cycle.',
        },
        {
            key: 'pi_load',
            indicator: language === 'zh' ? 'PI 在研项目' : 'Ongoing Projects (PI)',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.piLoad])),
            conclusion: language === 'zh' ? '张PI负荷超过临界值(4项)。' : 'PI Zhang\'s load exceeds the critical value (4 projects).',
            render: (v: string) => <Text type={parseFloat(v) > 4 ? 'danger' : 'secondary'}>{v}</Text>
        },
        {
            key: 'crc',
            indicator: language === 'zh' ? 'CRC 配置' : 'CRC Allocation',
            values: Object.fromEntries(allInstitutions.map(i => [i.id, i.crcRatio])),
            conclusion: language === 'zh' ? '资源配置充足，满足 1:1.5 要求。' : 'Resource allocation is sufficient, meets 1:1.5 requirement.',
        }
    ];

    return (
        <div className="space-y-4">
            <Card bordered={false} className="glass-card" title={
                <div className="flex justify-between items-center w-full">
                    <Space>
                        <BarChartOutlined />
                        <span>{language === 'zh' ? '中心推荐策略对比' : 'Comparison of Site Recommendation Strategies'}</span>
                    </Space>
                    <Space>
                        <Button size="small">{language === 'zh' ? '策略调整' : 'Strategy Adjustment'}</Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => setCurrentStep('compliance')}
                        >
                            {language === 'zh' ? '确认此中心组合' : 'Confirm Site Combination'}
                        </Button>
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
                        message={language === 'zh' ? "AI 优选建议" : "AI Optimal Recommendation"}
                        description={
                            <div className="mt-2 text-sm text-gray-600">
                                {language === 'zh'
                                    ? <>基于当前 <Text strong>NSCLC III期项目</Text> 需求，系统推荐优先启动 <Text strong>复旦肿瘤</Text> 和 <Text strong>中山肿瘤</Text>。</>
                                    : <>Based on current <Text strong>NSCLC Phase III</Text> requirements, the system recommends prioritizing <Text strong>Fudan Cancer Center</Text> and <Text strong>SYSUCC</Text>.</>}
                                {language === 'zh'
                                    ? ' 这两个中心在既往相似项目中表现出更强的入组启动协同效率。'
                                    : ' These two sites have shown stronger enrollment and startup synergy in past similar projects.'}
                                {language === 'zh'
                                    ? <> 注意：<Text type="warning">北京肿瘤</Text> 存在高 PI 负荷风险，建议作为备选中心。</>
                                    : <> Note: <Text type="warning">Beijing Cancer Hospital</Text> has a high PI load risk, suggested as an alternative site.</>}
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
