import type { HighRiskReportItem } from '../../types/report'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Badge } from '../ui/Badge'

interface HighRiskReportCardProps { items: HighRiskReportItem[] }

export function HighRiskReportCard({ items }: HighRiskReportCardProps) {
  return (
    <Card title="需要优先关注">
      {items.length === 0 ? <EmptyState title="暂无高风险知识点" description="继续加油！" /> : (
        items.map((h) => (
          <div key={h.knowledgePointId} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{h.knowledgePointName}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <Badge variant="danger">{h.currentMastery}%</Badge>
                <Badge variant="warning">{h.displayStatus}</Badge>
              </div>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{h.reason}</p>
            <p style={{ margin: '4px 0 0', color: 'var(--color-primary)', fontSize: '0.82rem' }}>{h.suggestion}</p>
          </div>
        ))
      )}
    </Card>
  )
}
