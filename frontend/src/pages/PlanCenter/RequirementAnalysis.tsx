import React from 'react'
import { Card, Typography, Divider, Tag, Descriptions } from 'antd'
import { FileTextOutlined, CalendarOutlined, TeamOutlined, FileSearchOutlined, DollarOutlined, ExperimentOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const RequirementAnalysis: React.FC = () => {
    return (
        <div className="space-y-4">
            {/* RFP邀请函 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <CalendarOutlined className="text-blue-500" />
                    <Text strong>RFP邀请函（Cover Letter）</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="投标截止时间">2026年2月15日 17:00 (UTC+8)</Descriptions.Item>
                    <Descriptions.Item label="提问截止时间">2026年1月28日 12:00</Descriptions.Item>
                    <Descriptions.Item label="竞标防御会议">2026年2月20日 14:00</Descriptions.Item>
                    <Descriptions.Item label="预计启动时间">2026年Q2</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 临床方案摘要 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <ExperimentOutlined className="text-green-500" />
                    <Text strong>临床方案摘要（Protocol Synopsis）</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="研究类型">随机、双盲、安慰剂对照</Descriptions.Item>
                    <Descriptions.Item label="研究阶段">Phase III</Descriptions.Item>
                    <Descriptions.Item label="适应症">晚期胃癌一线治疗</Descriptions.Item>
                    <Descriptions.Item label="主要终点">无进展生存期(PFS)</Descriptions.Item>
                    <Descriptions.Item label="计划入组">480例</Descriptions.Item>
                    <Descriptions.Item label="随机比例">1:1</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 工作范围说明书 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <FileSearchOutlined className="text-orange-500" />
                    <Text strong>工作范围说明书（Scope of Work）</Text>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Tag color="blue">项目管理</Tag>
                    <Tag color="blue">中心筛选与启动</Tag>
                    <Tag color="blue">监查服务</Tag>
                    <Tag color="blue">数据管理</Tag>
                    <Tag color="blue">统计分析</Tag>
                    <Tag color="blue">医学监查</Tag>
                    <Tag color="blue">药物警戒</Tag>
                    <Tag color="blue">质量保证</Tag>
                </div>
            </Card>

            {/* 报价网格模板 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <DollarOutlined className="text-purple-500" />
                    <Text strong>报价网格模板（Bid Grid）</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="模板格式">Excel（锁定单元格）</Descriptions.Item>
                    <Descriptions.Item label="报价货币">人民币CNY</Descriptions.Item>
                    <Descriptions.Item label="支付条款">里程碑付款</Descriptions.Item>
                    <Descriptions.Item label="Pass-through">需单独列示</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 研究假设清单 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <TeamOutlined className="text-cyan-500" />
                    <Text strong>研究假设清单（Study Assumptions）</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="研究中心数量">中国区40个中心</Descriptions.Item>
                    <Descriptions.Item label="预计入组周期">18个月</Descriptions.Item>
                    <Descriptions.Item label="治疗周期">每3周1次，直至疾病进展</Descriptions.Item>
                    <Descriptions.Item label="随访周期">末次治疗后24个月</Descriptions.Item>
                    <Descriptions.Item label="预计筛选失败率">25%</Descriptions.Item>
                    <Descriptions.Item label="预计脱落率">15%</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 下一步建议 */}
            <Card className="shadow-sm bg-blue-50 border-blue-200" size="small">
                <div className="flex items-start space-x-2">
                    <FileTextOutlined className="text-blue-500 text-lg mt-1" />
                    <div>
                        <Text strong>下一步建议</Text>
                        <Paragraph className="mb-0 mt-1 text-sm">
                            RFP文件解析完成，建议进入资料收集阶段，准备历史同类研究数据和中心资源信息。
                        </Paragraph>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default RequirementAnalysis
