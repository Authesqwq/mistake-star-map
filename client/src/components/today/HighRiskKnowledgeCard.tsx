import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Badge } from '../ui/Badge'
import { formatKnowledgeStatus } from '../../utils/dashboardSelectors'

interface HighRiskKnowledgeCardProps {
  name: string
  status: string
  mastery: number
  relatedMistakeCount: number
  majorErrorTagNames: string[]
  nextReviewAt: string | null
}

const statusVariant = (s: string) => {
  if (s === 'to_repair') return 'danger' as const
  if (s === 'repairing') return 'info' as const
  if (s === 'mastered') return 'success' as const
  return 'default' as const
}

export function HighRiskKnowledgeCard({
  name, status, mastery, relatedMistakeCount, majorErrorTagNames, nextReviewAt,
}: HighRiskKnowledgeCardProps) {
  return (
    <Card
      title={name}
      description={`关联 ${relatedMistakeCount} 条错题`}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Badge variant={statusVariant(status)}>{formatKnowledgeStatus(status)}</Badge>
        {majorErrorTagNames.map((t) => (
          <Badge key={t} variant="warning">{t}</Badge>
        ))}
      </div>
      <ProgressBar value={mastery} max={100} showPercent />
      {nextReviewAt && (
        <p style={{ margin: '12px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          下次复查：{new Date(nextReviewAt).toLocaleDateString('zh-CN')}
        </p>
      )}
      <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        建议：做同类题巩固，注意错因归纳
      </p>
    </Card>
  )
}
