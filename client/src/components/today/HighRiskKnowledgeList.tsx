import type { KnowledgePoint } from '../../types/domain'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { HighRiskKnowledgeCard } from './HighRiskKnowledgeCard'
import { getHighRiskKnowledgePoints } from '../../utils/dashboardSelectors'

interface HighRiskKnowledgeListProps {
  knowledgePoints: KnowledgePoint[]
  errorTagNameMap: (ids: string[]) => string[]
}

export function HighRiskKnowledgeList({ knowledgePoints, errorTagNameMap }: HighRiskKnowledgeListProps) {
  const highRisk = getHighRiskKnowledgePoints(knowledgePoints)

  return (
    <Card title="高风险知识点" description="需要优先关注的知识薄弱区域">
      {highRisk.length === 0 ? (
        <EmptyState title="暂无高风险知识点" description="继续加油！" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {highRisk.map((kp) => (
            <HighRiskKnowledgeCard
              key={kp.id}
              name={kp.name}
              status={kp.status}
              mastery={kp.mastery}
              relatedMistakeCount={kp.relatedMistakeIds.length}
              majorErrorTagNames={errorTagNameMap(kp.majorErrorTagIds)}
              nextReviewAt={kp.nextReviewAt}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
