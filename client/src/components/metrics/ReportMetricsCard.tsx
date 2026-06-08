import type { ReportMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { metrics: ReportMetricsView }
export function ReportMetricsCard({ metrics }: Props) {
  return (
    <Card title="学习报告"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>生成报告</span><span>{metrics.reportGeneratedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>复制MD</span><span>{metrics.markdownCopiedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>导出JSON</span><span>{metrics.jsonExportedCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>保存快照</span><span>{metrics.savedReportCount}</span>
    </div></Card>)
}
