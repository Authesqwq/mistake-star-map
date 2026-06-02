# 错题星图

> AI 错题复练与知识点掌握系统

通过 AI 错因归纳、知识点图鉴、今日三题和掌握度更新，将错题从静态收藏转化为复练任务。

## 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Node.js + Express + TypeScript
- **包管理**: npm
- **LLM 兼容**: OpenAI-compatible API（预留，尚未接入）

## PR 完成内容

### PR1: Monorepo 初始化与运行脚本

- 前端工程初始化（React + Vite + TypeScript）
- 后端工程初始化（Express + TypeScript）
- 根目录统一管理脚本（install、dev、build）
- 健康检查接口 `GET /api/health`
- 前端展示后端连接状态
- LLM 配置能力预留

### PR2: 数据模型与 Mock 数据

- 核心 TypeScript 类型定义
- Mock 知识点树：数学学科 × 3 章节 × 11 个知识点
- Mock 错因标签体系：7 类错因
- Mock 错题数据：10 条，覆盖 3 个章节
- Mock AI 归因结果：10 条
- Mock 今日三题：3 条
- Mock 成就数据：7 个
- Mock 周报数据：1 份
- 前端 Mock 数据查询工具函数

### PR3: 后端 API 基础设施与 Mock 数据接口

- Express app 结构拆分（app.ts + index.ts）
- 统一 API 响应格式（`{ success, data/error, timestamp }`）
- 请求日志中间件
- 404 路由处理
- 增强的错误处理中间件（统一格式，dev 环境输出详细信息）
- 增强 `/api/health`（版本、环境、运行时间）
- 12 个只读 Mock API 端点
- Mock Data Service 层封装
- 前端通过 API 获取 Mock 数据总览
- 环境变量新增 `NODE_ENV`

### 当前不包含

- 真实大模型调用
- LLM Provider / Prompt
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
│   │   ├── data/                   # Mock 数据（8 个文件）
│   │   │   └── index.ts            # 数据导出索引
│   │   ├── utils/
│   │   │   └── mockSelectors.ts    # 数据查询工具
│   │   ├── App.tsx                 # 主页面
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
│   │   │   ├── domain.ts           # 后端类型定义
│   │   │   └── api.ts              # API 响应类型
│   │   ├── data/
│   │   │   └── mockData.ts         # 后端 Mock 数据
│   │   ├── config/
│   │   │   └── env.ts              # 环境变量配置
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts     # 错误处理中间件
│   │   │   ├── requestLogger.ts    # 请求日志中间件
│   │   │   └── notFoundHandler.ts  # 404 处理
│   │   ├── routes/
│   │   │   ├── health.ts           # 健康检查路由
│   │   │   └── mock.ts             # Mock 数据 API
│   │   ├── services/
│   │   │   └── mockDataService.ts  # Mock 数据服务层
│   │   ├── utils/
│   │   │   └── apiResponse.ts      # 统一响应工具
│   │   ├── app.ts                  # Express app 配置
│   │   └── index.ts                # 服务入口
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
| `NODE_ENV` | 运行环境 | `development` |
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

## API 列表

### 统一响应格式

成功响应：
```json
{ "success": true, "data": { ... }, "timestamp": "..." }
```

错误响应：
```json
{ "success": false, "error": { "code": "...", "message": "..." }, "timestamp": "..." }
```

### 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查（含版本、环境、运行时间、LLM 配置状态） |
| GET | `/api/mock/summary` | Mock 数据总览 |
| GET | `/api/mock/student` | 学生信息 |
| GET | `/api/mock/knowledge-points` | 知识点列表（可选 `?status=&chapterId=`） |
| GET | `/api/mock/knowledge-points/:id` | 单个知识点 |
| GET | `/api/mock/error-tags` | 错因标签列表 |
| GET | `/api/mock/mistakes` | 错题列表（可选 `?knowledgePointId=&errorTagId=&difficulty=`） |
| GET | `/api/mock/mistakes/:id` | 单条错题 |
| GET | `/api/mock/diagnosis/:mistakeId` | 错因归因结果 |
| GET | `/api/mock/practice-tasks/today` | 今日三题 |
| GET | `/api/mock/achievements` | 成就列表 |
| GET | `/api/mock/weekly-report` | 周报 |
| GET | `/api/mock/atlas-progress` | 知识点图鉴进度 |

### 示例

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/mock/summary
curl http://localhost:3001/api/mock/knowledge-points
curl http://localhost:3001/api/mock/knowledge-points?status=to_repair
curl http://localhost:3001/api/mock/mistakes?difficulty=hard
```

## 当前能力边界

- 后端提供 13 个 API 端点（1 个 health + 12 个 mock），均为只读
- `llmConfigured` 仅反映环境变量是否设置，不代表实际 LLM 调用能力
- 所有业务数据来自 Mock，无需数据库
- 后续 PR4 将接入 LLM Provider 适配层
