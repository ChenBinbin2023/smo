import React, { useState } from 'react';
import { Card, Select, Typography, Space, Tag, Button, Row, Col, Table, Statistic, Progress, Divider, Radio } from 'antd';
import { LineChartOutlined, ThunderboltOutlined, CheckCircleFilled, BulbOutlined } from '@ant-design/icons';
import { useScheme, useInstitutions } from '../../context/SchemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Institution } from '../../types';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface SimulationScenario {
    name: string;
    rateMultiplier: number;
    probability: number;
    completionMonths: number;
    impact: 'low' | 'medium' | 'high';
}

const SimulationCenter: React.FC = () => {
    const { currentScheme, selectedInstitutionId, selectInstitution } = useScheme();
    const { getInstitution, getSchemeInstitutions } = useInstitutions();
    const { language, t } = useLanguage();
    const [targetCases, setTargetCases] = useState(30);
    const [selectedScenario, setSelectedScenario] = useState('normal');

    const institutions = getSchemeInstitutions();
    const selectedInstitution = selectedInstitutionId ? getInstitution(selectedInstitutionId) : null;

    const scenarios: SimulationScenario[] = [
        { name: language === 'zh' ? '正常情况' : 'Baseline', rateMultiplier: 1, probability: 92, completionMonths: 6.7, impact: 'low' },
        { name: language === 'zh' ? '入组下降 30%' : 'Enrollment -30%', rateMultiplier: 0.7, probability: 78, completionMonths: 9.6, impact: 'medium' },
        { name: language === 'zh' ? '入组下降 50%' : 'Enrollment -50%', rateMultiplier: 0.5, probability: 65, completionMonths: 13.4, impact: 'high' }
    ];

    const currentScenario = scenarios.find(s => s.name === selectedScenario) || scenarios[0];

    const getScenarioColor = (impact: string) => {
        switch (impact) {
            case 'high': return '#ff4d4f';
            case 'medium': return '#faad14';
            default: return '#52c41a';
        }
    };

    const getImpactText = (impact: string) => {
        switch (impact) {
            case 'high': return language === 'zh' ? '高影响' : 'High Impact';
            case 'medium': return language === 'zh' ? '中等影响' : 'Med Impact';
            default: return language === 'zh' ? '低影响' : 'Low Impact';
        }
    };

    const predictionColumns = [
        { title: language === 'zh' ? '机构' : 'Site', dataIndex: 'name', key: 'name' },
        {
            title: language === 'zh' ? '预计速率' : 'Est. Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate: number) => `${rate}/${language === 'zh' ? '月' : 'mo'}`
        },
        {
            title: language === 'zh' ? '分配目标' : 'Target',
            dataIndex: 'target',
            key: 'target',
            render: (t: number) => `${t}${language === 'zh' ? '例' : ' pts'}`
        },
        { title: language === 'zh' ? '预计完成' : 'Est. Completion', dataIndex: 'completion', key: 'completion' },
        { title: language === 'zh' ? '置信度' : 'Confidence', dataIndex: 'confidence', key: 'confidence' },
        { title: language === 'zh' ? '风险' : 'Risk', dataIndex: 'risk', key: 'risk' }
    ];

    const predictionData = [
        { key: '1', name: language === 'zh' ? '复旦肿瘤' : 'Fudan Cancer', rate: 4.5, target: 30, completion: language === 'zh' ? '6.7月' : '6.7mo', confidence: language === 'zh' ? '高' : 'High', risk: language === 'zh' ? '低' : 'Low' },
        { key: '2', name: language === 'zh' ? '浙江肿瘤' : 'Zhejiang Cancer', rate: 3.8, target: 25, completion: language === 'zh' ? '6.6月' : '6.6mo', confidence: language === 'zh' ? '中' : 'Med', risk: language === 'zh' ? '中' : 'Med' },
        { key: '3', name: language === 'zh' ? '中山肿瘤' : 'SYSUCC', rate: 3.5, target: 25, completion: language === 'zh' ? '7.1月' : '7.1mo', confidence: language === 'zh' ? '高' : 'High', risk: language === 'zh' ? '低' : 'Low' },
        { key: '4', name: language === 'zh' ? '北京肿瘤' : 'Beijing Cancer', rate: 3.8, target: 25, completion: language === 'zh' ? '6.6月' : '6.6mo', confidence: language === 'zh' ? '中' : 'Med', risk: language === 'zh' ? '低' : 'Low' }
    ];

    const getConfidenceColor = (conf: string) => {
        switch (conf) {
            case '高':
            case 'High': return 'success';
            case '中':
            case 'Med': return 'warning';
            default: return 'error';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case '低':
            case 'Low': return 'green';
            case '中':
            case 'Med': return 'orange';
            default: return 'red';
        }
    };

    return (
        <div className="pb-10">
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary">{language === 'zh' ? '方案：' : 'Scheme: '}</Text>
                <Text strong>{currentScheme?.name}</Text>
                <span style={{ margin: '0 12px' }}>»</span>
                <Text type="secondary">{language === 'zh' ? '选择中心：' : 'Select Site: '}</Text>
                <Select
                    value={selectedInstitutionId}
                    onChange={(value) => selectInstitution(value)}
                    style={{ width: 240, marginLeft: 8 }}
                    placeholder={language === 'zh' ? "请选择机构进行模拟" : "Select site for simulation"}
                >
                    {institutions.map((inst: Institution) => (
                        <Option key={inst.id} value={inst.id}>{inst.name}</Option>
                    ))}
                    <Option value="all">{language === 'zh' ? '全部模拟' : 'Simulate All'}</Option>
                </Select>
            </div>

            {!selectedInstitution ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <LineChartOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                        <Title level={4} style={{ marginTop: 16, color: '#999' }}>{language === 'zh' ? '请先选择要模拟的机构' : 'Please select a site to simulate'}</Title>
                        <Text type="secondary">{language === 'zh' ? '从上方选择机构后，将展示该机构的入组预测模拟结果' : 'After selecting a site, enrollment prediction simulation will be shown'}</Text>
                    </div>
                </Card>
            ) : (
                <Row gutter={24}>
                    <Col span={16}>
                        <Card bordered={false} className="glass-card" title={`${selectedInstitution.name} - ${language === 'zh' ? '入组预测模拟' : 'Enrollment Simulation'}`}>
                            <div style={{ marginBottom: 24 }}>
                                <Title level={5}>{language === 'zh' ? '当前状态' : 'Current Status'}</Title>
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Statistic
                                            title={language === 'zh' ? "历史入组均值" : "Hist. Enrollment Avg"}
                                            value={selectedInstitution.rate}
                                            suffix={language === 'zh' ? "人/月" : " pts/mo"}
                                            valueStyle={{ fontSize: 24 }}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title={language === 'zh' ? "该适应症入组" : "Indication Enrollment"}
                                            value={(selectedInstitution.rate * 1.15).toFixed(1)}
                                            suffix={language === 'zh' ? "人/月" : " pts/mo"}
                                            valueStyle={{ fontSize: 24 }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary">{language === 'zh' ? '置信区间：' : 'Confidence Interval: '}</Text>
                                        <Text>{(selectedInstitution.rate * 0.85).toFixed(1)} - {(selectedInstitution.rate * 1.2).toFixed(1)} {language === 'zh' ? '人/月' : ' pts/mo'}</Text>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                    <BulbOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                    {language === 'zh'
                                        ? <>您可以通过左侧 <Text strong>AI 对话</Text> 描述特定的模拟条件（如：如果入组标准放宽，结果会如何？）</>
                                        : <>You can describe specific simulation conditions via <Text strong>AI Chat</Text> (e.g., what if inclusion criteria are relaxed?)</>}
                                </Text>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Text type="secondary">{language === 'zh' ? '目标入组人数：' : 'Target Enrollment: '}</Text>
                                        <Select
                                            value={targetCases}
                                            onChange={setTargetCases}
                                            style={{ width: 120, marginLeft: 8 }}
                                        >
                                            {[20, 25, 30, 35, 40, 50, 100].map(n => (
                                                <Option key={n} value={n}>{n} {language === 'zh' ? '例' : ' pts'}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary">{language === 'zh' ? '环境风险场景：' : 'Risk Scenario: '}</Text>
                                        <Radio.Group
                                            value={selectedScenario}
                                            onChange={(e) => setSelectedScenario(e.target.value)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <Radio.Button value="normal">{language === 'zh' ? '基准' : 'Baseline'}</Radio.Button>
                                            <Radio.Button value="down30">{language === 'zh' ? '波动 (-30%)' : 'Fluct (-30%)'}</Radio.Button>
                                            <Radio.Button value="down50">{language === 'zh' ? '极端 (-50%)' : 'Extreme (-50%)'}</Radio.Button>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                            </div>

                            <Button type="primary" icon={<ThunderboltOutlined />}>
                                {language === 'zh' ? '运行模拟' : 'Run Simulation'}
                            </Button>

                            <Divider />

                            <div style={{ marginBottom: 24 }}>
                                <Title level={5}>{language === 'zh' ? '模拟结果' : 'Simulation Result'}</Title>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card size="small" style={{ background: '#f5f5f5' }}>
                                            <Statistic
                                                title={currentScenario.name}
                                                value={currentScenario.completionMonths}
                                                suffix={language === 'zh' ? "个月完成" : " mo to complete"}
                                                valueStyle={{
                                                    fontSize: 28,
                                                    color: getScenarioColor(currentScenario.impact)
                                                }}
                                            />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {language === 'zh' ? '概率' : 'Probability'} {currentScenario.probability}%
                                            </Text>
                                        </Card>
                                    </Col>
                                    <Col span={16}>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                            <div style={{ flex: 1 }}>
                                                <Text type="secondary">{language === 'zh' ? '影响评估：' : 'Impact Assessment: '}</Text>
                                                <Tag color={getScenarioColor(currentScenario.impact)} style={{ marginLeft: 8 }}>
                                                    {getImpactText(currentScenario.impact)}
                                                </Tag>
                                                {currentScenario.impact === 'high' && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text type="secondary">{language === 'zh' ? '需增加 2-3 家备选机构，或调整入排标准' : 'Need 2-3 additional sites or adjust criteria'}</Text>
                                                    </div>
                                                )}
                                                {currentScenario.impact === 'medium' && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text type="secondary">{language === 'zh' ? '启动备选机构（南京鼓楼）可补充 2.8 人/月' : 'Activate alt site (Nanjing Gulou) +2.8 pts/mo'}</Text>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <Title level={5}>{language === 'zh' ? '分中心预测详情' : 'Site-wise Prediction Details'}</Title>
                            <Table
                                size="small"
                                pagination={false}
                                dataSource={predictionData}
                                columns={predictionColumns.map(col => ({
                                    ...col,
                                    render: (val: any, record: any, index: number) => {
                                        if (col.key === 'confidence') {
                                            return <Tag color={getConfidenceColor(val)}>{val}</Tag>;
                                        }
                                        if (col.key === 'risk') {
                                            return <Tag color={getRiskColor(val)}>{val}</Tag>;
                                        }
                                        return val;
                                    }
                                }))}
                            />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card bordered={false} className="glass-card" title={language === 'zh' ? "应对建议" : "Mitigation Advice"}>
                            <div className="space-y-4">
                                <div>
                                    <Text strong style={{ color: '#52c41a' }}>
                                        <CheckCircleFilled style={{ marginRight: 8 }} />
                                        {currentScenario.name}
                                    </Text>
                                    <div style={{ marginLeft: 24, marginTop: 8 }}>
                                        <Text>{language === 'zh' ? `预计 ${currentScenario.completionMonths} 个月完成，概率 ${currentScenario.probability}%` : `Est. ${currentScenario.completionMonths} mo to complete, Prob ${currentScenario.probability}%`}</Text>
                                    </div>
                                </div>

                                {currentScenario.impact !== 'low' && (
                                    <div>
                                        <Divider />
                                        <Title level={5}>{language === 'zh' ? '应对策略' : 'Strategies'}</Title>
                                        {currentScenario.impact === 'medium' && (
                                            <div style={{ background: '#fffbe6', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                                                <Text strong style={{ color: '#d48806' }}>{language === 'zh' ? '策略 1：启动备选机构' : 'Strategy 1: Launch Alt Site'}</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>{language === 'zh' ? '南京鼓楼医院可补充 2.8 人/月' : 'Nanjing Gulou can add 2.8 pts/mo'}</Text>
                                                </div>
                                                <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                    {language === 'zh' ? '添加到方案' : 'Add to Scheme'}
                                                </Button>
                                            </div>
                                        )}
                                        {currentScenario.impact === 'high' && (
                                            <>
                                                <div style={{ background: '#fff2f0', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                                                    <Text strong style={{ color: '#cf1322' }}>{language === 'zh' ? '策略 1：增加备选机构' : 'Strategy 1: Add More Sites'}</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>{language === 'zh' ? '需增加 2-3 家备选机构' : 'Requires 2-3 more sites'}</Text>
                                                    </div>
                                                    <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                        {language === 'zh' ? '查看推荐备选' : 'View Recommendations'}
                                                    </Button>
                                                </div>
                                                <div style={{ background: '#fffbe6', padding: 12, borderRadius: 6 }}>
                                                    <Text strong style={{ color: '#d48806' }}>{language === 'zh' ? '策略 2：调整入排标准' : 'Strategy 2: Adjust Criteria'}</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>{language === 'zh' ? '放宽入排标准可扩大患者池' : 'Relaxing criteria expands pool'}</Text>
                                                    </div>
                                                    <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                        {language === 'zh' ? '模拟影响' : 'Simulate Impact'}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <Divider />

                                <Button block type="primary">
                                    {language === 'zh' ? '生成风险预案' : 'Generate Contingency Plan'}
                                </Button>
                                <Button
                                    block
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = '/reports/方案-SPOTLIGHT-GC-301.pdf';
                                        link.download = '方案-SPOTLIGHT-GC-301.pdf';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    {language === 'zh' ? '导出模拟报告' : 'Export Simulation Report'}
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default SimulationCenter;
