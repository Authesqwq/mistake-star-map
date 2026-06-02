import { useState } from 'react'
import { diagnoseSample, ApiError } from '../../services/apiClient'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Tag } from '../ui/Tag'
import { LoadingState } from '../ui/LoadingState'
import { ErrorState } from '../ui/ErrorState'

interface DiagData {
  knowledgePointName: string; errorTags: { id: string; name: string; severity: number }[]
  confidence: number; explanation: string; suggestedPracticeType: string
  recommendationReason: string; needReview: boolean; source: string
  llm: { used: boolean; model?: string; latencyMs: number }
  warnings: string[]
}

export function DiagnosisSmokePanel() {
  const [data, setData] = useState<DiagData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnosis = () => {
    setLoading(true)
    setError(null)
    setData(null)
    diagnoseSample()
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? `${e.code}: ${e.message}` : 'Request failed'))
      .finally(() => setLoading(false))
  }

  return (
    <Card
      title="AI 归因接口联调"
      description="点击按钮调用 /api/diagnose，未配置 LLM 时自动 fallback。"
      footer={
        <Button onClick={runDiagnosis} loading={loading}>
          运行 AI 归因联调
        </Button>
      }
    >
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
        题目：已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。<br />
        错误答案：随 x 增大而增大 → 正确答案：随 x 增大而减小
      </p>

      {loading && <LoadingState text="诊断中..." />}
      {error && <ErrorState message={error} />}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '0.87rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Source</span>
          <Badge variant={data.source === 'llm' ? 'success' : 'warning'}>{data.source}</Badge>

          <span style={{ color: 'var(--color-text-muted)' }}>知识点</span>
          <span style={{ fontWeight: 600 }}>{data.knowledgePointName}</span>

          <span style={{ color: 'var(--color-text-muted)' }}>错因</span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {data.errorTags.map((t) => (
              <Tag key={t.id} label={t.name} severity={t.severity} />
            ))}
          </div>

          <span style={{ color: 'var(--color-text-muted)' }}>置信度</span>
          <span>{(data.confidence * 100).toFixed(0)}%{data.needReview ? ' (需复核)' : ''}</span>

          <span style={{ color: 'var(--color-text-muted)' }}>解释</span>
          <span>{data.explanation}</span>

          <span style={{ color: 'var(--color-text-muted)' }}>复练建议</span>
          <span>{data.recommendationReason}</span>

          <span style={{ color: 'var(--color-text-muted)' }}>LLM</span>
          <span>{data.llm.used ? `${data.llm.model} (${data.llm.latencyMs}ms)` : '未调用'}</span>

          {data.warnings.length > 0 && (
            <>
              <span style={{ color: 'var(--color-text-muted)' }}>Warnings</span>
              <span style={{ color: 'var(--color-warning)', fontSize: '0.82rem' }}>
                {data.warnings.join(', ')}
              </span>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
