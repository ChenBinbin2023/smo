import { useState } from 'react'
import { Layout, Menu, theme, Button, Space, Avatar, Badge, Tooltip } from 'antd'
import {
    SearchOutlined,
    CompassOutlined,
    BarChartOutlined,
    HistoryOutlined,
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    MessageOutlined,
    ContainerOutlined,
    AppstoreOutlined,
    BulbOutlined,
    AuditOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons'
import Home from './pages/Home'
import IntelligentSelection from './pages/IntelligentSelection'
import IntelligentQuery from './pages/IntelligentQuery'
import RegulatoryReview from './pages/RegulatoryReview'
import DataCenter from './pages/DataCenter'
import AnalysisCenter from './pages/AnalysisCenter'
import PlanCenter from './pages/PlanCenter'

const { Header, Content } = Layout

const App = () => {
    const [activeTab, setActiveTab] = useState('query')
    const {
        token: { borderRadiusLG },
    } = theme.useToken()

    const menuItems = [
        { key: 'query', icon: <BulbOutlined />, label: '智能查询' },
        { key: 'selection', icon: <SearchOutlined />, label: '中心选择' },
        { key: 'regulation', icon: <AuditOutlined />, label: '法规审查' },
        { key: 'plan', icon: <DeploymentUnitOutlined />, label: '方案生成' },
        { key: 'home', icon: <CompassOutlined />, label: '工作台' },
        { key: 'data', icon: <ContainerOutlined />, label: '数据中心' },
        { key: 'analysis', icon: <BarChartOutlined />, label: '分析中心' },
        { key: 'history', icon: <HistoryOutlined />, label: '历史选址' },
        { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Home />
            case 'plan': return <PlanCenter />
            case 'selection': return <IntelligentSelection />
            case 'query': return <IntelligentQuery />
            case 'regulation': return <RegulatoryReview />
            case 'data': return <DataCenter />
            case 'analysis': return <AnalysisCenter />
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
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1f1f1f' }}>SMO Pro</span>
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
                    <Tooltip title="全局搜索">
                        <Button type="text" icon={<SearchOutlined />} />
                    </Tooltip>
                    <Tooltip title="消息通知">
                        <Badge count={5} size="small">
                            <Button type="text" icon={<BellOutlined />} />
                        </Badge>
                    </Tooltip>
                    <Tooltip title="在线帮助">
                        <Button type="text" icon={<MessageOutlined />} />
                    </Tooltip>
                    <div style={{ width: 1, height: 24, background: '#f0f0f0' }} />
                    <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} size="small" />
                        <span style={{ fontWeight: 500, color: '#333' }}>管理员</span>
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

export default App
