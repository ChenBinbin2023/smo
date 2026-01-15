import React from 'react';
import { Steps, Space, Tag } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useScheme } from '../../context/SchemeContext';
import { StepKey } from '../../types';

interface StepNavProps {
    onStepChange?: (step: StepKey) => void;
}

const stepConfig: { key: StepKey; title: string; description: string }[] = [
    { key: 'requirement', title: '需求定义', description: 'CUI 解析需求' },
    { key: 'recommendation', title: '中心推荐', description: '指标识别与画像' },
    { key: 'comparison', title: '中心对比', description: '多维度对标分析' },
    { key: 'compliance', title: '合规检查', description: '资质合规与风险' },
    { key: 'simulation', title: '模拟行动', description: '预测模拟与预案' }
];

const StepNavigation: React.FC<StepNavProps> = ({ onStepChange }) => {
    const { currentStep, setCurrentStep } = useScheme();

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
                        第 {currentIndex + 1} / {stepConfig.length} 步
                    </span>
                </Space>
            </div>
        </div>
    );
};

export default StepNavigation;
