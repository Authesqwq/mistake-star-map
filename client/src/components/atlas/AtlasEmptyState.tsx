import { EmptyState } from '../ui/EmptyState'

interface AtlasEmptyStateProps {
  reason?: string
}

export function AtlasEmptyState({ reason }: AtlasEmptyStateProps) {
  return (
    <EmptyState
      title="暂无匹配的知识点"
      description={reason ?? '尝试调整筛选条件或先录入错题并进行 AI 归因'}
    />
  )
}
