import type { AchievementReportSummary } from '../../types/report'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface AchievementReportCardProps { summary: AchievementReportSummary }

export function AchievementReportCard({ summary }: AchievementReportCardProps) {
  return (
    <Card title="成就概况">
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <Badge variant="success">修复值 {summary.repairValue}</Badge>
        <Badge variant="info">连续修复 {summary.streakDays} 天</Badge>
        <Badge variant="warning">{summary.unlockedAchievementCount} 个成就</Badge>
      </div>
      {summary.recentAchievementTitles.length > 0 && (
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>最近成就</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {summary.recentAchievementTitles.map((t) => <Badge key={t} variant="success">{t}</Badge>)}
          </div>
        </div>
      )}
    </Card>
  )
}
