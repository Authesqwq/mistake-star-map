import { Badge } from '../ui/Badge'
import { getAchievementBadgeVariant, formatAchievementRarity } from '../../utils/achievementMappers'
import type { AchievementRarity } from '../../types/achievement'

interface AchievementBadgeProps { rarity: AchievementRarity; title: string; unlocked: boolean }

export function AchievementBadge({ rarity, title, unlocked }: AchievementBadgeProps) {
  return (
    <span style={{ opacity: unlocked ? 1 : 0.4 }}>
      <Badge variant={unlocked ? getAchievementBadgeVariant(rarity) : 'default'}>
        {unlocked ? title : '???'}
        {unlocked && <span style={{ marginLeft: 4, fontSize: '0.7rem' }}>{formatAchievementRarity(rarity)}</span>}
      </Badge>
    </span>
  )
}
