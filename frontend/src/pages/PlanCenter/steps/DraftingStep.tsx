import React, { useState, useEffect, useRef } from 'react'
import { Typography, Tag, Card, Tabs, List, Tooltip, Badge, Row, Col, Collapse, Button, Divider, Alert, Table, Spin } from 'antd'
import {
    SyncOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    DiffOutlined,
    FileSearchOutlined,
    RobotOutlined,
    UserOutlined,
    HighlightOutlined,
    ArrowRightOutlined,
    SafetyCertificateOutlined,
    LoadingOutlined,
    EditOutlined
} from '@ant-design/icons'
import { useLanguage } from '../../../context/LanguageContext'

const { Title, Text, Paragraph } = Typography

interface DraftingStepProps {
    geneticApprovalCompleted?: boolean;
    isRevising?: boolean;
}

const DraftingStep: React.FC<DraftingStepProps> = ({ geneticApprovalCompleted = false, isRevising = false }) => {
    const { language } = useLanguage()
    const [activeTab, setActiveTab] = useState('protocol')
    const topRef = useRef<HTMLDivElement>(null)

    // 当进入修订状态时，自动滚动到顶部
    useEffect(() => {
        if (isRevising && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isRevising])

    // Mock Protocol Content (Translated)
    const protocolContent = (
        <div className="font-serif leading-relaxed text-gray-800" style={{ fontFamily: 'Songti SC, SimSun, serif' }}>
            <div className="text-center mb-8">
                <Title level={3}>{language === 'zh' ? 'GC-001联合XELOX一线治疗晚期胃癌III期临床试验方案' : 'Phase III Clinical Trial Protocol for GC-001 plus XELOX as 1st line Treatment for Advanced Gastric Cancer'}</Title>
                <Text className="block text-lg font-bold mb-2">{language === 'zh' ? '方案编号: GC-001-301' : 'Protocol No: GC-001-301'}</Text>
                <Text className="block text-base">{language === 'zh' ? '版本: 1.0 (草案)' : 'Version: 1.0 (Draft)'}</Text>
                <Text className="block text-sm text-gray-500">{language === 'zh' ? '日期: 2026-01-20' : 'Date: 2026-01-20'}</Text>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '0. 背景与研究理由' : '0. Background & Rationale'}</Title>
                <Paragraph>
                    {language === 'zh'
                        ? '胃癌是全球范围内常见的恶性肿瘤之一，特别是在东亚地区，其发病率和死亡率均居高不下。对于HER2阴性的晚期胃或胃食管交界处腺癌，目前的标准一线治疗方案仍以含铂类和氟尿嘧啶类的化疗为主。然而，化疗的疗效已进入瓶颈期，患者的中位总生存期（mOS）通常不足1年。'
                        : 'Gastric cancer is a common malignancy worldwide, especially in East Asia. For HER2-negative advanced gastric or G/GEJ adenocarcinoma, standard 1st-line treatment relies on platinum/fluorouracil-based chemotherapy. However, efficacy has reached a plateau, with mOS typically under 1 year.'}
                </Paragraph>
                <Paragraph>
                    {language === 'zh'
                        ? 'GC-001是一种高度特异性的抗PD-1单克隆抗体...本研究旨在III期规模上验证GC-001联合XELOX方案在一线治疗中的优越性。'
                        : 'GC-001 is a highly specific anti-PD-1 mAb... This Phase III study aims to validate the superiority of GC-001 plus XELOX as 1st-line treatment.'}
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '1. 方案概要' : '1. Protocol Summary'}</Title>
                <Paragraph>
                    <Text strong>{language === 'zh' ? '研究标题:' : 'Study Title:'}</Text> {language === 'zh'
                        ? '一项多中心、随机、双盲、安慰剂对照的III期临床研究，旨在评估GC-001联合XELOX方案对比安慰剂联合XELOX方案 frontline 处理 HER2 阴性 GC 患者。'
                        : 'A Multicenter, Randomized, Double-blind, Placebo-controlled Phase III Study of GC-001 plus XELOX vs Placebo plus XELOX as 1st-line treatment for HER2-negative GC patients.'}
                </Paragraph>
                <Paragraph>
                    <Text strong>{language === 'zh' ? '试验药物:' : 'Test Drug:'}</Text> {language === 'zh' ? 'GC-001 注射液 (规格: 100mg/10ml)' : 'GC-001 Injection (100mg/10ml)'}
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '2. 研究目的' : '2. Study Objectives'}</Title>
                <div className="pl-4">
                    <Title level={5}>{language === 'zh' ? '2.1 主要目的' : '2.1 Primary Objective'}</Title>
                    <ul className="list-disc pl-5 mb-4">
                        <li>{language === 'zh' ? '评估GC-001联合化疗对比安慰剂联合化疗在PD-L1 CPS ≥ 5 人群及ITT人群中的OS。' : 'Assess OS of GC-001+chemo vs Placebo+chemo in PD-L1 CPS ≥ 5 and ITT populations.'}</li>
                        <li>{language === 'zh' ? '评估基于BICR根据RECIST v1.1标准的PFS。' : 'Assess PFS based on BICR per RECIST v1.1.'}</li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '3. 研究设计' : '3. Study Design'}</Title>
                <Paragraph>
                    {language === 'zh'
                        ? '本研究为一项随机、双盲、安慰剂对照、多中心III期临床研究。计划入组约600例受试者。'
                        : 'This is a randomized, double-blind, placebo-controlled, multicenter Phase III study. Plan to enroll approx. 600 subjects.'}
                </Paragraph>
                <div className="bg-blue-50 p-4 border-l-4 border-blue-400 my-4 text-sm">
                    <Text type="secondary"><HighlightOutlined /> [Medical Writer Hint]: {language === 'zh' ? '分层因素包括ECOG评分、肝转移情况及PD-L1表达。' : 'Stratification factors: ECOG, Liver Met, PD-L1 expression.'}</Text>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '4. 治疗方案' : '4. Treatment Plan'}</Title>
                <div className="pl-4">
                    <Paragraph>
                        <Text strong>{language === 'zh' ? '试验组:' : 'Experimental Group:'}</Text> GC-001 3mg/kg Q3W + XELOX.
                    </Paragraph>
                    <Paragraph>
                        <Text strong>{language === 'zh' ? '对照组:' : 'Control Group:'}</Text> Placebo Q3W + XELOX.
                    </Paragraph>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '5. 入选/排除标准' : '5. Inclusion/Exclusion Criteria'}</Title>
                <div className="pl-4">
                    <Title level={5}>{language === 'zh' ? '5.1 入选标准' : '5.1 Inclusion Criteria'}</Title>
                    <ol className="list-decimal pl-5 mb-4">
                        <li>{language === 'zh' ? '年龄 18-75岁。' : 'Age 18-75 years.'}</li>
                        <li>{language === 'zh' ? '组织学确认的HER2阴性晚期胃癌。' : 'Histologically confirmed HER2-negative advanced GC.'}</li>
                        <li>{language === 'zh' ? '既往未接受系统化疗。' : 'No prior systemic treatment for advanced disease.'}</li>
                        <li>{language === 'zh' ? 'ECOG 0 or 1.' : 'ECOG 0 or 1.'}</li>
                    </ol>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>{language === 'zh' ? '13. 药代动力学(PK)与生物标志物' : '13. PK & Biomarkers'}</Title>
                <Table
                    size="small"
                    pagination={false}
                    dataSource={[
                        { key: '1', point: language === 'zh' ? 'C1D1 给药前' : 'C1D1 Pre-dose', pk: '√', ada: '√' },
                        { key: '2', point: language === 'zh' ? 'C1D1 给药结束' : 'C1D1 End', pk: '√', ada: '×' },
                        { key: '3', point: language === 'zh' ? 'C2D1 给药前' : 'C2D1 Pre-dose', pk: '√', ada: '√' },
                    ]}
                    columns={[
                        { title: language === 'zh' ? '采样点' : 'Time Point', dataIndex: 'point', key: 'point' },
                        { title: 'PK', dataIndex: 'pk', key: 'pk', align: 'center' },
                        { title: 'ADA', dataIndex: 'ada', key: 'ada', align: 'center' },
                    ]}
                />
                {geneticApprovalCompleted && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                        <Title level={5} className="text-green-700">{language === 'zh' ? '13.1 人类遗传资源管理' : '13.1 HGR Management'}</Title>
                        <Paragraph>
                            {language === 'zh'
                                ? '本研究涉及人类遗传资源的采集与使用，将严格遵守相关规定。'
                                : 'This study involves HGR collection, strictly following regulations.'}
                        </Paragraph>
                        <div className="pl-4">
                            <Title level={5}>{language === 'zh' ? '13.1.1 遗传资源采集审批' : '13.1.1 HGR Collection Approval'}</Title>
                            <Paragraph>
                                {language === 'zh'
                                    ? '申办方已向科技部人遗办提交申请，获得批准后方可开展。'
                                    : 'Sponsor has submitted HGR application to HGRAC.'}
                            </Paragraph>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    // Compliance Check Items (Translated)
    const complianceCheckItemsZh = [
        {
            category: '知情同意', items: [
                { text: '知情同意书语言通俗易懂', status: 'pass', ref: '第10节 (伦理与法规)' },
                { text: '明确告知风险与获益', status: 'pass', ref: '第10节 (伦理与法规)' },
                { text: '说明退出权利与后续治疗', status: 'pass', ref: '第5节 (入选/排除标准)' },
            ]
        },
        {
            category: '受试者保护', items: [
                { text: '受试者补偿方案合理', status: 'pass', ref: '第10节 (伦理与法规)' },
                { text: '不良事件报告与处理流程', status: 'pass', ref: '第8节 (安全性评价)' },
                { text: '紧急揭盲程序', status: 'pass', ref: '第3节 (研究设计)' },
            ]
        },
        {
            category: '生物样本', items: [
                { text: '样本采集目的与用途', status: 'pass', ref: '第13节 (PK与生物标志物)' },
                { text: '遗传资源审批情况', status: geneticApprovalCompleted ? 'pass' : 'warning', ref: geneticApprovalCompleted ? '第13节 (PK与生物标志物)' : '待补充' },
                { text: '样本保存期限与销毁', status: 'pass', ref: '第13节 (PK与生物标志物)' },
            ]
        },
    ]
    const complianceCheckItemsEn = [
        {
            category: 'Informed Consent', items: [
                { text: 'ICF language is clear/simple', status: 'pass', ref: 'Sec 10 (Ethics & Regs)' },
                { text: 'Risk/Benefit disclosure', status: 'pass', ref: 'Sec 10 (Ethics & Regs)' },
                { text: 'Exit rights & follow-up', status: 'pass', ref: 'Sec 5 (Inclusion/Exclusion)' },
            ]
        },
        {
            category: 'Subject Protection', items: [
                { text: 'Reasonable compensation', status: 'pass', ref: 'Sec 10 (Ethics & Regs)' },
                { text: 'AE reporting & disposal', status: 'pass', ref: 'Sec 8 (Safety Eval)' },
                { text: 'Emergency unblinding', status: 'pass', ref: 'Sec 3 (Study Design)' },
            ]
        },
        {
            category: 'Biosamples', items: [
                { text: 'Sample purpose & usage', status: 'pass', ref: 'Sec 13 (PK & Biomarkers)' },
                { text: 'HGR approval status', status: geneticApprovalCompleted ? 'pass' : 'warning', ref: geneticApprovalCompleted ? 'Sec 13 (PK & Biomarkers)' : 'Pending' },
                { text: 'Storage & disposal', status: 'pass', ref: 'Sec 13 (PK & Biomarkers)' },
            ]
        },
    ]
    const complianceCheckItems = language === 'zh' ? complianceCheckItemsZh : complianceCheckItemsEn

    const totalItems = complianceCheckItems.reduce((acc, g) => acc + g.items.length, 0)
    const passedItems = complianceCheckItems.reduce((acc, g) => acc + g.items.filter(i => i.status === 'pass').length, 0)

    // Consistency Check results (Translated)
    const consistencyDataZh = [
        { key: '1', source: '可行性报告 (步骤2)', target: '方案第3节 (设计)', item: '样本量设定', status: 'pass', desc: '可行性报告建议N=600以满足OS优效假设。方案已采用N=600。' },
        { key: '2', source: 'RFP需求', target: '方案第2节 (终点)', item: '双主要终点', status: 'pass', desc: 'RFP明确要求OS和PFS为双主要终点。' },
        { key: '3', source: 'Phase II数据', target: '方案第4节 (给药)', item: 'GC-001剂量', status: 'pass', desc: 'II期数据显示3mg/kg Q3W耐受极佳。' },
        { key: '23', source: '遗传办规定', target: '方案附录 (ICF)', item: '基因检测授权', status: 'warning', desc: '建议ICF中增加单独勾选授权。' },
    ]
    const consistencyDataEn = [
        { key: '1', source: 'Feasibility Report (Step 2)', target: 'Sec 3 (Design)', item: 'Sample Size', status: 'pass', desc: 'Report rec N=600 for OS superiority. Protocol adopted N=600.' },
        { key: '2', source: 'RFP Requirements', target: 'Sec 2 (Endpoints)', item: 'Co-primary Endpoints', status: 'pass', desc: 'RFP requested OS & PFS as dual primaries.' },
        { key: '3', source: 'Phase II Data', target: 'Sec 4 (Dosing)', item: 'GC-001 Dose', status: 'pass', desc: 'Phase II cohort showed 3mg/kg Q3W best tolerated.' },
        { key: '23', source: 'HGRAC Regs', target: 'Appendix (ICF)', item: 'Genetic Auth', status: 'warning', desc: 'Rec separate checkbox for genetic authorization.' },
    ]
    const consistencyData = language === 'zh' ? consistencyDataZh : consistencyDataEn

    return (
        <Card bordered={false} className="shadow-sm min-h-full flex flex-col" styles={{ body: { padding: '0', display: 'flex', flexDirection: 'column', flex: 1 } }}>
            <div ref={topRef} />
            {isRevising && (
                <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 flex items-center gap-3">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                    <div>
                        <Text strong className="text-orange-700"><EditOutlined /> {language === 'zh' ? '方案修订中' : 'Protocol Revising'}</Text>
                        <Text className="text-orange-600 ml-2">{language === 'zh' ? '医学方案撰写专家正在更新方案内容...' : 'Medical Writer is updating content...'}</Text>
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-row">
                <div className="flex-1 bg-gray-50 p-4 flex flex-col">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        type="card"
                        className="flex-1 flex flex-col"
                        items={[
                            {
                                label: <span><FileTextOutlined /> {language === 'zh' ? '方案内容' : 'Protocol Content'}</span>,
                                key: 'protocol',
                                children: (
                                    <div className="bg-white p-8 shadow-sm rounded-b-lg border border-gray-200">
                                        {protocolContent}
                                    </div>
                                )
                            },
                            {
                                label: <span><DiffOutlined /> {language === 'zh' ? '一致性检查' : 'Consistency Check'}</span>,
                                key: 'consistency',
                                children: (
                                    <div className="bg-white p-6 shadow-sm rounded-b-lg border border-gray-200">
                                        <Card
                                            size="small"
                                            title={<div className="flex items-center gap-2">
                                                <SafetyCertificateOutlined className={passedItems === totalItems ? "text-green-500" : "text-orange-500"} />
                                                <span>{language === 'zh' ? '合规要点核验' : 'Compliance Verification'}</span>
                                                <Tag color={passedItems === totalItems ? "success" : "warning"}>{passedItems}/{totalItems} {language === 'zh' ? '通过' : 'Pass'}</Tag>
                                            </div>}
                                            className="mb-6"
                                        >
                                            <Row gutter={[16, 16]}>
                                                {complianceCheckItems.map((group, idx) => (
                                                    <Col span={12} key={idx}>
                                                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                                            <Text strong className="text-sm">{group.category}</Text>
                                                            <div className="mt-2 space-y-2">
                                                                {group.items.map((item, itemIdx) => (
                                                                    <div key={itemIdx} className="flex items-center justify-between text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            {item.status === 'pass' ? <CheckCircleOutlined className="text-green-500" /> : <WarningOutlined className="text-orange-500" />}
                                                                            <span className={item.status === 'pass' ? 'text-gray-600' : 'text-orange-600'}>{item.text}</span>
                                                                        </div>
                                                                        <Text type="secondary" className="text-xs">{item.ref}</Text>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                        <Divider className="my-4" />
                                        <Alert
                                            message={language === 'zh' ? '方案一致性已核查' : 'Consistency Checked'}
                                            description={language === 'zh' ? '所有关键参数均符合可行性报告、风控报告及RFP要求。' : 'All key parameters match Feasibility, Risk, and RFP reports.'}
                                            type="success"
                                            showIcon
                                            className="mb-6"
                                        />
                                        <List
                                            dataSource={consistencyData}
                                            renderItem={item => (
                                                <List.Item className="border-b border-gray-100 last:border-0">
                                                    <div className="w-full">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <Text strong>{item.item}</Text>
                                                            <Tag color={item.status === 'pass' ? 'success' : 'warning'} icon={item.status === 'pass' ? <CheckCircleOutlined /> : <WarningOutlined />}>
                                                                {item.status === 'pass' ? (language === 'zh' ? '与上游一致' : 'Consistent') : (language === 'zh' ? '需核实' : 'To Verify')}
                                                            </Tag>
                                                        </div>
                                                        <Row gutter={16} className="text-sm text-gray-500 mb-2">
                                                            <Col span={10}><Text type="secondary">{language === 'zh' ? '来源' : 'Source'}: {item.source}</Text></Col>
                                                            <Col span={4} className="text-center"><ArrowRightOutlined /></Col>
                                                            <Col span={10}><Text type="secondary">{language === 'zh' ? '目标' : 'Target'}: {item.target}</Text></Col>
                                                        </Row>
                                                        <div className="bg-gray-50 p-2 rounded text-gray-600 text-sm">
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                )
                            }
                        ]}
                    />
                </div>
            </div>
        </Card>
    )
}

export default DraftingStep


