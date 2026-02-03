import { PlanItem, StepData } from './types'
import {
    FileTextOutlined,
    GlobalOutlined,
    RocketOutlined,
    MedicineBoxOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    FilePdfOutlined
} from '@ant-design/icons'

// English Data
export const stepsDataEn: StepData[] = [
    { title: 'Requirement Analysis', icon: <FileTextOutlined />, description: 'RFP Parsing' },
    { title: 'Data Collection', icon: <GlobalOutlined />, description: 'Structured Data' },
    { title: 'Feasibility Assessment', icon: <RocketOutlined />, description: 'Assessment Forecast' },
    { title: 'Site Selection', icon: <MedicineBoxOutlined />, description: 'Resource Combination' },
    { title: 'Compliance & Risk', icon: <SafetyCertificateOutlined />, description: 'Constraint Check' },
    { title: 'Plan Drafting', icon: <FileTextOutlined />, description: 'Draft Iteration' },
    { title: 'Collaborative Review', icon: <TeamOutlined />, description: 'Multi-party Revision' },
    { title: 'Delivery & Archiving', icon: <FilePdfOutlined />, description: 'Output Tracking' },
]

export const mockPlansEn: PlanItem[] = [
    {
        id: '1',
        name: 'GC-001-301 Gastric Cancer Phase III Clinical Plan',
        indication: 'Advanced Gastric Cancer',
        phase: 'Phase III',
        sponsor: 'Pharma Company A',
        createdAt: '2024-01-15',
        status: 'in-progress'
    },
    {
        id: '2',
        name: 'NS-202 NSCLC Study',
        indication: 'NSCLC',
        phase: 'Phase II',
        sponsor: 'Biotech Company B',
        createdAt: '2024-01-10',
        status: 'completed'
    },
    {
        id: '3',
        name: 'HEM-450 Hematologic Tumor Targeted Therapy',
        indication: 'T-cell Lymphoma',
        phase: 'Phase I/II',
        sponsor: 'Research Institute C',
        createdAt: '2024-01-08',
        status: 'draft'
    },
]

export const expertRolesEn = [
    { value: 'medical-writer', label: 'Medical Writer', description: 'Responsible for protocol drafting and polishing' },
    { value: 'statistician', label: 'Statistician', description: 'Responsible for sample size calculation and statistical analysis' },
    { value: 'compliance', label: 'Compliance Expert', description: 'Responsible for regulatory review and risk control' },
    { value: 'pm', label: 'Project Manager', description: 'Responsible for project coordination and management' },
    { value: 'clinical-expert', label: 'Clinical Expert', description: 'Responsible for clinical protocol design and optimization' },
    { value: 'data-manager', label: 'Data Manager', description: 'Responsible for data management plan formulation' },
]

export const systemCommandsEn = [
    { value: '生成方案', label: '/generate_plan', description: 'Quickly generate clinical trial protocols based on RFP', expert: 'system' },
    { value: '撰写章节', label: '/write_chapter', description: 'Write specified protocol chapters', expert: 'Medical Writer' },
    { value: '样本量计算', label: '/sample_size_calculation', description: 'Estimate statistical sample size', expert: 'Statistician' },
    { value: '合规检查', label: '/compliance_check', description: 'Execute regulatory compliance checks', expert: 'Compliance Expert' },
]

export const rfpProposalsEn = [
    {
        id: 'rfp-1',
        title: 'GC-001 Advanced Gastric Cancer Phase III Study Proposal',
        indication: 'Advanced Gastric Cancer',
        phase: 'Phase III',
        description: 'Randomized controlled clinical trial requirement for PD-L1 inhibitor combined with chemotherapy as first-line treatment for advanced gastric cancer',
        sponsor: 'Hengrui Pharma'
    },
    {
        id: 'rfp-2',
        title: 'NS-202 NSCLC Phase II Clinical Proposal',
        indication: 'Non-Small Cell Lung Cancer',
        phase: 'Phase II',
        description: 'Single-arm clinical trial requirement for ALK inhibitor as second-line treatment for EGFR wild-type NSCLC patients',
        sponsor: 'Betta Pharma'
    },
    {
        id: 'rfp-3',
        title: 'HEM-450 T-cell Lymphoma Phase I/II Proposal',
        indication: 'T-cell Lymphoma',
        phase: 'Phase I/II',
        description: 'Dose escalation trial requirement for CAR-T cell therapy for relapsed/refractory T-cell lymphoma',
        sponsor: 'JW Therapeutics'
    },
    {
        id: 'rfp-4',
        title: 'BC-301 HER2+ Breast Cancer Phase III Proposal',
        indication: 'HER2+ Breast Cancer',
        phase: 'Phase III',
        description: 'Clinical trial requirement for ADC drug combined with trastuzumab as neoadjuvant therapy for early HER2+ breast cancer',
        sponsor: 'RemeGen'
    },
]

// Chinese Data
export const stepsDataZh: StepData[] = [
    { title: '需求分析', icon: <FileTextOutlined />, description: 'RFP解析' },
    { title: '资料收集', icon: <GlobalOutlined />, description: '结构化数据' },
    { title: '可行性评估', icon: <RocketOutlined />, description: '评估预测' },
    { title: '中心选定', icon: <MedicineBoxOutlined />, description: '资源组合' },
    { title: '合规风控', icon: <SafetyCertificateOutlined />, description: '约束检查' },
    { title: '方案撰写', icon: <FileTextOutlined />, description: '成稿迭代' },
    { title: '协同评审', icon: <TeamOutlined />, description: '多方修订' },
    { title: '交付存档', icon: <FilePdfOutlined />, description: '输出留痕' },
]

export const mockPlansZh: PlanItem[] = [
    {
        id: '1',
        name: 'GC-001-301 胃癌三期临床方案',
        indication: '晚期胃癌',
        phase: 'Phase III',
        sponsor: '某制药公司',
        createdAt: '2024-01-15',
        status: 'in-progress'
    },
    {
        id: '2',
        name: 'NS-202 非小细胞肺癌研究',
        indication: '晚期非小细胞肺癌',
        phase: 'Phase II',
        sponsor: '某生物科技公司',
        createdAt: '2024-01-10',
        status: 'completed'
    },
    {
        id: '3',
        name: 'HEM-450 血液肿瘤靶向治疗',
        indication: 'T细胞淋巴瘤',
        phase: 'Phase I/II',
        sponsor: '某研究院',
        createdAt: '2024-01-08',
        status: 'draft'
    },
]

export const expertRolesZh = [
    { value: 'medical-writer', label: '医学撰写专家', description: '负责方案撰写与润色' },
    { value: 'statistician', label: '统计学家', description: '负责样本量计算与统计分析' },
    { value: 'compliance', label: '合规专家', description: '负责法规审查与风险控制' },
    { value: 'pm', label: '项目经理', description: '负责项目整体协调与管理' },
    { value: 'clinical-expert', label: '临床专家', description: '负责临床方案设计与优化' },
    { value: 'data-manager', label: '数据管理专家', description: '负责数据管理计划制定' },
]

export const systemCommandsZh = [
    { value: '生成方案', label: '/生成方案', description: '基于RFP快速生成临床试验方案', expert: 'system' },
    { value: '撰写章节', label: '/撰写章节', description: '撰写指定方案章节', expert: '医学撰写专家' },
    { value: '样本量计算', label: '/样本量计算', description: '进行统计学样本量估算', expert: '统计学家' },
    { value: '合规检查', label: '/合规检查', description: '执行法规合规性检查', expert: '合规专家' },
]

export const rfpProposalsZh = [
    {
        id: 'rfp-1',
        title: 'GC-001 晚期胃癌III期研究提案',
        indication: '晚期胃癌',
        phase: 'Phase III',
        description: 'PD-L1抑制剂联合化疗一线治疗晚期胃癌的随机对照临床试验需求',
        sponsor: '恒瑞医药'
    },
    {
        id: 'rfp-2',
        title: 'NS-202 非小细胞肺癌II期临床提案',
        indication: '非小细胞肺癌',
        phase: 'Phase II',
        description: 'ALK抑制剂二线治疗EGFR野生型NSCLC患者的单臂临床试验需求',
        sponsor: '贝达药业'
    },
    {
        id: 'rfp-3',
        title: 'HEM-450 T细胞淋巴瘤I/II期提案',
        indication: 'T细胞淋巴瘤',
        phase: 'Phase I/II',
        description: '针对复发难治性T细胞淋巴瘤的CAR-T细胞治疗剂量爬坡试验需求',
        sponsor: '药明巨诺'
    },
    {
        id: 'rfp-4',
        title: 'BC-301 HER2+乳腺癌III期提案',
        indication: 'HER2+乳腺癌',
        phase: 'Phase III',
        description: 'ADC药物联合曲妥珠单抗作为早期HER2+乳腺癌新辅助治疗的临床试验需求',
        sponsor: '荣昌生物'
    },
]

// Default export for backward compatibility (using English)
export const stepsData = stepsDataEn;
export const mockPlans = mockPlansEn;
export const expertRoles = expertRolesEn;
export const systemCommands = systemCommandsEn;
export const rfpProposals = rfpProposalsEn;
