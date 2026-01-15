import { Card, Row, Col, Typography, Statistic, Space, Button, Select } from 'antd'
import {
    BarChartOutlined,
    DotChartOutlined,
    HeatMapOutlined,
    RadarChartOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

const { Title, Text } = Typography

const AnalysisCenter = () => {
    const radarOption = {
        title: { text: '机构能力多维度对比' },
        legend: { data: ['复旦肿瘤', '中山肿瘤', '同类均值'] },
        radar: {
            indicator: [
                { name: '入组速率', max: 100 },
                { name: '启动效率', max: 100 },
                { name: '数据质量', max: 100 },
                { name: '合作配合度', max: 100 },
                { name: '合规意识', max: 100 },
                { name: '成本控制', max: 100 }
            ]
        },
        series: [
            {
                name: '对比',
                type: 'radar',
                data: [
                    { value: [95, 80, 90, 85, 95, 70], name: '复旦肿瘤' },
                    { value: [85, 95, 85, 90, 80, 85], name: '中山肿瘤' },
                    { value: [60, 60, 60, 60, 60, 60], name: '同类均值' }
                ]
            }
        ]
    }

    const scatterOption = {
        title: { text: '全国机构入组速率 vs 启动时长分布' },
        xAxis: { name: '启动天数', splitLine: { lineStyle: { type: 'dashed' } } },
        yAxis: { name: '入组速率 (人/月)', splitLine: { lineStyle: { type: 'dashed' } } },
        series: [
            {
                symbolSize: 20,
                data: [
                    [15, 4.5], [20, 3.8], [45, 2.5], [30, 3.2], [50, 1.8], [25, 3.5],
                    [60, 1.2], [40, 2.8], [35, 3.0], [55, 1.5], [22, 4.0], [18, 4.2]
                ],
                type: 'scatter',
                itemStyle: {
                    color: '#1677ff'
                }
            }
        ]
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={2}>分析中心</Title>
                    <Text type="secondary">通过深度学习模型与多维统计分析，揭示全国中心表现规律。</Text>
                </Col>
                <Col>
                    <Space>
                        <Select defaultValue="all" style={{ width: 150 }}>
                            <Select.Option value="all">所有适应症</Select.Option>
                            <Select.Option value="lung">非小细胞肺癌</Select.Option>
                            <Select.Option value="liver">肝癌</Select.Option>
                        </Select>
                        <Button type="primary">生成深度报告</Button>
                    </Space>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Card bordered={false} className="glass-card">
                        <ReactECharts option={radarOption} style={{ height: 400 }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false} className="glass-card">
                        <ReactECharts option={scatterOption} style={{ height: 400 }} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card bordered={false} title="区域中心热度分析" className="glass-card">
                        <div className="flex justify-center items-center h-48 bg-gray-50 rounded italic text-gray-400">
                            [ 区域热力图组件加载中... ]
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default AnalysisCenter
