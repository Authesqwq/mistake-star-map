# 错题星图

> AI 错题复练与知识点掌握系统

通过 AI 错因归纳、知识点图鉴、今日三题和掌握度更新，将错题从静态收藏转化为复练任务。

## 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Node.js + Express + TypeScript
- **包管理**: npm
- **LLM 兼容**: OpenAI-compatible API（预留，本 PR 不调用）

## 当前 PR 完成内容（PR1: Monorepo 初始化与运行脚本）

- 前端工程初始化（React + Vite + TypeScript）
- 后端工程初始化（Express + TypeScript）
- 根目录统一管理脚本（install、dev、build）
- 健康检查接口 `GET /api/health`
- 前端展示后端连接状态
- LLM 配置能力预留（不实际调用大模型）

### 本 PR 不包含

- 真实大模型调用
- 错题录入 / 错因归因 / 知识点图鉴 / 今日三题 / 复练页面
- 数据库
- 复杂 UI 框架

## 目录结构

```
mistake-star-map/
├── client/                    # 前端工程
│   ├── src/
│   │   ├── App.tsx            # 主页面组件
│   │   ├── main.tsx           # React 入口
│   │   └── styles/
│   │       └── global.css     # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                    # 后端工程
│   ├── src/
│   │   ├── index.ts           # Express 入口
│   │   ├── config/
│   │   │   └── env.ts         # 环境变量配置
│   │   ├── routes/
│   │   │   └── health.ts      # 健康检查路由
│   │   └── middleware/
│   │       └── errorHandler.ts # 错误处理中间件
│   ├── package.json
│   └── tsconfig.json
├── .env.example               # 环境变量示例
├── .gitignore
├── package.json               # 根目录脚本
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
- 后续 PR 将接入 LLM Provider、Prompt 管理、AI 错因归因接口
