import type { MetricsRange } from '../../types/metrics'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { formatMetricsRange } from '../../utils/analyticsMappers'

const ranges: MetricsRange[] = ['today', 'last_7_days', 'last_30_days', 'all']

interface MetricsHeaderProps { range: MetricsRange; onRangeChange: (r: MetricsRange) => void; onRefresh: () => void }

export function MetricsHeader({ range, onRangeChange, onRefresh }: MetricsHeaderProps) {
  return (
    <div>
      <SectionHeader title="指标看板" description="基于本地埋点事件和开发指标，观察错题星图核心链路表现" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {ranges.map((r) => <Button key={r} size="sm" variant={range === r ? 'primary' : 'ghost'} onClick={() => onRangeChange(r)}>{formatMetricsRange(r)}</Button>)}
        <div style={{ flex: 1 }} />
        <Badge variant="info">本地模拟埋点</Badge>
        <Button size="sm" variant="secondary" onClick={onRefresh}>刷新指标</Button>
      </div>
    </div>
  )
}
