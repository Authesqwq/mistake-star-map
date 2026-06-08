# PR 路线总结

| PR | 标题 | 做了什么 | 不做什么 |
|----|------|----------|----------|
| 1 | Monorepo 初始化 | 前后端工程、运行脚本、/api/health | 业务功能 |
| 2 | 数据模型与 Mock 数据 | 类型定义、Mock 数据、基础 selector | 真实 API |
| 3 | 后端 API 基础设施 | 统一响应、日志、错误处理、Mock API | 真实 LLM |
| 4 | LLM Provider 适配层 | OpenAI-compatible 调用、超时、重试 | 业务 Prompt |
| 5 | Prompt 工程与 Schema | Prompt 构造、Zod Schema、解析器 | /api/diagnose |
| 6 | AI 错因归因接口 | /api/diagnose、fallback、metrics | 业务页面 |
| 7 | 前端布局与视觉系统 | AppShell、UI 组件、API Client | 业务页面 |
| 8 | 今日修复中心 | 首页仪表板、今日三题、图鉴进度 | 推荐/复练 |
| 9 | 错题录入与 AI 归因联调 | 表单、候选选择、归因调用、校正确认 | 真实持久化 |
| 10 | 知识点图鉴 | 知识点卡片、筛选、详情、本地记录聚合 | 掌握度更新 |
| 11 | 今日三题推荐服务 | 规则优先级评分算法、推荐 API | 复练答题 |
| 12 | 复练页面与答题反馈 | 规则判题、反馈、本地复练结果保存 | 掌握度更新 |
| 13 | 掌握度更新闭环 | 本地派生掌握度、显示状态联动 | 成就系统 |
| 14 | 成就与正向激励系统 | 19 成就、修复值、连续修复日 | 排行榜 |
| 15 | 学习报告页 | 聚合报告、Markdown 摘要、JSON 导出 | PDF |
| 16 | 评测与回归测试 | 30 条 eval case、fixture/fallback/live 模式 | 修改 /api/diagnose |
| 17 | 数据埋点与指标看板 | 本地埋点、指标聚合、看板 | 真实埋点 SDK |
| 18 | 最终收尾与文档 | README、docs、final-check、UI polish | 新功能 |

每个 PR 独立分支，可独立 review。从 PR1 到 PR18 逐步构建完整产品。
