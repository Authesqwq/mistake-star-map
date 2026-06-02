import type { ConfirmedDiagnosisRecord } from '../../types/diagnosis'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Tag } from '../ui/Tag'
import { EmptyState } from '../ui/EmptyState'

interface LocalDiagnosisListProps {
  records: ConfirmedDiagnosisRecord[]
}

function truncate(s: string, max = 60): string {
  return s.length > max ? s.slice(0, max) + '...' : s
}

export function LocalDiagnosisList({ records }: LocalDiagnosisListProps) {
  if (records.length === 0) {
    return <EmptyState title="暂无本地确认记录" description="录入错题并完成 AI 归因确认后，记录会显示在这里" />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {records.map((r) => (
        <Card key={r.id} title={new Date(r.createdAt).toLocaleString('zh-CN')}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <Badge variant={r.source === 'llm' ? 'success' : 'warning'}>
              {r.source === 'llm' ? 'AI' : '规则兜底'}
            </Badge>
            {r.needReview && <Badge variant="danger">需复核</Badge>}
          </div>
          <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            错答: {truncate(r.wrongAnswer)}
          </p>
          <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            正答: {truncate(r.correctAnswer)}
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {r.correctedErrorTags.map((t) => (
              <Tag key={t.id} label={t.name} severity={t.severity} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
