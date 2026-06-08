import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface PracticeEmptyStateProps {
  onBackToToday?: () => void
}

export function PracticeEmptyState({ onBackToToday }: PracticeEmptyStateProps) {
  return (
    <Card title="还没有选择复练任务">
      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
        请先回到今日修复中心，从今日三题中选择一个任务开始。
      </p>
      {onBackToToday && <Button onClick={onBackToToday}>返回今日修复中心</Button>}
    </Card>
  )
}
