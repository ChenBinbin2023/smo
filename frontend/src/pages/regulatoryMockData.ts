// Regulatory Review Mock Data
// Contains detailed regulation information from global regulatory agencies

export interface Regulation {
    key: string;
    id: number;
    title: string;
    publishDate: string;
    effectiveDate: string;
    source: string;
    sourceCode: 'NMPA' | 'FDA' | 'EMA' | 'PMDA' | 'ICH';
    category: string;
    status: 'active' | 'updated' | 'pending';
    // Detail fields
    documentNumber: string;
    summary: string;
    scope: string[];
    keyPoints: string[];
    relatedTrialTypes: string[];
    impactAreas: string[];
    officialUrl: string;
    attachments: { name: string; type: string }[];
}

export const mockRegulations: Regulation[] = [
    // NMPA (China) - 5 regulations
    {
        key: '1',
        id: 1,
        title: '抗肿瘤药物临床试验终点技术指导原则（2025年修订版）',
        publishDate: '2025-12-28',
        effectiveDate: '2026-01-15',
        source: 'NMPA 中国',
        sourceCode: 'NMPA',
        category: '肿瘤试验',
        status: 'active',
        documentNumber: 'NMPA-2025-CT-0128',
        summary: '本指导原则旨在规范抗肿瘤药物临床试验中有效性终点的选择与评价，明确主要终点、次要终点及探索性终点的定义标准，为申办方和研究者提供科学依据。',
        scope: ['实体瘤临床试验', '血液肿瘤临床试验', '肿瘤免疫治疗', '靶向治疗药物'],
        keyPoints: [
            '明确总生存期(OS)作为金标准终点的适用场景',
            '无进展生存期(PFS)作为替代终点的验证要求',
            '客观缓解率(ORR)在加速审批中的应用条件',
            '患者报告结局(PRO)作为共同主要终点的纳入标准',
            '真实世界数据(RWD)辅助终点评价的技术要求'
        ],
        relatedTrialTypes: ['III期确证性试验', 'II期探索性试验', '加速审批路径试验'],
        impactAreas: ['试验设计', '统计分析计划', '数据管理', '终点评估委员会'],
        officialUrl: 'https://www.nmpa.gov.cn/xxgk/ggtg/qtggtg/20251228.html',
        attachments: [
            { name: '指导原则正文.pdf', type: 'pdf' },
            { name: '技术问答(Q&A).pdf', type: 'pdf' },
            { name: '终点定义附录.xlsx', type: 'excel' }
        ]
    },
    {
        key: '2',
        id: 2,
        title: 'CAR-T 细胞治疗产品临床试验技术指导原则（第二版）',
        publishDate: '2025-11-15',
        effectiveDate: '2025-12-01',
        source: 'NMPA 中国',
        sourceCode: 'NMPA',
        category: '细胞治疗',
        status: 'updated',
        documentNumber: 'NMPA-2025-BIO-0089',
        summary: '针对嵌合抗原受体T细胞(CAR-T)治疗产品的临床试验设计、受试者筛选、安全性监测及疗效评价提供全面技术指导，反映最新国际监管经验。',
        scope: ['自体CAR-T产品', '异体CAR-T产品', 'CAR-NK产品', 'TCR-T产品'],
        keyPoints: [
            '细胞因子释放综合征(CRS)分级管理与报告标准',
            '神经毒性(ICANS)早期识别与干预流程',
            '长期随访要求：最低15年生存随访',
            '制备失败的备选治疗方案要求',
            '桥接治疗的规范化管理',
            '新型CAR结构的安全性评估框架'
        ],
        relatedTrialTypes: ['I/II期剂量探索', '关键性II期', '上市后承诺研究'],
        impactAreas: ['中心资质认证', '研究团队培训', '应急预案', '生产工艺验证'],
        officialUrl: 'https://www.nmpa.gov.cn/xxgk/ggtg/qtggtg/20251115.html',
        attachments: [
            { name: 'CAR-T临床试验指导原则.pdf', type: 'pdf' },
            { name: 'CRS/ICANS管理流程图.pdf', type: 'pdf' },
            { name: '随访表模板.docx', type: 'word' }
        ]
    },
    {
        key: '3',
        id: 3,
        title: '非小细胞肺癌治疗药物临床试验设计指导原则',
        publishDate: '2025-10-20',
        effectiveDate: '2025-11-01',
        source: 'NMPA 中国',
        sourceCode: 'NMPA',
        category: '肿瘤试验',
        status: 'active',
        documentNumber: 'NMPA-2025-CT-0076',
        summary: '针对非小细胞肺癌(NSCLC)治疗药物的临床开发策略、人群选择、生物标志物驱动设计及联合治疗方案提供详细指导。',
        scope: ['EGFR突变阳性NSCLC', 'ALK重排NSCLC', 'PD-L1高表达NSCLC', '驱动基因阴性NSCLC'],
        keyPoints: [
            '分子分型入组的生物标志物检测标准化要求',
            '脑转移患者的纳入与评估策略',
            '联合免疫治疗的安全性监测强化',
            '耐药后治疗的探索性研究框架',
            '中国人群特异性突变的专项要求'
        ],
        relatedTrialTypes: ['一线治疗试验', '二线及后线治疗试验', '新辅助/辅助治疗试验'],
        impactAreas: ['入排标准制定', '分层随机化', '伴随诊断开发', '中心实验室要求'],
        officialUrl: 'https://www.nmpa.gov.cn/xxgk/ggtg/qtggtg/20251020.html',
        attachments: [
            { name: 'NSCLC临床试验指导原则.pdf', type: 'pdf' },
            { name: '生物标志物检测技术要求.pdf', type: 'pdf' }
        ]
    },
    {
        key: '4',
        id: 4,
        title: '以患者为中心的药物临床试验设计技术指导原则',
        publishDate: '2025-09-08',
        effectiveDate: '2025-10-01',
        source: 'NMPA 中国',
        sourceCode: 'NMPA',
        category: '试验设计',
        status: 'active',
        documentNumber: 'NMPA-2025-CT-0062',
        summary: '强调患者参与临床试验设计的重要性，规范患者报告结局(PRO)工具选择、患者偏好研究及负担评估的技术要求。',
        scope: ['所有治疗领域临床试验', '患者报告结局研究', '健康相关生活质量评估'],
        keyPoints: [
            '患者参与试验设计的规范化流程',
            'PRO量表的文化适应性验证要求',
            '电子化PRO采集的技术规范',
            '患者负担评估与受访频次优化',
            '患者咨询委员会的组建与运作指南'
        ],
        relatedTrialTypes: ['确证性临床试验', '健康经济学研究', '上市后研究'],
        impactAreas: ['方案设计', '知情同意', '数据采集系统', '结果解读'],
        officialUrl: 'https://www.nmpa.gov.cn/xxgk/ggtg/qtggtg/20250908.html',
        attachments: [
            { name: '患者中心指导原则.pdf', type: 'pdf' },
            { name: 'PRO选择决策树.pdf', type: 'pdf' }
        ]
    },
    {
        key: '5',
        id: 5,
        title: '真实世界证据支持药物研发的技术指导原则（2025年更新）',
        publishDate: '2025-08-12',
        effectiveDate: '2025-09-01',
        source: 'NMPA 中国',
        sourceCode: 'NMPA',
        category: 'RWE 研究',
        status: 'active',
        documentNumber: 'NMPA-2025-RWE-0045',
        summary: '明确真实世界数据(RWD)来源、质量控制及真实世界证据(RWE)在药物注册中应用的技术标准与审评考量。',
        scope: ['适应症扩展', '儿科外推', '罕见病药物', '中国患者桥接数据'],
        keyPoints: [
            '电子健康档案数据的质量评估框架',
            '真实世界研究的因果推断方法学要求',
            '数据隐私保护与患者知情要求',
            '外部对照臂设计的适用条件',
            '多源数据融合的标准化流程'
        ],
        relatedTrialTypes: ['单臂试验外部对照', '适应症扩展研究', '上市后安全性监测'],
        impactAreas: ['数据合作协议', '统计分析', '结果外推', '审评沟通'],
        officialUrl: 'https://www.nmpa.gov.cn/xxgk/ggtg/qtggtg/20250812.html',
        attachments: [
            { name: 'RWE技术指导原则.pdf', type: 'pdf' },
            { name: '数据质量评估清单.xlsx', type: 'excel' }
        ]
    },

    // FDA (US) - 5 regulations
    {
        key: '6',
        id: 6,
        title: 'Guidance for Oncology Clinical Trials Incorporating Decentralized Elements',
        publishDate: '2026-01-10',
        effectiveDate: '2026-02-01',
        source: 'FDA 美国',
        sourceCode: 'FDA',
        category: 'DCT 试验',
        status: 'pending',
        documentNumber: 'FDA-2026-D-0012',
        summary: 'This guidance provides recommendations for sponsors on designing and conducting oncology clinical trials that incorporate decentralized clinical trial (DCT) elements, including remote assessments, direct-to-patient drug delivery, and telemedicine visits.',
        scope: ['Solid Tumor Trials', 'Hematologic Malignancy Trials', 'Supportive Care Studies'],
        keyPoints: [
            'Criteria for remote tumor assessment using imaging',
            'Home administration of oral anticancer therapies',
            'Telemedicine for adverse event monitoring',
            'Local laboratory requirements and data integration',
            'Patient safety considerations for decentralized elements',
            'Electronic consent and data capture standards'
        ],
        relatedTrialTypes: ['Phase II/III Trials', 'Expansion Cohorts', 'Post-Marketing Studies'],
        impactAreas: ['Protocol Design', 'Site Selection', 'Technology Infrastructure', 'Regulatory Submissions'],
        officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/oncology-dct-2026',
        attachments: [
            { name: 'Oncology DCT Guidance.pdf', type: 'pdf' },
            { name: 'Remote Assessment Checklist.pdf', type: 'pdf' }
        ]
    },
    {
        key: '7',
        id: 7,
        title: 'Adaptive Designs for Clinical Trials of Drugs and Biologics (Final Guidance)',
        publishDate: '2025-12-05',
        effectiveDate: '2026-01-01',
        source: 'FDA 美国',
        sourceCode: 'FDA',
        category: '适应性设计',
        status: 'active',
        documentNumber: 'FDA-2025-D-0892',
        summary: 'Final guidance on adaptive clinical trial designs that allow for prospectively planned modifications based on accumulating data, while preserving trial integrity and validity.',
        scope: ['All Therapeutic Areas', 'Drugs and Biologics', 'Combination Products'],
        keyPoints: [
            'Types of adaptive designs: sample size re-estimation, response-adaptive randomization, seamless phase designs',
            'Statistical considerations for Type I error control',
            'Operational bias prevention strategies',
            'Simulation requirements for complex adaptations',
            'Documentation and pre-specification requirements',
            'Interaction with FDA during trial planning'
        ],
        relatedTrialTypes: ['Phase II/III Seamless Trials', 'Dose-Finding Studies', 'Master Protocols'],
        impactAreas: ['Statistical Analysis Plan', 'IDMC Charter', 'Regulatory Strategy', 'Trial Simulations'],
        officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-designs-2025',
        attachments: [
            { name: 'Adaptive Design Guidance Final.pdf', type: 'pdf' },
            { name: 'Simulation Template.xlsx', type: 'excel' }
        ]
    },
    {
        key: '8',
        id: 8,
        title: 'E6(R3) Good Clinical Practice: Modernized GCP for Clinical Electronic Systems',
        publishDate: '2025-11-18',
        effectiveDate: '2025-12-15',
        source: 'FDA 美国',
        sourceCode: 'FDA',
        category: 'GCP/数据',
        status: 'updated',
        documentNumber: 'FDA-2025-D-0756',
        summary: 'Updated FDA implementation of ICH E6(R3), focusing on quality-by-design approaches, risk-based monitoring, and electronic systems validation in modern clinical trials.',
        scope: ['All Clinical Trials', 'Electronic Data Systems', 'Remote Monitoring'],
        keyPoints: [
            'Quality tolerance limits and critical process parameters',
            'Centralized monitoring infrastructure requirements',
            'Electronic health record integration standards',
            'Data integrity for cloud-based systems',
            'Audit trail and 21 CFR Part 11 compliance updates',
            'Vendor oversight and qualification'
        ],
        relatedTrialTypes: ['All Phase Trials', 'Real-World Data Studies', 'Registry Trials'],
        impactAreas: ['EDC Systems', 'Monitoring Plans', 'Quality Management', 'Training Programs'],
        officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/e6r3-gcp-2025',
        attachments: [
            { name: 'E6R3 FDA Implementation.pdf', type: 'pdf' },
            { name: 'Electronic Systems Validation Checklist.pdf', type: 'pdf' }
        ]
    },
    {
        key: '9',
        id: 9,
        title: 'Inclusion of Adolescent Patients in Adult Oncology Clinical Trials',
        publishDate: '2025-10-22',
        effectiveDate: '2025-11-15',
        source: 'FDA 美国',
        sourceCode: 'FDA',
        category: '儿科肿瘤',
        status: 'active',
        documentNumber: 'FDA-2025-D-0634',
        summary: 'Guidance encouraging sponsors to include adolescent patients (12-17 years) in adult oncology trials when scientifically appropriate, with specific safety monitoring recommendations.',
        scope: ['Adult Oncology Trials', 'Adolescent Patients 12-17 Years', 'Tumor Types Common to Both Populations'],
        keyPoints: [
            'Scientific justification for adolescent inclusion',
            'Age-appropriate consent/assent processes',
            'PK bridging study requirements',
            'Growth and developmental safety monitoring',
            'Adolescent-specific PRO instruments',
            'Regulatory pathway for adolescent indications'
        ],
        relatedTrialTypes: ['Pivotal Oncology Trials', 'Pediatric Study Plans', 'Post-Marketing Requirements'],
        impactAreas: ['Protocol Amendments', 'IRB/IEC Submissions', 'Formulation Development', 'Label Negotiations'],
        officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adolescent-oncology-2025',
        attachments: [
            { name: 'Adolescent Inclusion Guidance.pdf', type: 'pdf' }
        ]
    },
    {
        key: '10',
        id: 10,
        title: 'Clinical Trial Diversity: Eligibility Criteria, Enrollment Practices, and Trial Designs',
        publishDate: '2025-09-30',
        effectiveDate: '2025-10-30',
        source: 'FDA 美国',
        sourceCode: 'FDA',
        category: '入排标准',
        status: 'active',
        documentNumber: 'FDA-2025-D-0589',
        summary: 'Final guidance on improving the diversity of clinical trial populations through modernized eligibility criteria, enhanced enrollment practices, and inclusive trial designs.',
        scope: ['All Drug Development Programs', 'Biologics', 'Medical Devices'],
        keyPoints: [
            'Broadening eligibility criteria: organ function thresholds, concurrent conditions',
            'Diversity action plans and enrollment goals',
            'Community engagement strategies',
            'Decentralized trial elements for underserved populations',
            'Data disaggregation by race/ethnicity requirements',
            'FDA meeting procedures for diversity discussions'
        ],
        relatedTrialTypes: ['Phase III Confirmatory Trials', 'New Drug Applications', 'Supplemental Applications'],
        impactAreas: ['Clinical Development Plans', 'Site Selection', 'Outreach Programs', 'FDA Communications'],
        officialUrl: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/diversity-2025',
        attachments: [
            { name: 'Diversity Guidance Final.pdf', type: 'pdf' },
            { name: 'Diversity Action Plan Template.docx', type: 'word' }
        ]
    },

    // EMA (Europe) - 4 regulations
    {
        key: '11',
        id: 11,
        title: 'Guideline on the Clinical Investigation of Medicinal Products for the Treatment of MASH',
        publishDate: '2025-12-18',
        effectiveDate: '2026-01-18',
        source: 'EMA 欧洲',
        sourceCode: 'EMA',
        category: '肝病试验',
        status: 'active',
        documentNumber: 'EMA/CHMP/2025/789012',
        summary: 'Revised guideline for clinical development of treatments for metabolic dysfunction-associated steatohepatitis (MASH, formerly NASH), addressing endpoints, patient populations, and trial designs.',
        scope: ['MASH/NASH Therapeutics', 'Fibrosis Stage F2-F4', 'Cirrhosis Prevention'],
        keyPoints: [
            'Histological endpoints: MASH resolution and fibrosis improvement',
            'Non-invasive biomarker acceptance criteria',
            'Cardiovascular outcome integration requirements',
            'Composite endpoint construction guidance',
            'Duration of therapy for regulatory approval',
            'Pediatric MASH development considerations'
        ],
        relatedTrialTypes: ['Phase IIb Proof-of-Concept', 'Phase III Outcome Trials', 'Biomarker Qualification Studies'],
        impactAreas: ['Endpoint Selection', 'Sample Size Calculations', 'Biopsy Standardization', 'Label Claims'],
        officialUrl: 'https://www.ema.europa.eu/en/documents/scientific-guideline/mash-2025.pdf',
        attachments: [
            { name: 'MASH Clinical Guideline.pdf', type: 'pdf' },
            { name: 'Histology Scoring Standards.pdf', type: 'pdf' }
        ]
    },
    {
        key: '12',
        id: 12,
        title: 'Guideline on Bioanalytical Method Validation and Study Sample Analysis',
        publishDate: '2025-11-25',
        effectiveDate: '2025-12-25',
        source: 'EMA 欧洲',
        sourceCode: 'EMA',
        category: 'PK 分析',
        status: 'updated',
        documentNumber: 'EMA/CHMP/2025/654321',
        summary: 'Updated guideline harmonized with ICH M10 on bioanalytical method validation for PK, bioequivalence, and immunogenicity studies, incorporating new requirements for large molecules.',
        scope: ['Small Molecule PK', 'Large Molecule PK/ADA', 'Bioequivalence Studies', 'Immunogenicity Assays'],
        keyPoints: [
            'ICH M10 alignment for small molecules',
            'Large molecule-specific validation parameters',
            'Incurred sample reanalysis (ISR) requirements',
            'Reference standard and critical reagent management',
            'Bioanalytical data integrity and audit trails',
            'Cross-validation and method transfer protocols'
        ],
        relatedTrialTypes: ['All Clinical PK Studies', 'Bioequivalence Trials', 'Biosimilar Development'],
        impactAreas: ['Central Lab Selection', 'Method Development', 'Data Quality', 'Regulatory Submissions'],
        officialUrl: 'https://www.ema.europa.eu/en/documents/scientific-guideline/bioanalytical-2025.pdf',
        attachments: [
            { name: 'Bioanalytical Validation Guideline.pdf', type: 'pdf' },
            { name: 'Validation Report Template.docx', type: 'word' }
        ]
    },
    {
        key: '13',
        id: 13,
        title: 'Guideline on Clinical Trials in Small Populations (Revision)',
        publishDate: '2025-10-15',
        effectiveDate: '2025-11-15',
        source: 'EMA 欧洲',
        sourceCode: 'EMA',
        category: '罕见病',
        status: 'active',
        documentNumber: 'EMA/CHMP/2025/543210',
        summary: 'Revised guidance for conducting clinical trials in small patient populations, particularly rare diseases, addressing innovative trial designs, statistical approaches, and evidence generation.',
        scope: ['Rare Diseases', 'Pediatric Subpopulations', 'Ultra-Rare Conditions', 'Orphan Medicinal Products'],
        keyPoints: [
            'Bayesian and adaptive statistical approaches',
            'Natural history studies as control data',
            'Patient registry utilization',
            'N-of-1 and single-arm trial considerations',
            'Extrapolation from adult to pediatric populations',
            'Multi-regional rare disease collaboration frameworks'
        ],
        relatedTrialTypes: ['Orphan Drug Development', 'Pediatric Investigation Plans', 'Basket/Umbrella Trials'],
        impactAreas: ['Trial Feasibility', 'Regulatory Pathway Selection', 'HTA Submissions', 'Patient Advocacy Engagement'],
        officialUrl: 'https://www.ema.europa.eu/en/documents/scientific-guideline/small-populations-2025.pdf',
        attachments: [
            { name: 'Small Populations Guideline.pdf', type: 'pdf' }
        ]
    },
    {
        key: '14',
        id: 14,
        title: 'Clinical Trials Regulation (EU CTR) - Updated Implementation Guidance 2026',
        publishDate: '2025-09-20',
        effectiveDate: '2026-01-01',
        source: 'EMA 欧洲',
        sourceCode: 'EMA',
        category: '法规更新',
        status: 'active',
        documentNumber: 'EMA/CTIS/2025/UPDATE-003',
        summary: 'Comprehensive implementation guidance for the EU Clinical Trials Regulation 536/2014, including CTIS system updates, multinational trial procedures, and transitional provisions.',
        scope: ['All Clinical Trials in EU', 'CTIS Submissions', 'Multinational Trial Coordination'],
        keyPoints: [
            'CTIS 3.0 system updates and new functionalities',
            'Reporting Member State coordination procedures',
            'Safety reporting harmonization across Member States',
            'Substantial modification fast-track pathways',
            'Third country data and site requirements',
            'Transitional period end: mandatory conversion deadlines'
        ],
        relatedTrialTypes: ['All EU Clinical Trials', 'Global Programs with EU Sites', 'Academic-Sponsored Trials'],
        impactAreas: ['Regulatory Operations', 'Submission Timelines', 'Documentation Standards', 'Country Coordination'],
        officialUrl: 'https://www.ema.europa.eu/en/human-regulatory/research-development/clinical-trials/ctis-2026.pdf',
        attachments: [
            { name: 'EU CTR Implementation Guide 2026.pdf', type: 'pdf' },
            { name: 'CTIS User Manual v3.0.pdf', type: 'pdf' }
        ]
    },

    // PMDA (Japan) - 3 regulations
    {
        key: '15',
        id: 15,
        title: '抗悪性腫瘍薬の臨床評価に関するガイドライン（2025年改訂）',
        publishDate: '2025-11-28',
        effectiveDate: '2025-12-28',
        source: 'PMDA 日本',
        sourceCode: 'PMDA',
        category: '肿瘤试验',
        status: 'active',
        documentNumber: 'PMDA-2025-ONCOL-045',
        summary: '针对抗恶性肿瘤药物的临床评价提供全面指导，包括疗效终点、安全性评估、特殊人群及日本患者亚组分析要求。',
        scope: ['固形癌治疗药物', '血液恶性肿瘤治疗药物', '肿瘤免疫治疗', '分子靶向药物'],
        keyPoints: [
            '日本人群亚组分析的样本量与效能要求',
            '国际多中心试验中日本中心的最低参与度',
            '肿瘤影像学评效标准(RECIST 1.1)的一致性要求',
            '日本患者安全性信号的早期识别机制',
            '加速审批后确证性研究的承诺要求',
            'ADC/双特异性抗体等新型药物的评价框架'
        ],
        relatedTrialTypes: ['国际多中心III期试验', '日本桥接研究', '条件性早期批准研究'],
        impactAreas: ['日本中心选择', '入排标准调整', '亚组分析计划', 'PMDA咨询'],
        officialUrl: 'https://www.pmda.go.jp/files/000XXX_oncology_guideline_2025.pdf',
        attachments: [
            { name: '抗肿瘤药物临床评价指南.pdf', type: 'pdf' },
            { name: '日本亚组分析模板.xlsx', type: 'excel' }
        ]
    },
    {
        key: '16',
        id: 16,
        title: '再生医療等製品の臨床試験に関する指針（細胞治療製品）',
        publishDate: '2025-10-08',
        effectiveDate: '2025-11-08',
        source: 'PMDA 日本',
        sourceCode: 'PMDA',
        category: '再生医学',
        status: 'active',
        documentNumber: 'PMDA-2025-REGEN-028',
        summary: '规定再生医疗产品（包括细胞治疗产品、基因治疗产品）临床试验的设计、实施及评价要求，强调日本SAKIGAKE制度下的开发路径。',
        scope: ['自体细胞治疗', '异体细胞治疗', '基因修饰细胞产品', 'iPS细胞来源产品'],
        keyPoints: [
            'SAKIGAKE先驱审查制度的适用条件',
            '条件性限时批准的临床数据要求',
            '长期安全性随访：基因治疗产品15年追踪',
            '细胞制品的效价分析与批间一致性',
            '治疗机构资质与人员培训标准',
            '遗传性变异监测的报告义务'
        ],
        relatedTrialTypes: ['探索性临床研究', '确证性临床研究', '条件性限时批准后研究'],
        impactAreas: ['PMDA事前咨询', '制造设施认证', '医疗机构合规', '风险管理计划'],
        officialUrl: 'https://www.pmda.go.jp/files/000XXX_regenerative_guideline_2025.pdf',
        attachments: [
            { name: '再生医疗临床试验指南.pdf', type: 'pdf' },
            { name: 'SAKIGAKE申请清单.pdf', type: 'pdf' }
        ]
    },
    {
        key: '17',
        id: 17,
        title: 'バイオマーカー駆動型臨床試験ガイドライン（生物标志物驱动试验指南）',
        publishDate: '2025-08-25',
        effectiveDate: '2025-09-25',
        source: 'PMDA 日本',
        sourceCode: 'PMDA',
        category: '生物标志物',
        status: 'pending',
        documentNumber: 'PMDA-2025-BM-019',
        summary: '针对生物标志物在药物开发和临床试验中应用的技术指导，涵盖预测性、预后性和药效学生物标志物的验证与应用。',
        scope: ['伴随诊断开发', '患者富集策略', '替代终点开发', '药效学生物标志物'],
        keyPoints: [
            '生物标志物分析验证的技术标准',
            '伴随诊断与治疗药物的协同开发要求',
            '生物标志物驱动入组的前瞻性验证',
            '液体活检生物标志物的应用框架',
            '多组学生物标志物的探索性研究设计',
            '生物标志物数据的监管提交格式'
        ],
        relatedTrialTypes: ['精准医疗试验', '伴随诊断共同开发', '篮式/伞式试验'],
        impactAreas: ['中心实验室认证', '样本管理', 'CDx注册策略', '标签声明'],
        officialUrl: 'https://www.pmda.go.jp/files/000XXX_biomarker_guideline_2025.pdf',
        attachments: [
            { name: '生物标志物临床试验指南.pdf', type: 'pdf' }
        ]
    },

    // ICH (International) - 3 regulations
    {
        key: '18',
        id: 18,
        title: 'ICH E9(R1) Addendum: Estimands and Sensitivity Analysis in Clinical Trials',
        publishDate: '2025-12-01',
        effectiveDate: '2026-01-01',
        source: 'ICH 国际',
        sourceCode: 'ICH',
        category: '统计方法',
        status: 'active',
        documentNumber: 'ICH-E9R1-2025-UPDATE',
        summary: 'Updated implementation guidance for the estimand framework, clarifying intercurrent event handling strategies and sensitivity analysis requirements for confirmatory clinical trials.',
        scope: ['Confirmatory Clinical Trials', 'All Therapeutic Areas', 'Global Regulatory Submissions'],
        keyPoints: [
            'Treatment policy vs. hypothetical strategy selection criteria',
            'Composite strategies for intercurrent events',
            'Principal stratum estimand applications',
            'Sensitivity analysis: tipping point and delta-adjustment methods',
            'Estimand documentation in protocols and SAPs',
            'Alignment between clinical questions and statistical analyses'
        ],
        relatedTrialTypes: ['Phase III Confirmatory Trials', 'Pivotal Efficacy Studies', 'NDA/BLA/MAA Submissions'],
        impactAreas: ['Protocol Development', 'Statistical Analysis Plans', 'Regulatory Submissions', 'Agency Interactions'],
        officialUrl: 'https://www.ich.org/page/efficacy-guidelines#e9-r1',
        attachments: [
            { name: 'ICH E9R1 2025 Update.pdf', type: 'pdf' },
            { name: 'Estimand Case Studies.pdf', type: 'pdf' }
        ]
    },
    {
        key: '19',
        id: 19,
        title: 'ICH E17 General Principles for Planning and Design of Multi-Regional Clinical Trials',
        publishDate: '2025-10-15',
        effectiveDate: '2025-11-15',
        source: 'ICH 国际',
        sourceCode: 'ICH',
        category: 'MRCT 设计',
        status: 'active',
        documentNumber: 'ICH-E17-2025-TRAINING',
        summary: 'Practical implementation guidance for ICH E17 principles, focusing on sample size allocation, consistency assessment, and regulatory acceptance across regions.',
        scope: ['Multi-Regional Clinical Trials', 'Global Drug Development', 'Regulatory Harmonization'],
        keyPoints: [
            'Sample size determination for regional subgroups',
            'Consistency evaluation methods: qualitative vs. quantitative',
            'Intrinsic and extrinsic ethnic factor considerations',
            'Regulatory bridging study requirements by region',
            'Post-hoc regional analysis interpretation',
            'Multi-regional simultaneous submission strategies'
        ],
        relatedTrialTypes: ['Global Phase III Trials', 'Regional Bridging Studies', 'Parallel Regulatory Submissions'],
        impactAreas: ['Global Development Strategy', 'Country Selection', 'Enrollment Allocation', 'Regulatory Planning'],
        officialUrl: 'https://www.ich.org/page/efficacy-guidelines#e17',
        attachments: [
            { name: 'ICH E17 Training Materials.pdf', type: 'pdf' },
            { name: 'Regional Allocation Calculator.xlsx', type: 'excel' }
        ]
    },
    {
        key: '20',
        id: 20,
        title: 'ICH E8(R1) General Considerations for Clinical Studies (Revision)',
        publishDate: '2025-09-01',
        effectiveDate: '2025-10-01',
        source: 'ICH 国际',
        sourceCode: 'ICH',
        category: '试验设计',
        status: 'updated',
        documentNumber: 'ICH-E8R1-2025-FINAL',
        summary: 'Revised general principles for clinical study design emphasizing quality-by-design, fit-for-purpose approaches, and stakeholder engagement throughout drug development.',
        scope: ['All Clinical Development Phases', 'Drug and Biologic Development', 'Global Regulatory Standards'],
        keyPoints: [
            'Quality-by-design principles for clinical trials',
            'Critical to Quality (CtQ) factors identification',
            'Fit-for-purpose study design tailoring',
            'Patient input in study design',
            'Data sources beyond traditional trials (RWD)',
            'Study design documentation and rationale'
        ],
        relatedTrialTypes: ['All Phase Clinical Trials', 'Non-Interventional Studies', 'Hybrid Designs'],
        impactAreas: ['Protocol Development', 'Quality Management Systems', 'Risk Assessment', 'Regulatory Strategy'],
        officialUrl: 'https://www.ich.org/page/efficacy-guidelines#e8',
        attachments: [
            { name: 'ICH E8R1 Final 2025.pdf', type: 'pdf' },
            { name: 'CtQ Factor Worksheet.xlsx', type: 'excel' }
        ]
    }
];
