import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { SchemeProvider } from './context/SchemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                    fontFamily: 'Outfit, "PingFang SC", "Microsoft YaHei", sans-serif',
                },
                components: {
                    Card: {
                        paddingLG: 24,
                    },
                },
            }}
        >
            <SchemeProvider>
                <App />
            </SchemeProvider>
        </ConfigProvider>
    </React.StrictMode>,
)
