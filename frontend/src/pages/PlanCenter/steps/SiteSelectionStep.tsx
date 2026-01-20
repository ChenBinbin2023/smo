import React from 'react'
import { Card, Row, Col, Statistic, Divider, List, Table, Tag, Typography, Spin, Progress } from 'antd'
import { MedicineBoxOutlined, EnvironmentOutlined, TeamOutlined, LoadingOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface SiteSelectionStepProps {
    scenarioLoading?: boolean
    centerListLoading?: boolean
    hasAddedRegion?: boolean
    hasCompressedTimeline?: boolean
}

const SiteSelectionStep: React.FC<SiteSelectionStepProps> = ({
    scenarioLoading = false,
    centerListLoading = false,
    hasAddedRegion = false,
    hasCompressedTimeline = false
}) => {
    // 推荐中心数据
    const baseCenterData = [
        { key: '1', name: '北京大学肿瘤医院', pi: '沈教授', tier: 'Tier 1', region: '华北', score: 95, expectedEnroll: 28, role: '组长单位' },
        { key: '2', name: '复旦大学附属肿瘤医院', pi: '刘教授', tier: 'Tier 1', region: '华东', score: 92, expectedEnroll: 25, role: '主要中心' },
        { key: '3', name: '中山大学肿瘤防治中心', pi: '徐教授', tier: 'Tier 1', region: '华南', score: 90, expectedEnroll: 22, role: '主要中心' },
    ]

    // 新增区域后的数据
    const addedCenter = { key: '4', name: '四川华西医院', pi: '李教授', tier: 'Tier 2', region: '西南', score: 85, expectedEnroll: 18, role: '参与中心' }

    // 压缩后的数据（新增天津肿瘤医院）
    const compressedCenter = { key: '5', name: '天津市肿瘤医院', pi: '王教授', tier: 'Tier 1', region: '华北', score: 94, expectedEnroll: 30, role: '主要中心' }

    let centerData = baseCenterData
    if (hasAddedRegion) {
        centerData = [...baseCenterData, addedCenter]
    }
    if (hasCompressedTimeline) {
        // Timeline compressed: Add compressedCenter and ensure addedCenter is there if region added (though logically user might do either)
        // Assuming cumulative:
        centerData = hasAddedRegion ? [...baseCenterData, addedCenter, compressedCenter] : [...baseCenterData, compressedCenter]
        // Sort by score desc for better visual
        centerData.sort((a, b) => b.score - a.score)
    }

    const centerColumns = [
        { title: '中心名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'PI', dataIndex: 'pi', key: 'pi' },
        { title: '层级', dataIndex: 'tier', key: 'tier', render: (t: string) => <Tag color={t === 'Tier 1' ? 'gold' : 'blue'}>{t}</Tag> },
        { title: '区域', dataIndex: 'region', key: 'region' },
        { title: '综合评分', dataIndex: 'score', key: 'score', render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 90 ? '#52c41a' : v >= 80 ? '#1890ff' : '#faad14'} /> },
        { title: '预期入组', dataIndex: 'expectedEnroll', key: 'expectedEnroll', render: (v: number) => `${v}例` },
        { title: '角色', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color={r === '组长单位' ? 'red' : r === '主要中心' ? 'green' : 'default'}>{r}</Tag> },
    ]

    // Calculate stats
    const centerCount = centerData.length
    const expectedEnrollTotal = centerData.reduce((acc, curr) => acc + curr.expectedEnroll, 0)

    return (
        <div className="space-y-4">
            {/* 中心选择概览 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="推荐中心数"
                            value={centerCount}
                            suffix="家"
                            prefix={<EnvironmentOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="覆盖区域"
                            value={hasAddedRegion ? 4 : 3}
                            suffix="个"
                            prefix={<MedicineBoxOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="KOL覆盖率"
                            value={hasCompressedTimeline ? 92 : 85}
                            suffix="%"
                            prefix={<TrophyOutlined className="text-orange-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title="预期总入组"
                            value={expectedEnrollTotal}
                            suffix="例"
                            prefix={<TeamOutlined className="text-purple-500" />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 推荐中心列表 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <EnvironmentOutlined className="text-blue-500" />
                        <Text strong>推荐中心与研究者</Text>
                        <Tag color="blue">按综合评分排序</Tag>
                        {centerListLoading && <Tag color="processing">更新中...</Tag>}
                        {hasCompressedTimeline && <Tag color="green">已优化(进度压缩)</Tag>}
                    </div>
                }
            >
                {centerListLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                        <Text type="secondary">中心选择专家正在筛选新区域候选中心...</Text>
                    </div>
                ) : (
                    <>
                        <Table
                            dataSource={centerData}
                            columns={centerColumns}
                            size="small"
                            pagination={false}
                        />

                    </>
                )}
            </Card>

            {/* 区域分布 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <MedicineBoxOutlined className="text-green-500" />
                        <Text strong>区域分布策略</Text>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={6}><Statistic title="华北" value={hasCompressedTimeline ? 2 : 1} suffix="家" /></Col>
                    <Col span={6}><Statistic title="华东" value={1} suffix="家" /></Col>
                    <Col span={6}><Statistic title="华南" value={1} suffix="家" /></Col>
                    {hasAddedRegion && <Col span={6}><Statistic title="西南" value={1} suffix="家" /></Col>}
                </Row>
            </Card>

            {/* 情景推演区域 - 根据 scenarioLoading 显示 loading 或结果 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <LineChartOutlined className="text-orange-500" />
                        <Text strong>情景推演分析</Text>
                        {scenarioLoading && <Tag color="processing">推演中...</Tag>}
                    </div>
                }
            >
                {scenarioLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                        <Text type="secondary">情景推演专家正在进行入组速率/周期/资源负载推演...</Text>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small" className="bg-green-50 border-green-200">
                                    <Statistic
                                        title="乐观情景"
                                        value={hasCompressedTimeline ? 18 : (hasAddedRegion ? 22 : 24)}
                                        suffix="个月"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                    <Text type="secondary" className="text-xs">月入组{hasCompressedTimeline ? '0.80' : '0.65'}例/中心，提前完成</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" className="bg-blue-50 border-blue-200">
                                    <Statistic
                                        title="基准情景"
                                        value={hasCompressedTimeline ? 20 : (hasAddedRegion ? 26 : 28)}
                                        suffix="个月"
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                    <Text type="secondary" className="text-xs">月入组{hasCompressedTimeline ? '0.72' : '0.52'}例/中心，按期完成</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" className="bg-orange-50 border-orange-200">
                                    <Statistic
                                        title="保守情景"
                                        value={hasCompressedTimeline ? 24 : (hasAddedRegion ? 30 : 32)}
                                        suffix="个月"
                                        valueStyle={{ color: '#fa8c16' }}
                                    />
                                    <Text type="secondary" className="text-xs">月入组{hasCompressedTimeline ? '0.60' : '0.42'}例/中心，需调整策略</Text>
                                </Card>
                            </Col>
                        </Row>
                        <Divider className="my-2" />
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title="资源负载 - CRA配置" value={hasCompressedTimeline ? 8 : 6} suffix="人" />
                            </Col>
                            <Col span={8}>
                                <Statistic title="资源负载 - CRC配置" value={hasCompressedTimeline ? 65 : 50} suffix="人" />
                            </Col>
                            <Col span={8}>
                                <Statistic title="预算预估" value={hasCompressedTimeline ? "1,520" : "1,350"} suffix="万元" />
                            </Col>
                        </Row>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default SiteSelectionStep
