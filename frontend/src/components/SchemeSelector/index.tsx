import React, { useState } from 'react';
import { Select, Button, Space, Modal, Form, Input, Tag, Typography, Tooltip } from 'antd';
import { PlusOutlined, SettingOutlined, CopyOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useScheme } from '../../context/SchemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { SelectionScheme } from '../../types';
import { motion } from 'framer-motion';

const { Text } = Typography;

const SchemeSelector: React.FC = () => {
    const { currentScheme, schemes, setCurrentScheme, addScheme } = useScheme();
    const { language } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleChange = (value: string) => {
        const scheme = schemes.find(s => s.id === value);
        if (scheme) {
            setCurrentScheme(scheme);
        }
    };

    const handleCreate = () => {
        const values = form.getFieldsValue();
        const newScheme: SelectionScheme = {
            id: `scheme-${Date.now()}`,
            name: values.name || (language === 'zh' ? '新建选址方案' : 'New Selection Scheme'),
            version: 1,
            status: 'draft',
            creatorId: 'user-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            requirements: {
                indication: '',
                phase: '',
                drugType: '',
                targetEnrollment: 200,
                targetCentersMin: 8,
                targetCentersMax: 10,
                regionDistribution: { '华东': 4, '华北': 2, '华南': 2 }
            },
            weights: {
                enrollmentWeight: 0.35,
                startEfficiencyWeight: 0.25,
                complianceWeight: 0.25,
                historyWeight: 0.15
            },
            institutions: [],
            alternatives: []
        };
        addScheme(newScheme);
        setIsModalOpen(false);
        form.resetFields();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'green';
            case 'locked': return 'red';
            default: return 'blue';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return language === 'zh' ? '已确认' : 'Confirmed';
            case 'locked': return language === 'zh' ? '已锁定' : 'Locked';
            default: return language === 'zh' ? '草稿' : 'Draft';
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileTextOutlined style={{ fontSize: 18, color: '#1677ff' }} />
            <Select
                value={currentScheme?.id}
                onChange={handleChange}
                style={{ width: 280 }}
                dropdownStyle={{ padding: 8 }}
            >
                {schemes.map(scheme => (
                    <Select.Option key={scheme.id} value={scheme.id}>
                        <Space>
                            <span>{scheme.name}</span>
                            <Tag color={getStatusColor(scheme.status)} style={{ margin: 0 }}>
                                {getStatusText(scheme.status)}
                            </Tag>
                        </Space>
                    </Select.Option>
                ))}
            </Select>

            <Tooltip title={language === 'zh' ? "新建方案" : "New Scheme"}>
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                />
            </Tooltip>

            <Tooltip title={language === 'zh' ? "方案管理" : "Scheme Management"}>
                <Button
                    type="text"
                    icon={<SettingOutlined />}
                />
            </Tooltip>

            <Modal
                title={language === 'zh' ? "新建选址方案" : "New Selection Scheme"}
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
                okText={language === 'zh' ? "创建" : "Create"}
                cancelText={language === 'zh' ? "取消" : "Cancel"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label={language === 'zh' ? "方案名称" : "Scheme Name"}
                        rules={[{ required: true, message: language === 'zh' ? '请输入方案名称' : 'Please input scheme name' }]}
                    >
                        <Input placeholder={language === 'zh' ? "例如：华东区 NSCLC III 期选址方案 v1" : "e.g., East China NSCLC Phase III Scheme v1"} />
                    </Form.Item>
                    <Form.Item
                        name="template"
                        label={language === 'zh' ? "使用模板" : "Use Template"}
                    >
                        <Select placeholder={language === 'zh' ? "选择模板（可选）" : "Select template (optional)"}>
                            <Select.Option value="tumor">{language === 'zh' ? '肿瘤项目选址方案（标准版）' : 'Oncology Standard'}</Select.Option>
                            <Select.Option value="medical">{language === 'zh' ? '医疗器械项目选址方案' : 'Medical Device Standard'}</Select.Option>
                            <Select.Option value="rare">{language === 'zh' ? '罕见病项目选址方案' : 'Rare Disease Standard'}</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SchemeSelector;
