# 错题星图 — 演示指南

## 启动项目

```bash
cd mistake-star-map
npm run install:all
npm run build
npm run dev
```

访问:
- 前端: http://localhost:5173
- 后端: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

## 推荐演示路径

### 1. 今日修复中心 (默认首页)

进入 http://localhost:5173，默认展示今日修复中心。

查看: 学生概况、图鉴进度、高风险知识点、AI 状态、今日三题任务。

### 2. 错题录入

点击 Sidebar "错题录入" 或首页 "录入新错题"。

点击示例题按钮自动填入表单，或手动填写题目信息。

### 3. AI 归因

点击 "开始 AI 归因"。

未配置 LLM 时展示 fallback 结果（source: fallback）。
配置 LLM 后展示 AI 结果（source: llm）。

查看归因结果：知识点、错因标签、置信度、复练建议。

### 4. 校正与确认

在 "校正归因结果" 面板中可修改知识点和错因标签。

点击 "确认归因结果"，保存到 localStorage。

### 5. 知识点图鉴

点击 Sidebar "知识点图鉴" 或首页 "查看知识点图鉴"。

查看按章节分组的知识点卡片。

使用筛选器：关键词搜索、章节筛选、状态筛选、风险筛选、只看本地新增。

点击知识点卡片查看详情：Mock 错题、本地确认记录、掌握度变化。

### 6. 今日三题与复练

回到今日修复中心，查看今日推荐的三道复练任务。

点击 "开始复练" 进入复练页面。

阅读题目，可选查看参考答案。

输入答案，点击 "提交答案"。

查看反馈：正确/错误/需确认，低压力文案。

查看掌握度影响卡片：初始掌握度 → 当前掌握度。

### 7. 成就中心

点击 Sidebar "成就中心" 或首页 "成就中心"。

查看修复值、连续修复日、19 个成就进度。

### 8. 学习报告

点击 Sidebar "学习报告" 或首页 "查看学习报告"。

切换时间范围（本周/近 7 天/近 30 天/全部）。

查看复练概况、错因分布、掌握度提升、高风险知识点、下周建议。

复制 Markdown 摘要、导出 JSON 报告。

### 9. 指标看板

点击 Sidebar "指标看板"。

查看产品使用、链路漏斗、AI 归因、推荐、复练、图鉴、成就、报告指标。

查看事件日志和本地数据健康状态。

导出指标 JSON。

### 10. 开发联调与评测

点击 Sidebar "开发联调"。

查看 API 状态、Mock 数据总览。

点击 "运行 fixture 评测" 验证 Prompt/Schema 回归测试。

## 未配置 LLM 的 Fallback 演示

以上路径完全可以在未配置 LLM 时走通：

- /api/diagnose 返回 fallback 结果
- 推荐服务使用规则推荐
- 判题使用规则判题
- 评测默认使用 fixture

## 配置 LLM 后

在 server/.env 中配置:

```
LLM_API_KEY=your_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

重启后端后，归因接口将调用真实 LLM。

live 评测:

```bash
npm run eval:diagnosis:live
```

注意: live eval 会逐条调用 LLM，可能产生费用。
