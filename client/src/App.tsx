import { useEffect, useState } from 'react'

interface HealthStatus {
  status: string
  service: string
  llmConfigured: boolean
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: HealthStatus) => {
        setHealth(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

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
                <dt>状态</dt>
                <dd>{health.status}</dd>
                <dt>LLM 已配置</dt>
                <dd>{health.llmConfigured ? '是' : '否'}</dd>
                <dt>时间</dt>
                <dd>{new Date(health.timestamp).toLocaleString('zh-CN')}</dd>
              </dl>
            </div>
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
