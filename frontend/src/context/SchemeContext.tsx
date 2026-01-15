import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SelectionScheme, Institution, SchemeRequirements, StepKey } from '../types';

interface SchemeContextType {
    currentScheme: SelectionScheme | null;
    schemes: SelectionScheme[];
    currentStep: StepKey;
    selectedInstitutionId: string | null;
    setCurrentScheme: (scheme: SelectionScheme | null) => void;
    setCurrentStep: (step: StepKey) => void;
    setSelectedInstitutionId: (id: string | null) => void;
    addScheme: (scheme: SelectionScheme) => void;
    updateScheme: (id: string, updates: Partial<SelectionScheme>) => void;
    selectInstitution: (institutionId: string) => void;
    clearSelection: () => void;
    getSelectedInstitution: () => Institution | null;
    getSchemeInstitutions: () => Institution[];
    getInstitution: (id: string) => Institution | null;
    allInstitutions: Institution[];
}

const SchemeContext = createContext<SchemeContextType | undefined>(undefined);

const defaultRequirements: SchemeRequirements = {
    indication: '',
    phase: '',
    drugType: '',
    targetEnrollment: 200,
    targetCentersMin: 8,
    targetCentersMax: 10,
    regionDistribution: {
        '华东': 4,
        '华北': 2,
        '华南': 2
    }
};

const defaultScheme: SelectionScheme = {
    id: 'scheme-1',
    name: 'NSCLC-PD1-III-选址方案-v1',
    projectId: 'CTR20240001',
    version: 1,
    status: 'draft',
    creatorId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requirements: defaultRequirements,
    weights: {
        enrollmentWeight: 0.35,
        startEfficiencyWeight: 0.25,
        complianceWeight: 0.25,
        historyWeight: 0.15
    },
    institutions: ['1', '2', '3'],
    alternatives: ['4', '5'],
    scores: {
        overall: 92,
        enrollment: 95,
        startEfficiency: 88,
        compliance: 90,
        history: 85
    },
    risks: {
        high: 1,
        medium: 2,
        low: 5,
        details: [
            {
                institutionId: '2',
                institutionName: '浙江省肿瘤医院',
                type: 'GCP证书',
                level: 'high',
                description: 'GCP证书将于2025-06-30到期',
                suggestion: '提前确认续期计划'
            },
            {
                institutionId: '2',
                institutionName: '浙江省肿瘤医院',
                type: '竞争试验',
                level: 'medium',
                description: '存在同适应症竞争试验 CTR20240089',
                suggestion: '关注竞争试验入组进度'
            },
            {
                institutionId: '3',
                institutionName: '北京肿瘤医院',
                type: '合同周期',
                level: 'medium',
                description: '历史合同审批周期较长（平均22天）',
                suggestion: '提前准备合同材料'
            }
        ]
    },
    predictions: {
        overallRate: 35,
        completionMonths: 5.7,
        confidence: 92,
        institutionPredictions: [
            { institutionId: '1', institutionName: '复旦肿瘤', predictedRate: 4.5, targetCases: 30, completionMonth: '6.7', confidence: 'high', risk: 'low' },
            { institutionId: '2', institutionName: '浙江肿瘤', predictedRate: 3.8, targetCases: 25, completionMonth: '6.6', confidence: 'medium', risk: 'medium' },
            { institutionId: '3', institutionName: '中山肿瘤', predictedRate: 3.5, targetCases: 25, completionMonth: '7.1', confidence: 'high', risk: 'low' },
            { institutionId: '4', institutionName: '北京肿瘤', predictedRate: 3.8, targetCases: 25, completionMonth: '6.6', confidence: 'medium', risk: 'low' }
        ]
    }
};

const mockInstitutions: Institution[] = [
    {
        id: '1',
        name: '复旦大学附属肿瘤医院',
        region: '华东',
        pi: '陈XX',
        rate: 4.5,
        rateTrend: 'up',
        reliability: '高',
        risk: '低',
        tags: ['三甲', '合作历史优', 'NSCLC经验丰富'],
        score: 96,
        regTags: ['HGR优化报备', 'SMODE审计'],
        ethicsApproval: '15天',
        contractApproval: '12天',
        sivPreparation: '6天',
        piLoad: '3.2项',
        crcRatio: '1:1.5',
        contractHistory: '22天'
    },
    {
        id: '2',
        name: '浙江省肿瘤医院',
        region: '华东',
        pi: '王XX',
        rate: 3.8,
        rateTrend: 'stable',
        reliability: '高',
        risk: '中',
        tags: ['三甲', '入组稳定'],
        score: 92,
        regTags: ['GCP认证'],
        ethicsApproval: '20天',
        contractApproval: '18天',
        sivPreparation: '7天',
        piLoad: '3.5项',
        crcRatio: '1:1.3',
        contractHistory: '25天'
    },
    {
        id: '3',
        name: '中山大学肿瘤防治中心',
        region: '华南',
        pi: '周XX',
        rate: 3.5,
        rateTrend: 'up',
        reliability: '高',
        risk: '低',
        tags: ['三甲', '启动快', '华南龙头'],
        score: 90,
        regTags: ['GCP认证', '数据安全'],
        ethicsApproval: '12天',
        contractApproval: '10天',
        sivPreparation: '5天',
        piLoad: '2.8项',
        crcRatio: '1:1.2',
        contractHistory: '18天'
    },
    {
        id: '4',
        name: '北京肿瘤医院',
        region: '华北',
        pi: '张XX',
        rate: 3.8,
        rateTrend: 'down',
        reliability: '中',
        risk: '中',
        tags: ['三甲', '负荷较高'],
        score: 88,
        regTags: ['GCP认证'],
        ethicsApproval: '20天',
        contractApproval: '25天',
        sivPreparation: '8天',
        piLoad: '4.5项',
        crcRatio: '1:2',
        contractHistory: '30天'
    },
    {
        id: '5',
        name: '南京鼓楼医院',
        region: '华东',
        pi: '李XX',
        rate: 2.8,
        rateTrend: 'stable',
        reliability: '中',
        risk: '低',
        tags: ['三甲', '备选机构'],
        score: 82,
        regTags: ['GCP认证'],
        ethicsApproval: '18天',
        contractApproval: '15天',
        sivPreparation: '6天',
        piLoad: '2.5项',
        crcRatio: '1:1.4',
        contractHistory: '20天'
    }
];

export const SchemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentScheme, setCurrentScheme] = useState<SelectionScheme | null>(defaultScheme);
    const [schemes, setSchemes] = useState<SelectionScheme[]>([defaultScheme]);
    const [currentStep, setCurrentStepState] = useState<StepKey>('requirement');
    const [selectedInstitutionId, setSelectedInstitutionIdState] = useState<string | null>(null);

    const setCurrentStep = useCallback((step: StepKey) => {
        setCurrentStepState(step);
    }, []);

    const setSelectedInstitutionId = useCallback((id: string | null) => {
        setSelectedInstitutionIdState(id);
    }, []);

    const addScheme = useCallback((scheme: SelectionScheme) => {
        setSchemes(prev => [...prev, scheme]);
        setCurrentScheme(scheme);
    }, []);

    const updateScheme = useCallback((id: string, updates: Partial<SelectionScheme>) => {
        setSchemes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        setCurrentScheme(prev => prev?.id === id ? { ...prev, ...updates } : prev);
    }, []);

    const selectInstitution = useCallback((institutionId: string) => {
        setSelectedInstitutionIdState(institutionId);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedInstitutionIdState(null);
    }, []);

    const getSelectedInstitution = useCallback(() => {
        if (!selectedInstitutionId) return null;
        return mockInstitutions.find(i => i.id === selectedInstitutionId) || null;
    }, [selectedInstitutionId]);

    const getInstitution = useCallback((id: string) => {
        return mockInstitutions.find(i => i.id === id) || null;
    }, []);

    const getSchemeInstitutions = useCallback(() => {
        if (!currentScheme) return [];
        return currentScheme.institutions
            .map(id => mockInstitutions.find(i => i.id === id))
            .filter((i): i is Institution => i !== undefined);
    }, [currentScheme]);

    const value: SchemeContextType = {
        currentScheme,
        schemes,
        currentStep,
        selectedInstitutionId,
        setCurrentScheme,
        setCurrentStep,
        setSelectedInstitutionId,
        addScheme,
        updateScheme,
        selectInstitution,
        clearSelection,
        getSelectedInstitution,
        getSchemeInstitutions,
        getInstitution,
        allInstitutions: mockInstitutions
    };

    return (
        <SchemeContext.Provider value={value}>
            {children}
        </SchemeContext.Provider>
    );
};

export const useScheme = () => {
    const context = useContext(SchemeContext);
    if (!context) {
        throw new Error('useScheme must be used within a SchemeProvider');
    }
    return context;
};

export const useInstitutions = () => {
    const { getSelectedInstitution, getSchemeInstitutions, getInstitution } = useScheme();
    return {
        getSelectedInstitution,
        getSchemeInstitutions,
        getInstitution,
        allInstitutions: mockInstitutions
    };
};
