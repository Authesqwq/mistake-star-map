import { Card } from '../ui/Card'

interface KpOption {
  value: string; label: string; chapterId: string
}

interface TagOption {
  value: string; label: string; description: string; severity: number
}

interface CandidateSelectorProps {
  knowledgePointOptions: KpOption[]
  errorTagOptions: TagOption[]
  selectedKpIds: string[]
  selectedTagIds: string[]
  onKpChange: (ids: string[]) => void
  onTagChange: (ids: string[]) => void
  error?: string
}

const chapterNames: Record<string, string> = {
  'ch-linear-function': '一次函数',
  'ch-fractional-eq': '分式方程',
  'ch-congruent-tri': '全等三角形',
}

export function CandidateSelector({
  knowledgePointOptions,
  errorTagOptions,
  selectedKpIds,
  selectedTagIds,
  onKpChange,
  onTagChange,
  error,
}: CandidateSelectorProps) {
  const toggleKp = (id: string) => {
    if (selectedKpIds.includes(id)) {
      onKpChange(selectedKpIds.filter((v) => v !== id))
    } else {
      onKpChange([...selectedKpIds, id])
    }
  }

  const toggleTag = (id: string) => {
    if (selectedTagIds.includes(id)) {
      onTagChange(selectedTagIds.filter((v) => v !== id))
    } else {
      onTagChange([...selectedTagIds, id])
    }
  }

  // Group KPs by chapter
  const byChapter: Record<string, KpOption[]> = {}
  for (const kp of knowledgePointOptions) {
    if (!byChapter[kp.chapterId]) byChapter[kp.chapterId] = []
    byChapter[kp.chapterId].push(kp)
  }

  return (
    <Card title="候选范围">
      {error && (
        <p style={{ fontSize: '0.82rem', color: 'var(--color-danger)', marginBottom: 12 }}>{error}</p>
      )}

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
            知识点 ({selectedKpIds.length}/{knowledgePointOptions.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer' }}
              onClick={() => onKpChange(knowledgePointOptions.map((k) => k.value))}>
              全选
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              onClick={() => onKpChange([])}>
              清空
            </span>
          </div>
        </div>
        {Object.entries(byChapter).map(([chapterId, kps]) => (
          <div key={chapterId} style={{ marginBottom: 8 }}>
            <p style={{ margin: '4px 0', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {chapterNames[chapterId] ?? chapterId}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {kps.map((kp) => (
                <span
                  key={kp.value}
                  onClick={() => toggleKp(kp.value)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 99,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedKpIds.includes(kp.value) ? 'var(--color-primary)' : 'var(--color-border)',
                    background: selectedKpIds.includes(kp.value) ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                    color: selectedKpIds.includes(kp.value) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}>
                  {kp.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
            错因标签 ({selectedTagIds.length}/{errorTagOptions.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer' }}
              onClick={() => onTagChange(errorTagOptions.map((t) => t.value))}>
              全选
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              onClick={() => onTagChange([])}>
              清空
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {errorTagOptions.map((t) => (
            <span
              key={t.value}
              onClick={() => toggleTag(t.value)}
              title={`${t.description} | 严重度: ${t.severity}`}
              style={{
                padding: '4px 12px',
                borderRadius: 99,
                fontSize: '0.8rem',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedTagIds.includes(t.value) ? 'var(--color-primary)' : 'var(--color-border)',
                background: selectedTagIds.includes(t.value) ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                color: selectedTagIds.includes(t.value) ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
