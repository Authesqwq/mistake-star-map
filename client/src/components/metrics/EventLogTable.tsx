import type { AnalyticsEvent } from '../../types/analytics'
import { Card } from '../ui/Card'
import { formatAnalyticsEventName, formatAnalyticsPageName, formatEventDate } from '../../utils/analyticsMappers'
import { MetricsEmptyState } from './MetricsEmptyState'

interface Props { events: AnalyticsEvent[] }
export function EventLogTable({ events }: Props) {
  const recent = events.slice(-50).reverse()
  if (recent.length === 0) return <MetricsEmptyState />
  return (
    <Card title="事件日志 (最近 50 条)">
      <div style={{ maxHeight: 360, overflow: 'auto' }}>
        {recent.map((e) => (
          <div key={e.id} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--color-border)',fontSize:'0.78rem',gap:12 }}>
            <span style={{color:'var(--color-text-muted)',minWidth:130}}>{formatEventDate(e.createdAt)}</span>
            <span style={{color:'var(--color-text-muted)',minWidth:70}}>{formatAnalyticsPageName(e.page)}</span>
            <span style={{fontWeight:500}}>{formatAnalyticsEventName(e.name)}</span>
            <span style={{color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200}}>
              {e.properties ? JSON.stringify(e.properties) : '-'}
            </span>
          </div>
        ))}
      </div>
    </Card>)
}
