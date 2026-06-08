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

### PR4: LLM Provider 适配层

- OpenAI-compatible Chat Completions 客户端
- LLM 配置校验与安全降级
- 超时控制（基于 `LLM_TIMEOUT_MS`）
- 重试机制（可配置 `LLM_MAX_RETRIES`，仅对网络错误/5xx/超时重试）
- LLM 错误类型（配置错误、超时、Provider 错误、响应解析错误）
- `/api/llm/status` - LLM 配置状态查询
- `/api/llm/smoke-test` - 开发环境烟雾测试（不承载业务逻辑）
- 健康检查增强（llmProvider 字段）
- 前端展示 LLM 配置状态

### PR5: Prompt 工程与诊断 Schema

- 诊断 Prompt 构造器（system + user）
- Few-shot 诊断示例（4 个，覆盖一次函数/分式方程/全等三角形）
- Zod 结构化输出 Schema
- JSON 解析工具（支持直接 JSON / 代码块 / 夹杂文本）
- 候选知识点和错因标签白名单校验
- 本地 Schema 验证脚本 `npm run validate:diagnosis-schema`
- 不调用真实 LLM，不实现 `/api/diagnose`

### PR6: AI 错因归因接口

- `POST /api/diagnose` - 串联 PR4 LLM Client + PR5 Prompt/Schema
- `GET /api/diagnose/metrics` - 进程内指标
- LLM 可用时调用 chatCompletion → 解析 → 校验 → 返回 source=llm
- LLM 不可用/超时/解析失败/校验失败时自动 fallback
- Fallback 基于关键词匹配，返回 needReview: true + warnings
- 请求体 Zod 校验
- 候选知识点和错因标签白名单过滤
- 前端轻量联调按钮

### PR7: 前端布局与视觉系统

- AppShell 页面框架（Header + Sidebar + MainContent）
- CSS 设计变量 tokens（颜色、圆角、阴影、间距、字体）
- 通用 UI 组件（Button、Card、MetricCard、Badge、Tag、StatusDot、ProgressBar、LoadingState、ErrorState、EmptyState）
- 前端统一 API Client（requestJson + 类型化 helpers）
- 开发预览面板（ApiStatusPanel、MockSummaryPanel、DiagnosisSmokePanel）
- 响应式布局（移动端 Sidebar 堆叠展示）
- 重构 App.tsx 为开发预览视图

### PR8: 今日修复中心

- 正式首页「今日修复中心」
- WelcomeHero + StudentStatsGrid
- 今日三题任务列表（来自 `/api/mock/practice-tasks/today`）
- 知识点图鉴进度卡（来自 `/api/mock/atlas-progress`）
- 高风险知识点列表（前端计算，来自 `/api/mock/knowledge-points`）
- AI 归因能力状态卡（来自 `/api/llm/status`）
- 4 个后续学习入口卡（Coming soon，标注对应 PR）
- Sidebar 页面切换（今日修复中心 / 开发联调）
- 开发联调页保留 ApiStatusPanel、MockSummaryPanel、DiagnosisSmokePanel
- 首页不会自动调用 /api/diagnose

### PR12: 复练页面与答题反馈

- 复练任务页面（题目展示 + 答案输入 + 提交反馈）
- 首页"开始复练"进入复练页
- 后端 POST /api/practice/evaluate 规则判题
- GET /api/practice/metrics 进程内指标
- correct / incorrect / needs_review 三类判题结果
- 低压力反馈文案
- 复练结果保存到 localStorage（key: mistake-star-map.practice-results）
- 最近复练记录展示 + 清空确认
- Sidebar "复练任务"入口

### PR13: 掌握度更新闭环

- 本地掌握度计算规则（Mock 初始 + PR9 归因 + PR12 复练结果）
- MasterySnapshot localStorage 存储
- 复练提交后展示 MasteryImpactCard
- 知识点图鉴展示 currentMastery 和复练历史
- 首页图鉴进度和高风险知识点计入本地掌握度
- 推荐 API 接收 localMasterySignals 影响排序
- 掌握度变化记录（MasteryHistoryList）
- 本 PR 仅前端派生，不写入后端

### PR14: 成就与正向激励系统

- 成就规则引擎（19 个成就定义，5 个类别）
- 修复值 repairValue 计算（归因 +2、复练 +5、答对 +5、成就 +10~35）
- 连续修复日 streakDays 计算
- 成就 localStorage 持久化
- AchievementCenterPage 成就中心页面
- 复练完成后可触发成就反馈（AchievementToast）
- 首页展示 MotivationProfile（修复值、连续修复日、最近成就）
- 不做排行榜、不做抽奖、不做惩罚打卡
- 修复值只奖励有效学习行为

### PR15: 学习报告

- 本地学习报告生成（复练、错因、掌握度、成就统计聚合）
- 时间范围筛选（本周/近 7 天/近 30 天/全部）
- Markdown 摘要复制
- JSON 报告导出
- 报告快照 localStorage 存储
- 11 个报告组件
- Sidebar + QuickEntry "学习报告"入口
- 不调用大模型生成报告

### 当前不包含

### PR9: 错题录入与 AI 归因联调

- 错题录入页面（表单 + 候选选择器 + 示例题）
- 调用 POST /api/diagnose 获取 AI 归因
- 诊断结果展示（source、confidence、warnings、llm metadata）
- 用户校正知识点和错因标签
- 确认记录保存到 localStorage（key: `mistake-star-map.confirmed-diagnoses`）
- Sidebar 错题录入入口 + 首页 QuickEntry 跳转
- 未配置 LLM 时自动展示 fallback 结果
- 不写入后端数据库，不更新知识点图鉴

### PR12: 复练页面与答题反馈

- 复练任务页面（题目展示 + 答案输入 + 提交反馈）
- 首页"开始复练"进入复练页
- 后端 POST /api/practice/evaluate 规则判题
- GET /api/practice/metrics 进程内指标
- correct / incorrect / needs_review 三类判题结果
- 低压力反馈文案
- 复练结果保存到 localStorage（key: mistake-star-map.practice-results）
- 最近复练记录展示 + 清空确认
- Sidebar "复练任务"入口

### PR13: 掌握度更新闭环

- 本地掌握度计算规则（Mock 初始 + PR9 归因 + PR12 复练结果）
- MasterySnapshot localStorage 存储
- 复练提交后展示 MasteryImpactCard
- 知识点图鉴展示 currentMastery 和复练历史
- 首页图鉴进度和高风险知识点计入本地掌握度
- 推荐 API 接收 localMasterySignals 影响排序
- 掌握度变化记录（MasteryHistoryList）
- 本 PR 仅前端派生，不写入后端

### PR14: 成就与正向激励系统

- 成就规则引擎（19 个成就定义，5 个类别）
- 修复值 repairValue 计算（归因 +2、复练 +5、答对 +5、成就 +10~35）
- 连续修复日 streakDays 计算
- 成就 localStorage 持久化
- AchievementCenterPage 成就中心页面
- 复练完成后可触发成就反馈（AchievementToast）
- 首页展示 MotivationProfile（修复值、连续修复日、最近成就）
- 不做排行榜、不做抽奖、不做惩罚打卡
- 修复值只奖励有效学习行为

### PR15: 学习报告

- 本地学习报告生成（复练、错因、掌握度、成就统计聚合）
- 时间范围筛选（本周/近 7 天/近 30 天/全部）
- Markdown 摘要复制
- JSON 报告导出
- 报告快照 localStorage 存储
- 11 个报告组件
- Sidebar + QuickEntry "学习报告"入口
- 不调用大模型生成报告

### 当前不包含

### PR10: 知识点图鉴

- 知识点图鉴页面（按章节分组展示）
- Mock 知识点数据 + PR9 localStorage 确认记录聚合
- 章节筛选、状态筛选、风险筛选、关键词搜索、只看本地新增
- 知识点详情面板（关联错题、错因标签、本地确认记录、建议动作）
- 图鉴进度统计（总数、待修复、修复中、已掌握、本地记录数）
- 清空本地确认记录（二次确认）
- Sidebar "知识点图鉴" 入口 + 首页 QuickEntry 跳转

### PR11: 今日三题推荐服务

- 规则推荐优先级算法（错题频次 30% + 错因严重度 25% + 掌握度缺口 25% + 复查时间 20%）
- POST /api/recommendations/today - 生成今日推荐任务
- GET /api/recommendations/metrics - 进程内推荐指标
- 本地确认记录作为推荐信号参与排序
- 首页「今日三题」改为读取推荐 API
- 推荐失败时 fallback 到 Mock 今日三题
- AI 推荐理由已预留但默认不启用（useAiReason: false）
- 大模型不参与推荐排序
- 评分拆解展示（PriorityBreakdown）
- 推荐说明卡（RecommendationSummaryCard）

### PR12: 复练页面与答题反馈

- 复练任务页面（题目展示 + 答案输入 + 提交反馈）
- 首页"开始复练"进入复练页
- 后端 POST /api/practice/evaluate 规则判题
- GET /api/practice/metrics 进程内指标
- correct / incorrect / needs_review 三类判题结果
- 低压力反馈文案
- 复练结果保存到 localStorage（key: mistake-star-map.practice-results）
- 最近复练记录展示 + 清空确认
- Sidebar "复练任务"入口

### PR13: 掌握度更新闭环

- 本地掌握度计算规则（Mock 初始 + PR9 归因 + PR12 复练结果）
- MasterySnapshot localStorage 存储
- 复练提交后展示 MasteryImpactCard
- 知识点图鉴展示 currentMastery 和复练历史
- 首页图鉴进度和高风险知识点计入本地掌握度
- 推荐 API 接收 localMasterySignals 影响排序
- 掌握度变化记录（MasteryHistoryList）
- 本 PR 仅前端派生，不写入后端

### PR14: 成就与正向激励系统

- 成就规则引擎（19 个成就定义，5 个类别）
- 修复值 repairValue 计算（归因 +2、复练 +5、答对 +5、成就 +10~35）
- 连续修复日 streakDays 计算
- 成就 localStorage 持久化
- AchievementCenterPage 成就中心页面
- 复练完成后可触发成就反馈（AchievementToast）
- 首页展示 MotivationProfile（修复值、连续修复日、最近成就）
- 不做排行榜、不做抽奖、不做惩罚打卡
- 修复值只奖励有效学习行为

### PR15: 学习报告

- 本地学习报告生成（复练、错因、掌握度、成就统计聚合）
- 时间范围筛选（本周/近 7 天/近 30 天/全部）
- Markdown 摘要复制
- JSON 报告导出
- 报告快照 localStorage 存储
- 11 个报告组件
- Sidebar + QuickEntry "学习报告"入口
- 不调用大模型生成报告

### 当前不包含

- 复练答题页 / 掌握度真实更新 / 学习报告 / 成就系统
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
│   │   │   ├── mock.ts             # Mock 数据 API
│   │   │   └── llm.ts              # LLM 状态与烟雾测试
│   │   ├── services/
│   │   │   ├── mockDataService.ts  # Mock 数据服务层
│   │   │   ├── llm/                # LLM Provider 适配层
│   │   │   │   ├── llmTypes.ts     # LLM 类型定义
│   │   │   │   ├── llmErrors.ts    # LLM 错误类型
│   │   │   │   ├── llmConfig.ts    # 配置校验
│   │   │   │   ├── llmClient.ts    # 核心调用客户端
│   │   │   │   └── index.ts        # 导出索引
│   │   │   └── diagnosis/          # 诊断解析
│   │   │       ├── diagnosisTypes.ts
│   │   │       ├── diagnosisParser.ts
│   │   │       └── index.ts
│   │   ├── prompts/                # Prompt 工程
│   │   │   ├── promptTypes.ts
│   │   │   ├── diagnosisPrompt.ts
│   │   │   ├── diagnosisExamples.ts
│   │   │   └── index.ts
│   │   ├── schemas/                # 结构化输出 Schema
│   │   │   ├── diagnosisSchema.ts
│   │   │   ├── schemaValidation.ts
│   │   │   └── index.ts
│   │   ├── scripts/                # 本地验证脚本
│   │   │   └── validateDiagnosisSchema.ts
│   │   ├── utils/
│   │   │   ├── apiResponse.ts      # 统一响应工具
│   │   │   └── timeout.ts          # 超时控制工具
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
| `LLM_MAX_RETRIES` | LLM 请求重试次数 | `1` |
| `LLM_TEMPERATURE` | LLM 生成温度 | `0.2` |

> **安全约定**: API Key 只允许放在 server 侧环境变量中，前端不可访问。使用 `.env.example` 作为模板，真实 `.env` 不提交到仓库。前端不会读取或传递 API Key。

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
| `npm run validate:diagnosis-schema` | 验证诊断 Schema 与 Few-shot 示例 |

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
| GET | `/api/llm/status` | LLM 配置状态 |
| POST | `/api/llm/smoke-test` | LLM 烟雾测试（需配置 LLM 环境变量） |
| POST | `/api/diagnose` | AI 错因归因（未配置 LLM 时自动 fallback） |
| GET | `/api/diagnose/metrics` | 诊断接口调用指标 |

### 示例

```bash
# Health check
curl http://localhost:3001/api/health

# Mock APIs
curl http://localhost:3001/api/mock/summary
curl http://localhost:3001/api/mock/knowledge-points
curl http://localhost:3001/api/mock/knowledge-points?status=to_repair
curl http://localhost:3001/api/mock/mistakes?difficulty=hard

# LLM status
curl http://localhost:3001/api/llm/status
```

如果已配置 LLM 环境变量，可测试连接：

```bash
curl -X POST http://localhost:3001/api/llm/smoke-test \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，请用一句话回复：模型连接正常。"}'
```

Diagnosis (未配置 LLM 时自动 fallback):

```bash
curl -X POST http://localhost:3001/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"subjectId":"math","subjectName":"数学","grade":"八年级","question":"已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。","wrongAnswer":"随 x 增大而增大","correctAnswer":"随 x 增大而减小"}'
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/diagnose" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"subjectId":"math","subjectName":"数学","grade":"八年级","question":"已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。","wrongAnswer":"随 x 增大而增大","correctAnswer":"随 x 增大而减小"}'
```

LLM smoke test:

```bash
curl -X POST http://localhost:3001/api/llm/smoke-test \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，请用一句话回复：模型连接正常。"}'
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/llm/smoke-test" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"message":"你好，请用一句话回复：模型连接正常。"}'
```

## 当前能力边界

- 后端提供 15 个 API 端点（1 个 health + 12 个 mock + 2 个 llm）
- `llmConfigured` 仅反映环境变量是否设置，不代表实际 LLM 调用能力
- 未配置 LLM 时，smoke-test 返回 400 错误，系统安全降级
- 所有业务数据来自 Mock，无需数据库
- 后续 PR5 将实现 Prompt 模板与结构化输出 Schema
- 后续 PR6 将实现 /api/diagnose
