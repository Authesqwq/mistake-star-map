# AI 能力边界

## LLM 负责什么

| 能力 | 说明 |
|------|------|
| 错因归因 | 根据题目、错误答案、正确答案判断错因 |
| 知识点识别 | 从候选知识点中选择最匹配的一个 |
| 错因标签选择 | 从候选错因标签中选择 1-3 个 |
| 置信度估计 | 输出 0-1 的置信度 |
| 复练类型建议 | original / same_type / variant / review |
| 推荐理由 | 用自然语言解释为什么推荐该复练类型 |

## LLM 不负责什么

| 能力 | 实际由什么负责 |
|------|----------------|
| 推荐排序 | 规则优先级算法 (PR11) |
| 判题 | 规则答案规范化与比对 (PR12) |
| 掌握度计算 | 本地规则派生 (PR13) |
| 成就触发 | 规则引擎 (PR14) |
| 报告生成 | 本地数据聚合 (PR15) |
| 指标采集 | 本地模拟埋点 (PR17) |

## Fallback 机制

当 LLM 不可用时，系统通过关键词匹配提供兜底诊断：

- 识别一次函数/分式方程/全等三角形等关键词
- 匹配粗心计算/概念模糊等常见错因
- 设置 needReview: true 和低置信度
- 不影响链路其他环节正常运行

## Prompt 输出 Schema

PR5 定义的结构化输出 Schema (Zod):

- knowledgePointId: 候选知识点 ID
- errorTags: 1-3 个候选错因标签
- confidence: 0-1
- explanation: ≤ 160 字的简短解释
- suggestedPracticeType: 枚举
- recommendationReason: ≤ 180 字
- needReview: boolean

## 安全约束

- 不输出羞辱、否定人格、焦虑诱导语言
- 不输出 Markdown 推理过程
- 不输出完整 raw response 到前端
- API Key 不进入前端代码或响应体

## 未实现能力

- 真实 OCR 识别
- 多学科支持（仅数学）
- 多模态（图片理解）
- 自定义 Prompt 模板
- 模型切换与对比
- Streaming 响应
- Function Calling / Tool Use

## 风险与应对

| 风险 | 应对 |
|------|------|
| LLM 不可用 | Fallback 兜底，系统不崩溃 |
| 输出格式异常 | Schema 校验失败 → Fallback |
| 候选校验失败 | 白名单校验失败 → Fallback |
| API Key 泄露 | 前端不读取、响应不返回、日志不打印 |
| 模型幻觉 | needReview 标记 + 用户可校正 |
