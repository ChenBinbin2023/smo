import { Card, Table, Tag, Input, Space, Button, Typography, Row, Col } from 'antd'
import { SearchOutlined, FilterOutlined, ExportOutlined, DatabaseOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const DataCenter = () => {
    const data = [
        { key: '1', name: '复旦大学附属肿瘤医院', level: '三甲', projects: 127, subjects: 3850, area: '华东', drug: 'PD-1, CTLA-4' },
        { key: '2', name: '上海交通大学医学院附属胸科医院', level: '三甲', projects: 85, subjects: 2100, area: '华东', drug: 'EGFR, ALK' },
        { key: '3', name: '中山大学肿瘤防治中心', level: '三甲', projects: 110, subjects: 3200, area: '华南', drug: 'PD-L1, VEGF' },
        { key: '4', name: '北京大学肿瘤医院', level: '三甲', projects: 102, subjects: 2900, area: '华北', drug: 'PD-1, HER2' },
        { key: '5', name: '浙江省肿瘤医院', level: '三甲', projects: 76, subjects: 1800, area: '华东', drug: 'PD-1, EGFR' },
    ]

    const columns = [
        { title: '机构名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: '等次', dataIndex: 'level', key: 'level', render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: '累计历史试验', dataIndex: 'projects', key: 'projects', sorter: true },
        { title: '累计入组人数', dataIndex: 'subjects', key: 'subjects', sorter: true },
        { title: '覆盖地区', dataIndex: 'area', key: 'area' },
        { title: '擅长药物靶点', dataIndex: 'drug', key: 'drug' },
        { title: '操作', key: 'action', render: () => <Button type="link">查看数据源</Button> },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={2}>数据中心</Title>
                    <Text type="secondary">汇总全平台临床试验历史数据，提供全维度的机构与研究者画像。</Text>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ExportOutlined />}>导出数据</Button>
                        <Button type="primary" icon={<DatabaseOutlined />}>进入知识图谱</Button>
                    </Space>
                </Col>
            </Row>

            <Card bordered={false} className="glass-card">
                <div className="mb-4 flex justify-between">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="搜索机构、研究者或靶点"
                        style={{ width: 300 }}
                    />
                    <Button icon={<FilterOutlined />}>高级筛选</Button>
                </div>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
            </Card>
        </div>
    )
}

export default DataCenter
