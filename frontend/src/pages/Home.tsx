import { Row, Col, Card, Statistic, List, Avatar, Tag, Button, Typography, Space } from 'antd'
import {
    RiseOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ArrowRightOutlined,
    ThunderboltFilled
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

const { Title, Text } = Typography

const Home = () => {
    const chartOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLine: { show: false } },
        yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { type: 'dashed' } } },
        series: [
            {
                name: '入组总数',
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
        { title: '肺癌PD-1抑制剂III期临床', status: '进行中', rate: '92%', icon: '🫁' },
        { title: '肝癌靶向药物I期研究', status: '招募中', rate: '45%', icon: '🪵' },
        { title: '乳腺癌双抗试验', status: '准备中', rate: '0%', icon: '🎗️' },
    ]

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>下午好，Eric 👋</Title>
                <Text type="secondary">欢迎回到中心选择智能决策系统，今天有 2 个新项目需要选址决策。</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={16}>
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title="累计选址中心"
                                    value={128}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title="平均缩短周期"
                                    value={2.4}
                                    precision={1}
                                    suffix="月"
                                    prefix={<RiseOutlined style={{ color: '#1677ff' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card bordered={false} className="glass-card">
                                <Statistic
                                    title="正在进行的选址"
                                    value={5}
                                    prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card bordered={false} title="入组能力趋势 (全平台)" className="glass-card">
                                <ReactECharts option={chartOption} style={{ height: 300 }} />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={8}>
                    <Card
                        bordered={false}
                        title="最近选址方案"
                        extra={<Button type="link">查看全部</Button>}
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
                                                <Tag color={item.status === '进行中' ? 'processing' : 'warning'}>{item.status}</Tag>
                                                <Text type="secondary">入组率: {item.rate}</Text>
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
                            <Title level={4} style={{ margin: 0, color: '#fff' }}>AI 选址助手</Title>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                            输入项目需求，让我为您推荐最合适的临床试验中心。
                        </p>
                        <Button block style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
                            立即开始选址
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Home
