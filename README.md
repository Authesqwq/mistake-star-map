# 错题星图

AI 错题复练与知识点掌握系统

## 定位

错题星图面向中小学生错题复练场景，通过 AI 错因归因、知识点图鉴、今日三题、复练反馈、掌握度更新和成就激励，把静态错题本转化为可执行的学习闭环。

## 核心功能

| 模块 | 说明 |
|------|------|
| 今日修复中心 | 首页总览，学生状态、今日三题、图鉴进度、AI 状态 |
| 错题录入 | 手动填写或使用示例题，调用 AI 归因，支持用户校正 |
| 知识点图鉴 | 按章节展示知识点掌握度与风险，搜索与筛选 |
| 今日三题推荐 | 规则优先级推荐复练任务 |
| 复练答题 | 规则判题、低压力反馈 |
| 掌握度更新 | 本地派生掌握度与状态 |
| 成就激励 | 19 个成就、修复值、连续修复日 |
| 学习报告 | 聚合复练、错因、掌握度数据 |
| 指标看板 | 本地埋点事件与产品链路指标 |
| Prompt 回归评测 | 30 条评测 Case，fixture/fallback/live 模式 |

## 技术架构

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **LLM**: OpenAI-compatible Chat Completions API
- **Validation**: Zod
- **Storage**: localStorage (MVP demo state)
- **Eval**: fixture / fallback / optional live LLM

## 项目结构

```
mistake-star-map/
├── client/              # React + Vite + TypeScript
│   └── src/
│       ├── components/  # layout, ui, today, mistake, atlas, practice, achievement, mastery, report, metrics, dev
│       ├── pages/       # 8 个页面
│       ├── services/    # API Client
│       ├── types/       # 类型定义
│       └── utils/       # 工具函数
├── server/              # Express + TypeScript
│   └── src/
│       ├── config/      # 环境变量
│       ├── middleware/   # 日志、错误处理
│       ├── routes/      # health, mock, diagnose, llm, recommendations, practice, eval
│       ├── services/    # mockData, llm, diagnosis, recommendations, practice
│       ├── schemas/     # Zod 校验
│       ├── prompts/     # Prompt 构造与示例
│       ├── eval/        # 评测集、评分、报告
│       └── scripts/     # validateDiagnosisSchema, runDiagnosisEval
├── docs/                # 文档
├── scripts/             # final-check
└── server/eval-reports/ # 评测报告 (gitignored)
```

## 环境变量

```bash
PORT=3001
NODE_ENV=development
LLM_API_KEY=
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=
LLM_TIMEOUT_MS=8000
LLM_MAX_RETRIES=1
LLM_TEMPERATURE=0.2
```

- `.env` 不提交到 Git
- API Key 仅放在 server 侧环境变量
- 前端不读取 API Key
- 未配置 LLM 时系统通过 fallback 仍可演示

## 本地运行

```bash
npm run install:all
npm run build
npm run dev
```

- 前端: http://localhost:5173
- 后端: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

### 一键运行方式（Windows）

电脑需要提前安装 [Node.js LTS](https://nodejs.org/)，且 `.env` 不应提交到仓库。

**一键启动**：双击 `一键启动.bat`，自动安装依赖并启动前后端服务器，浏览器打开 http://localhost:5173。

**一键验收**：双击 `一键验收.bat`，依次执行 `install:all` → `build` → `eval:diagnosis` → `final-check`，全部通过后显示"验收通过"。

未配置 LLM 时 fallback 可用，归因接口会返回规则兜底结果、needReview 标记和中文提示，不影响演示体验。

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run install:all` | 安装全部依赖 |
| `npm run dev` | 同时启动前后端 |
| `npm run build` | 构建前后端 |
| `npm run eval:diagnosis` | 运行 fixture 评测（不调用 LLM） |
| `npm run eval:diagnosis:fallback` | 运行 fallback 评测（不调用 LLM） |
| `npm run eval:diagnosis:live` | 运行 live LLM 评测（需配置 LLM） |
| `npm run validate:diagnosis-schema` | 验证 Few-shot 示例 |
| `npm run final-check` | 最终静态检查 |

## 默认评测

默认 `npm run eval:diagnosis` 使用 fixture，不调用大模型。

`npm run eval:diagnosis:live` 会调用真实 LLM，只有配置好环境变量且接受成本时运行。

## AI 能力边界

- **AI 负责**: 错因归因、知识点识别、解释与推荐理由
- **规则负责**: 推荐排序、判题、掌握度计算、成就触发、报告生成
- **LLM 未配置时**: Fallback 关键词匹配兜底
- **不做**: 真实 OCR、多学科、数据库持久化、替代教师判断

详见 `docs/AI_CAPABILITY_BOUNDARY.md`

## 数据与隐私

- 所有业务数据存储在浏览器 localStorage
- 埋点不记录完整题目、答案、API Key、raw LLM
- 指标导出只包含聚合数据
- `.env` 不提交到仓库
- API Key 不进入前端代码或响应体

详见 `docs/LOCAL_DATA_AND_PRIVACY.md`

## 推荐演示路径

1. 进入今日修复中心 → 查看首页总览
2. 错题录入 → 使用示例题 → 运行 AI 归因
3. 校正并确认归因结果
4. 查看知识点图鉴 → 筛选与详情
5. 回到今日修复中心 → 开始复练
6. 提交答案 → 查看反馈与掌握度影响
7. 成就中心 → 查看修复值与成就
8. 学习报告 → 生成报告
9. 指标看板 → 查看链路指标
10. 开发联调 → 运行 fixture/fallback 评测

未配置 LLM 时以上路径仍可通过 fallback 走通。

## PR 路线

| PR | 内容 |
|----|------|
| PR1 | Monorepo 初始化与运行脚本 |
| PR2 | 数据模型与 Mock 数据 |
| PR3 | 后端 API 基础设施与 Mock API |
| PR4 | LLM Provider 适配层 |
| PR5 | Prompt 工程与 Diagnosis Schema |
| PR6 | AI 错因归因接口 /api/diagnose |
| PR7 | 前端布局与视觉系统 |
| PR8 | 今日修复中心首页 |
| PR9 | 错题录入与 AI 归因联调 |
| PR10 | 知识点图鉴页面 |
| PR11 | 今日三题推荐服务 |
| PR12 | 复练页面与答题反馈 |
| PR13 | 掌握度更新闭环 |
| PR14 | 成就与正向激励系统 |
| PR15 | 学习报告页 |
| PR16 | 评测集与 Prompt 回归测试 |
| PR17 | 数据埋点与指标看板 |
| PR18 | 最终收尾与文档完善 |

## 当前限制

- 无真实用户系统
- 无数据库（localStorage-only）
- 无真实 OCR
- 题库为 Mock 数据
- 掌握度为本地规则派生
- 指标为本地模拟数据
- Live LLM 评测需自行配置环境变量

## 文档

| 文档 | 说明 |
|------|------|
| `docs/PRODUCT_OVERVIEW.md` | 产品概述 |
| `docs/DEMO_GUIDE.md` | 演示指南 |
| `docs/AI_CAPABILITY_BOUNDARY.md` | AI 能力边界 |
| `docs/PROMPT_AND_EVAL.md` | Prompt 与评测说明 |
| `docs/LOCAL_DATA_AND_PRIVACY.md` | 本地数据与隐私 |
| `docs/PR_ROADMAP.md` | PR 路线总结 |
| `docs/FINAL_CHECKLIST.md` | 最终检查清单 |
