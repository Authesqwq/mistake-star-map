import { useState } from 'react'
import type { PracticeResultRecord } from '../../types/practice'
import { getPracticeResults, clearPracticeResults } from '../../utils/practiceStorage'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { formatEvaluationStatus, getPracticeStatusBadgeVariant } from '../../utils/practiceMappers'

export function PracticeResultList() {
  const [results, setResults] = useState<PracticeResultRecord[]>(() => getPracticeResults().slice(-5).reverse())
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearPracticeResults()
      setResults([])
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  if (results.length === 0) {
    return <EmptyState title="暂无复练记录" description="完成答题后，记录会显示在这里" />
  }

  return (
    <Card
      title="最近复练记录"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {confirmClear ? (
            <>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)' }}>
                再次点击确认清空所有本地复练记录。
              </span>
              <Button size="sm" variant="danger" onClick={handleClear}>确认清空</Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>取消</Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={handleClear}>清空记录</Button>
          )}
        </div>
      }
    >
      {results.map((r) => (
        <div
          key={r.id}
          style={{
            padding: '10px 14px', marginBottom: 8,
            background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{r.sourceTaskTitle ?? r.knowledgePointName}</span>
            <Badge variant={getPracticeStatusBadgeVariant(r.status)}>
              {formatEvaluationStatus(r.status)}
            </Badge>
          </div>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
            {new Date(r.createdAt).toLocaleString('zh-CN')} · {r.knowledgePointName}
          </p>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)' }}>
            答题: {r.userAnswer.slice(0, 40)}{r.userAnswer.length > 40 ? '...' : ''}
          </p>
        </div>
      ))}
    </Card>
  )
}
