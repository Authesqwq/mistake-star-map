import type { RecommendedPracticeTask } from '../../types/recommendation'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { TodayTaskCard } from './TodayTaskCard'

interface TodayTaskListProps {
  tasks: RecommendedPracticeTask[]
}

export function TodayTaskList({ tasks }: TodayTaskListProps) {
  const sorted = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3)

  return (
    <Card title="今日三题" description="少量、高优先级、可完成的复练任务">
      {sorted.length === 0 ? (
        <EmptyState title="今日无任务" description="暂时没有待处理的复练任务" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sorted.map((task) => (
            <TodayTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </Card>
  )
}
