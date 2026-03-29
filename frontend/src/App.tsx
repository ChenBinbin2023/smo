import { useState } from 'react'
import { Layout, Menu, theme, Button, Space, Avatar, Badge, Tooltip, Switch, Dropdown } from 'antd'
import {
    SearchOutlined,
    CompassOutlined,
    UserOutlined,
    BellOutlined,
    MessageOutlined,
    AppstoreOutlined,
    BulbOutlined,
    AuditOutlined,
    DeploymentUnitOutlined,
    DownOutlined
} from '@ant-design/icons'
import Home from './pages/Home'
import IntelligentSelection from './pages/IntelligentSelection'
import IntelligentQuery from './pages/IntelligentQuery'
import RegulatoryReview from './pages/RegulatoryReview'
import PlanCenter from './pages/PlanCenter'
import { LanguageProvider, useLanguage } from './context/LanguageContext'

const { Header, Content } = Layout

const AppContent = () => {
    const [activeTab, setActiveTab] = useState('home')
    const {
        token: { borderRadiusLG },
    } = theme.useToken()
    const { language, setLanguage, t } = useLanguage();

    const menuItems = [
        { key: 'home', icon: <CompassOutlined />, label: t('workbench') },
        { key: 'selection', icon: <SearchOutlined />, label: t('siteSelection') },
    ]

    const helpMenuItems = [
        { key: 'query', icon: <BulbOutlined />, label: t('intelligentQuery') },
        { key: 'regulation', icon: <AuditOutlined />, label: t('regulatoryReview') },
        { key: 'plan', icon: <DeploymentUnitOutlined />, label: t('planCenter') },
    ]

    const handleHelpMenuClick = ({ key }: { key: string }) => {
        setActiveTab(key)
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Home />
            case 'plan': return <PlanCenter />
            case 'selection': return <IntelligentSelection />
            case 'query': return <IntelligentQuery />
            case 'regulation': return <RegulatoryReview />
            default: return <Home />
        }
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: '0 24px',
                height: 64
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 48,
                    minWidth: 120
                }}>
                    <AppstoreOutlined style={{ fontSize: 24, color: '#1677ff', marginRight: 12 }} />
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1f1f1f' }}>速研动力</span>
                </div>

                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[activeTab]}
                    items={menuItems.map(item => ({ ...item, onClick: () => setActiveTab(item.key) }))}
                    style={{
                        flex: 1,
                        borderBottom: 'none',
                        background: 'transparent',
                        fontSize: 15
                    }}
                />

                <Space size={20}>
                    <Space>
                        <span style={{ fontSize: 14, color: language === 'zh' ? '#1677ff' : '#666', fontWeight: language === 'zh' ? 'bold' : 'normal' }}>中</span>
                        <Switch
                            checked={language === 'en'}
                            onChange={(checked) => setLanguage(checked ? 'en' : 'zh')}
                            size="small"
                        />
                        <span style={{ fontSize: 14, color: language === 'en' ? '#1677ff' : '#666', fontWeight: language === 'en' ? 'bold' : 'normal' }}>En</span>
                    </Space>
                    <Tooltip title={t('globalSearch')}>
                        <Button type="text" icon={<SearchOutlined />} />
                    </Tooltip>
                    <Tooltip title={t('notifications')}>
                        <Badge count={5} size="small">
                            <Button type="text" icon={<BellOutlined />} />
                        </Badge>
                    </Tooltip>
                    <Dropdown
                        menu={{ items: helpMenuItems, onClick: handleHelpMenuClick }}
                        placement="bottomRight"
                    >
                        <Tooltip title={t('help')}>
                            <Button type="text" icon={<MessageOutlined />}>
                                <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} />
                            </Button>
                        </Tooltip>
                    </Dropdown>
                    <div style={{ width: 1, height: 24, background: '#f0f0f0' }} />
                    <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} size="small" />
                        <span style={{ fontWeight: 500, color: '#333' }}>{t('admin')}</span>
                    </Space>
                </Space>
            </Header>

            <Content style={{
                padding: '24px 24px 0',
                maxWidth: 1600,
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 64px)'
            }}>
                <div style={{
                    background: 'transparent',
                    borderRadius: borderRadiusLG,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {renderContent()}
                </div>
            </Content>
        </Layout>
    )
}

const App = () => {
    return (
        <AppContent />
    )
}

export default App
