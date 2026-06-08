import { MetricCard } from '../ui/MetricCard'

interface AtlasStatsGridProps {
  total: number
  discovered: number
  toRepair: number
  repairing: number
  mastered: number
  localCount: number
}

export function AtlasStatsGrid({ total, discovered, toRepair, repairing, mastered, localCount }: AtlasStatsGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: 12,
      marginBottom: 'var(--space-5)',
    }}>
      <MetricCard title="知识点总数" value={total} />
      <MetricCard title="待修复" value={toRepair} />
      <MetricCard title="修复中" value={repairing} />
      <MetricCard title="已掌握" value={mastered} />
      <MetricCard title="已发现" value={discovered} />
      <MetricCard title="本地记录" value={localCount} />
    </div>
  )
}
