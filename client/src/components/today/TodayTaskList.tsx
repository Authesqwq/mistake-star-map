import type { PracticeTask } from '../../types/domain'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { TodayTaskCard } from './TodayTaskCard'
import { sortTodayTasks } from '../../utils/dashboardSelectors'

interface TodayTaskListProps {
  tasks: PracticeTask[]
  knowledgePointNameMap: Record<string, string>
  mistakeTitleMap: Record<string, string>
}

export function TodayTaskList({ tasks, knowledgePointNameMap, mistakeTitleMap }: TodayTaskListProps) {
  const sorted = sortTodayTasks(tasks).slice(0, 3)

  return (
    <Card title="今日三题" description="少量、高优先级、可完成的复练任务">
      {sorted.length === 0 ? (
        <EmptyState title="今日无任务" description="暂时没有待处理的复练任务" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sorted.map((task) => (
            <TodayTaskCard
              key={task.id}
              title={task.title}
              type={task.type}
              reason={task.recommendationReason}
              priorityScore={task.priorityScore}
              knowledgePointName={knowledgePointNameMap[task.knowledgePointId] ?? task.knowledgePointId}
              mistakeTitle={mistakeTitleMap[task.mistakeId] ?? task.mistakeId}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
