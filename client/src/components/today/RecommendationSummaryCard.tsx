import type { RecommendationResponse } from '../../types/recommendation'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatRecommendationSource, formatWarning } from '../../utils/recommendationMappers'

interface RecommendationSummaryCardProps {
  response: RecommendationResponse
}

export function RecommendationSummaryCard({ response }: RecommendationSummaryCardProps) {
  const isFallback = response.source === 'mock_fallback'

  return (
    <Card title="推荐说明" description="今日三题由规则优先级生成，本地确认记录会影响推荐排序。大模型不参与排序。">
      {isFallback && (
        <p style={{
          padding: '10px 14px', marginBottom: 12, background: '#fef3c7',
          borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#92400e',
        }}>
          推荐服务异常，当前使用默认兜底任务。
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>来源</span>
        <Badge variant={isFallback ? 'warning' : 'success'}>
          {formatRecommendationSource(response.source)}
        </Badge>
        <span style={{ color: 'var(--color-text-muted)' }}>候选</span>
        <span>{response.summary.candidateCount}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>返回</span>
        <span>{response.summary.returnedCount}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>本地信号</span>
        <span>{response.summary.localSignalCount}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>评分版本</span>
        <span>{response.summary.scoringVersion}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>AI 理由</span>
        <span>{response.summary.aiReasonUsed ? '是' : '否'}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>生成时间</span>
        <span>{new Date(response.summary.generatedAt).toLocaleString('zh-CN')}</span>
      </div>

      {response.warnings.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {response.warnings.map((w) => (
            <p key={w} style={{ margin: '2px 0', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
              {formatWarning(w)}
            </p>
          ))}
        </div>
      )}
    </Card>
  )
}
