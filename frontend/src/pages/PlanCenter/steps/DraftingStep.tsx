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

const { Title, Text, Paragraph } = Typography

interface DraftingStepProps {
    geneticApprovalCompleted?: boolean;
    isRevising?: boolean;
}

const DraftingStep: React.FC<DraftingStepProps> = ({ geneticApprovalCompleted = false, isRevising = false }) => {
    const [activeTab, setActiveTab] = useState('protocol')
    const topRef = useRef<HTMLDivElement>(null)

    // 当进入修订状态时，自动滚动到顶部
    useEffect(() => {
        if (isRevising && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isRevising])

    // Mock Protocol Data - Gastric Cancer Study
    const protocolContent = (
        <div className="font-serif leading-relaxed text-gray-800" style={{ fontFamily: 'Songti SC, SimSun, serif' }}>
            <div className="text-center mb-8">
                <Title level={3}>GC-001联合XELOX一线治疗晚期胃癌III期临床试验方案</Title>
                <Text className="block text-lg font-bold mb-2">方案编号: GC-001-301</Text>
                <Text className="block text-base">版本: 1.0 (草案)</Text>
                <Text className="block text-sm text-gray-500">日期: 2026-01-20</Text>
            </div>

            <div className="mb-6">
                <Title level={4}>0. 背景与研究理由</Title>
                <Paragraph>
                    胃癌是全球范围内常见的恶性肿瘤之一，特别是在东亚地区，其发病率和死亡率均居高不下。对于HER2阴性的晚期胃或胃食管交界处腺癌，目前的标准一线治疗方案仍以含铂类和氟尿嘧啶类的化疗为主。然而，化疗的疗效已进入瓶颈期，患者的中位总生存期（mOS）通常不足1年。
                </Paragraph>
                <Paragraph>
                    GC-001是一种高度特异性的抗PD-1单克隆抗体，通过阻断PD-1与其配体PD-L1/PD-L2的结合，恢复T细胞的抗肿瘤活性。早期的I/II期临床研究显示，GC-001联合化疗在晚期胃癌患者中表现出令人鼓舞的抗肿瘤活性和可控的安全性，尤其是在PD-L1表达阳性的患者中效果更为显著。基于此，本研究旨在III期规模上验证GC-001联合XELOX方案在一线治疗中的优越性。
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>1. 方案概要</Title>
                <Paragraph>
                    <Text strong>研究标题:</Text> 一项多中心、随机、双盲、安慰剂对照的III期临床研究，旨在评估GC-001（抗PD-1单抗）联合XELOX方案（奥沙利铂+卡培他滨）对比安慰剂联合XELOX方案一线治疗HER2阴性、不可切除的局部晚期或转移性胃或胃食管交界处（G/GEJ）腺癌患者的有效性和安全性。
                </Paragraph>
                <Paragraph>
                    <Text strong>试验药物:</Text> GC-001 注射液 (规格: 100mg/10ml)
                </Paragraph>
                <Paragraph>
                    <Text strong>研究分期:</Text> III期关键性注册临床研究
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>2. 研究目的</Title>
                <div className="pl-4">
                    <Title level={5}>2.1 主要目的</Title>
                    <ul className="list-disc pl-5 mb-4">
                        <li>评估GC-001联合化疗对比安慰剂联合化疗在PD-L1 CPS ≥ 5 人群及意向治疗人群（ITT）中的总生存期（OS）。</li>
                        <li>评估基于盲态独立影像评估委员会（BICR）根据RECIST v1.1标准评估的无进展生存期（PFS）。</li>
                    </ul>
                    <Title level={5}>2.2 次要目的</Title>
                    <ul className="list-disc pl-5">
                        <li>客观缓解率（ORR）</li>
                        <li>缓解持续时间（DoR）</li>
                        <li>疾病控制率（DCR）</li>
                        <li>安全性与耐受性（NCI-CTCAE v5.0）</li>
                        <li>生活质量评分（EORTC QLQ-C30/STO22）</li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>3. 研究设计</Title>
                <Paragraph>
                    本研究为一项随机、双盲、安慰剂对照、多中心III期临床研究。计划在中国及亚太地区约50家中心入组约600例受试者。符合条件的受试者将按1:1随机分配至试验组或对照组。
                </Paragraph>
                <div className="bg-blue-50 p-4 border-l-4 border-blue-400 my-4 text-sm">
                    <Text type="secondary"><HighlightOutlined /> [医学撰写提示]: 分层因素包括ECOG评分（0 vs 1）、肝转移情况（有 vs 无）及PD-L1表达水平（CPS 5-9 vs ≥10）。</Text>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>4. 治疗方案</Title>
                <div className="pl-4">
                    <Paragraph>
                        <Text strong>试验组:</Text> GC-001 3mg/kg，静脉输注，每3周一次（Q3W） + 奥沙利铂 130 mg/m² (D1) + 卡培他滨 1000 mg/m² bid (D1-14)，Q3W。
                    </Paragraph>
                    <Paragraph>
                        <Text strong>对照组:</Text> 安慰剂，静脉输注，每3周一次（Q3W） + 奥沙利铂 130 mg/m² (D1) + 卡培他滨 1000 mg/m² bid (D1-14)，Q3W。
                    </Paragraph>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>5. 入选/排除标准</Title>
                <div className="pl-4">
                    <Title level={5}>5.1 入选标准</Title>
                    <ol className="list-decimal pl-5 mb-4">
                        <li>自愿签署知情同意书，年龄 ≥ 18岁且 ≤ 75岁。</li>
                        <li>经组织学确认的、不可切除的局部晚期或转移性胃或胃食管交界处腺癌。</li>
                        <li>HER2检测结果为阴性（IHC 0/1+ 或 IHC 2+/FISH 阴性）。</li>
                        <li>既往未针对晚期疾病接受过系统性抗肿瘤治疗。</li>
                        <li>根据RECIST v1.1标准，至少有一个可测量病灶。</li>
                        <li>ECOG体能状态评分 0 或 1。</li>
                        <li>
                            器官功能良好：ANC ≥ 1.5×10^9/L, PLT ≥ 100×10^9/L, Hb ≥ 90 g/L; TBIL ≤ 1.5×ULN, ALT/AST ≤ 2.5×ULN (肝转移者 ≤ 5×ULN); CrCl ≥ 50 mL/min。
                        </li>
                    </ol>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>6. 访视与评估</Title>
                <Paragraph>
                    研究分为筛选期（-28天至-1天）、治疗期（每3周为一个周期）和安全性随访期（末次用药后30天/90天）。
                </Paragraph>
                <div className="pl-4">
                    <ul className="list-disc pl-5">
                        <li><Text strong>筛选期:</Text>签署ICF，人口学特征，既往病史，基线肿瘤评估（CT/MRI），ECOG评分，实验室检查。</li>
                        <li><Text strong>治疗期:</Text>每周期（D1）进行体格检查、生命体征、实验室检查。每2个周期（6周）进行一次肿瘤评估（RECIST v1.1），直至第48周，之后每4个周期（12周）评估一次，直至疾病进展（PD）。</li>
                        <li><Text strong>治疗结束:</Text>因PD、毒性不可耐受或撤回知情同意等原因终止治疗时进行。</li>
                        <li><Text strong>生存随访:</Text>治疗结束后每12周进行一次生存随访，直至死亡、研究结束或失访。</li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>7. 疗效评估</Title>
                <Paragraph>
                    主要疗效终点为总生存期（OS）和无进展生存期（PFS）。次要疗效终点包括客观缓解率（ORR）、缓解持续时间（DoR）和疾病控制率（DCR）。
                </Paragraph>
                <Paragraph>
                    肿瘤反应评估将依据RECIST v1.1标准进行。对于主要终点PFS，将由盲态独立影像评估委员会（BICR）进行中心评估。研究者评估结果将作为敏感性分析。
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>8. 安全性评价</Title>
                <Paragraph>
                    安全性评估包括不良事件（AE）、严重不良事件（SAE）、实验室异常、生命体征和心电图检查。不良事件严重程度将根据NCI-CTCAE v5.0进行分级。
                </Paragraph>
                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 my-4 text-sm">
                    <Text type="secondary"><WarningOutlined /> [重点关注风险]: 免疫相关不良事件（irAEs），包括免疫性肺炎、结肠炎、肝炎、内分泌毒性等；化疗相关骨髓抑制及周围神经毒性。</Text>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>9. 统计学分析</Title>
                <div className="pl-4">
                    <Title level={5}>9.1 样本量计算</Title>
                    <Paragraph>
                        假设对照组的中位OS为11.0个月，试验组的中位OS为15.0个月（HR=0.73）。在单侧显著性水平0.025，效能（Power）为90%的情况下，需要约460例OS事件。考虑到5%的脱落率，计划入组约600例受试者。
                    </Paragraph>
                    <Title level={5}>9.2 分析集</Title>
                    <Paragraph>
                        <Text strong>意向治疗人群（ITT）:</Text> 所有经随机化分配的受试者，无论其是否接受治疗。ITT人群将用于主要疗效分析。
                        <br />
                        <Text strong>安全性分析集（SS）:</Text> 所有接受至少一次研究治疗的受试者。
                    </Paragraph>
                    <Title level={5}>9.3 统计方法</Title>
                    <Paragraph>
                        OS and PFS将采用Kaplan-Meier法估算中位生存时间及生存率，组间比较采用分层Log-rank检验。风险比（HR）及其95%置信区间（CI）将采用分层Cox比例风险模型进行估算。
                    </Paragraph>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>10. 伦理与法规</Title>
                <Paragraph>
                    本研究将遵循《赫尔辛基宣言》、ICH-GCP指南及中国现行药品注册管理办法进行。研究方案及其修订均需经独立伦理委员会（IEC）审核批准。所有受试者必须在主要研究程序开始前自愿签署书面知情同意书。
                </Paragraph>
            </div>

            <div className="mb-6">
                <Title level={4}>11. 剂量调整与停药原则</Title>
                <div className="pl-4">
                    <Paragraph>
                        受试者出现与研究药物相关的毒性反应时，应根据NCI-CTCAE v5.0分级进行剂量延迟、减量或永久停药。
                    </Paragraph>
                    <ul className="list-disc pl-5">
                        <li><Text strong>血液学毒性:</Text> 若发生4级中性粒细胞减少或3级及以上发热性中性粒细胞减少，应延迟给药直至恢复至≤1级。后续奥沙利铂剂量应下调25%。</li>
                        <li><Text strong>免疫相关不良事件 (irAE):</Text> 对于2级irAE，应暂停GC-001直至恢复至≤1级；对于3级irAE，原则上应永久停药，除非经研究者评估并与医学监查员沟通确认可恢复后重启（如内分泌毒性控制良好）。</li>
                        <li><Text strong>卡培他滨调整:</Text> 出现2级手足综合征（HFS）时应暂停给药，直至恢复至0-1级，首次恢复后可不减量，若再次发生则需减量25%。</li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>12. 合并用药管理</Title>
                <div className="pl-4">
                    <Title level={5}>12.1 禁止使用的合并用药</Title>
                    <ul className="list-disc pl-5 mb-4">
                        <li>其他任何试验性全身辅助抗肿瘤药物。</li>
                        <li>其他PD-1、PD-L1、CTLA-4抗体。</li>
                        <li>全身性糖皮质激素（泼尼松等效剂量 &gt; 10mg/天），除非用于治疗AE或作为造影剂过敏预防。</li>
                    </ul>
                    <Title level={5}>12.2 允许使用的合并用药</Title>
                    <ul className="list-disc pl-5">
                        <li>用于控制恶心、呕吐、疼痛的标准对症治疗药物。</li>
                        <li>治疗慢性疾病（如高血压、糖尿病）且不影响研究药物评估的药物。</li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <Title level={4}>13. 药代动力学(PK)与生物标志物采样</Title>
                <Paragraph>
                    受试者需在特定时间点采集静脉血用于PK分析和免疫原性（ADA）检测。
                </Paragraph>
                <Table
                    size="small"
                    pagination={false}
                    dataSource={[
                        { key: '1', point: 'C1D1 给药前', pk: '√', ada: '√' },
                        { key: '2', point: 'C1D1 给药结束前', pk: '√', ada: '×' },
                        { key: '3', point: 'C2D1 给药前', pk: '√', ada: '√' },
                        { key: '4', point: 'C4D1 给药前', pk: '√', ada: '√' },
                    ]}
                    columns={[
                        { title: '采样时间点', dataIndex: 'point', key: 'point' },
                        { title: 'PK采样', dataIndex: 'pk', key: 'pk', align: 'center' },
                        { title: 'ADA采样', dataIndex: 'ada', key: 'ada', align: 'center' },
                    ]}
                />
                {/* 遗传资源审批说明 - 动态添加 */}
                {geneticApprovalCompleted && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                        <Title level={5} className="text-green-700">13.1 人类遗传资源管理</Title>
                        <Paragraph>
                            本研究涉及人类遗传资源的采集与使用，将严格遵守《中华人民共和国人类遗传资源管理条例》的相关规定。
                        </Paragraph>
                        <div className="pl-4">
                            <Title level={5}>13.1.1 遗传资源采集审批</Title>
                            <Paragraph>
                                研究开始前，申办方已向科技部中国人类遗传资源管理办公室提交人类遗传资源采集审批申请，获得批准后方可开展涉及遗传资源的研究活动。采集范围包括用于探索性生物标志物分析的血液样本。
                            </Paragraph>
                            <Title level={5}>13.1.2 样本出境审批</Title>
                            <Paragraph>
                                如需将人类遗传资源材料或相关数据出境，申办方将按照规定向人类遗传资源管理办公室申请出境许可。出境前需完成数据安全评估，确保符合《数据安全法》和《个人信息保护法》的要求。
                            </Paragraph>
                            <Title level={5}>13.1.3 知情同意要求</Title>
                            <Paragraph>
                                知情同意书中已包含遗传资源使用的专门条款，明确告知受试者：(1) 样本将用于的具体研究目的；(2) 样本可能出境的情况及安全保障措施；(3) 受试者有权拒绝样本用于遗传资源研究而不影响其参与主研究。
                            </Paragraph>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <Title level={4}>14. 数据管理与监查</Title>
                <Paragraph>
                    本研究采用Medidata Rave EDC系统进行临床数据的采集与管理。研究者需及时准确地录入电子报告卡（eCRF）。
                </Paragraph>
                <Paragraph>
                    监查员（CRA）将定期进行现场或远程监查，以核实数据的真实性、完整性及受试者权益。主要指标将进行100%的原始数据核对（SDV）。
                </Paragraph>
            </div>
        </div>
    )

    // 合规要点检查（来自风控步骤）
    const complianceCheckItems = [
        { category: '知情同意', items: [
            { text: '知情同意书语言通俗易懂', status: 'pass', ref: '第10节 (伦理与法规)' },
            { text: '明确告知风险与获益', status: 'pass', ref: '第10节 (伦理与法规)' },
            { text: '说明退出权利与后续治疗', status: 'pass', ref: '第5节 (入选/排除标准)' },
        ]},
        { category: '受试者保护', items: [
            { text: '受试者补偿方案合理', status: 'pass', ref: '第10节 (伦理与法规)' },
            { text: '不良事件报告与处理流程', status: 'pass', ref: '第8节 (安全性评价)' },
            { text: '紧急揭盲程序', status: 'pass', ref: '第3节 (研究设计)' },
        ]},
        { category: '数据管理', items: [
            { text: '数据采集与存储方案', status: 'pass', ref: '第14节 (数据管理)' },
            { text: '数据跨境传输合规说明', status: 'pass', ref: '第10节 (伦理与法规)' },
            { text: '去标识化与隐私保护措施', status: 'pass', ref: '第14节 (数据管理)' },
        ]},
        { category: '生物样本', items: [
            { text: '样本采集目的与用途', status: 'pass', ref: '第13节 (PK与生物标志物)' },
            { text: '遗传资源审批情况', status: geneticApprovalCompleted ? 'pass' : 'warning', ref: geneticApprovalCompleted ? '第13节 (PK与生物标志物)' : '待补充' },
            { text: '样本保存期限与销毁', status: 'pass', ref: '第13节 (PK与生物标志物)' },
        ]},
    ]

    // 计算通过数量
    const totalItems = complianceCheckItems.reduce((acc, g) => acc + g.items.length, 0)
    const passedItems = complianceCheckItems.reduce((acc, g) => acc + g.items.filter(i => i.status === 'pass').length, 0)

    // Consistency Check results
    const consistencyData = [
        // --- 临床科学性 (Clinical/Scientific) ---
        { key: '1', source: '可行性报告 (步骤2)', target: '方案第3节 (设计)', item: '样本量设定', status: 'pass', desc: '可行性报告建议N=600以满足OS优效假设（HR=0.75）。方案已采用N=600。' },
        { key: '2', source: 'RFP需求', target: '方案第2节 (终点)', item: '双主要终点', status: 'pass', desc: 'RFP明确要求OS和PFS为双主要终点。方案设计已完全响应。' },
        { key: '3', source: 'Phase II数据', target: '方案第4节 (给药)', item: 'GC-001剂量', status: 'pass', desc: 'II期数据显示3mg/kg Q3W耐受性良好且疗效最佳。方案已采纳该剂量。' },
        { key: '4', source: 'RFP需求', target: '方案第5节 (入选)', item: '超龄风险', status: 'warning', desc: 'RFP建议上限80岁，但考虑到化疗耐受性，方案设定为75岁。需与申办方确认。' },
        { key: '5', source: '可行性报告', target: '方案第5节 (入选)', item: 'ECOG评分', status: 'pass', desc: '基于目标人群特征，入选标准限制ECOG 0-1，符合可行性分析建议。' },
        { key: '6', source: 'RFP需求', target: '方案第2节 (次要终点)', item: '生活质量评估', status: 'pass', desc: '已按要求加入EORTC QLQ-C30/STO22问卷评估。' },
        { key: '7', source: 'CSCO指南', target: '方案第4节 (对照组)', item: '标准治疗', status: 'pass', desc: '对照组采用XELOX方案，符合当前CSCO胃癌诊疗指南一线标准。' },
        { key: '8', source: 'IB手册', target: '方案第5节 (排除)', item: '自身免疫病史', status: 'pass', desc: '基于IB风险提示，方案已排除活动性自身免疫病患者。' },
        { key: '9', source: 'RFP需求-生物标志物', target: '方案第5节 (入选)', item: 'HER2状态', status: 'pass', desc: '已明确仅入组HER2阴性患者，避免与赫赛汀联用混杂。' },
        { key: '10', source: '全局标准', target: '方案第6节 (访视)', item: '给药周期', status: 'pass', desc: '访视窗口期设定为±3天，符合常规操作标准。' },

        // --- 统计学 (Statistical) ---
        { key: '11', source: 'SAP (统计分析计划)', target: '方案第9.2节 (分析集)', item: 'ITT定义', status: 'pass', desc: '方案中ITT定义为所有随机化受试者，与SAP一致。' },
        { key: '12', source: 'SAP (统计分析计划)', target: '方案第9.3节 (缺失值)', item: '缺失数据处理', status: 'pass', desc: '生存分析采用右删失处理，符合SAP规定。' },
        { key: '13', source: '可行性报告', target: '方案第9.1节 (假设)', item: 'HR设定', status: 'pass', desc: '样本量计算基于HR=0.73，效能90%，与可行性测算一致。' },
        { key: '14', source: 'RFP需求', target: '方案第9.3节 (期中分析)', item: '期中分析时机', status: 'pass', desc: '方案设定了达到70% OS事件时的期中分析，响应RFP要求。' },
        { key: '15', source: '随机化系统规范', target: '方案第3节 (方法)', item: '分层因素', status: 'pass', desc: '分层因素（ECOG, 肝转移, PD-L1）与IWRS系统设置一致。' },

        // --- 安全性与药物警戒 (Safety/PV) ---
        { key: '16', source: '药物警戒计划 (PV)', target: '方案第9节 (AE报告)', item: 'SAE上报时限', status: 'pass', desc: '方案规定SAE需在24小时内上报，与PV部门SOP保持一致。' },
        { key: '17', source: '法律法规', target: '方案第9节 (SUSAR)', item: 'SUSAR快速报告', status: 'pass', desc: '方案明确了SUSAR的7/15天快速报告流程，符合法规要求。' },
        { key: '18', source: 'PV SOP', target: '方案第8节 (特殊情形)', item: '妊娠报告', status: 'pass', desc: '已包含妊娠事件的追踪及报告流程。' },
        { key: '19', source: '风控报告', target: '方案第8节 (AESI)', item: 'AESI清单', status: 'pass', desc: '免疫相关肺炎、结肠炎已列为特别关注不良事件（AESI）。' },
        { key: '20', source: '风控报告', target: '方案第4节 (给药)', item: '肾毒性管理', status: 'pass', desc: '方案已包含针对CrCl 30-50ml/min患者的剂量调整指南。' },

        // --- 伦理与法规 (Ethics/Regulatory) ---
        { key: '21', source: 'GCP原则', target: '方案附录 (ICF)', item: '知情同意', status: 'pass', desc: '方案强调必须在任何研究程序前签署ICF。' },
        { key: '22', source: '保险条款', target: '方案第10节', item: '受试者保险', status: 'pass', desc: '方案已声明将为受试者购买临床试验责任险。' },
        { key: '23', source: '遗传办规定', target: '方案附录 (ICF)', item: '基因检测授权', status: 'warning', desc: '方案涉及探索性基因检测，建议ICF中增加单独勾选授权项。' },
        { key: '24', source: '数据出境规定', target: '方案第10节', item: '数据隐私', status: 'pass', desc: '方案声明数据采集将遵循《个人信息保护法》及数据出境评估要求。' },
        { key: '25', source: '人类遗传资源管理条例', target: '方案第6节 (样本)', item: '样本销毁', status: 'pass', desc: '规定了剩余样本的销毁或长期存储流程需符合人遗办审批。' },

        // --- 运营与数据 (Operational/Data) ---
        { key: '26', source: '供应链管理 (SCM)', target: '方案第6节 (随机化)', item: 'IWRS交互', status: 'pass', desc: '方案流程支持中央随机系统（IWRS）进行药物分配。' },
        { key: '27', source: '中心实验室手册', target: '方案第6节 (采样)', item: 'PK样本处理', status: 'pass', desc: 'PK样本离心及冷冻保存条件与中心实验室实验室手册一致。' },
        { key: '28', source: '数据管理计划 (DMP)', target: '方案第11节 (数据)', item: 'EDC系统', status: 'pass', desc: '明确使用Medidata Rave系统进行数据采集。' },
        { key: '29', source: '数据管理计划 (DMP)', target: '方案第11节 (编码)', item: 'MedDRA版本', status: 'pass', desc: 'AE编码将采用最新版本MedDRA，符合DMP。' },
        { key: '30', source: '药品稳定性报告', target: '方案第4节 (贮存)', item: '药物效期管理', status: 'pass', desc: '药物保存条件（2-8℃避光）符合稳定性数据支持。' },
        { key: '31', source: '监查计划 (CMP)', target: '方案第10节 (监查)', item: 'SDV比例', status: 'pass', desc: '方案设定100% SDV（源数据核对），符合关键注册研究监查要求。' }
    ]

    return (
        <Card bordered={false} className="shadow-sm min-h-full flex flex-col" styles={{ body: { padding: '0', display: 'flex', flexDirection: 'column', flex: 1 } }}>
            {/* 顶部锚点，用于自动滚动 */}
            <div ref={topRef} />
            {/* 修订中提示 */}
            {isRevising && (
                <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 flex items-center gap-3">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                    <div>
                        <Text strong className="text-orange-700"><EditOutlined /> 方案修订中</Text>
                        <Text className="text-orange-600 ml-2">医学方案撰写专家正在更新方案内容...</Text>
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-row">
                {/* Main Content / Tabs */}
                <div className="flex-1 bg-gray-50 p-4 flex flex-col">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        type="card"
                        className="flex-1 flex flex-col"
                        items={[
                            {
                                label: <span><FileTextOutlined /> 方案内容</span>,
                                key: 'protocol',
                                children: (
                                    <div className="bg-white p-8 shadow-sm rounded-b-lg border border-gray-200">
                                        {protocolContent}
                                    </div>
                                )
                            },
                            {
                                label: <span><DiffOutlined /> 一致性检查</span>,
                                key: 'consistency',
                                children: (
                                    <div className="bg-white p-6 shadow-sm rounded-b-lg border border-gray-200">
                                        {/* 合规要点检查 - 来自风控步骤 */}
                                        <Card
                                            size="small"
                                            title={<div className="flex items-center gap-2"><SafetyCertificateOutlined className={passedItems === totalItems ? "text-green-500" : "text-orange-500"} /><span>合规要点核验</span><Tag color={passedItems === totalItems ? "success" : "warning"}>{passedItems}/{totalItems} 通过</Tag></div>}
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
                                                                            {item.status === 'pass' ? (
                                                                                <CheckCircleOutlined className="text-green-500" />
                                                                            ) : (
                                                                                <WarningOutlined className="text-orange-500" />
                                                                            )}
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
                                            message="方案一致性已核查"
                                            description="所有关键参数均符合可行性报告、风控报告及RFP要求。"
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
                                                                {item.status === 'pass' ? '与上游一致' : '需核实'}
                                                            </Tag>
                                                        </div>
                                                        <Row gutter={16} className="text-sm text-gray-500 mb-2">
                                                            <Col span={10}><Text type="secondary">来源: {item.source}</Text></Col>
                                                            <Col span={4} className="text-center"><ArrowRightOutlined /></Col>
                                                            <Col span={10}><Text type="secondary">目标: {item.target}</Text></Col>
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
