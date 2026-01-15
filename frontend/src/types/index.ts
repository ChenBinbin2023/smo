export type SchemeStatus = 'draft' | 'confirmed' | 'locked';

export interface Institution {
    id: string;
    name: string;
    region: string;
    pi: string;
    rate: number;
    rateTrend?: 'up' | 'down' | 'stable';
    reliability: string;
    risk: string;
    tags: string[];
    score: number;
    regTags: string[];
    ethicsApproval: string;
    contractApproval: string;
    sivPreparation: string;
    piLoad: string;
    crcRatio: string;
    contractHistory: string;
}

export interface Requirement {
    indication: string;
    phase: string;
    drugType: string;
    targetEnrollment: number;
    targetCenters: number;
    regionDistribution: Record<string, number>;
}

export interface SchemeRequirements {
    indication: string;
    phase: string;
    drugType: string;
    targetEnrollment: number;
    targetCentersMin: number;
    targetCentersMax: number;
    regionDistribution: Record<string, number>;
}

export interface SchemeWeights {
    enrollmentWeight: number;
    startEfficiencyWeight: number;
    complianceWeight: number;
    historyWeight: number;
}

export interface SchemeScores {
    overall: number;
    enrollment: number;
    startEfficiency: number;
    compliance: number;
    history: number;
}

export interface SchemeRisks {
    high: number;
    medium: number;
    low: number;
    details: RiskItem[];
}

export interface RiskItem {
    institutionId: string;
    institutionName: string;
    type: string;
    level: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
}

export interface SchemePrediction {
    overallRate: number;
    completionMonths: number;
    confidence: number;
    institutionPredictions: InstitutionPrediction[];
}

export interface InstitutionPrediction {
    institutionId: string;
    institutionName: string;
    predictedRate: number;
    targetCases: number;
    completionMonth: string;
    confidence: 'high' | 'medium' | 'low';
    risk: 'low' | 'medium' | 'high';
}

export interface ComplianceCheckResult {
    passed: boolean;
    checkTime: string;
    source: string;
    notes: string[];
    categories: ComplianceCategory[];
}

export interface ComplianceCategory {
    name: string;
    icon: string;
    items: ComplianceItem[];
}

export interface ComplianceItem {
    name: string;
    status: 'passed' | 'warning' | 'failed';
    description: string;
}

export interface SelectionScheme {
    id: string;
    name: string;
    projectId?: string;
    templateId?: string;
    version: number;
    status: SchemeStatus;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    requirements: SchemeRequirements;
    weights: SchemeWeights;
    institutions: string[];
    alternatives: string[];
    scores?: SchemeScores;
    risks?: SchemeRisks;
    predictions?: SchemePrediction;
    checkResults?: Record<string, ComplianceCheckResult>;
}

export interface ComplianceCheckRecord {
    id: string;
    schemeId: string;
    institutionId: string;
    checkTime: string;
    checkStatus: 'passed' | 'warning' | 'failed';
    qualification?: ComplianceCategory[];
    compliance?: ComplianceCategory[];
    risks?: ComplianceCategory[];
    ethics?: ComplianceCategory[];
    regulations?: ComplianceCategory[];
    medical?: ComplianceCategory[];
    checkedBy?: string;
    notes?: string;
}

export type StepKey = 'requirement' | 'recommendation' | 'comparison' | 'compliance' | 'simulation';
