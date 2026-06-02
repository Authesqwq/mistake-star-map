import { MetricCard } from '../ui/MetricCard'

interface StudentStatsGridProps {
  streakDays: number
  repairValue: number
  totalMistakes: number
  completedPracticeCount: number
}

export function StudentStatsGrid({ streakDays, repairValue, totalMistakes, completedPracticeCount }: StudentStatsGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 12,
      marginBottom: 'var(--space-5)',
    }}>
      <MetricCard title="连续修复日" value={streakDays} description="天" />
      <MetricCard title="错因修复值" value={repairValue} description="修复进度积分" />
      <MetricCard title="总错题数" value={totalMistakes} description="累计收录" />
      <MetricCard title="已完成复练" value={completedPracticeCount} description="次" />
    </div>
  )
}
