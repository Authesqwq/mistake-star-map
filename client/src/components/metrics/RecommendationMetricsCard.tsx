import type { RecommendationMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { metrics: RecommendationMetricsView }
export function RecommendationMetricsCard({ metrics }: Props) {
  return (
    <Card title="推荐服务"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>加载成功</span><span>{metrics.recommendationLoadedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>加载失败</span><span>{metrics.recommendationFailedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>规则推荐</span><span>{metrics.ruleSourceCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>兜底任务</span><span>{metrics.mockFallbackCount}</span>
    </div></Card>)
}
