import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

interface AtlasProgressCardProps {
  total: number
  undiscovered: number
  discovered: number
  toRepair: number
  repairing: number
  mastered: number
}

export function AtlasProgressCard(props: AtlasProgressCardProps) {
  const { total, undiscovered, discovered, toRepair, repairing, mastered } = props
  // Progress = mastered / total (completed portion of the atlas)
  const explored = discovered + toRepair + repairing + mastered

  return (
    <Card title="知识点图鉴进度">
      <ProgressBar value={explored} max={total} showPercent />
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16,
        fontSize: '0.82rem', color: 'var(--color-text-muted)',
      }}>
        <span>总计 <strong style={{ color: 'var(--color-text)' }}>{total}</strong></span>
        <span>已发现 <strong style={{ color: 'var(--color-text)' }}>{discovered}</strong></span>
        <span>待修复 <strong style={{ color: 'var(--color-warning)' }}>{toRepair}</strong></span>
        <span>修复中 <strong style={{ color: 'var(--color-primary)' }}>{repairing}</strong></span>
        <span>已掌握 <strong style={{ color: 'var(--color-success)' }}>{mastered}</strong></span>
      </div>
      <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        未发现 {undiscovered} 个 · 数据来自 Mock
      </p>
    </Card>
  )
}
