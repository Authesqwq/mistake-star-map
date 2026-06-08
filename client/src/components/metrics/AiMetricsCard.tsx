import type { AiDiagnosisMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'
import { formatRate } from '../../utils/analyticsMappers'

interface Props { metrics: AiDiagnosisMetricsView }
export function AiMetricsCard({ metrics }: Props) {
  return (
    <Card title="AI 归因"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>开始归因</span><span>{metrics.diagnosisStarted}</span>
      <span style={{color:'var(--color-text-muted)'}}>归因成功</span><span>{metrics.diagnosisSucceeded}</span>
      <span style={{color:'var(--color-text-muted)'}}>归因失败</span><span>{metrics.diagnosisFailed}</span>
      <span style={{color:'var(--color-text-muted)'}}>LLM结果</span><span>{metrics.llmResultCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>Fallback</span><span>{metrics.fallbackResultCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>Fallback率</span><span>{formatRate(metrics.fallbackRate)}</span>
      <span style={{color:'var(--color-text-muted)'}}>平均置信度</span><span>{metrics.averageConfidence}</span>
    </div></Card>)
}
