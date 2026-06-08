import type { AtlasMetricsView } from '../../types/metrics'
import { Card } from '../ui/Card'

interface Props { metrics: AtlasMetricsView }
export function AtlasMetricsCard({ metrics }: Props) {
  return (
    <Card title="知识点图鉴"><div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px',fontSize:'0.82rem' }}>
      <span style={{color:'var(--color-text-muted)'}}>查看次数</span><span>{metrics.atlasViewCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>筛选操作</span><span>{metrics.filterChangeCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>确认记录</span><span>{metrics.localDiagnosisCount}</span>
      <span style={{color:'var(--color-text-muted)'}}>掌握度快照</span><span>{metrics.masterySnapshotCount}</span>
    </div></Card>)
}
