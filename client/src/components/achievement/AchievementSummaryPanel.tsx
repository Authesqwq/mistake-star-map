import type { MotivationProfile } from '../../types/achievement'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface AchievementSummaryPanelProps { profile: MotivationProfile }

export function AchievementSummaryPanel({ profile }: AchievementSummaryPanelProps) {
  return (
    <Card title="激励概览">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Badge variant="success">修复值 {profile.repairValue}</Badge>
        <Badge variant="info">连续修复 {profile.streakDays} 天</Badge>
        <Badge variant="warning">成就 {profile.unlockedAchievementCount}</Badge>
        {profile.lastEffectivePracticeDate && (
          <Badge variant="info">最近复练 {profile.lastEffectivePracticeDate}</Badge>
        )}
      </div>
      {profile.recentAchievements.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>最近成就</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {profile.recentAchievements.map((a) => (
              <Badge key={a.id} variant="success">{a.title}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
