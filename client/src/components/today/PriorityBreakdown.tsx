import type { PriorityBreakdown as PB } from '../../types/recommendation'
import { ProgressBar } from '../ui/ProgressBar'

interface PriorityBreakdownProps {
  breakdown: PB
}

const labelMap: Record<string, string> = {
  mistakeFrequencyScore: '错题频次',
  errorSeverityScore: '错因严重度',
  masteryGapScore: '掌握度缺口',
  reviewDueScore: '复查时间',
}

export function PriorityBreakdownView({ breakdown }: PriorityBreakdownProps) {
  const items = (
    Object.keys(labelMap) as Array<keyof typeof labelMap>
  ).map((k) => ({
    label: labelMap[k],
    value: breakdown[k as keyof PB] ?? 0,
  }))

  return (
    <div>
      <p style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
        评分拆解（加权: {breakdown.weightedScore}）
      </p>
      {items.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 80, fontSize: '0.78rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
            {item.label}
          </span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={item.value} max={100} />
          </div>
          <span style={{ width: 32, fontSize: '0.78rem', color: 'var(--color-text)', textAlign: 'right' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
