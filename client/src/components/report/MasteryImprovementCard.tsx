import type { MasteryImprovementItem } from '../../types/report'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Badge } from '../ui/Badge'

interface MasteryImprovementCardProps { items: MasteryImprovementItem[] }

export function MasteryImprovementCard({ items }: MasteryImprovementCardProps) {
  return (
    <Card title="掌握度提升">
      {items.length === 0 ? <EmptyState title="暂无明显提升" description="继续复练后可以看到掌握度变化" /> : (
        items.map((m) => (
          <div key={m.knowledgePointId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
            <span>{m.knowledgePointName}</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                {m.baseMastery} → {m.currentMastery}
              </span>
              <Badge variant="success">+{m.delta}</Badge>
            </div>
          </div>
        ))
      )}
    </Card>
  )
}
