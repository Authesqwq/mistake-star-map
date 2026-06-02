import { useEffect, useState } from 'react'
import { getHealth } from './services/apiClient'
import { getKnowledgeAtlasProgress } from './utils/mockSelectors'
import { AppShell } from './components/layout/AppShell'
import { ApiStatusPanel } from './components/dev/ApiStatusPanel'
import { MockSummaryPanel } from './components/dev/MockSummaryPanel'
import { DiagnosisSmokePanel } from './components/dev/DiagnosisSmokePanel'
import { Card } from './components/ui/Card'
import { MetricCard } from './components/ui/MetricCard'
import { ProgressBar } from './components/ui/ProgressBar'
import { Badge } from './components/ui/Badge'
import { SectionHeader } from './components/ui/SectionHeader'

function App() {
  const [backendOk, setBackendOk] = useState(false)
  const [llmConfigured, setLlmConfigured] = useState(false)

  useEffect(() => {
    getHealth()
      .then((data) => {
        setBackendOk(data.status === 'ok')
        setLlmConfigured(data.llmConfigured)
      })
      .catch(() => setBackendOk(false))
  }, [])

  const atlas = getKnowledgeAtlasProgress()

  return (
    <AppShell backendOk={backendOk}>
      {/* ── Overview cards ── */}
      <SectionHeader
        title="开发预览面板"
        description="MVP 阶段联调视图，非正式产品页面。后续 PR 将替换为正式业务页面。"
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <MetricCard
          title="知识点图鉴进度"
          value={`${atlas.mastered}/${atlas.total}`}
          description="已掌握 / 总计"
        />
        <MetricCard
          title="待修复"
          value={atlas.toRepair + atlas.repairing}
          trend={`已掌握 ${atlas.mastered} 个`}
        />
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 8 }}>
            AI 归因状态
          </p>
          <Badge variant={llmConfigured ? 'success' : 'warning'}>
            {llmConfigured ? 'LLM 已配置' : 'LLM 未配置（Fallback）'}
          </Badge>
          <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            未配置时自动降级
          </p>
        </div>
      </div>

      {/* ── Atlas Progress ── */}
      <div style={{ marginBottom: 24 }}>
        <Card title="知识点图鉴进度">
          <ProgressBar value={atlas.mastered} max={atlas.total} showPercent />
          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 12,
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
          }}>
            <span>未发现 {atlas.undiscovered}</span>
            <span>已发现 {atlas.discovered}</span>
            <span>待修复 {atlas.toRepair}</span>
            <span>修复中 {atlas.repairing}</span>
            <span>已掌握 {atlas.mastered}</span>
          </div>
        </Card>
      </div>

      {/* ── Dev panels ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ApiStatusPanel />
        <MockSummaryPanel />
        <DiagnosisSmokePanel />
      </div>
    </AppShell>
  )
}

export default App
