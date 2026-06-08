import { MetricCard } from '../ui/MetricCard'

interface ReportSummaryGridProps {
  practiceCount: number; accuracyRate: number
  kpCount: number; improvementCount: number
  highRiskCount: number; achievementCount: number
}

export function ReportSummaryGrid(p: ReportSummaryGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
      <MetricCard title="完成复练" value={p.practiceCount} description="次" />
      <MetricCard title="正确率" value={`${p.accuracyRate}%`} />
      <MetricCard title="练过知识点" value={p.kpCount} description="个" />
      <MetricCard title="掌握度提升" value={p.improvementCount} description="个" />
      <MetricCard title="高风险" value={p.highRiskCount} description="个" />
      <MetricCard title="解锁成就" value={p.achievementCount} description="个" />
    </div>
  )
}
