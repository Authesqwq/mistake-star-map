import type { FunnelMetrics } from '../../types/metrics'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

interface FunnelCardProps { funnel: FunnelMetrics }

const stages: { key: keyof FunnelMetrics; label: string }[] = [
  { key: 'diagnosisStarted', label: '开始归因' },
  { key: 'diagnosisSucceeded', label: '归因成功' },
  { key: 'diagnosisConfirmed', label: '确认归因' },
  { key: 'practiceStarted', label: '开始复练' },
  { key: 'practiceSubmitted', label: '提交复练' },
  { key: 'practiceCorrect', label: '复练答对' },
]

export function FunnelCard({ funnel }: FunnelCardProps) {
  const max = Math.max(...stages.map((s) => funnel[s.key]), 1)
  return (
    <Card title="链路漏斗">
      {stages.map((s) => (
        <div key={s.key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
            <span style={{ fontWeight: 600 }}>{funnel[s.key]}</span>
          </div>
          <ProgressBar value={funnel[s.key]} max={max} />
        </div>
      ))}
    </Card>
  )
}
