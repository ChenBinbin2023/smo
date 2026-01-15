import React, { useState } from 'react';
import { Card, Select, Typography, Space, Tag, Button, Row, Col, Divider, List, Progress, Tooltip, Alert } from 'antd';
import { SafetyCertificateOutlined, CheckCircleFilled, WarningFilled, CloseCircleFilled, InfoCircleOutlined, FileProtectOutlined, ExperimentOutlined, AuditOutlined, BankOutlined } from '@ant-design/icons';
import { useScheme, useInstitutions } from '../../context/SchemeContext';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CheckCategory {
    name: string;
    icon: React.ReactNode;
    color: string;
    items: CheckItem[];
}

interface CheckItem {
    name: string;
    status: 'passed' | 'warning' | 'failed';
    description: string;
    detail?: string;
}

const complianceData: Record<string, CheckCategory> = {
    qualification: {
        name: '资质审查',
        icon: <SafetyCertificateOutlined />,
        color: '#1677ff',
        items: [
            { name: 'GCP证书有效期', status: 'passed', description: 'GCP证书有效（2027-06-30到期）', detail: '状态正常，无需特殊关注' },
            { name: '备案专业匹配', status: 'passed', description: '备案专业：肿瘤内科', detail: '与项目适应症匹配' },
            { name: '机构等级认定', status: 'passed', description: '三甲医院', detail: '符合要求' },
            { name: '研究者执业资格', status: 'warning', description: '研究者3人，需确认PI人选', detail: '建议提前确定PI' },
            { name: '设施设备配置', status: 'passed', description: '设施配置完整', detail: '满足项目需求' }
        ]
    },
    compliance: {
        name: '合规性检查',
        icon: <AuditOutlined />,
        color: '#52c41a',
        items: [
            { name: '法规遵循状态', status: 'passed', description: '符合GCP及相关法规要求', detail: '无违规记录' },
            { name: '备案完整度', status: 'passed', description: '备案信息完整', detail: '已通过核查' },
            { name: '伦理审批历史', status: 'passed', description: '历史审批正常', detail: '平均审批周期15天' },
            { name: '合规事件记录', status: 'passed', description: '近2年无合规事件', detail: '记录良好' },
            { name: '检查/审计结果', status: 'passed', description: '最近一次检查通过', detail: '无重大发现' }
        ]
    },
    risks: {
        name: '风险提示',
        icon: <WarningFilled />,
        color: '#faad14',
        items: [
            { name: '竞争试验风险', status: 'warning', description: '存在同适应症竞争试验 CTR20240089', detail: '可能分流15-20%合格患者' },
            { name: 'PI负荷风险', status: 'passed', description: 'PI在研项目3.2项', detail: '在可接受范围内' },
            { name: '入组能力风险', status: 'passed', description: '入组能力稳定', detail: '历史完成率92%' },
            { name: '启动延期风险', status: 'passed', description: '启动周期正常', detail: '平均45天' },
            { name: '数据质量风险', status: 'passed', description: '数据质量良好', detail: 'Query率低于均值' }
        ]
    },
    ethics: {
        name: '伦理协议',
        icon: <FileProtectOutlined />,
        color: '#722ed1',
        items: [
            { name: '伦理委员会类型', status: 'passed', description: '独立伦理委员会', detail: '类型符合要求' },
            { name: '伦理审批周期', status: 'passed', description: '平均15天', detail: '双周开会' },
            { name: '伦理费标准', status: 'passed', description: '费用：8000元', detail: '在合理范围内' },
            { name: '协议模板可用性', status: 'passed', description: '有标准协议模板', detail: '可直接使用' },
            { name: '历史伦理问题', status: 'passed', description: '无历史问题', detail: '记录良好' }
        ]
    },
    regulations: {
        name: '法律法规',
        icon: <BankOutlined />,
        color: '#13c2c2',
        items: [
            { name: '遗传办要求', status: 'passed', description: '需进行遗传办备案', detail: '流程已熟悉' },
            { name: '注册申报要求', status: 'passed', description: '符合注册申报要求', detail: '满足申报条件' },
            { name: '地方性法规', status: 'passed', description: '符合地方要求', detail: '无需特殊处理' },
            { name: '行业标准规范', status: 'passed', description: '符合行业规范', detail: '遵循最新标准' },
            { name: '最新政策变化', status: 'passed', description: '无重大政策影响', detail: '已跟踪最新政策' }
        ]
    },
    medical: {
        name: '医学量表/指标',
        icon: <ExperimentOutlined />,
        color: '#eb2f96',
        items: [
            { name: '量表版权状态', status: 'passed', description: '量表版权已获取', detail: '可正常使用' },
            { name: '指标检测能力', status: 'passed', description: '支持所有必需指标检测', detail: '设备齐全' },
            { name: '特殊设备要求', status: 'passed', description: '特殊设备已配置', detail: '满足需求' },
            { name: '实验室资质', status: 'passed', description: '实验室已获认证', detail: '资质有效' },
            { name: '样本存储条件', status: 'passed', description: '样本存储条件符合要求', detail: '设施完善' }
        ]
    }
};

const ComplianceCheckCenter: React.FC = () => {
    const { currentScheme, selectedInstitutionId, setSelectedInstitutionId, selectInstitution } = useScheme();
    const { getInstitution, getSchemeInstitutions } = useInstitutions();
    const [activeCategory, setActiveCategory] = useState<string>('qualification');

    const institutions = getSchemeInstitutions();
    const selectedInstitution = selectedInstitutionId ? getInstitution(selectedInstitutionId) : null;

    const categories: [string, CheckCategory][] = Object.entries(complianceData);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'passed': return <CheckCircleFilled style={{ color: '#52c41a' }} />;
            case 'warning': return <WarningFilled style={{ color: '#faad14' }} />;
            case 'failed': return <CloseCircleFilled style={{ color: '#ff4d4f' }} />;
            default: return <InfoCircleOutlined />;
        }
    };

    const getOverallStatus = () => {
        if (!selectedInstitution) return null;
        const data = complianceData[activeCategory];
        if (!data) return null;
        const passed = data.items.filter(i => i.status === 'passed').length;
        const total = data.items.length;
        return (
            <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic title="通过" value={passed} valueStyle={{ color: '#52c41a' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic title="警告" value={data.items.filter(i => i.status === 'warning').length} valueStyle={{ color: '#faad14' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic title="不通过" value={data.items.filter(i => i.status === 'failed').length} valueStyle={{ color: '#ff4d4f' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic title="通过率" value={Math.round((passed / total) * 100)} suffix="%" />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    const Statistic: React.FC<{ title: string; value: number | string; valueStyle?: React.CSSProperties; suffix?: string }> = ({ title, value, valueStyle, suffix }) => (
        <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{title}</Text>
            <div style={{ fontSize: 24, fontWeight: 600, ...valueStyle }}>
                {value}{suffix}
            </div>
        </div>
    );

    return (
        <div className="pb-10">
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">方案：</Text>
                <Text strong>{currentScheme?.name}</Text>
                <span style={{ margin: '0 12px' }}>»</span>
                <Text type="secondary">选择中心：</Text>
                <Select
                    value={selectedInstitutionId}
                    onChange={(value) => selectInstitution(value)}
                    style={{ width: 240, marginLeft: 8 }}
                    placeholder="请选择机构进行合规检查"
                >
                    {institutions.map(inst => (
                        <Option key={inst.id} value={inst.id}>{inst.name}</Option>
                    ))}
                </Select>
            </div>

            {!selectedInstitution ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <SafetyCertificateOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                        <Title level={4} style={{ marginTop: 16, color: '#999' }}>请先选择要检查的机构</Title>
                        <Text type="secondary">从上方选择机构后，将展示该机构的合规检查结果</Text>
                    </div>
                </Card>
            ) : (
                <Row gutter={24}>
                    <Col span={6}>
                        <Card size="small" title="检查分类" bordered={false} style={{ background: '#fafafa' }}>
                            <List
                                size="small"
                                dataSource={Object.entries(complianceData) as [string, CheckCategory][]}
                                renderItem={([key, cat]) => {
                                    const hasWarning = cat.items.some(i => i.status === 'warning');
                                    const hasFailed = cat.items.some(i => i.status === 'failed');
                                    const statusDot = hasFailed ? 'red' : hasWarning ? 'orange' : 'green';
                                    return (
                                        <List.Item
                                            style={{
                                                cursor: 'pointer',
                                                background: activeCategory === key ? '#e6f4ff' : 'transparent',
                                                padding: '12px',
                                                marginBottom: 4,
                                                borderRadius: 6
                                            }}
                                            onClick={() => setActiveCategory(key)}
                                        >
                                            <Space>
                                                <span style={{ color: cat.color }}>{cat.icon}</span>
                                                <span>{cat.name}</span>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: statusDot
                                                }} />
                                            </Space>
                                        </List.Item>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card bordered={false} className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Space>
                                    <span style={{ color: complianceData[activeCategory]?.color, fontSize: 20 }}>
                                        {complianceData[activeCategory]?.icon}
                                    </span>
                                    <Title level={4} style={{ margin: 0 }}>{complianceData[activeCategory]?.name}</Title>
                                </Space>
                                <Tag color="blue">{selectedInstitution.name}</Tag>
                            </div>

                            {getOverallStatus()}

                            <List
                                dataSource={complianceData[activeCategory]?.items || []}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card size="small" style={{ width: '100%' }}>
                                            <Row align="middle">
                                                <Col span={20}>
                                                    <Space>
                                                        {getStatusIcon(item.status)}
                                                        <Text strong>{item.name}</Text>
                                                    </Space>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>{item.description}</Text>
                                                    </div>
                                                    {item.detail && (
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            <InfoCircleOutlined style={{ marginRight: 4 }} />
                                                            {item.detail}
                                                        </Text>
                                                    )}
                                                </Col>
                                                <Col span={4} style={{ textAlign: 'right' }}>
                                                    <Tag color={item.status === 'passed' ? 'success' : item.status === 'warning' ? 'warning' : 'error'}>
                                                        {item.status === 'passed' ? '通过' : item.status === 'warning' ? '警告' : '不通过'}
                                                    </Tag>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text type="secondary">检查时间：</Text>
                                    <Text>{new Date().toLocaleString('zh-CN')}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary">数据来源：</Text>
                                    <Text>机构档案 + 官方公示</Text>
                                </Col>
                            </Row>

                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Button>导出检查报告</Button>
                                <Space>
                                    <Button onClick={() => selectInstitution('')}>切换机构</Button>
                                    <Button type="primary">确认并进入下一步</Button>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ComplianceCheckCenter;
