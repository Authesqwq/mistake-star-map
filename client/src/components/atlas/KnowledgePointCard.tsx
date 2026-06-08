import type { AtlasKnowledgePointViewModel } from '../../types/atlas'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import { formatKnowledgeStatus, formatRiskLevel, formatSourceBadge, formatNextReviewAt } from '../../utils/atlasMappers'

interface KnowledgePointCardProps {
  vm: AtlasKnowledgePointViewModel
  active: boolean
  onClick: () => void
}

const riskVariant = (r: string) => r === 'high' ? 'danger' as const : r === 'medium' ? 'warning' as const : 'success' as const
const statusVariant = (s: string) => {
  if (s === 'to_repair') return 'danger' as const
  if (s === 'repairing') return 'info' as const
  if (s === 'mastered') return 'success' as const
  return 'default' as const
}

export function KnowledgePointCard({ vm, active, onClick }: KnowledgePointCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'border-color 0.15s',
      }}
    >
      <Card title={vm.name} description={vm.chapterName}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <Badge variant={statusVariant(vm.displayStatus)}>{formatKnowledgeStatus(vm.displayStatus)}</Badge>
          <Badge variant={riskVariant(vm.riskLevel)}>{formatRiskLevel(vm.riskLevel)}</Badge>
          {vm.sourceBadges.map((s) => (
            <Badge key={s} variant="info">{formatSourceBadge(s)}</Badge>
          ))}
        </div>

        <ProgressBar value={vm.mastery} max={100} showPercent />

        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 12,
          fontSize: '0.8rem', color: 'var(--color-text-muted)',
        }}>
          <span>错题 {vm.relatedMistakeIds.length}</span>
          {vm.localDiagnosisCount > 0 && <span>本地 {vm.localDiagnosisCount}</span>}
          <span>复查 {formatNextReviewAt(vm.nextReviewAt)}</span>
        </div>

        <div style={{ marginTop: 12 }}>
          <Button size="sm" variant="ghost">
            查看详情
          </Button>
        </div>
      </Card>
    </div>
  )
}
