import type { AtlasKnowledgePointViewModel } from '../../types/atlas'
import type { Mistake, ErrorTag } from '../../types/domain'
import type { ConfirmedDiagnosisRecord } from '../../types/diagnosis'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { Tag } from '../ui/Tag'
import { LocalDiagnosisList } from './LocalDiagnosisList'
import { formatKnowledgeStatus, formatRiskLevel, formatNextReviewAt, formatErrorTagNames } from '../../utils/atlasMappers'

interface KnowledgePointDetailPanelProps {
  vm: AtlasKnowledgePointViewModel
  relatedMistakes: Mistake[]
  relatedErrorTags: ErrorTag[]
  localDiagnoses: ConfirmedDiagnosisRecord[]
  onClose: () => void
}

const riskVariant = (r: string) => r === 'high' ? 'danger' as const : r === 'medium' ? 'warning' as const : 'success' as const
const statusVariant = (s: string) => {
  if (s === 'to_repair') return 'danger' as const
  if (s === 'repairing') return 'info' as const
  if (s === 'mastered') return 'success' as const
  return 'default' as const
}

export function KnowledgePointDetailPanel({
  vm, relatedMistakes, relatedErrorTags, localDiagnoses, onClose,
}: KnowledgePointDetailPanelProps) {
  const tagNames = formatErrorTagNames(vm.majorErrorTagIds, relatedErrorTags)
  const actionText = vm.riskLevel === 'high' ? '建议进入今日三题或同类巩固' :
    vm.riskLevel === 'medium' ? '建议安排一次变式练习' : '建议按复查时间回看'

  return (
    <Card
      title="知识点详情"
      description={vm.chapterName}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{actionText}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="secondary">去复练 (Coming soon)</Button>
            <Button size="sm" variant="ghost" onClick={onClose}>关闭</Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <Badge variant={statusVariant(vm.displayStatus)}>{formatKnowledgeStatus(vm.displayStatus)}</Badge>
        <Badge variant={riskVariant(vm.riskLevel)}>{formatRiskLevel(vm.riskLevel)}</Badge>
        {(vm.displayStatus !== vm.status) && <Badge variant="warning">本地派生</Badge>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>掌握度</p>
        <ProgressBar value={vm.mastery} max={100} showPercent />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.85rem', marginBottom: 16 }}>
        <span style={{ color: 'var(--color-text-muted)' }}>关联错题</span>
        <span>{vm.relatedMistakeIds.length} 条</span>
        <span style={{ color: 'var(--color-text-muted)' }}>本地记录</span>
        <span>{vm.localDiagnosisCount} 条</span>
        <span style={{ color: 'var(--color-text-muted)' }}>下次复查</span>
        <span>{formatNextReviewAt(vm.nextReviewAt)}</span>
      </div>

      {tagNames.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>高频错因</p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tagNames.map((name, i) => <Tag key={i} label={name} />)}
          </div>
        </div>
      )}

      {relatedMistakes.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
            Mock 错题 ({relatedMistakes.length})
          </p>
          {relatedMistakes.map((m) => (
            <div key={m.id} style={{
              padding: '8px 12px', marginBottom: 6, background: 'var(--color-surface-soft)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
            }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{m.title}</p>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>
                难度: {m.difficulty} · 错因: {m.errorTagIds.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}

      <div>
        <p style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
          本地确认记录 ({localDiagnoses.length})
        </p>
        <LocalDiagnosisList records={localDiagnoses} />
      </div>
    </Card>
  )
}
