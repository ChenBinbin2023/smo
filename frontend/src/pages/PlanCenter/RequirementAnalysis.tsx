import React from 'react'
import { Card, Typography, Divider, Tag, Descriptions } from 'antd'
import { FileTextOutlined, CalendarOutlined, TeamOutlined, FileSearchOutlined, DollarOutlined, ExperimentOutlined } from '@ant-design/icons'
import { useLanguage } from '../../context/LanguageContext'

const { Title, Paragraph, Text } = Typography

const RequirementAnalysis: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="space-y-4">
            {/* RFP邀请函 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <CalendarOutlined className="text-blue-500" />
                    <Text strong>{language === 'zh' ? 'RFP邀请函 (Cover Letter)' : 'RFP Cover Letter'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? "投标截止时间" : "Submission Deadline"}>2026-02-15 17:00 (UTC+8)</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "提问截止时间" : "Q&A Deadline"}>2026-01-28 12:00</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "竞标防御会议" : "Bid Defense Meeting"}>2026-02-20 14:00</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "预计启动时间" : "Expected Launch"}>2026 Q2</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 临床方案摘要 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <ExperimentOutlined className="text-green-500" />
                    <Text strong>{language === 'zh' ? '临床方案摘要 (Protocol Synopsis)' : 'Protocol Synopsis'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? "研究类型" : "Study Type"}>{language === 'zh' ? "随机、双盲、安慰剂对照" : "Randomized, Double-blind, Placebo-controlled"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "研究阶段" : "Study Phase"}>Phase III</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "适应症" : "Indication"}>{language === 'zh' ? "晚期胃癌一线治疗" : "1st-line Advanced Gastric Cancer"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "主要终点" : "Primary Endpoint"}>{language === 'zh' ? "无进展生存期(PFS)" : "PFS"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "计划入组" : "Target Enrollment"}>{language === 'zh' ? "480例" : "480 pts"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "随机比例" : "Randomization"}>1:1</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 工作范围说明书 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <FileSearchOutlined className="text-orange-500" />
                    <Text strong>{language === 'zh' ? '工作范围说明书 (Scope of Work)' : 'Scope of Work (SOW)'}</Text>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Tag color="blue">{language === 'zh' ? "项目管理" : "Project Management"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "中心筛选与启动" : "Site Selection & Startup"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "监查服务" : "Monitoring"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "数据管理" : "Data Management"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "统计分析" : "Biostatistics"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "医学监查" : "Medical Monitoring"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "药物警戒" : "Pharmacovigilance"}</Tag>
                    <Tag color="blue">{language === 'zh' ? "质量保证" : "Quality Assurance"}</Tag>
                </div>
            </Card>

            {/* 报价网格模板 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <DollarOutlined className="text-purple-500" />
                    <Text strong>{language === 'zh' ? '报价网格模板 (Bid Grid)' : 'Bid Grid Template'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? "模板格式" : "Format"}>{language === 'zh' ? "Excel (锁定单元格)" : "Excel (Locked Cells)"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "报价货币" : "Currency"}>{language === 'zh' ? "人民币CNY" : "CNY"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "支付条款" : "Payment Terms"}>{language === 'zh' ? "里程碑付款" : "Milestones"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "Pass-through" : "Pass-through"}>{language === 'zh' ? "需单独列示" : "Itemized"}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 研究假设清单 */}
            <Card className="shadow-sm" size="small">
                <div className="flex items-center space-x-2 mb-3">
                    <TeamOutlined className="text-cyan-500" />
                    <Text strong>{language === 'zh' ? '研究假设清单 (Study Assumptions)' : 'Study Assumptions'}</Text>
                </div>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label={language === 'zh' ? "研究中心数量" : "No. of Sites"}>{language === 'zh' ? "中国区40个中心" : "40 sites in China"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "预计入组周期" : "Enrollment Period"}>{language === 'zh' ? "18个月" : "18 months"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "治疗周期" : "Treatment Cycle"}>{language === 'zh' ? "每3周1次，直至疾病进展" : "Q3W until progression"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "随访周期" : "Follow-up"}>{language === 'zh' ? "末次治疗后24个月" : "24M post-treatment"}</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "预计筛选失败率" : "Est. Screen Failure"}>25%</Descriptions.Item>
                    <Descriptions.Item label={language === 'zh' ? "预计脱落率" : "Est. Dropout Rate"}>15%</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 下一步建议 */}
            <Card className="shadow-sm bg-blue-50 border-blue-200" size="small">
                <div className="flex items-start space-x-2">
                    <FileTextOutlined className="text-blue-500 text-lg mt-1" />
                    <div>
                        <Text strong>{language === 'zh' ? '下一步建议' : 'Next Steps'}</Text>
                        <Paragraph className="mb-0 mt-1 text-sm">
                            {language === 'zh'
                                ? 'RFP文件解析完成，建议进入资料收集阶段，准备历史同类研究数据和中心资源信息。'
                                : 'RFP parsing completed. Suggest proceeding to data collection for historical similar studies and site resource info.'}
                        </Paragraph>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default RequirementAnalysis
