import { Row, Col, Card, Statistic, List, Avatar, Tag, Button, Typography, Space } from 'antd'
import {
    RiseOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ArrowRightOutlined,
    ThunderboltFilled
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useLanguage } from '../context/LanguageContext'

const { Title, Text } = Typography

const Home = () => {
    const { t } = useLanguage();

    const chartOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisLine: { show: false } },
        yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { type: 'dashed' } } },
        series: [
            {
                name: t('enrollmentTotal'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: 'rgba(22, 119, 255, 0.3)' }, { offset: 1, color: 'rgba(22, 119, 255, 0)' }]
                    }
                },
                data: [120, 150, 220, 180, 260, 310]
            }
        ]
    }

    const recentProjects = [
        { title: 'Lung Cancer PD-1 Inhibitor Phase III', status: t('inProgress'), rate: '92%', icon: '🫁' },
        { title: 'Liver Cancer Targeted Therapy Phase I', status: t('recruiting'), rate: '45%', icon: '🪵' },
        { title: 'Breast Cancer Bispecific Antibody Trial', status: t('preparation'), rate: '0%', icon: '🎗️' },
    ]

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>{t('goodAfternoon')}, Eric 👋</Title>
                <Text type="secondary">{t('welcomeMessage')}</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={16}>
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title={t('cumulativeSites')}
                                    value={128}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title={t('avgCycleReduction')}
                                    value={2.4}
                                    precision={1}
                                    suffix={t('month')}
                                    prefix={<RiseOutlined style={{ color: '#1677ff' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title={t('ongoingSelections')}
                                    value={5}
                                    prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card bordered={false} title={t('enrollmentCapacityTrend')} className="glass-card">
                                <ReactECharts option={chartOption} style={{ height: 300 }} />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={8}>
                    <Card
                        bordered={false}
                        title={t('recentSelectionPlans')}
                        extra={<Button type="link">{t('viewAll')}</Button>}
                        className="glass-card"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={recentProjects}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[<ArrowRightOutlined key="go" />]}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size="large" style={{ backgroundColor: '#f0f5ff', fontSize: 24 }}>{item.icon}</Avatar>}
                                        title={item.title}
                                        description={
                                            <Space>
                                                <Tag color={item.status === 'In Progress' ? 'processing' : 'warning'}>{item.status}</Tag>
                                                <Text type="secondary">{t('rate')}: {item.rate}</Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card bordered={false} style={{ marginTop: 24, background: 'linear-gradient(135deg, #1677ff 0%, #00d2ff 100%)' }} className="text-white">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <ThunderboltFilled style={{ fontSize: 24, marginRight: 12 }} />
                            <Title level={4} style={{ margin: 0, color: '#fff' }}>{t('aiAssistant')}</Title>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                            {t('aiAssistantDesc')}
                        </p>
                        <Button block style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
                            {t('startSelection')}
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Home
