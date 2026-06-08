import type { RecommendedPracticeTask } from '../../types/recommendation'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatTaskRole, formatPracticeType } from '../../utils/recommendationMappers'

interface PracticeTaskHeaderProps {
  task: RecommendedPracticeTask
  onBack: () => void
}

export function PracticeTaskHeader({ task, onBack }: PracticeTaskHeaderProps) {
  return (
    <Card
      title={task.title}
      description={`${task.knowledgePointName} · ${task.chapterName}`}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="ghost" size="sm" onClick={onBack}>返回今日修复中心</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        <Badge variant="info">{formatTaskRole(task.taskRole)}</Badge>
        <Badge variant="info">{formatPracticeType(task.practiceType)}</Badge>
        <Badge variant={task.priorityScore >= 75 ? 'danger' : 'warning'}>优先级 {task.priorityScore}</Badge>
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        {task.recommendationReason}
      </p>
    </Card>
  )
}
