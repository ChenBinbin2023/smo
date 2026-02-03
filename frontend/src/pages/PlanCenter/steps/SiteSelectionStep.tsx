import React from 'react'
import { Card, Row, Col, Statistic, Divider, List, Table, Tag, Typography, Spin, Progress } from 'antd'
import { MedicineBoxOutlined, EnvironmentOutlined, TeamOutlined, LoadingOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons'
import { useLanguage } from '../../../context/LanguageContext'

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
    const { language } = useLanguage()

    // 推荐中心数据
    const baseCenterDataZh = [
        { key: '1', name: '北京大学肿瘤医院', pi: '沈教授', tier: 'Tier 1', region: '华北', score: 95, expectedEnroll: 28, role: '组长单位' },
        { key: '2', name: '复旦大学附属肿瘤医院', pi: '刘教授', tier: 'Tier 1', region: '华东', score: 92, expectedEnroll: 25, role: '主要中心' },
        { key: '3', name: '中山大学肿瘤防治中心', pi: '徐教授', tier: 'Tier 1', region: '华南', score: 90, expectedEnroll: 22, role: '主要中心' },
    ]
    const baseCenterDataEn = [
        { key: '1', name: 'PKU Cancer Hospital', pi: 'Prof. Shen', tier: 'Tier 1', region: 'North China', score: 95, expectedEnroll: 28, role: 'Lead Site' },
        { key: '2', name: 'Fudan Cancer Hospital', pi: 'Prof. Liu', tier: 'Tier 1', region: 'East China', score: 92, expectedEnroll: 25, role: 'Main Site' },
        { key: '3', name: 'SYSU Cancer Center', pi: 'Prof. Xu', tier: 'Tier 1', region: 'South China', score: 90, expectedEnroll: 22, role: 'Main Site' },
    ]
    const baseCenterData = language === 'zh' ? baseCenterDataZh : baseCenterDataEn

    // 新增区域后的数据
    const addedCenterZh = { key: '4', name: '四川华西医院', pi: '李教授', tier: 'Tier 2', region: '西南', score: 85, expectedEnroll: 18, role: '参与中心' }
    const addedCenterEn = { key: '4', name: 'West China Hospital', pi: 'Prof. Li', tier: 'Tier 2', region: 'Southwest', score: 85, expectedEnroll: 18, role: 'Participant' }
    const addedCenter = language === 'zh' ? addedCenterZh : addedCenterEn

    // 压缩后的数据（新增天津肿瘤医院）
    const compressedCenterZh = { key: '5', name: '天津市肿瘤医院', pi: '王教授', tier: 'Tier 1', region: '华北', score: 94, expectedEnroll: 30, role: '主要中心' }
    const compressedCenterEn = { key: '5', name: 'Tianjin Cancer Hosp', pi: 'Prof. Wang', tier: 'Tier 1', region: 'North China', score: 94, expectedEnroll: 30, role: 'Main Site' }
    const compressedCenter = language === 'zh' ? compressedCenterZh : compressedCenterEn

    let centerData = [...baseCenterData]
    if (hasAddedRegion) {
        centerData = [...centerData, addedCenter]
    }
    if (hasCompressedTimeline) {
        centerData = [...centerData, compressedCenter]
    }
    // Sort by score desc for better visual
    centerData.sort((a, b) => (b.score as number) - (a.score as number))

    const centerColumns = [
        { title: language === 'zh' ? '中心名称' : 'Site Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: language === 'zh' ? 'PI' : 'PI', dataIndex: 'pi', key: 'pi' },
        { title: language === 'zh' ? '层级' : 'Tier', dataIndex: 'tier', key: 'tier', render: (t: string) => <Tag color={t === 'Tier 1' ? 'gold' : 'blue'}>{t}</Tag> },
        { title: language === 'zh' ? '区域' : 'Region', dataIndex: 'region', key: 'region' },
        { title: language === 'zh' ? '综合评分' : 'Score', dataIndex: 'score', key: 'score', render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 90 ? '#52c41a' : v >= 80 ? '#1890ff' : '#faad14'} /> },
        { title: language === 'zh' ? '预期入组' : 'Expected Enrollment', dataIndex: 'expectedEnroll', key: 'expectedEnroll', render: (v: number) => `${v}${language === 'zh' ? '例' : ' pts'}` },
        { title: language === 'zh' ? '角色' : 'Role', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color={(r === '组长单位' || r === 'Lead Site') ? 'red' : (r === '主要中心' || r === 'Main Site') ? 'green' : 'default'}>{r}</Tag> },
    ]

    // Calculate stats
    const centerCount = centerData.length
    const expectedEnrollTotal = centerData.reduce((acc, curr) => acc + (curr.expectedEnroll as number), 0)

    return (
        <div className="space-y-4">
            {/* 中心选择概览 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '推荐中心数' : 'Rec. Sites'}
                            value={centerCount}
                            suffix={language === 'zh' ? '家' : ''}
                            prefix={<EnvironmentOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '覆盖区域' : 'Regions Covered'}
                            value={hasAddedRegion ? 4 : 3}
                            suffix={language === 'zh' ? '个' : ''}
                            prefix={<MedicineBoxOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? 'KOL覆盖率' : 'KOL Coverage'}
                            value={hasCompressedTimeline ? 92 : 85}
                            suffix="%"
                            prefix={<TrophyOutlined className="text-orange-500" />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" className="shadow-sm">
                        <Statistic
                            title={language === 'zh' ? '预期总入组' : 'Total Expected Enrollment'}
                            value={expectedEnrollTotal}
                            suffix={language === 'zh' ? '例' : ' pts'}
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
                        <Text strong>{language === 'zh' ? '推荐中心与研究者' : 'Rec. Sites & Investigators'}</Text>
                        <Tag color="blue">{language === 'zh' ? '按综合评分排序' : 'Sorted by Score'}</Tag>
                        {centerListLoading && <Tag color="processing">{language === 'zh' ? '更新中...' : 'Updating...'}</Tag>}
                        {hasCompressedTimeline && <Tag color="green">{language === 'zh' ? '已优化(进度压缩)' : 'Optimized (Compressed)'}</Tag>}
                    </div>
                }
            >
                {centerListLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                        <Text type="secondary">{language === 'zh' ? '中心选择专家正在筛选新区域候选中心...' : 'Site Selection Expert is screening new candidates...'}</Text>
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
                        <Text strong>{language === 'zh' ? '区域分布策略' : 'Regional Distribution'}</Text>
                    </div>
                }
            >
                <Row gutter={16}>
                    <Col span={6}><Statistic title={language === 'zh' ? '华北' : 'North'} value={hasCompressedTimeline ? 2 : 1} suffix={language === 'zh' ? '家' : ''} /></Col>
                    <Col span={6}><Statistic title={language === 'zh' ? '华东' : 'East'} value={1} suffix={language === 'zh' ? '家' : ''} /></Col>
                    <Col span={6}><Statistic title={language === 'zh' ? '华南' : 'South'} value={1} suffix={language === 'zh' ? '家' : ''} /></Col>
                    {hasAddedRegion && <Col span={6}><Statistic title={language === 'zh' ? '西南' : 'Southwest'} value={1} suffix={language === 'zh' ? '家' : ''} /></Col>}
                </Row>
            </Card>

            {/* 情景推演区域 - 根据 scenarioLoading 显示 loading 或结果 */}
            <Card
                size="small"
                className="shadow-sm"
                title={
                    <div className="flex items-center space-x-2">
                        <LineChartOutlined className="text-orange-500" />
                        <Text strong>{language === 'zh' ? '情景推演分析' : 'Scenario Simulation'}</Text>
                        {scenarioLoading && <Tag color="processing">{language === 'zh' ? '推演中...' : 'Simulating...'}</Tag>}
                    </div>
                }
            >
                {scenarioLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                        <Text type="secondary">{language === 'zh' ? '情景推演专家正在进行入组速率/周期/资源负载推演...' : 'Scenario Expert is simulating enrollment rate/cycle/resources...'}</Text>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card size="small" className="bg-green-50 border-green-200">
                                    <Statistic
                                        title={language === 'zh' ? '乐观情景' : 'Optimistic'}
                                        value={hasCompressedTimeline ? 18 : (hasAddedRegion ? 22 : 24)}
                                        suffix={language === 'zh' ? '个月' : ' Months'}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? `月入组${hasCompressedTimeline ? '0.80' : '0.65'}例/中心，提前完成` : `Rate: ${hasCompressedTimeline ? '0.80' : '0.65'} pts/mo, Early finish`}</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" className="bg-blue-50 border-blue-200">
                                    <Statistic
                                        title={language === 'zh' ? '基准情景' : 'Baseline'}
                                        value={hasCompressedTimeline ? 20 : (hasAddedRegion ? 26 : 28)}
                                        suffix={language === 'zh' ? '个月' : ' Months'}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? `月入组${hasCompressedTimeline ? '0.72' : '0.52'}例/中心，按期完成` : `Rate: ${hasCompressedTimeline ? '0.72' : '0.52'} pts/mo, On schedule`}</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" className="bg-orange-50 border-orange-200">
                                    <Statistic
                                        title={language === 'zh' ? '保守情景' : 'Conservative'}
                                        value={hasCompressedTimeline ? 24 : (hasAddedRegion ? 30 : 32)}
                                        suffix={language === 'zh' ? '个月' : ' Months'}
                                        valueStyle={{ color: '#fa8c16' }}
                                    />
                                    <Text type="secondary" className="text-xs">{language === 'zh' ? `月入组${hasCompressedTimeline ? '0.60' : '0.42'}例/中心，需调整策略` : `Rate: ${hasCompressedTimeline ? '0.60' : '0.42'} pts/mo, Adj Req`}</Text>
                                </Card>
                            </Col>
                        </Row>
                        <Divider className="my-2" />
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title={language === 'zh' ? '资源负载 - CRA配置' : 'Resources - CRA'} value={hasCompressedTimeline ? 8 : 6} suffix={language === 'zh' ? '人' : ''} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={language === 'zh' ? '资源负载 - CRC配置' : 'Resources - CRC'} value={hasCompressedTimeline ? 65 : 50} suffix={language === 'zh' ? '人' : ''} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={language === 'zh' ? '预算预估' : 'Budget Estimate'} value={hasCompressedTimeline ? "1,520" : "1,350"} suffix={language === 'zh' ? '万元' : 'M CNY'} />
                            </Col>
                        </Row>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default SiteSelectionStep
