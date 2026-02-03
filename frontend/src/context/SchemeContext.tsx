import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { SelectionScheme, Institution, SchemeRequirements, StepKey } from '../types';
import { useLanguage } from './LanguageContext';

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

export const SchemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { language } = useLanguage();

    const mockInstitutions: Institution[] = useMemo(() => [
        {
            id: '1',
            name: language === 'zh' ? '复旦大学附属肿瘤医院' : 'Fudan University Cancer Hospital',
            region: language === 'zh' ? '华东' : 'East China',
            pi: language === 'zh' ? '陈XX' : 'Dr. Chen',
            rate: 4.5,
            rateTrend: 'up',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '低' : 'Low',
            tags: language === 'zh' ? ['三甲', '合作历史优', 'NSCLC经验丰富'] : ['Grade A', 'Good History', 'NSCLC Expert'],
            score: 96,
            regTags: language === 'zh' ? ['HGR优化报备', 'SMODE审计'] : ['HGR Optimized', 'SMODE Audit'],
            ethicsApproval: language === 'zh' ? '15天' : '15 Days',
            contractApproval: language === 'zh' ? '12天' : '12 Days',
            sivPreparation: language === 'zh' ? '6天' : '6 Days',
            piLoad: language === 'zh' ? '3.2项' : '3.2 Projects',
            crcRatio: '1:1.5',
            contractHistory: language === 'zh' ? '22天' : '22 Days'
        },
        {
            id: '2',
            name: language === 'zh' ? '浙江省肿瘤医院' : 'Zhejiang Cancer Hospital',
            region: language === 'zh' ? '华东' : 'East China',
            pi: language === 'zh' ? '王XX' : 'Dr. Wang',
            rate: 3.8,
            rateTrend: 'stable',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '中' : 'Medium',
            tags: language === 'zh' ? ['三甲', '入组稳定'] : ['Grade A', 'Stable Enrollment'],
            score: 92,
            regTags: language === 'zh' ? ['GCP认证'] : ['GCP Cert'],
            ethicsApproval: language === 'zh' ? '20天' : '20 Days',
            contractApproval: language === 'zh' ? '18天' : '18 Days',
            sivPreparation: language === 'zh' ? '7天' : '7 Days',
            piLoad: language === 'zh' ? '3.5项' : '3.5 Projects',
            crcRatio: '1:1.3',
            contractHistory: language === 'zh' ? '25天' : '25 Days'
        },
        {
            id: '3',
            name: language === 'zh' ? '中山大学肿瘤防治中心' : 'Sun Yat-sen University Cancer Center',
            region: language === 'zh' ? '华南' : 'South China',
            pi: language === 'zh' ? '周XX' : 'Dr. Zhou',
            rate: 3.5,
            rateTrend: 'up',
            reliability: language === 'zh' ? '高' : 'High',
            risk: language === 'zh' ? '低' : 'Low',
            tags: language === 'zh' ? ['三甲', '启动快', '华南龙头'] : ['Grade A', 'Fast Startup', 'South China Leader'],
            score: 90,
            regTags: language === 'zh' ? ['GCP认证', '数据安全'] : ['GCP Cert', 'Data Security'],
            ethicsApproval: language === 'zh' ? '12天' : '12 Days',
            contractApproval: language === 'zh' ? '10天' : '10 Days',
            sivPreparation: language === 'zh' ? '5天' : '5 Days',
            piLoad: language === 'zh' ? '2.8项' : '2.8 Projects',
            crcRatio: '1:1.2',
            contractHistory: language === 'zh' ? '18天' : '18 Days'
        },
        {
            id: '4',
            name: language === 'zh' ? '北京肿瘤医院' : 'Beijing Cancer Hospital',
            region: language === 'zh' ? '华北' : 'North China',
            pi: language === 'zh' ? '张XX' : 'Dr. Zhang',
            rate: 3.8,
            rateTrend: 'down',
            reliability: language === 'zh' ? '中' : 'Medium',
            risk: language === 'zh' ? '中' : 'Medium',
            tags: language === 'zh' ? ['三甲', '负荷较高'] : ['Grade A', 'High Load'],
            score: 88,
            regTags: language === 'zh' ? ['GCP认证'] : ['GCP Cert'],
            ethicsApproval: language === 'zh' ? '20天' : '20 Days',
            contractApproval: language === 'zh' ? '25天' : '25 Days',
            sivPreparation: language === 'zh' ? '8天' : '8 Days',
            piLoad: language === 'zh' ? '4.5项' : '4.5 Projects',
            crcRatio: '1:2',
            contractHistory: language === 'zh' ? '30天' : '30 Days'
        },
        {
            id: '5',
            name: language === 'zh' ? '南京鼓楼医院' : 'Nanjing Gulou Hospital',
            region: language === 'zh' ? '华东' : 'East China',
            pi: language === 'zh' ? '李XX' : 'Dr. Li',
            rate: 2.8,
            rateTrend: 'stable',
            reliability: language === 'zh' ? '中' : 'Medium',
            risk: language === 'zh' ? '低' : 'Low',
            tags: language === 'zh' ? ['三甲', '备选机构'] : ['Grade A', 'Alternative'],
            score: 82,
            regTags: language === 'zh' ? ['GCP认证'] : ['GCP Cert'],
            ethicsApproval: language === 'zh' ? '18天' : '18 Days',
            contractApproval: language === 'zh' ? '15天' : '15 Days',
            sivPreparation: language === 'zh' ? '6天' : '6 Days',
            piLoad: language === 'zh' ? '2.5项' : '2.5 Projects',
            crcRatio: '1:1.4',
            contractHistory: language === 'zh' ? '20天' : '20 Days'
        }
    ], [language]);

    const defaultScheme: SelectionScheme = useMemo(() => ({
        id: 'scheme-1',
        name: language === 'zh' ? 'NSCLC-PD1-III-选址方案-v1' : 'NSCLC-PD1-III-Selection-v1',
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
                    institutionName: language === 'zh' ? '浙江省肿瘤医院' : 'Zhejiang Cancer Hospital',
                    type: language === 'zh' ? 'GCP证书' : 'GCP Cert',
                    level: 'high',
                    description: language === 'zh' ? 'GCP证书将于2025-06-30到期' : 'GCP certificate will expire on 2025-06-30',
                    suggestion: language === 'zh' ? '提前确认续期计划' : 'Confirm renewal plan in advance'
                },
                {
                    institutionId: '2',
                    institutionName: language === 'zh' ? '浙江省肿瘤医院' : 'Zhejiang Cancer Hospital',
                    type: language === 'zh' ? '竞争试验' : 'Competitive Trial',
                    level: 'medium',
                    description: language === 'zh' ? '存在同适应症竞争试验 CTR20240089' : 'Same indication competing trial CTR20240089 exists',
                    suggestion: language === 'zh' ? '关注竞争试验入组进度' : 'Monitor competitive trial progress'
                },
                {
                    institutionId: '3',
                    institutionName: language === 'zh' ? '北京肿瘤医院' : 'Beijing Cancer Hospital',
                    type: language === 'zh' ? '合同周期' : 'Contract Cycle',
                    level: 'medium',
                    description: language === 'zh' ? '历史合同审批周期较长（平均22天）' : 'Long historical contract cycle (avg 22 days)',
                    suggestion: language === 'zh' ? '提前准备合同材料' : 'Prepare contract materials early'
                }
            ]
        },
        predictions: {
            overallRate: 35,
            completionMonths: 5.7,
            confidence: 92,
            institutionPredictions: [
                { institutionId: '1', institutionName: language === 'zh' ? '复旦肿瘤' : 'Fudan Cancer', predictedRate: 4.5, targetCases: 30, completionMonth: '6.7', confidence: 'high', risk: 'low' },
                { institutionId: '2', institutionName: language === 'zh' ? '浙江肿瘤' : 'Zhejiang Cancer', predictedRate: 3.8, targetCases: 25, completionMonth: '6.6', confidence: 'medium', risk: 'medium' },
                { institutionId: '3', institutionName: language === 'zh' ? '中山肿瘤' : 'SYSUCC', predictedRate: 3.5, targetCases: 25, completionMonth: '7.1', confidence: 'high', risk: 'low' },
                { institutionId: '4', institutionName: language === 'zh' ? '北京肿瘤' : 'Beijing Cancer', predictedRate: 3.8, targetCases: 25, completionMonth: '6.6', confidence: 'medium', risk: 'low' }
            ]
        }
    }), [language]);

    const [currentScheme, setCurrentScheme] = useState<SelectionScheme | null>(null);
    const [schemes, setSchemes] = useState<SelectionScheme[]>([]);
    const [currentStep, setCurrentStepState] = useState<StepKey>('requirement');
    const [selectedInstitutionId, setSelectedInstitutionIdState] = useState<string | null>(null);

    // Initialize with defaultScheme after it's memoized
    useEffect(() => {
        // If no scheme is selected, or if we're using a version of the default scheme,
        // update it to current language version.
        if (!currentScheme || currentScheme.id === 'scheme-1') {
            setCurrentScheme(defaultScheme);
        }

        // Refresh schemes list if it only contains the default scheme
        if (schemes.length <= 1) {
            setSchemes([defaultScheme]);
        }
    }, [defaultScheme, currentScheme, schemes.length]);

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
    }, [selectedInstitutionId, mockInstitutions]);

    const getInstitution = useCallback((id: string) => {
        return mockInstitutions.find(i => i.id === id) || null;
    }, [mockInstitutions]);

    const getSchemeInstitutions = useCallback(() => {
        if (!currentScheme) return [];
        return (currentScheme.institutions || [])
            .map(id => mockInstitutions.find(i => i.id === id))
            .filter((i): i is Institution => i !== undefined);
    }, [currentScheme, mockInstitutions]);

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
    const { getSelectedInstitution, getSchemeInstitutions, getInstitution, allInstitutions } = useScheme();
    return {
        getSelectedInstitution,
        getSchemeInstitutions,
        getInstitution,
        allInstitutions
    };
};
