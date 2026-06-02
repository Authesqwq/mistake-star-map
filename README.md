# 错题星图

> AI 错题复练与知识点掌握系统

通过 AI 错因归纳、知识点图鉴、今日三题和掌握度更新，将错题从静态收藏转化为复练任务。

## 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Node.js + Express + TypeScript
- **包管理**: npm
- **LLM 兼容**: OpenAI-compatible API（预留，本 PR 不调用）

## PR 完成内容

### PR1: Monorepo 初始化与运行脚本

- 前端工程初始化（React + Vite + TypeScript）
- 后端工程初始化（Express + TypeScript）
- 根目录统一管理脚本（install、dev、build）
- 健康检查接口 `GET /api/health`
- 前端展示后端连接状态
- LLM 配置能力预留（不实际调用大模型）

### PR2: 数据模型与 Mock 数据

- 核心 TypeScript 类型定义（`client/src/types/domain.ts`）
- Mock 知识点树：数学学科 × 3 章节 × 11 个知识点
- Mock 错因标签体系：7 类错因
- Mock 错题数据：10 条，覆盖 3 个章节
- Mock AI 归因结果：10 条，含置信度与复练建议
- Mock 今日三题：3 条复练任务
- Mock 成就数据：7 个成就
- Mock 周报数据：1 份周报
- 基础数据查询工具函数（`client/src/utils/mockSelectors.ts`）
- 前端轻量更新，展示 Mock 数据统计
- 后端类型文件与精简 Mock 数据（`server/src/types/domain.ts`、`server/src/data/mockData.ts`）

#### Mock 数据覆盖

| 数据类别 | 数量 | 覆盖范围 |
|----------|------|----------|
| 知识点 | 11 | 一次函数(4)、分式方程(3)、全等三角形(4) |
| 错因标签 | 7 | 计算、概念、逻辑、审题、迁移、表达、公式 |
| 错题 | 10 | 3 章节 × 3 难度级别 |
| AI 归因 | 10 | 含 2 条低置信度需人工复核 |
| 今日三题 | 3 | 核心修复 / 同类巩固 / 间隔复查 |
| 成就 | 7 | 探索 / 复练 / 日常 / 突破 / 毅力 |
| 周报 | 1 | 含掌握度变化与下周建议 |

### 当前不包含

- 真实大模型调用
- 错题录入 / 错因归因 / 知识点图鉴 / 今日三题 / 复练页面
- 数据库
- 复杂 UI 框架

> **类型同步说明**: MVP 阶段以前端 mock 数据为主，前后端类型文件手动保持一致。后续 PR 接入 API 后将统一迁移为共享类型包。

## 目录结构

```
mistake-star-map/
├── client/                         # 前端工程
│   ├── src/
│   │   ├── types/
│   │   │   └── domain.ts           # 核心类型定义
│   │   ├── data/
│   │   │   ├── mockStudent.ts      # 学生数据
│   │   │   ├── mockKnowledge.ts    # 知识点树
│   │   │   ├── mockErrorTags.ts    # 错因标签
│   │   │   ├── mockMistakes.ts     # 错题数据
│   │   │   ├── mockDiagnosis.ts    # AI 归因结果
│   │   │   ├── mockPracticeTasks.ts # 复练任务
│   │   │   ├── mockAchievements.ts # 成就数据
│   │   │   ├── mockWeeklyReport.ts # 周报数据
│   │   │   └── index.ts            # 数据导出索引
│   │   ├── utils/
│   │   │   └── mockSelectors.ts    # 数据查询工具
│   │   ├── App.tsx                 # 主页面组件
│   │   ├── main.tsx                # React 入口
│   │   └── styles/
│   │       └── global.css          # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                         # 后端工程
│   ├── src/
│   │   ├── types/
│   │   │   └── domain.ts           # 后端类型定义
│   │   ├── data/
│   │   │   └── mockData.ts         # 后端 Mock 数据
│   │   ├── index.ts                # Express 入口
│   │   ├── config/
│   │   │   └── env.ts              # 环境变量配置
│   │   ├── routes/
│   │   │   └── health.ts           # 健康检查路由
│   │   └── middleware/
│   │       └── errorHandler.ts     # 错误处理中间件
│   ├── package.json
│   └── tsconfig.json
├── .env.example                    # 环境变量示例
├── .gitignore
├── package.json                    # 根目录脚本
└── README.md
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 后端服务端口 | `3001` |
| `LLM_API_KEY` | LLM API 密钥（空表示未配置） | - |
| `LLM_BASE_URL` | LLM API 地址 | `https://api.example.com/v1` |
| `LLM_MODEL` | 模型名称 | - |
| `LLM_TIMEOUT_MS` | LLM 请求超时（毫秒） | `8000` |

> **安全约定**: API Key 只允许放在 server 侧环境变量中，前端不可访问。使用 `.env.example` 作为模板，真实 `.env` 不提交到仓库。

## 本地运行

```bash
# 1. 进入项目目录
cd mistake-star-map

# 2. 安装所有依赖
npm run install:all

# 3. （可选）配置环境变量
cp .env.example .env
# 编辑 .env，填入 LLM_API_KEY 等（本阶段可不填）

# 4. 启动开发环境
npm run dev
```

- 前端: http://localhost:5173
- 后端: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run install:all` | 安装根目录、client、server 全部依赖 |
| `npm run dev` | 同时启动前端和后端开发服务器 |
| `npm run dev:client` | 仅启动前端 |
| `npm run dev:server` | 仅启动后端 |
| `npm run build` | 同时构建前端和后端 |
| `npm run build:client` | 仅构建前端 |
| `npm run build:server` | 仅构建后端 |

## 当前能力边界

- `/api/health` 是当前唯一可用的 API 端点
- `llmConfigured` 字段反映 `LLM_API_KEY` 环境变量是否已设置，不代表实际调用能力
- 所有业务数据来自前端 Mock，无需后端数据库
- 后续 PR 将接入 LLM Provider、Prompt 管理、AI 错因归因接口、后端 API、业务页面
