# SMO Pro 前端项目

本目录包含 SMO Pro 系统的 React 前端应用代码。

## 🏗️ 架构说明

### 状态管理
- 使用 **React Context (SchemeContext)** 管理选址方案（Selection Scheme）的生命周期。
- 支持多方案切换、进度跟踪（Step Navigation）以及实时的风险预测数据同步。

### 页面说明
- `Home.tsx` (工作台): 仪表盘界面，展示全平台趋势和个人任务概览。
- `IntelligentSelection.tsx` (中心选择): 核心交互页面，集成了 CUI（AI 对话）和 GUI（结构化表单）。
- `DataCenter.tsx` (数据中心): 机构名录与知识图谱入口。
- `AnalysisCenter.tsx` (分析中心): 提供雷达图、散点图等深度分析工具。

### 主要依赖
- **antd**: 提供完整且一致的 UI 组件。
- **framer-motion**: 负责页面切换动画及智能交互界面的微动效。
- **echarts-for-react**: 驱动所有数据可视化图表。
- **clsx & tailwind-merge**: 用于灵活、无冲突的 CSS 类名处理。

## 🛠️ 开发指南

### 本地开发
```bash
npm run dev
```
开发服务器默认运行在 [http://localhost:3000](http://localhost:3000)。

### 构建部署
```bash
npm run build
```
构建产物将输出在 `dist/` 目录下。

### 代码规范
- 请确保组件使用函数式组件 (FC) 编写。
- 业务逻辑复用建议抽象为 Hooks。
- 样式优先使用 Tailwind CSS 辅助类，复杂布局可使用模块化 CSS。
