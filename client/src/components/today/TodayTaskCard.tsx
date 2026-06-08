import { useState } from 'react'
import type { RecommendedPracticeTask } from '../../types/recommendation'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PriorityBreakdownView } from './PriorityBreakdown'
import { formatTaskRole, formatPracticeType } from '../../utils/recommendationMappers'

interface TodayTaskCardProps {
  task: RecommendedPracticeTask
  onStartPractice?: (task: RecommendedPracticeTask) => void
}

export function TodayTaskCard({ task, onStartPractice }: TodayTaskCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  return (
    <Card
      title={task.title}
      description={`${task.knowledgePointName} · ${task.chapterName}`}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button size="sm" onClick={() => onStartPractice?.(task)}>
            开始复练
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowBreakdown((p) => !p)}>
            {showBreakdown ? '收起评分' : '查看评分'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <Badge variant="info">{formatTaskRole(task.taskRole)}</Badge>
        <Badge variant="info">{formatPracticeType(task.practiceType)}</Badge>
        <Badge variant={task.priorityScore >= 75 ? 'danger' : 'warning'}>
          优先级 {task.priorityScore}
        </Badge>
      </div>

      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        {task.recommendationReason}
      </p>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10,
        fontSize: '0.8rem', color: 'var(--color-text-muted)',
      }}>
        <span>关联错题 {task.sourceSignals.relatedMistakeCount}</span>
        <span>本地记录 {task.sourceSignals.localDiagnosisCount}</span>
        <span>掌握度 {task.sourceSignals.mastery}%</span>
      </div>

      {showBreakdown && (
        <div style={{ marginTop: 14, padding: 12, background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
          <PriorityBreakdownView breakdown={task.priorityBreakdown} />
        </div>
      )}
    </Card>
  )
}
