import React from 'react';
import { Steps, Space, Tag } from 'antd';
import { useScheme } from '../../context/SchemeContext';
import { StepKey } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface StepNavProps {
    onStepChange?: (step: StepKey) => void;
}

const StepNavigation: React.FC<StepNavProps> = ({ onStepChange }) => {
    const { currentStep, setCurrentStep } = useScheme();
    const { t } = useLanguage();

    const stepConfig: { key: StepKey; title: string; description: string }[] = [
        { key: 'requirement', title: t('stepRequirement'), description: t('descRequirement') },
        { key: 'recommendation', title: t('stepRecommendation'), description: t('descRecommendation') },
        { key: 'comparison', title: t('stepComparison'), description: t('descComparison') },
        { key: 'compliance', title: t('stepCompliance'), description: t('descCompliance') },
        { key: 'simulation', title: t('stepSimulation'), description: t('descSimulation') }
    ];

    const currentIndex = stepConfig.findIndex(s => s.key === currentStep);

    const handleStepClick = (index: number) => {
        const step = stepConfig[index].key;
        setCurrentStep(step);
        onStepChange?.(step);
    };

    return (
        <div style={{ padding: '16px 24px', background: '#fff', borderRadius: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Steps
                    current={currentIndex}
                    size="small"
                    onChange={handleStepClick}
                    items={stepConfig.map((step, index) => ({
                        title: (
                            <span style={{
                                fontSize: index === currentIndex ? 14 : 12,
                                fontWeight: index === currentIndex ? 600 : 400
                            }}>
                                {step.title}
                            </span>
                        ),
                        description: (
                            <span style={{ fontSize: 11, color: '#999' }}>
                                {step.description}
                            </span>
                        )
                    }))}
                />
                <Space>
                    <Tag color="blue">{stepConfig[currentIndex].title}</Tag>
                    <span style={{ color: '#999', fontSize: 12 }}>
                        {t('stepPrefix')}{currentIndex + 1}{t('stepDivider')}{stepConfig.length}{t('stepSuffix')}
                    </span>
                </Space>
            </div>
        </div>
    );
};

export default StepNavigation;
