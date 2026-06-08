import { MetricCard } from '../ui/MetricCard'
import { formatRate } from '../../utils/analyticsMappers'
import type { MetricsDashboardData } from '../../types/metrics'

interface MetricsSummaryGridProps { data: MetricsDashboardData }

export function MetricsSummaryGrid({ data }: MetricsSummaryGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
      <MetricCard title="页面访问" value={data.product.pageViewCount} />
      <MetricCard title="AI归因成功" value={data.aiDiagnosis.diagnosisSucceeded} />
      <MetricCard title="确认归因" value={data.product.diagnosisConfirmedCount} />
      <MetricCard title="复练提交" value={data.practice.practiceSubmittedCount} />
      <MetricCard title="正确率" value={formatRate(data.practice.accuracyRate)} />
      <MetricCard title="解锁成就" value={data.achievement.achievementUnlockedEventCount} />
    </div>
  )
}
