import React, { useState } from 'react';
import { Select, Button, Space, Modal, Form, Input, Tag, Typography, Tooltip } from 'antd';
import { PlusOutlined, SettingOutlined, CopyOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useScheme } from '../../context/SchemeContext';
import { SelectionScheme } from '../../types';
import { motion } from 'framer-motion';

const { Text } = Typography;

const SchemeSelector: React.FC = () => {
    const { currentScheme, schemes, setCurrentScheme, addScheme } = useScheme();
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
            name: values.name || '新建选址方案',
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
            case 'confirmed': return '已确认';
            case 'locked': return '已锁定';
            default: return '草稿';
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

            <Tooltip title="新建方案">
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                />
            </Tooltip>

            <Tooltip title="方案管理">
                <Button
                    type="text"
                    icon={<SettingOutlined />}
                />
            </Tooltip>

            <Modal
                title="新建选址方案"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
                okText="创建"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="方案名称"
                        rules={[{ required: true, message: '请输入方案名称' }]}
                    >
                        <Input placeholder="例如：华东区 NSCLC III 期选址方案 v1" />
                    </Form.Item>
                    <Form.Item
                        name="template"
                        label="使用模板"
                    >
                        <Select placeholder="选择模板（可选）">
                            <Select.Option value="tumor">肿瘤项目选址方案（标准版）</Select.Option>
                            <Select.Option value="medical">医疗器械项目选址方案</Select.Option>
                            <Select.Option value="rare">罕见病项目选址方案</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SchemeSelector;
