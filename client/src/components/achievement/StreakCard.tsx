import { Card } from '../ui/Card'

interface StreakCardProps { days: number }

export function StreakCard({ days }: StreakCardProps) {
  return (
    <Card title="连续修复日" description="连续修复日用于记录有效复练节奏，中断不会扣分。">
      <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', margin: 0 }}>{days}</p>
      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        天 · 中断不会扣分，随时可以继续
      </p>
    </Card>
  )
}
