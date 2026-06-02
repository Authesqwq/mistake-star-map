import { useState } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatPracticeType } from '../../utils/dashboardSelectors'

interface TodayTaskCardProps {
  title: string
  type: string
  reason: string
  priorityScore: number
  knowledgePointName: string
  mistakeTitle: string
}

export function TodayTaskCard({ title, type, reason, priorityScore, knowledgePointName, mistakeTitle }: TodayTaskCardProps) {
  const [showHint, setShowHint] = useState(false)

  return (
    <Card
      title={title}
      description={`关联知识点：${knowledgePointName}`}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            size="sm"
            onClick={() => setShowHint(true)}
          >
            开始复练
          </Button>
          {showHint && (
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              复练流程将在后续 PR 实现
            </span>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Badge variant="info">{formatPracticeType(type)}</Badge>
        <Badge variant={priorityScore >= 85 ? 'danger' : 'warning'}>
          优先级 {priorityScore}
        </Badge>
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        {reason}
      </p>
      <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        错题：{mistakeTitle}
      </p>
    </Card>
  )
}
