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

export const stepsData: StepData[] = [
    { title: '需求分析', icon: <FileTextOutlined />, description: 'RFP解析' },
    { title: '资料收集', icon: <GlobalOutlined />, description: '结构化数据' },
    { title: '可行性评估', icon: <RocketOutlined />, description: '评估预测' },
    { title: '中心选定', icon: <MedicineBoxOutlined />, description: '资源组合' },
    { title: '合规风控', icon: <SafetyCertificateOutlined />, description: '约束检查' },
    { title: '方案撰写', icon: <FileTextOutlined />, description: '成稿迭代' },
    { title: '评审协同', icon: <TeamOutlined />, description: '多方修订' },
    { title: '交付存档', icon: <FilePdfOutlined />, description: '输出留痕' },
]

export const mockPlans: PlanItem[] = [
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
        indication: 'NSCLC',
        phase: 'Phase II',
        sponsor: '某生物科技',
        createdAt: '2024-01-10',
        status: 'completed'
    },
    {
        id: '3',
        name: 'HEM-450 血液瘤靶向治疗',
        indication: 'T细胞淋巴瘤',
        phase: 'Phase I/II',
        sponsor: '某研究机构',
        createdAt: '2024-01-08',
        status: 'draft'
    },
]

export const expertRoles = [
    { value: 'medical-writer', label: '医学撰写专家', description: '负责方案撰写与润色' },
    { value: 'statistician', label: '统计学家', description: '负责样本量计算与统计分析' },
    { value: 'compliance', label: '合规专家', description: '负责法规审查与风险控制' },
    { value: 'pm', label: '项目经理', description: '负责项目整体协调与管理' },
    { value: 'clinical-expert', label: '临床专家', description: '负责临床方案设计与优化' },
    { value: 'data-manager', label: '数据管理专家', description: '负责数据管理计划制定' },
]

export const systemCommands = [
    { value: '生成方案', label: '/生成方案', description: '基于RFP快速生成临床试验方案', expert: 'system' },
    { value: '撰写章节', label: '/撰写章节', description: '撰写指定方案章节', expert: '医学撰写专家' },
    { value: '样本量计算', label: '/样本量计算', description: '进行统计学样本量估算', expert: '统计学家' },
    { value: '合规检查', label: '/合规检查', description: '执行法规合规性检查', expert: '合规专家' },
]

export const rfpProposals = [
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
        title: 'NS-202 NSCLC II期临床提案',
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
        description: 'CAR-T细胞疗法治疗复发难治性T细胞淋巴瘤的剂量递增试验需求',
        sponsor: '药明巨诺'
    },
    {
        id: 'rfp-4',
        title: 'BC-301 HER2+乳腺癌III期提案',
        indication: 'HER2阳性乳腺癌',
        phase: 'Phase III',
        description: 'ADC药物联合曲妥珠单抗新辅助治疗早期HER2+乳腺癌的临床试验需求',
        sponsor: '荣昌生物'
    },
]
