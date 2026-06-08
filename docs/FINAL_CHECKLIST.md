# 最终检查清单

## 构建与运行

- [ ] `npm run build` 通过
- [ ] `npm run dev` 前后端启动
- [ ] http://localhost:5173 可访问
- [ ] http://localhost:3001/api/health 返回 ok

## 评测

- [ ] `npm run eval:diagnosis` 通过 (fixture, 不调用 LLM)
- [ ] `npm run eval:diagnosis:fallback` 运行 (不调用 LLM)
- [ ] `npm run eval:diagnosis:live` 可选 (需配置 LLM)

## 最终检查

- [ ] `npm run final-check` 通过

## 安全

- [ ] 前端不读取 LLM_API_KEY
- [ ] 后端响应不返回 API Key
- [ ] .env 未提交
- [ ] 生成的 eval report 未提交
- [ ] localStorage 不存储完整题目/答案

## 文档

- [ ] README.md 完整
- [ ] docs/ 7 个文档完整
- [ ] .env.example 字段正确
- [ ] .gitignore 覆盖关键文件

## 演示路径

- [ ] 今日修复中心 → 错题录入 → AI 归因
- [ ] 校正确认 → 知识点图鉴
- [ ] 今日三题 → 复练答题 → 反馈
- [ ] 掌握度影响 → 成就中心
- [ ] 学习报告 → 指标看板
- [ ] 开发联调 → 运行评测

## GitHub

- [ ] PR1–PR18 全部已合并
- [ ] main 分支为最终代码
- [ ] 无多余分支未清理
