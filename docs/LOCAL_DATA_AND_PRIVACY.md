# 本地数据与隐私说明

## localStorage Keys

| Key | 内容 | 最多条数 |
|-----|------|----------|
| `mistake-star-map.confirmed-diagnoses` | 确认的 AI 归因结果 | 50 |
| `mistake-star-map.practice-results` | 复练答题记录 | 100 |
| `mistake-star-map.mastery-snapshots` | 掌握度快照 | - |
| `mistake-star-map.achievement-records` | 解锁的成就记录 | - |
| `mistake-star-map.motivation-profile` | 激励画像 | 1 |
| `mistake-star-map.learning-reports` | 学习报告快照 | 10 |
| `mistake-star-map.analytics-events` | 埋点事件 | 1000 |
| `mistake-star-map.analytics-session` | 埋点会话 | 1 |

## 存什么

- 知识点 ID、错因标签 ID
- 状态字段、数量型摘要
- 掌握度数值
- 事件类型、页面名称、时间戳
- 置信度、正确率等聚合指标

## 不存什么

- API Key
- 完整题目文本（analytics 中）
- 学生完整答案（analytics 中）
- 参考答案全文（analytics 中）
- raw LLM response
- .env 内容
- 个人隐私信息
- 后端错误堆栈

## 敏感字段过滤

analyticsTracker 自动过滤 14 个敏感 key 模式:
question, wrongAnswer, correctAnswer, userAnswer, expectedAnswer,
raw, rawResponse, apiKey, authorization, token, password, secret, stack

## 清空数据

各页面提供清空入口，均需二次确认:
- 错题录入页不清空数据
- 知识点图鉴可清空本地确认记录
- 复练页可清空本地复练记录
- 成就中心可清空成就数据
- 学习报告可清空报告快照
- 指标看板可清空埋点事件

清空某类数据不影响其他类别。

## API Key 安全

- API Key 仅放在 server 侧 .env
- .env 不提交到 Git
- 前端不读取 LLM_API_KEY
- 后端响应不返回 API Key
- 日志不打印 API Key
- 评测报告不包含 API Key
- 导出 JSON 不包含 API Key

## .env

`.env.example` 包含空模板，不包含真实密钥。
