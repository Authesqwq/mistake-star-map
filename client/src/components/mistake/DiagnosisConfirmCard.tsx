import type { ConfirmedDiagnosisRecord } from '../../types/diagnosis'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Tag } from '../ui/Tag'
import { formatDiagnosisSource } from '../../utils/diagnosisMappers'

interface DiagnosisConfirmCardProps {
  record: ConfirmedDiagnosisRecord
  recordCount: number
  onNext: () => void
}

export function DiagnosisConfirmCard({ record, recordCount, onNext }: DiagnosisConfirmCardProps) {
  return (
    <Card title="归因结果已确认">
      <div style={{
        padding: 14,
        background: '#dcfce7',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 16,
        fontSize: '0.88rem',
        color: '#166534',
      }}>
        确认记录已保存到本地。
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.87rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>来源</span>
        <Badge variant={record.source === 'llm' ? 'success' : 'warning'}>
          {formatDiagnosisSource(record.source)}
        </Badge>

        <span style={{ color: 'var(--color-text-muted)' }}>确认知识点</span>
        <span style={{ fontWeight: 600 }}>{record.correctedKnowledgePointName}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>确认错因</span>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {record.correctedErrorTags.map((t) => (
            <Tag key={t.id} label={t.name} severity={t.severity} />
          ))}
        </div>

        <span style={{ color: 'var(--color-text-muted)' }}>保存位置</span>
        <span>本地确认记录</span>

        <span style={{ color: 'var(--color-text-muted)' }}>当前确认数</span>
        <span>{recordCount} 条</span>
      </div>

      <p style={{ margin: '16px 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        知识点图鉴页面将在 PR10 使用这些确认记录展示点亮状态。
      </p>

      <Button variant="secondary" onClick={onNext}>
        继续录入下一题
      </Button>
    </Card>
  )
}
