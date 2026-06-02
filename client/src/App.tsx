import { useEffect, useState } from 'react'
import { mockStudent } from './data/mockStudent'
import { getKnowledgeAtlasProgress, getTodayPracticeTasks } from './utils/mockSelectors'

interface HealthData {
  status: string
  service: string
  version: string
  environment: string
  llmConfigured: boolean
  llmProvider?: {
    configured: boolean
    modelConfigured: boolean
    baseUrlConfigured: boolean
  }
  uptime: number
}

interface MockSummary {
  studentCount: number
  subjectCount: number
  chapterCount: number
  knowledgePointCount: number
  mistakeCount: number
  errorTagCount: number
  practiceTaskCount: number
  achievementCount: number
}

interface LlmStatus {
  configured: boolean
  modelConfigured: boolean
  baseUrlConfigured: boolean
  apiKeyConfigured: boolean
  model: string
  timeoutMs: number
  maxRetries: number
}

function App() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<MockSummary | null>(null)
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setHealth(json.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })

    fetch('/api/mock/summary')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => setSummary(json.data))
      .catch(() => {})

    fetch('/api/llm/status')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => setLlmStatus(json.data))
      .catch(() => {})
  }, [])

  const atlas = getKnowledgeAtlasProgress()
  const todayTasks = getTodayPracticeTasks()

  return (
    <div className="container">
      <header>
        <h1>错题星图</h1>
        <p className="subtitle">AI 错题复练与知识点掌握系统</p>
      </header>

      <main>
        <section className="intro">
          <p>
            通过 AI
            错因归纳、知识点图鉴、今日三题和掌握度更新，将错题从静态收藏转化为复练任务。
          </p>
        </section>

        <section className="status-card">
          <h2>后端状态</h2>
          {loading && <p className="status loading">检测中...</p>}
          {error && <p className="status error">连接失败: {error}</p>}
          {health && (
            <div className="status ok">
              <p className="status-icon">连接正常</p>
              <dl>
                <dt>服务</dt>
                <dd>{health.service}</dd>
                <dt>版本</dt>
                <dd>{health.version}</dd>
                <dt>环境</dt>
                <dd>{health.environment}</dd>
                <dt>运行时间</dt>
                <dd>{health.uptime}s</dd>
                <dt>LLM 已配置</dt>
                <dd>{health.llmConfigured ? '是' : '否'}</dd>
              </dl>
            </div>
          )}
        </section>

        {llmStatus && (
          <section className="status-card">
            <h2>LLM 配置状态</h2>
            <dl>
              <dt>LLM Configured</dt>
              <dd>{llmStatus.configured ? 'Yes' : 'No'}</dd>
              <dt>Model configured</dt>
              <dd>{llmStatus.modelConfigured ? 'Yes' : 'No'}</dd>
              <dt>Base URL configured</dt>
              <dd>{llmStatus.baseUrlConfigured ? 'Yes' : 'No'}</dd>
              <dt>Timeout</dt>
              <dd>{llmStatus.timeoutMs}ms</dd>
              <dt>Max retries</dt>
              <dd>{llmStatus.maxRetries}</dd>
            </dl>
          </section>
        )}

        {summary && (
          <section className="status-card">
            <h2>Mock 数据总览（来自后端 API）</h2>
            <dl>
              <dt>知识点数量</dt>
              <dd>{summary.knowledgePointCount}</dd>
              <dt>错题数量</dt>
              <dd>{summary.mistakeCount}</dd>
              <dt>今日三题数量</dt>
              <dd>{summary.practiceTaskCount}</dd>
              <dt>成就数量</dt>
              <dd>{summary.achievementCount}</dd>
            </dl>
          </section>
        )}

        <section className="status-card">
          <h2>当前学生</h2>
          <dl>
            <dt>姓名</dt>
            <dd>{mockStudent.name}</dd>
            <dt>年级</dt>
            <dd>{mockStudent.grade}</dd>
            <dt>连续修复</dt>
            <dd>{mockStudent.streakDays} 天</dd>
            <dt>错题总数</dt>
            <dd>{mockStudent.totalMistakes}</dd>
          </dl>
        </section>

        <section className="status-card">
          <h2>知识点图鉴进度</h2>
          <dl>
            <dt>总计</dt>
            <dd>{atlas.total}</dd>
            <dt>已发现</dt>
            <dd>{atlas.discovered}</dd>
            <dt>待修复</dt>
            <dd>{atlas.toRepair}</dd>
            <dt>修复中</dt>
            <dd>{atlas.repairing}</dd>
            <dt>已掌握</dt>
            <dd>{atlas.mastered}</dd>
          </dl>
        </section>

        <section className="status-card">
          <h2>今日三题</h2>
          <p>待完成: {todayTasks.length} 题</p>
          {todayTasks.length > 0 && (
            <ul>
              {todayTasks.map((t) => (
                <li key={t.id}>
                  <strong>{t.title}</strong> — 优先级 {t.priorityScore}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer>
        <p>错题星图 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
