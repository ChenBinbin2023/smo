import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
    // App.tsx
    'workbench': { zh: '工作台', en: 'Workbench' },
    'intelligentQuery': { zh: '智能查询', en: 'Intelligent Query' },
    'siteSelection': { zh: '中心选择', en: 'Site Selection' },
    'regulatoryReview': { zh: '法规审查', en: 'Regulatory Review' },
    'planCenter': { zh: '方案中心', en: 'Plan Center' },
    'dataCenter': { zh: '数据中心', en: 'Data Center' },
    'analysisCenter': { zh: '分析中心', en: 'Analysis Center' },
    'history': { zh: '历史选址', en: 'History' },
    'settings': { zh: '系统设置', en: 'Settings' },
    'globalSearch': { zh: '全局搜索', en: 'Global Search' },
    'notifications': { zh: '消息通知', en: 'Notifications' },
    'help': { zh: '在线帮助', en: 'Help' },
    'admin': { zh: 'Alice', en: 'Alice' },

    // Home.tsx
    'goodAfternoon': { zh: '下午好', en: 'Good Afternoon' },
    'welcomeMessage': { zh: '欢迎回到速研动力智能决策系统，今天有 2 个新项目需要选址决策。', en: 'Welcome back to 速研动力 Decision System. You have 2 new projects requiring site selection today.' },
    'cumulativeSites': { zh: '累计选址中心', en: 'Cumulative Sites Selected' },
    'avgCycleReduction': { zh: '平均缩短周期', en: 'Avg Cycle Reduction' },
    'ongoingSelections': { zh: '正在进行的选址', en: 'Ongoing Selections' },
    'enrollmentCapacityTrend': { zh: '入组能力趋势 (全平台)', en: 'Enrollment Capacity Trend (Platform-wide)' },
    'recentSelectionPlans': { zh: '最近选址方案', en: 'Recent Selection Plans' },
    'viewAll': { zh: '查看全部', en: 'View All' },
    'aiAssistant': { zh: 'AI 选址助手', en: 'AI Selection Assistant' },
    'aiAssistantDesc': { zh: '输入项目需求，让我为您推荐最合适的临床试验中心。', en: 'Enter project requirements, let me recommend the most suitable clinical trial centers for you.' },
    'startSelection': { zh: '立即开始选址', en: 'Start Selection Now' },
    'month': { zh: '月', en: ' Mo' },
    'enrollmentTotal': { zh: '入组总数', en: 'Enrollment Total' },
    'inProgress': { zh: '进行中', en: 'In Progress' },
    'recruiting': { zh: '招募中', en: 'Recruiting' },
    'preparation': { zh: '准备中', en: 'Preparation' },
    'rate': { zh: '入组率', en: 'Rate' },

    // WorkflowView
    'requirementAnalysis': { zh: '需求分析', en: 'Requirement Analysis' },
    'dataCollection': { zh: '资料收集', en: 'Data Collection' },
    'feasibilityAssessment': { zh: '可行性评估', en: 'Feasibility Assessment' },
    'siteSelectionWorkflow': { zh: '中心选定', en: 'Site Selection' },
    'complianceRiskControl': { zh: '合规风控', en: 'Compliance & Risk' },
    'proposalWriting': { zh: '方案撰写', en: 'Proposal Writing' },
    'collaborativeReview': { zh: '协同评审', en: 'Collaborative Review' },
    'deliveryArchiving': { zh: '交付存档', en: 'Delivery & Archiving' },

    // RegulatoryReview
    'regReviewAssistant': { zh: '法规审查助理', en: 'Regulatory Review Assistant' },
    'regLibrary': { zh: '法规库', en: 'Regulations Library' },
    'regulations': { zh: '条法规', en: 'Regulations' },
    'lastUpdated': { zh: '最后更新', en: 'Last Updated' },
    'view': { zh: '查看', en: 'View' },
    'interpret': { zh: '解读', en: 'Interpret' },
    'screen': { zh: '筛查', en: 'Screen' },
    'executionFlow': { zh: '执行流程', en: 'Execution Flow' },
    'aiAnalyzing': { zh: 'AI 正在解析', en: 'AI Analyzing' },
    'assessmentReport': { zh: '法规审查评估报告', en: 'Assessment Report' },
    'screeningReport': { zh: '筛查报告', en: 'Screening Report' },
    'affectedProjects': { zh: '可能受影响的项目', en: 'Potentially Affected Projects' },
    'affectedProposals': { zh: '可能受影响的方案', en: 'Potentially Affected Proposals' },
    'batchEvaluate': { zh: '批量评估', en: 'Batch Evaluate' },
    'highRisk': { zh: '高风险项', en: 'High Risk' },
    'mediumRisk': { zh: '中风险项', en: 'Medium Risk' },
    'lowRisk': { zh: '低风险项', en: 'Low Risk' },
    'compliant': { zh: '已合规', en: 'Compliant' },
    'mustRevise': { zh: '必须修订', en: 'Must Revise' },
    'suggestedRevise': { zh: '建议修订', en: 'Suggested Revise' },
    'noImpact': { zh: '无需修改', en: 'No Impact' },
    'remediationPlan': { zh: '整改计划与时间线', en: 'Remediation Plan & Timeline' },
    'impactAssessment': { zh: '影响评估', en: 'Impact Assessment' },
    'clausesAnalysis': { zh: '条款级差异分析', en: 'Clause-level Analysis' },
    'relatedDocImpact': { zh: '关联文档影响', en: 'Related Document Impact' },
    'resourceEstimation': { zh: '修订耗时与资源评估', en: 'Resource & Time Estimation' },
    'aiRecommendations': { zh: 'AI 修订建议', en: 'AI Recommendations' },
    'coreInsights': { zh: '核心速览', en: 'Core Insights' },
    'keyChanges': { zh: '关键变更点', en: 'Key Changes' },
    'processChanges': { zh: '流程调整要求', en: 'Process Adjustments' },
    'metricsTable': { zh: '核心指标对照表', en: 'Core Metrics Table' },
    'attentionItems': { zh: '特别关注事项', en: 'Priority Attention Items' },
    'viewOriginal': { zh: '查看原文', en: 'View Original' },
    'screenAffected': { zh: '筛查受影响项目', en: 'Screen Affected Projects' },
    'share': { zh: '分享', en: 'Share' },
    'exportPDF': { zh: '导出 PDF', en: 'Export PDF' },
    'evaluate': { zh: '评估', en: 'Evaluate' },
    'screeningComplete': { zh: '筛查完成', en: 'Screening Complete' },
    'evaluatingComplete': { zh: '评估完成', en: 'Evaluation Complete' },
    'interpretingComplete': { zh: '解读完成', en: 'Interpretation Complete' },
    'inputPlaceholder': { zh: '输入法规查询问题...', en: 'Type your regulatory query...' },
    'regDetails': { zh: '法规详情', en: 'Regulation Details' },
    'projectDetails': { zh: '项目详情', en: 'Project Details' },
    'proposalDetails': { zh: '方案详情', en: 'Proposal Details' },
    'regSummary': { zh: '法规概要', en: 'Regulation Summary' },
    'applicationScope': { zh: '适用范围', en: 'Scope of Application' },
    'relatedTrialTypes': { zh: '相关试验类型', en: 'Related Trial Types' },
    'impactAreas': { zh: '影响领域', en: 'Impact Areas' },
    'relatedAttachments': { zh: '相关附件', en: 'Related Attachments' },
    'officialLink': { zh: '官方链接', en: 'Official Link' },
    'screeningImpactBtn': { zh: '筛查此法规对在研项目的影响', en: 'Screen impact on ongoing projects' },
    'projectID': { zh: '项目编号', en: 'Project ID' },
    'projectName': { zh: '项目名称', en: 'Project Name' },
    'phase': { zh: '阶段', en: 'Phase' },
    'indication': { zh: '适应症', en: 'Indication' },
    'hitKeywords': { zh: '命中关键词', en: 'Hit Keywords' },
    'sponsor': { zh: '申办方', en: 'Sponsor' },
    'pi': { zh: '主要研究者', en: 'PI' },
    'therapeutic': { zh: '治疗方案', en: 'Therapeutic' },
    'sites': { zh: '参与中心', en: 'Sites' },
    'enrollmentProgress': { zh: '入组进度', en: 'Enrollment Progress' },
    'startDate': { zh: '开始日期', en: 'Start Date' },
    'expectedEnd': { zh: '预计结束', en: 'Expected End' },
    'keyMilestones': { zh: '关键里程碑', en: 'Key Milestones' },
    'completed': { zh: '已完成', en: 'Completed' },
    'viewFullProject': { zh: '查看完整项目详情 →', en: 'View full project details →' },
    'jumpToSystem': { zh: '跳转至项目管理系统查看详细信息', en: 'Go to Project Management System for details' },
    'evaluateComplianceBtn': { zh: '评估此项目的合规影响', en: 'Evaluate compliance impact' },
    'proposalID': { zh: '方案编号', en: 'Proposal ID' },
    'proposalName': { zh: '方案名称', en: 'Proposal Name' },
    'version': { zh: '版本', en: 'Version' },
    'department': { zh: '编制部门', en: 'Department' },
    'createdDate': { zh: '创建日期', en: 'Created Date' },
    'approvedDate': { zh: '批准日期', en: 'Approved Date' },
    'proposalChapters': { zh: '方案章节', en: 'Proposal Chapters' },
    'endpoints': { zh: '终点设计', en: 'Endpoints' },
    'keyInclusionExclusion': { zh: '关键入排标准', en: 'Key Inclusion/Exclusion' },
    'versionHistory': { zh: '版本历史', en: 'Version History' },
    'complianceStatus': { zh: '合规状态', en: 'Compliance Status' },
    'audited': { zh: '已审核', en: 'Audited' },
    'lastAudited': { zh: '上次合规审查', en: 'Last Audited' },
    'viewFullProposal': { zh: '查看完整方案文档 →', en: 'View full proposal document →' },
    'jumpToDocSystem': { zh: '跳转至文档管理系统查看详细内容', en: 'Go to Document Management System for details' },
    'evaluateRevisionBtn': { zh: '评估此方案的修订影响', en: 'Evaluate revision impact' },
    'published': { zh: '发布', en: 'Published' },
    'effective': { zh: '生效', en: 'Effective' },
    'docNo': { zh: '文号', en: 'Doc No' },
    'activeStatus': { zh: '现行有效', en: 'Active' },
    'revisedStatus': { zh: '已修订', en: 'Revised' },
    'pendingStatus': { zh: '待生效', en: 'Pending' },

    'rfpParsing': { zh: 'RFP解析', en: 'RFP Parsing' },
    'structuredData': { zh: '结构化数据', en: 'Structured Data' },
    'assessmentForecast': { zh: '评估预测', en: 'Assessment Forecast' },
    'resourceCombination': { zh: '资源组合', en: 'Resource Combination' },
    'constraintCheck': { zh: '约束检查', en: 'Constraint Check' },
    'draftIteration': { zh: '成稿迭代', en: 'Draft Iteration' },
    'multiPartyRevision': { zh: '多方修订', en: 'Multi-party Revision' },
    'outputTracking': { zh: '输出留痕', en: 'Output Tracking' },

    'waitingToStart': { zh: '等待开始', en: 'Waiting to start' },
    'inProgressStatus': { zh: '进行中...', en: ' in progress...' },
    'backToList': { zh: '返回列表', en: 'Back to List' },
    'next': { zh: '下一步', en: 'Next' },
    'finish': { zh: '完成', en: 'Finish' },

    'pd1Experience': { zh: 'PD-1 经验机构', en: 'PD-1 Experience' },
    'action': { zh: '操作', en: 'Action' },

    // IntelligentQuery.tsx & IntelligentSelection.tsx common
    'aiChatInteraction': { zh: 'AI 对话交互', en: 'AI Chat Interaction' },
    'aiAssistantGreetingQuery': { zh: '您好！我是集成本体认知的智能助理。请输入您的查询需求，我将通过知识图谱与本体架构为您精准规划和检索。', en: 'Hello! I am an AI assistant with integrated ontology cognition. Please enter your query requirements, and I will accurately plan and retrieve info for you through the knowledge graph and ontology architecture.' },
    'semanticQueryInstructions': { zh: '输入语义查询指令...', en: 'Enter semantic query instructions...' },
    'piRetrieval': { zh: '肺癌 PI 检索', en: 'Lung Cancer PI Retrieval' },
    'similarProjectRetrieval': { zh: '相似项目检索', en: 'Similar Project Retrieval' },
    'comparativeAnalysis': { zh: '对比分析', en: 'Comparative Analysis' },
    'multiDimScreening': { zh: '多维度筛选', en: 'Multi-dimensional Screening' },
    'nationalGeoDist': { zh: '全国地理分布', en: 'National Geographic Distribution' },
    'thinkingDeepAnalysis': { zh: '正在深度解析您的语义意图，并基于 SMO 本体架构检索跨维度的相关节点与关联路径。系统正在构建一套最优的推理规划链条：首先调取领域知识图谱锁定核心实体，随后通过多模态算子评估入组速率与合规性权重，正动态分配特征计算资源，以确保检索结果的精准度与可落地性……', en: 'Deeply analyzing your semantic intent and retrieving cross-dimensional related nodes and paths based on the SMO ontology architecture. The system is building an optimal reasoning chain: first fetching domain knowledge graphs to lock core entities, then evaluating enrollment rates and compliance weights through multimodal operators, dynamically allocating feature computing resources to ensure accurate and actionable results...' },
    'queryPlanningExecuted': { zh: '查询规划已通过本体引擎执行完毕。已根据检索结果为您生成专属报告：', en: 'Query planning has been executed via the ontology engine. An exclusive report has been generated based on the search results:' },
    'ontologyReasoningChain': { zh: '本体推理链', en: 'Ontology Reasoning Chain' },
    'reasoningInProgress': { zh: '推理执行中', en: 'Reasoning in progress' },
    'searchPI': { zh: '擅长肺癌三期临床试验的研究者', en: 'PIs specialized in Lung Cancer Phase III trials' },
    'searchSimilar': { zh: '查找阿可替尼三期非小细胞肺癌研究的相似项目', en: 'Search for similar projects to Alectinib Phase III NSCLC study' },
    'searchMultiDim': { zh: '华东地区病床数>500且GCP无违规的中心', en: 'Centers in East China with bed count > 500 and no GCP violations' },
    'searchGeographic': { zh: '各省肺癌试验中心的数量分布', en: 'Distribution of Lung Cancer trial centers by province' },
    'comparisonAnalysis': { zh: '对比分析', en: 'Comparison Analysis' },
    'reportGenerated': { zh: '报告已生成', en: 'Report Generated' },
    'startSemanticAnalysisEngine': { zh: '请从左侧输入指令，启动本体语义分析引擎', en: 'Please enter instructions from the left to start the ontology semantic analysis engine' },
    'aiThinkingDeeply': { zh: 'AI 正在深度思考', en: 'AI is thinking deeply' },

    // IntelligentSelection.tsx
    'aiSelectionAssistantGreeting': { zh: '您好！我是您的AI选址助手。请告诉我想寻找什么样的临床试验中心。', en: 'Hello! I am your AI selection assistant. Please tell me what kind of clinical trial centers you are looking for.' },
    'selectionRequirementPlaceholder': { zh: '描述您的选址需求...', en: 'Describe your site selection requirements...' },
    'requirementListTitle': { zh: '临床试验需求列表', en: 'Clinical Trial Requirements List' },
    'requirementDetailPreviewTitle': { zh: '需求详情预览', en: 'Requirement Details Preview' },
    'confirmAndStartRecommendation': { zh: '确认并开始中心推荐', en: 'Confirm and Start Recommendation' },
    'aiRecommendedCentersTitle': { zh: 'AI 推荐中心列表', en: 'AI Recommended Centers List' },
    'exportAnalysisReport': { zh: '导出分析报告', en: 'Export Analysis Report' },
    'startCenterComparison': { zh: '开始中心对比', en: 'Start Center Comparison' },
    'regionalCoverageAnalysisTitle': { zh: '区域覆盖分析', en: 'Regional Coverage Analysis' },
    'coreCoverage': { zh: '核心覆盖', en: 'Core Coverage' },
    'enrollmentAccelerationForecastTitle': { zh: '入组加速预测', en: 'Enrollment Acceleration Forecast' },
    'expectedEfficiencyImprovement': { zh: '预计相比历史提升', en: 'Expected improvement over history' },
    'efficiency': { zh: '效率', en: 'Efficiency' },
    'selectionStrategy': { zh: '选址策略', en: 'Selection Strategy' },
    'strategyLog': { zh: '策略日志', en: 'Strategy Log' },
    'institutionPortraitTitle': { zh: '机构详情画像', en: 'Institution Portrait' },
    'basicInfo': { zh: '基本情况', en: 'Basic Info' },
    'regionLabel': { zh: '所属地区', en: 'Region' },
    'historicalPerformanceTitle': { zh: '历史绩效 (近3年)', en: 'Historical Performance (Last 3 Years)' },
    'avgStartupCycleLabel': { zh: '平均启动周期', en: 'Average Startup Cycle' },
    'fpiOnTimeRateLabel': { zh: 'FPI 按时完成率', en: 'FPI On-time Completion Rate' },
    'avgQueryRateLabel': { zh: '平均 Query 率', en: 'Average Query Rate' },
    'regComplianceCertTitle': { zh: '监管/合规认证', en: 'Regulatory/Compliance Certification' },
    'facilitiesEquipmentTitle': { zh: '设施与设备', en: 'Facilities & Equipment' },
    'addToComparisonFlow': { zh: '添加至对比流', en: 'Add to Comparison Flow' },
    'requirementName': { zh: '需求名称', en: 'Requirement Name' },
    'trialPhase': { zh: '试验分期', en: 'Trial Phase' },
    'drugType': { zh: '药物类型', en: 'Drug Type' },
    'targetEnrollment': { zh: '目标入组', en: 'Target Enrollment' },
    'expectedCycle': { zh: '预计周期', en: 'Expected Cycle' },
    'mainInclusionCriteria': { zh: '主要准入标准', en: 'Main Inclusion Criteria' },
    'selectRequirementPreview': { zh: '请选择一个需求进行预览', en: 'Please select a requirement to preview' },
    'institutionName': { zh: '机构名称', en: 'Institution Name' },
    'estimatedMonthlyEnrollment': { zh: '预计月入组', en: 'Estimated Monthly Enrollment' },
    'complianceNote': { zh: '存在合规关注点', en: 'Compliance concerns exist' },
    'attentionTag': { zh: '关注', en: 'Attention' },
    'portrait': { zh: '画像', en: 'Portrait' },
    'manualAddInstitution': { zh: '手动添加机构', en: 'Manually Add Institution' },
    'foundCentersPrefix': { zh: '共找到 ', en: 'Found ' },
    'foundCentersSuffix': { zh: ' 个符合条件的中心', en: ' matching centers' },

    // StepNavigation
    'stepRequirement': { zh: '需求定义', en: 'Requirement' },
    'stepRecommendation': { zh: '中心推荐', en: 'Recommendation' },
    'stepComparison': { zh: '中心对比', en: 'Comparison' },
    'stepCompliance': { zh: '合规检查', en: 'Compliance' },
    'stepSimulation': { zh: '模拟行动', en: 'Simulation' },
    'descRequirement': { zh: 'CUI 解析需求', en: 'CUI Parse Req' },
    'descRecommendation': { zh: '指标识别与画像', en: 'Metrics & Portrait' },
    'descComparison': { zh: '多维度对标分析', en: 'Multi-dim Analysis' },
    'descCompliance': { zh: '资质合规与风险', en: 'Compliance & Risk' },
    'descSimulation': { zh: '预测模拟与预案', en: 'Simulation & Plan' },
    'stepPrefix': { zh: '第 ', en: 'Step ' },
    'stepDivider': { zh: ' / ', en: ' / ' },
    'stepSuffix': { zh: ' 步', en: '' },

    // Add more as needed
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('zh');

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
