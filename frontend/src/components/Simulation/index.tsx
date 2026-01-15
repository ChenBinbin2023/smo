import React, { useState } from 'react';
import { Card, Select, Typography, Space, Tag, Button, Row, Col, Table, Statistic, Progress, Divider, Radio } from 'antd';
import { LineChartOutlined, ThunderboltOutlined, CheckCircleFilled, BulbOutlined } from '@ant-design/icons';
import { useScheme, useInstitutions } from '../../context/SchemeContext';
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
    const [targetCases, setTargetCases] = useState(30);
    const [selectedScenario, setSelectedScenario] = useState('normal');

    const institutions = getSchemeInstitutions();
    const selectedInstitution = selectedInstitutionId ? getInstitution(selectedInstitutionId) : null;

    const scenarios: SimulationScenario[] = [
        { name: '正常情况', rateMultiplier: 1, probability: 92, completionMonths: 6.7, impact: 'low' },
        { name: '入组下降 30%', rateMultiplier: 0.7, probability: 78, completionMonths: 9.6, impact: 'medium' },
        { name: '入组下降 50%', rateMultiplier: 0.5, probability: 65, completionMonths: 13.4, impact: 'high' }
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
            case 'high': return '高影响';
            case 'medium': return '中等影响';
            default: return '低影响';
        }
    };

    const predictionColumns = [
        { title: '机构', dataIndex: 'name', key: 'name' },
        {
            title: '预计速率',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate: number) => `${rate}/月`
        },
        {
            title: '分配目标',
            dataIndex: 'target',
            key: 'target',
            render: (t: number) => `${t}例`
        },
        { title: '预计完成', dataIndex: 'completion', key: 'completion' },
        { title: '置信度', dataIndex: 'confidence', key: 'confidence' },
        { title: '风险', dataIndex: 'risk', key: 'risk' }
    ];

    const predictionData = [
        { key: '1', name: '复旦肿瘤', rate: 4.5, target: 30, completion: '6.7月', confidence: '高', risk: '低' },
        { key: '2', name: '浙江肿瘤', rate: 3.8, target: 25, completion: '6.6月', confidence: '中', risk: '中' },
        { key: '3', name: '中山肿瘤', rate: 3.5, target: 25, completion: '7.1月', confidence: '高', risk: '低' },
        { key: '4', name: '北京肿瘤', rate: 3.8, target: 25, completion: '6.6月', confidence: '中', risk: '低' }
    ];

    const getConfidenceColor = (conf: string) => {
        switch (conf) {
            case '高': return 'success';
            case '中': return 'warning';
            default: return 'error';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case '低': return 'green';
            case '中': return 'orange';
            default: return 'red';
        }
    };

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
                    placeholder="请选择机构进行模拟"
                >
                    {institutions.map((inst: Institution) => (
                        <Option key={inst.id} value={inst.id}>{inst.name}</Option>
                    ))}
                    <Option value="all">全部模拟</Option>
                </Select>
            </div>

            {!selectedInstitution ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <LineChartOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                        <Title level={4} style={{ marginTop: 16, color: '#999' }}>请先选择要模拟的机构</Title>
                        <Text type="secondary">从上方选择机构后，将展示该机构的入组预测模拟结果</Text>
                    </div>
                </Card>
            ) : (
                <Row gutter={24}>
                    <Col span={16}>
                        <Card bordered={false} className="glass-card" title={`${selectedInstitution.name} - 入组预测模拟`}>
                            <div style={{ marginBottom: 24 }}>
                                <Title level={5}>当前状态</Title>
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Statistic
                                            title="历史入组均值"
                                            value={selectedInstitution.rate}
                                            suffix="人/月"
                                            valueStyle={{ fontSize: 24 }}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="该适应症入组"
                                            value={(selectedInstitution.rate * 1.15).toFixed(1)}
                                            suffix="人/月"
                                            valueStyle={{ fontSize: 24 }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary">置信区间：</Text>
                                        <Text>{(selectedInstitution.rate * 0.85).toFixed(1)} - {(selectedInstitution.rate * 1.2).toFixed(1)} 人/月</Text>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                    <BulbOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                    您可以通过左侧 <Text strong>AI 对话</Text> 描述特定的模拟条件（如：如果入组标准放宽，结果会如何？）
                                </Text>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Text type="secondary">目标入组人数：</Text>
                                        <Select
                                            value={targetCases}
                                            onChange={setTargetCases}
                                            style={{ width: 120, marginLeft: 8 }}
                                        >
                                            {[20, 25, 30, 35, 40, 50, 100].map(n => (
                                                <Option key={n} value={n}>{n} 例</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary">环境风险场景：</Text>
                                        <Radio.Group
                                            value={selectedScenario}
                                            onChange={(e) => setSelectedScenario(e.target.value)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <Radio.Button value="normal">基准</Radio.Button>
                                            <Radio.Button value="down30">波动 (-30%)</Radio.Button>
                                            <Radio.Button value="down50">极端 (-50%)</Radio.Button>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                            </div>

                            <Button type="primary" icon={<ThunderboltOutlined />}>
                                运行模拟
                            </Button>

                            <Divider />

                            <div style={{ marginBottom: 24 }}>
                                <Title level={5}>模拟结果</Title>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card size="small" style={{ background: '#f5f5f5' }}>
                                            <Statistic
                                                title={currentScenario.name}
                                                value={currentScenario.completionMonths}
                                                suffix="个月完成"
                                                valueStyle={{
                                                    fontSize: 28,
                                                    color: getScenarioColor(currentScenario.impact)
                                                }}
                                            />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                概率 {currentScenario.probability}%
                                            </Text>
                                        </Card>
                                    </Col>
                                    <Col span={16}>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                            <div style={{ flex: 1 }}>
                                                <Text type="secondary">影响评估：</Text>
                                                <Tag color={getScenarioColor(currentScenario.impact)} style={{ marginLeft: 8 }}>
                                                    {getImpactText(currentScenario.impact)}
                                                </Tag>
                                                {currentScenario.impact === 'high' && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text type="secondary">需增加 2-3 家备选机构，或调整入排标准</Text>
                                                    </div>
                                                )}
                                                {currentScenario.impact === 'medium' && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <Text type="secondary">启动备选机构（南京鼓楼）可补充 2.8 人/月</Text>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <Title level={5}>分中心预测详情</Title>
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
                        <Card bordered={false} className="glass-card" title="应对建议">
                            <div className="space-y-4">
                                <div>
                                    <Text strong style={{ color: '#52c41a' }}>
                                        <CheckCircleFilled style={{ marginRight: 8 }} />
                                        {currentScenario.name}
                                    </Text>
                                    <div style={{ marginLeft: 24, marginTop: 8 }}>
                                        <Text>预计 {currentScenario.completionMonths} 个月完成，概率 {currentScenario.probability}%</Text>
                                    </div>
                                </div>

                                {currentScenario.impact !== 'low' && (
                                    <div>
                                        <Divider />
                                        <Title level={5}>应对策略</Title>
                                        {currentScenario.impact === 'medium' && (
                                            <div style={{ background: '#fffbe6', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                                                <Text strong style={{ color: '#d48806' }}>策略 1：启动备选机构</Text>
                                                <div style={{ marginTop: 4 }}>
                                                    <Text>南京鼓楼医院可补充 2.8 人/月</Text>
                                                </div>
                                                <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                    添加到方案
                                                </Button>
                                            </div>
                                        )}
                                        {currentScenario.impact === 'high' && (
                                            <>
                                                <div style={{ background: '#fff2f0', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                                                    <Text strong style={{ color: '#cf1322' }}>策略 1：增加备选机构</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>需增加 2-3 家备选机构</Text>
                                                    </div>
                                                    <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                        查看推荐备选
                                                    </Button>
                                                </div>
                                                <div style={{ background: '#fffbe6', padding: 12, borderRadius: 6 }}>
                                                    <Text strong style={{ color: '#d48806' }}>策略 2：调整入排标准</Text>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>放宽入排标准可扩大患者池</Text>
                                                    </div>
                                                    <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}>
                                                        模拟影响
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <Divider />

                                <Button block type="primary">
                                    生成风险预案
                                </Button>
                                <Button block>
                                    导出模拟报告
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
