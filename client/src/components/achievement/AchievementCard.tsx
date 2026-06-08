import type { AchievementDefinition, AchievementProgress } from '../../types/achievement'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { formatAchievementCategory, formatAchievementRarity, getAchievementBadgeVariant, getAchievementProgressText } from '../../utils/achievementMappers'

interface AchievementCardProps { def: AchievementDefinition; progress: AchievementProgress }

export function AchievementCard({ def, progress }: AchievementCardProps) {
  const unlocked = progress.unlocked
  return (
    <Card
      title={unlocked ? def.title : '???'}
      description={unlocked ? def.description : `完成条件后解锁: ${def.description}`}
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <Badge variant={unlocked ? getAchievementBadgeVariant(def.rarity) : 'default'}>
          {formatAchievementRarity(def.rarity)}
        </Badge>
        <Badge variant="info">{formatAchievementCategory(def.category)}</Badge>
        <Badge variant="success">+{def.rewardRepairValue}</Badge>
      </div>
      <ProgressBar value={progress.current} max={progress.target} showPercent={false} />
      <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        {getAchievementProgressText(progress.current, progress.target)}
        {unlocked && progress.unlockedAt && (
          <span style={{ marginLeft: 12 }}>
            解锁于 {new Date(progress.unlockedAt).toLocaleDateString('zh-CN')}
          </span>
        )}
      </p>
    </Card>
  )
}
