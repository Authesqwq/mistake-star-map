import type { DiagnoseResponse } from '../../types/diagnosis'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Tag } from '../ui/Tag'
import { formatDiagnosisSource, formatPracticeType, formatWarning } from '../../utils/diagnosisMappers'

interface DiagnosisResultCardProps {
  result: DiagnoseResponse
}

export function DiagnosisResultCard({ result }: DiagnosisResultCardProps) {
  const isFallback = result.source === 'fallback'

  return (
    <Card title="AI 归因结果">
      {isFallback && (
        <p style={{
          padding: '10px 14px',
          background: '#fef3c7',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: '#92400e',
          marginBottom: 16,
        }}>
          当前结果来自规则兜底，建议确认。
        </p>
      )}
      {result.needReview && (
        <p style={{
          padding: '10px 14px',
          background: '#fee2e2',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: '#991b1b',
          marginBottom: 16,
        }}>
          当前置信度较低，建议手动确认。
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '0.87rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>来源</span>
        <Badge variant={isFallback ? 'warning' : 'success'}>{formatDiagnosisSource(result.source)}</Badge>

        <span style={{ color: 'var(--color-text-muted)' }}>知识点</span>
        <span style={{ fontWeight: 600 }}>{result.knowledgePointName}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>错因标签</span>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {result.errorTags.map((t) => (
            <Tag key={t.id} label={t.name} severity={t.severity} />
          ))}
        </div>

        <span style={{ color: 'var(--color-text-muted)' }}>置信度</span>
        <div>
          <ProgressBar value={Math.round(result.confidence * 100)} max={100} showPercent />
        </div>

        <span style={{ color: 'var(--color-text-muted)' }}>解释</span>
        <span>{result.explanation}</span>

        <span style={{ color: 'var(--color-text-muted)' }}>复练类型</span>
        <Badge variant="info">{formatPracticeType(result.suggestedPracticeType)}</Badge>

        <span style={{ color: 'var(--color-text-muted)' }}>复练理由</span>
        <span>{result.recommendationReason}</span>

        {result.llm && (
          <>
            <span style={{ color: 'var(--color-text-muted)' }}>LLM 模型</span>
            <span>{result.llm.used ? `${result.llm.model ?? '-'} (${result.llm.latencyMs}ms)` : '未调用'}</span>
            {result.llm.usage && (
              <>
                <span style={{ color: 'var(--color-text-muted)' }}>Token 消耗</span>
                <span>in={result.llm.usage.promptTokens ?? '-'} out={result.llm.usage.completionTokens ?? '-'}</span>
              </>
            )}
          </>
        )}
      </div>

      {result.warnings.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-warning)' }}>Warnings</p>
          {result.warnings.map((w) => (
            <p key={w} style={{ margin: '2px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {formatWarning(w)}
            </p>
          ))}
        </div>
      )}
    </Card>
  )
}
