import type { DiagnoseResponse } from '../../types/diagnosis'
import type { KnowledgePoint, ErrorTag } from '../../types/domain'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { getKnowledgePointById, getErrorTagsByIds } from '../../utils/diagnosisMappers'

interface DiagnosisCorrectionPanelProps {
  diagnosisResult: DiagnoseResponse
  knowledgePoints: KnowledgePoint[]
  errorTags: ErrorTag[]
  correctedKpId: string
  correctedTagIds: string[]
  onKpChange: (id: string) => void
  onTagChange: (ids: string[]) => void
  onConfirm: () => void
  error?: string
}

const chipStyle = (selected: boolean): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: 99,
  fontSize: '0.8rem',
  cursor: 'pointer',
  border: '1px solid',
  borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
  background: selected ? 'var(--color-primary-soft)' : 'var(--color-surface)',
  color: selected ? 'var(--color-primary)' : 'var(--color-text-muted)',
})

export function DiagnosisCorrectionPanel({
  diagnosisResult,
  knowledgePoints,
  errorTags,
  correctedKpId,
  correctedTagIds,
  onKpChange,
  onTagChange,
  onConfirm,
  error,
}: DiagnosisCorrectionPanelProps) {
  const kp = getKnowledgePointById(knowledgePoints, correctedKpId)
  const tags = getErrorTagsByIds(errorTags, correctedTagIds)

  const toggleTag = (id: string) => {
    if (correctedTagIds.includes(id)) {
      if (correctedTagIds.length > 1) onTagChange(correctedTagIds.filter((v) => v !== id))
    } else {
      if (correctedTagIds.length < 3) onTagChange([...correctedTagIds, id])
    }
  }

  return (
    <Card title="校正归因结果" description="确认或修改 AI 推荐的归因结果">
      {error && (
        <p style={{ fontSize: '0.82rem', color: 'var(--color-danger)', marginBottom: 12 }}>{error}</p>
      )}

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          知识点 (已选: {kp?.name ?? correctedKpId})
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {knowledgePoints.map((kp) => (
            <span
              key={kp.id}
              onClick={() => onKpChange(kp.id)}
              style={chipStyle(correctedKpId === kp.id)}
            >
              {kp.name}
              {correctedKpId === kp.id && diagnosisResult.knowledgePointId !== kp.id && ' (已修改)'}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          错因标签 (已选 {correctedTagIds.length}/3: {tags.map((t) => t.name).join(', ')})
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {errorTags.map((t) => (
            <span
              key={t.id}
              onClick={() => toggleTag(t.id)}
              title={`${t.description} | 严重度: ${t.severity}`}
              style={chipStyle(correctedTagIds.includes(t.id))}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
        校正后的结果将保存到本地确认记录，不会更新后端数据。正式图鉴更新将在后续 PR 实现。
      </p>

      <Button onClick={onConfirm}>
        确认归因结果
      </Button>
    </Card>
  )
}
