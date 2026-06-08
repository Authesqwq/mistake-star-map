import type { MasterySnapshot } from '../../types/mastery'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { formatMasteryStatus, getMasteryLevelText, getMasteryBadgeVariant } from '../../utils/masteryMappers'

interface MasteryImpactCardProps {
  snapshot: MasterySnapshot
  practiceResult?: { status: string }
}

export function MasteryImpactCard({ snapshot, practiceResult }: MasteryImpactCardProps) {
  const delta = snapshot.currentMastery - snapshot.baseMastery
  const v = getMasteryBadgeVariant(snapshot.currentMastery)

  return (
    <Card title="掌握度变化" description="这次复练已计入本地掌握度。当前结果只用于本地演示，不会写入后端。">
      {practiceResult && (
        <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          本次复练: <Badge variant={
            practiceResult.status === 'correct' ? 'success' :
            practiceResult.status === 'incorrect' ? 'danger' : 'warning'
          }>
            {practiceResult.status === 'correct' ? '答对' :
             practiceResult.status === 'incorrect' ? '未通过' : '需确认'}
          </Badge>
        </p>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>初始掌握度</span>
          <span>{snapshot.baseMastery}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>当前掌握度</span>
          <span style={{ fontWeight: 600, color: delta > 0 ? 'var(--color-success)' : delta < 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
            {snapshot.currentMastery}% ({delta > 0 ? '+' : ''}{delta})
          </span>
        </div>
      </div>

      <ProgressBar value={snapshot.currentMastery} max={100} showPercent />

      <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
        <Badge variant={v}>{getMasteryLevelText(snapshot.currentMastery)}</Badge>
        <Badge variant="info">{formatMasteryStatus(snapshot.displayStatus)}</Badge>
      </div>

      <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        本地记录: {snapshot.localDiagnosisCount} 条归因 · {snapshot.practiceResultCount} 次复练
        ({snapshot.correctCount} 正确, {snapshot.incorrectCount} 需重试)
      </p>
    </Card>
  )
}
