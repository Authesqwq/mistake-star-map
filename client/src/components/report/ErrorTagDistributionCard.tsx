import type { ErrorTagReportItem } from '../../types/report'
import { Card } from '../ui/Card'
import { Tag } from '../ui/Tag'
import { EmptyState } from '../ui/EmptyState'

interface ErrorTagDistributionCardProps { items: ErrorTagReportItem[] }

export function ErrorTagDistributionCard({ items }: ErrorTagDistributionCardProps) {
  const max = items[0]?.count ?? 1
  return (
    <Card title="错因分布">
      {items.length === 0 ? <EmptyState title="暂无错因数据" /> : (
        items.map((item) => (
          <div key={item.errorTagId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Tag label={item.errorTagName} severity={item.severity} />
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(item.count / max) * 100}%`, borderRadius: 3, background: 'var(--color-warning)' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', minWidth: 24, textAlign: 'right' }}>{item.count}</span>
          </div>
        ))
      )}
    </Card>
  )
}
