import type { ProductMetrics } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { metrics: ProductMetrics }
export function ProductMetricsCard({ metrics }: Props) {
  return (
    <Card title="产品使用"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>页面访问</span><span>{metrics.pageViewCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>会话数</span><span>{metrics.uniqueSessionCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>快捷入口点击</span><span>{metrics.quickEntryClickCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>确认归因</span><span>{metrics.diagnosisConfirmedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>开始复练</span><span>{metrics.practiceStartedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>提交复练</span><span>{metrics.practiceSubmittedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>生成报告</span><span>{metrics.reportGeneratedCount}</span>
    </div></Card>)
}
