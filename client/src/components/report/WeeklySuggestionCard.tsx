import type { LearningSuggestion } from '../../types/report'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { formatSuggestionPriority, getSuggestionPriorityBadgeVariant } from '../../utils/reportMappers'

interface WeeklySuggestionCardProps { suggestions: LearningSuggestion[] }

export function WeeklySuggestionCard({ suggestions }: WeeklySuggestionCardProps) {
  return (
    <Card title="下周建议">
      {suggestions.length === 0 ? <EmptyState title="暂无建议" /> : (
        suggestions.map((s, i) => (
          <div key={s.id} style={{ padding: '8px 0', borderBottom: i < suggestions.length - 1 ? '1px solid var(--color-border)' : 'none', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{s.title}</span>
              <Badge variant={getSuggestionPriorityBadgeVariant(s.priority)}>{formatSuggestionPriority(s.priority)}</Badge>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{s.description}</p>
          </div>
        ))
      )}
    </Card>
  )
}
