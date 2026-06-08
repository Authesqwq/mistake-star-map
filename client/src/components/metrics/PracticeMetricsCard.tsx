import type { PracticeMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'
import { formatRate } from '../../utils/analyticsMappers'

interface Props { metrics: PracticeMetricsView }
export function PracticeMetricsCard({ metrics }: Props) {
  return (
    <Card title="复练任务"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>开始复练</span><span>{metrics.practiceStartedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>提交复练</span><span>{metrics.practiceSubmittedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>答对</span><span>{metrics.correctCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>未通过</span><span>{metrics.incorrectCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>需确认</span><span>{metrics.needsReviewCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>完成率</span><span>{formatRate(metrics.completionRate)}</span>
      <span style={{color:'var(--color-text-muted)'}}>正确率</span><span>{formatRate(metrics.accuracyRate)}</span>
    </div></Card>)
}
