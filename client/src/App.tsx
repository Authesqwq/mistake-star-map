import { useEffect, useState } from 'react'
import { mockStudent } from './data/mockStudent'
import { getKnowledgeAtlasProgress, getTodayPracticeTasks } from './utils/mockSelectors'

interface HealthData {
  status: string
  service: string
  version: string
  environment: string
  llmConfigured: boolean
  llmProvider?: { configured: boolean; modelConfigured: boolean; baseUrlConfigured: boolean }
  uptime: number
}

interface MockSummary {
  studentCount: number; subjectCount: number; chapterCount: number
  knowledgePointCount: number; mistakeCount: number; errorTagCount: number
  practiceTaskCount: number; achievementCount: number
}

interface LlmStatus {
  configured: boolean; modelConfigured: boolean; baseUrlConfigured: boolean
  apiKeyConfigured: boolean; model: string; timeoutMs: number; maxRetries: number
}

interface DiagnoseResult {
  knowledgePointId: string; knowledgePointName: string
  errorTags: { id: string; name: string; severity: number }[]
  confidence: number; explanation: string
  suggestedPracticeType: string; recommendationReason: string
  needReview: boolean; source: string
  llm: { used: boolean; model?: string; latencyMs: number }
  warnings: string[]
}

const testQuestion = {
  subjectId: 'math' as const,
  subjectName: '数学',
  grade: '八年级',
  question: '已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。',
  wrongAnswer: '随 x 增大而增大',
  correctAnswer: '随 x 增大而减小',
}

function App() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<MockSummary | null>(null)
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null)

  // Diagnosis test state
  const [diagResult, setDiagResult] = useState<DiagnoseResult | null>(null)
  const [diagLoading, setDiagLoading] = useState(false)
  const [diagError, setDiagError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { setHealth(j.data); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })

    fetch('/api/mock/summary')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error()))
      .then((j) => setSummary(j.data))
      .catch(() => {})

    fetch('/api/llm/status')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error()))
      .then((j) => setLlmStatus(j.data))
      .catch(() => {})
  }, [])

  const runDiagnosis = () => {
    setDiagLoading(true)
    setDiagError(null)
    setDiagResult(null)
    fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testQuestion),
    })
      .then((r) => r.ok ? r.json() : r.json().then((j: unknown) => Promise.reject(j)))
      .then((j) => { setDiagResult(j.data); setDiagLoading(false) })
      .catch((e) => {
        setDiagError(typeof e === 'object' && e !== null && 'error' in e
          ? (e as Record<string, unknown>).error as string
          : 'Request failed')
        setDiagLoading(false)
      })
  }

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
            通过 AI 错因归纳、知识点图鉴、今日三题和掌握度更新，将错题从静态收藏转化为复练任务。
          </p>
        </section>

        {/* ── Diagnosis Test ── */}
        <section className="status-card">
          <h2>AI 归因接口联调</h2>
          <p style={{ marginBottom: 12, fontSize: '0.9rem', color: '#888' }}>
            预置题目：已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。
          </p>
          <button onClick={runDiagnosis} disabled={diagLoading} className="btn-diag">
            {diagLoading ? '诊断中...' : '调用 /api/diagnose'}
          </button>

          {diagLoading && <p className="status loading" style={{ marginTop: 12 }}>诊断中...</p>}
          {diagError && (
            <p className="status error" style={{ marginTop: 12 }}>
              错误: {JSON.stringify(diagError)}
            </p>
          )}
          {diagResult && (
            <div className="status ok" style={{ marginTop: 12 }}>
              <p className="status-icon">归因完成</p>
              <dl>
                <dt>Source</dt>
                <dd>{diagResult.source}</dd>
                <dt>知识点</dt>
                <dd>{diagResult.knowledgePointName}</dd>
                <dt>错因</dt>
                <dd>{diagResult.errorTags.map((t) => `${t.name}(${t.severity})`).join(', ')}</dd>
                <dt>置信度</dt>
                <dd>{(diagResult.confidence * 100).toFixed(0)}%</dd>
                <dt>解释</dt>
                <dd>{diagResult.explanation}</dd>
                <dt>复练建议</dt>
                <dd>{diagResult.recommendationReason}</dd>
                <dt>LLM 调用</dt>
                <dd>{diagResult.llm.used ? `${diagResult.llm.model} (${diagResult.llm.latencyMs}ms)` : '未调用'}</dd>
                {diagResult.warnings.length > 0 && (
                  <>
                    <dt>Warnings</dt>
                    <dd>{diagResult.warnings.join(', ')}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </section>

        <section className="status-card">
          <h2>后端状态</h2>
          {loading && <p className="status loading">检测中...</p>}
          {error && <p className="status error">连接失败: {error}</p>}
          {health && (
            <div className="status ok">
              <p className="status-icon">连接正常</p>
              <dl>
                <dt>服务</dt><dd>{health.service}</dd>
                <dt>版本</dt><dd>{health.version}</dd>
                <dt>环境</dt><dd>{health.environment}</dd>
                <dt>运行时间</dt><dd>{health.uptime}s</dd>
                <dt>LLM 已配置</dt><dd>{health.llmConfigured ? '是' : '否'}</dd>
              </dl>
            </div>
          )}
        </section>

        {llmStatus && (
          <section className="status-card">
            <h2>LLM 配置状态</h2>
            <dl>
              <dt>LLM Configured</dt><dd>{llmStatus.configured ? 'Yes' : 'No'}</dd>
              <dt>Model configured</dt><dd>{llmStatus.modelConfigured ? 'Yes' : 'No'}</dd>
              <dt>Base URL configured</dt><dd>{llmStatus.baseUrlConfigured ? 'Yes' : 'No'}</dd>
              <dt>Timeout</dt><dd>{llmStatus.timeoutMs}ms</dd>
              <dt>Max retries</dt><dd>{llmStatus.maxRetries}</dd>
            </dl>
          </section>
        )}

        {summary && (
          <section className="status-card">
            <h2>Mock 数据总览（来自后端 API）</h2>
            <dl>
              <dt>知识点数量</dt><dd>{summary.knowledgePointCount}</dd>
              <dt>错题数量</dt><dd>{summary.mistakeCount}</dd>
              <dt>今日三题数量</dt><dd>{summary.practiceTaskCount}</dd>
              <dt>成就数量</dt><dd>{summary.achievementCount}</dd>
            </dl>
          </section>
        )}

        <section className="status-card">
          <h2>当前学生</h2>
          <dl>
            <dt>姓名</dt><dd>{mockStudent.name}</dd>
            <dt>年级</dt><dd>{mockStudent.grade}</dd>
            <dt>连续修复</dt><dd>{mockStudent.streakDays} 天</dd>
            <dt>错题总数</dt><dd>{mockStudent.totalMistakes}</dd>
          </dl>
        </section>

        <section className="status-card">
          <h2>知识点图鉴进度</h2>
          <dl>
            <dt>总计</dt><dd>{atlas.total}</dd>
            <dt>已发现</dt><dd>{atlas.discovered}</dd>
            <dt>待修复</dt><dd>{atlas.toRepair}</dd>
            <dt>修复中</dt><dd>{atlas.repairing}</dd>
            <dt>已掌握</dt><dd>{atlas.mastered}</dd>
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
