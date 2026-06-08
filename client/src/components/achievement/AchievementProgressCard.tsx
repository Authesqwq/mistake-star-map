import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

interface AchievementProgressCardProps { unlocked: number; total: number }

export function AchievementProgressCard({ unlocked, total }: AchievementProgressCardProps) {
  return (
    <Card title="成就进度">
      <ProgressBar value={unlocked} max={total} showPercent />
      <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        已解锁 {unlocked}/{total}
      </p>
    </Card>
  )
}
