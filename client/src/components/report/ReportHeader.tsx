import type { ReportRange } from '../../types/report'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { formatReportRange } from '../../utils/reportMappers'

const ranges: ReportRange[] = ['this_week', 'last_7_days', 'last_30_days', 'all']

interface ReportHeaderProps {
  range: ReportRange
  onRangeChange: (r: ReportRange) => void
  onRefresh: () => void
  onSave: () => void
}

export function ReportHeader({ range, onRangeChange, onRefresh, onSave }: ReportHeaderProps) {
  return (
    <div>
      <SectionHeader title="学习报告" description="汇总复练、错因、掌握度和成就变化，生成下一步建议" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {ranges.map((r) => (
          <Button key={r} size="sm" variant={range === r ? 'primary' : 'ghost'} onClick={() => onRangeChange(r)}>
            {formatReportRange(r)}
          </Button>
        ))}
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="secondary" onClick={onRefresh}>刷新报告</Button>
        <Button size="sm" variant="secondary" onClick={onSave}>保存快照</Button>
      </div>
    </div>
  )
}
