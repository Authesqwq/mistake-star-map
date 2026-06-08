import type { MasterySnapshot } from '../../types/mastery'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { formatMasteryStatus, getMasteryBadgeVariant } from '../../utils/masteryMappers'

interface MasterySnapshotPanelProps {
  snapshot: MasterySnapshot
  knowledgePointName: string
}

export function MasterySnapshotPanel({ snapshot, knowledgePointName }: MasterySnapshotPanelProps) {
  const v = getMasteryBadgeVariant(snapshot.currentMastery)
  const delta = snapshot.currentMastery - snapshot.baseMastery

  return (
    <Card title="掌握度概览" description={knowledgePointName}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>初始 → 当前</span>
          <span style={{ fontWeight: 600 }}>
            {snapshot.baseMastery}% → {snapshot.currentMastery}%
            <span style={{
              marginLeft: 6, fontSize: '0.8rem',
              color: delta > 0 ? 'var(--color-success)' : delta < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)',
            }}>
              ({delta > 0 ? '+' : ''}{delta})
            </span>
          </span>
        </div>
        <ProgressBar value={snapshot.currentMastery} max={100} showPercent />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <Badge variant={v}>{snapshot.currentMastery}%</Badge>
        <Badge variant="info">{formatMasteryStatus(snapshot.displayStatus)}</Badge>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px',
        fontSize: '0.82rem', color: 'var(--color-text-muted)',
      }}>
        <span>归因记录</span><span>{snapshot.localDiagnosisCount}</span>
        <span>复练次数</span><span>{snapshot.practiceResultCount}</span>
        <span>答对</span><span style={{ color: 'var(--color-success)' }}>{snapshot.correctCount}</span>
        <span>需重试</span><span style={{ color: 'var(--color-danger)' }}>{snapshot.incorrectCount}</span>
        <span>需确认</span><span>{snapshot.needsReviewCount}</span>
        {snapshot.lastPracticedAt && (
          <>
            <span>最近复练</span>
            <span>{new Date(snapshot.lastPracticedAt).toLocaleDateString('zh-CN')}</span>
          </>
        )}
      </div>
    </Card>
  )
}
