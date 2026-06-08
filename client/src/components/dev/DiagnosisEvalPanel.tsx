import { useEffect, useState } from 'react'
import { getDiagnosisEvalSummary, runDiagnosisEval, ApiError } from '../../services/apiClient'
import type { DiagnosisEvalRunResponse } from '../../types/eval'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { LoadingState } from '../ui/LoadingState'
import { ErrorState } from '../ui/ErrorState'

export function DiagnosisEvalPanel() {
  const [summary, setSummary] = useState<{ totalCases: number; byCategory: Record<string, number> } | null>(null)
  const [evalResult, setEvalResult] = useState<DiagnosisEvalRunResponse | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDiagnosisEvalSummary()
      .then(setSummary)
      .catch(() => {})
  }, [])

  const runEval = async (mode: 'fixture' | 'fallback') => {
    setRunning(true)
    setError(null)
    try {
      const result = await runDiagnosisEval({ mode })
      setEvalResult(result)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Eval failed')
    } finally {
      setRunning(false)
    }
  }

  const failed = evalResult?.results.filter((r) => !r.passed) ?? []

  return (
    <Card title="诊断评测" description="评测面板用于验证 Prompt、Schema、Fallback 和诊断输出稳定性。前端只支持 fixture/fallback，live LLM 评测需在命令行手动执行。">
      {summary && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant="info">总计 {summary.totalCases}</Badge>
            {Object.entries(summary.byCategory).map(([cat, count]) => (
              <Badge key={cat} variant="default">{cat}: {count}</Badge>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button size="sm" onClick={() => runEval('fixture')} loading={running}>
          运行 fixture 评测
        </Button>
        <Button size="sm" variant="secondary" onClick={() => runEval('fallback')} loading={running}>
          运行 fallback 评测
        </Button>
      </div>

      {running && <LoadingState text="评测运行中..." />}
      {error && <ErrorState message={error} />}

      {evalResult && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Badge variant={evalResult.summary.passRate >= 80 ? 'success' : 'danger'}>
              Pass: {evalResult.summary.passRate}%
            </Badge>
            <Badge variant="info">Avg: {evalResult.summary.averageScore}</Badge>
            <Badge variant="warning">{evalResult.summary.totalCases} cases</Badge>
          </div>

          {failed.length > 0 && (
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8 }}>
                失败 Cases ({failed.length})
              </p>
              {failed.map((f) => (
                <div key={f.caseId} style={{
                  padding: '8px 12px', marginBottom: 6, fontSize: '0.82rem',
                  background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{f.caseId}: {f.title}</span>
                    <Badge variant="danger">{f.score}/{f.maxScore}</Badge>
                  </div>
                  {f.messages.map((m, i) => (
                    <p key={i} style={{ margin: '2px 0 0', color: 'var(--color-text-muted)' }}>{m}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
