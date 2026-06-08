import type { AchievementRecord } from '../../types/achievement'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { AchievementBadge } from './AchievementBadge'

interface AchievementToastProps { newlyUnlocked: AchievementRecord[]; onClose: () => void }

export function AchievementToast({ newlyUnlocked, onClose }: AchievementToastProps) {
  if (newlyUnlocked.length === 0) return null
  return (
    <Card title={`解锁了 ${newlyUnlocked.length} 个成就`} description="你的学习行动获得了新成就">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {newlyUnlocked.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
            <AchievementBadge rarity={a.rarity} title={a.title} unlocked={true} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{a.description}</span>
            <span style={{ color: 'var(--color-primary)', fontSize: '0.78rem', fontWeight: 600 }}>+{a.rewardRepairValue}</span>
          </div>
        ))}
      </div>
      <Button size="sm" variant="ghost" onClick={onClose}>知道了</Button>
    </Card>
  )
}
