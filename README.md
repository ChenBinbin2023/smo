# SMO Pro - 临床试验智能决策平台 (Clinical Intelligence Platform)

SMO Pro 是一个下一代临床研究决策支持系统。通过深度整合医疗临床本体（Ontology）、AI 推理引擎与多维大数据分析，旨在为药企和 CRO 提供从“智能问询”到“方案决策”的端到端选址与风险评估体验。

## 🌟 核心功能

- **🤖 智能分析问讯 (Intelligent Query)**：
  - **CUI 驱动交互**：支持自然语言输入查询需求，系统自动解析本体意图。
  - **AI 推理透明化**：动态展示 AI 的“思考过程”（思维链），包括谓词逻辑转换、本体过滤、图引擎聚合等步骤。
  - **决策支持报告**：生成包含历史周期对标、PI 战绩分析、筛选失败原因挖掘及 AI 战略建议的深度报告。
- **📊 多维中心决策 (Site Selection)**：利用可视化技术（热力图、倾向性分布图）多维度对比中心能力。
- **📈 相似案例对标**：跨项目提取同类靶点（如 ALK/ROS1）的历史执行数据，建立精准的基准线。
- **🎨 极致交互设计**：采用 Glassmorphism 现代美学，支持平滑动效与深度 Drawer 详情展示。

## 🧠 AI 仿真逻辑

系统采用 **“本体驱动型 AI (Ontology-Driven AI)”** 模拟逻辑：
1. **意图解析**：将自然语言转换为谓词逻辑节点。
2. **逻辑规划**：在医学本体图谱中规划查询路径（Planning Phase）。
3. **动态模拟**：实时展示推理步骤的“执行进度”，模拟图引擎在万亿级节点中的聚合过程。
4. **决策生成**：基于历史样本量、质量合规性与执行速度的平衡模型（Weighted Model）输出报告。

## 🛠️ 技术栈

- **前端核心**: React 18, TypeScript, Vite
- **UI & 动效**: Ant Design 5 (定制化主题), Framer Motion, Tailwind CSS
- **可视化**: Apache ECharts, ReactECharts
- **工具链**: Lucide React Icons, Ant Design Icons

## 📂 项目结构

```bash
├── frontend/               # 前端工程
│   ├── src/
│   │   ├── pages/
│   │   │   ├── IntelligentQuery.tsx   # 智能问询模块 (CUI & AI 模拟中心)
│   │   │   ├── CenterChoice.tsx       # 中心选址决策中心
│   │   │   └── ...
│   │   ├── components/     # UI 核心组件
│   │   ├── context/        # 决策主题与全局状态
│   └── public/             # 静态资源与 Mock 资产
├── docs/                   # 需求文档与行业本体分析
└── README.md
```

## 🚀 快速开始

```bash
# 进入前端
cd frontend

# 安装依赖
npm install

# 本地开发
npm run dev
```

---

© 2026 SMO Pro Team. 让临床试验选址告别经验主义。
