import React from 'react'
import { Card, Steps, Button, Typography, Spin } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined, CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { stepsDataEn, stepsDataZh } from './mockData'
import RequirementAnalysis from './RequirementAnalysis'
import {
    DataCollectionStep,
    FeasibilityStep,
    SiteSelectionStep,
    RiskComplianceStep,
    DraftingStep,
    ReviewStep,
    DeliveryStep
} from './steps'
import { useLanguage } from '../../context/LanguageContext'

const { Text } = Typography

interface WorkflowViewProps {
    activeStep: number;
    stepStatus: 'idle' | 'loading' | 'completed';
    completedSteps: number[];
    onNextStep: () => void;
    onBackToList: () => void;
    onStepClick: (step: number) => void;
    siteSelectionSubStatus?: 'idle' | 'center-loading' | 'center-done' | 'scenario-loading' | 'completed';
    hasAddedRegion?: boolean;
    hasCompressedTimeline?: boolean;
    riskComplianceSubStatus?: 'idle' | 'mapping' | 'mapping-done' | 'conflict' | 'conflict-done' | 'report' | 'completed';
    geneticApprovalCompleted?: boolean;
    isRevising?: boolean;
}

const WorkflowView: React.FC<WorkflowViewProps> = ({
    activeStep,
    stepStatus,
    completedSteps,
    onNextStep,
    onBackToList,
    onStepClick,
    siteSelectionSubStatus = 'idle',
    hasAddedRegion = false,
    hasCompressedTimeline = false,
    riskComplianceSubStatus = 'idle',
    geneticApprovalCompleted = false,
    isRevising = false
}) => {
    const { t, language } = useLanguage();
    const stepsData = language === 'zh' ? stepsDataZh : stepsDataEn;

    const renderStepContent = () => {
        // Step 0: Requirement Analysis
        if (activeStep === 0) {
            if (stepStatus === 'loading') {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        <Text type="secondary" className="text-lg">{t('requirementAnalysis')} {t('inProgressStatus')}</Text>
                        <Text type="secondary">{language === 'zh' ? '正在解析RFP文件并分析需求...' : 'Parsing RFP document and analyzing requirements...'}</Text>
                    </div>
                )
            } else if (stepStatus === 'completed') {
                return <RequirementAnalysis />
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Text type="secondary" className="text-lg">{t('waitingToStart')} {t('requirementAnalysis').toLowerCase()}...</Text>
                    </div>
                )
            }
        }

        // Step 1: Data Collection
        if (activeStep === 1) {
            if (stepStatus === 'loading') {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        <Text type="secondary" className="text-lg">{t('dataCollection')} {t('inProgressStatus')}</Text>
                        <Text type="secondary">{language === 'zh' ? '数据专家正在聚合历史数据与中心画像...' : 'Data experts are aggregating historical data and center profiles...'}</Text>
                    </div>
                )
            } else if (stepStatus === 'completed') {
                return <DataCollectionStep />
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Text type="secondary" className="text-lg">{t('waitingToStart')} {t('dataCollection').toLowerCase()}...</Text>
                    </div>
                )
            }
        }

        // Step 2: Feasibility Assessment
        if (activeStep === 2) {
            if (stepStatus === 'loading') {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        <Text type="secondary" className="text-lg">{t('feasibilityAssessment')} {t('inProgressStatus')}</Text>
                        <Text type="secondary">{language === 'zh' ? '可行性专家正在分析入组空间与区域策略...' : 'Feasibility experts are analyzing enrollment space and regional strategies...'}</Text>
                    </div>
                )
            } else if (stepStatus === 'completed') {
                return <FeasibilityStep />
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Text type="secondary" className="text-lg">{t('waitingToStart')} {t('feasibilityAssessment').toLowerCase()}...</Text>
                    </div>
                )
            }
        }
        // Step 3: Site Selection with dual expert workflow
        if (activeStep === 3) {
            // Initial loading state (when first entering step 3)
            if (stepStatus === 'loading' && siteSelectionSubStatus === 'center-loading' && !hasAddedRegion) {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        <Text type="secondary" className="text-lg">{t('siteSelectionWorkflow')} {t('inProgressStatus')}</Text>
                        <Text type="secondary">{language === 'zh' ? '中心选择专家正在生成候选池并筛选...' : 'Center selection experts are generating candidate pools and screening...'}</Text>
                    </div>
                )
            } else if (stepStatus === 'completed' || hasAddedRegion || siteSelectionSubStatus !== 'idle') {
                // Determine logic for loading states within the cards
                const centerListLoading = siteSelectionSubStatus === 'center-loading';
                const scenarioLoading = siteSelectionSubStatus === 'scenario-loading';

                return <SiteSelectionStep
                    scenarioLoading={scenarioLoading}
                    centerListLoading={centerListLoading}
                    hasAddedRegion={hasAddedRegion}
                    hasCompressedTimeline={hasCompressedTimeline}
                />
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Text type="secondary" className="text-lg">{t('waitingToStart')} {t('siteSelectionWorkflow').toLowerCase()}...</Text>
                    </div>
                )
            }
        }

        // Step 4: Risk & Compliance
        if (activeStep === 4) {
            if (stepStatus === 'loading') {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        <Text type="secondary" className="text-lg">{t('complianceRiskControl')} {t('inProgressStatus')}</Text>
                        <Text type="secondary">{language === 'zh' ? '正在全面分析相关法规与伦理要求...' : 'Comprehensively analyzing related regulations and ethical requirements...'}</Text>
                    </div>
                )
            } else if (stepStatus === 'completed') {
                return <RiskComplianceStep />
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Text type="secondary" className="text-lg">{t('waitingToStart')} {t('complianceRiskControl').toLowerCase()}...</Text>
                    </div>
                )
            }
        }

        // Other steps
        switch (activeStep) {
            case 5: // Protocol Drafting
                if (stepStatus === 'loading') {
                    return (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                            <Text type="secondary" className="text-lg">{t('proposalWriting')} {t('inProgressStatus')}</Text>
                            <Text type="secondary">{language === 'zh' ? '正在整合分析结果，进行结构化撰写与一致性检查...' : 'Integrating analysis results, conducting structured drafting and consistency checks...'}</Text>
                        </div>
                    )
                }
                return <DraftingStep geneticApprovalCompleted={geneticApprovalCompleted} isRevising={isRevising} />
            case 6: // Review
                if (stepStatus === 'loading') {
                    return (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                            <Text type="secondary" className="text-lg">{t('collaborativeReview')} {t('inProgressStatus')}</Text>
                            <Text type="secondary">{language === 'zh' ? '多方专家正在进行交叉评审与意见收敛...' : 'Experts from various fields are cross-reviewing and converging opinions...'}</Text>
                        </div>
                    )
                }
                return <ReviewStep />
            case 7: // Delivery
                if (stepStatus === 'loading') {
                    return (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                            <Text type="secondary" className="text-lg">{t('deliveryArchiving')} {t('inProgressStatus')}</Text>
                            <Text type="secondary">{language === 'zh' ? '正在打包交付物并生成最终报告...' : 'Packaging deliverables and generating final report...'}</Text>
                        </div>
                    )
                }
                return <DeliveryStep />
            default: return null
        }
    }

    // Convert stepsData with completion status
    const stepsWithStatus = stepsData.map((step, index) => {
        let status: 'wait' | 'process' | 'finish' = 'wait'
        let icon = step.icon

        if (completedSteps.includes(index)) {
            status = 'finish'
            icon = <CheckCircleFilled />
        } else if (index === activeStep) {
            status = 'process'
            if (stepStatus === 'loading') {
                icon = <LoadingOutlined />
            }
        }

        return {
            ...step,
            status,
            icon
        }
    })

    return (
        <Card bordered={false} className="h-full shadow-sm flex flex-col" styles={{ body: { padding: '0', display: 'flex', flexDirection: 'row', height: '100%' } }}>
            {/* Stepper Sidebar */}
            <div className="w-56 border-r border-gray-100 bg-white p-4 overflow-y-auto">
                <Steps
                    direction="vertical"
                    current={activeStep}
                    size="small"
                    className="cursor-pointer"
                    onChange={(step) => onStepClick(step)}
                    items={stepsWithStatus.map(s => ({
                        title: s.title,
                        icon: s.icon,
                        status: s.status as any
                    }))}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
                {/* Content Header with Title and Next Button */}
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                    <div>
                        <Text strong className="text-lg">{stepsData[activeStep].title}</Text>
                        <Text type="secondary" className="ml-3 text-sm">{stepsData[activeStep].description}</Text>
                    </div>
                    <div className="flex space-x-2">
                        {activeStep === 0 && (
                            <Button icon={<ArrowLeftOutlined />} onClick={onBackToList}>
                                {t('backToList')}
                            </Button>
                        )}
                        {activeStep < stepsData.length - 1 && stepStatus === 'completed' && (
                            <Button type="primary" icon={<ArrowRightOutlined />} onClick={onNextStep}>
                                {t('next')}
                            </Button>
                        )}
                        {activeStep === stepsData.length - 1 && stepStatus === 'completed' && (
                            <Button type="primary" onClick={onBackToList}>
                                {t('finish')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>


            </div>
        </Card>
    )
}

export default WorkflowView
