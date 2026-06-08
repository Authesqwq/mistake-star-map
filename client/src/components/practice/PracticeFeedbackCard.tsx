import type { PracticeEvaluateResponse } from '../../types/practice'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatEvaluationStatus, getPracticeStatusBadgeVariant } from '../../utils/practiceMappers'

interface PracticeFeedbackCardProps {
  evaluation: PracticeEvaluateResponse
  userAnswer: string
  expectedAnswer?: string
}

export function PracticeFeedbackCard({ evaluation, userAnswer, expectedAnswer }: PracticeFeedbackCardProps) {
  const v = getPracticeStatusBadgeVariant(evaluation.status)

  return (
    <Card title="答题反馈">
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <Badge variant={v}>{formatEvaluationStatus(evaluation.status)}</Badge>
        <Badge variant="info">规则判题</Badge>
      </div>

      <div style={{
        padding: 14, background: v === 'success' ? '#dcfce7' : v === 'danger' ? '#fee2e2' : '#fef3c7',
        borderRadius: 'var(--radius-sm)', marginBottom: 16,
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: v === 'success' ? '#166534' : v === 'danger' ? '#991b1b' : '#92400e' }}>
          {evaluation.feedback}
        </p>
      </div>

      <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        {evaluation.suggestion}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '0.85rem', marginTop: 12 }}>
        <span style={{ color: 'var(--color-text-muted)' }}>你的答案</span>
        <span>{userAnswer}</span>
        {expectedAnswer && (
          <>
            <span style={{ color: 'var(--color-text-muted)' }}>参考答案</span>
            <span>{expectedAnswer}</span>
          </>
        )}
        {evaluation.warnings.length > 0 && (
          <>
            <span style={{ color: 'var(--color-text-muted)' }}>提示</span>
            <span style={{ color: 'var(--color-warning)', fontSize: '0.8rem' }}>
              {evaluation.warnings.join(', ')}
            </span>
          </>
        )}
      </div>
    </Card>
  )
}
