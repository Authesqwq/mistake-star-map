import type { MasteryChange } from '../../types/mastery'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { formatMasteryChangeReason, formatMasteryDelta } from '../../utils/masteryMappers'

interface MasteryHistoryListProps {
  changes: MasteryChange[]
}

export function MasteryHistoryList({ changes }: MasteryHistoryListProps) {
  if (changes.length === 0) {
    return <EmptyState title="暂无掌握度变化记录" description="完成错题归因和复练后，变化记录会显示在这里" />
  }

  return (
    <Card title="掌握度变化记录">
      {changes.map((c) => (
        <div
          key={c.id}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', marginBottom: 6, fontSize: '0.82rem',
            background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)',
          }}
        >
          <div>
            <span style={{ fontWeight: 500 }}>{formatMasteryChangeReason(c.reason)}</span>
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
              {c.description}
            </span>
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
              {new Date(c.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <Badge variant={c.delta > 0 ? 'success' : c.delta < 0 ? 'danger' : 'info'}>
            {formatMasteryDelta(c.delta)}
          </Badge>
        </div>
      ))}
    </Card>
  )
}
