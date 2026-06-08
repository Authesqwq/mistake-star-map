import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface AnswerInputPanelProps {
  userAnswer: string
  onAnswerChange: (v: string) => void
  onSubmit: () => void
  onReset: () => void
  loading: boolean
  hasResult: boolean
}

export function AnswerInputPanel({
  userAnswer, onAnswerChange, onSubmit, onReset, loading, hasResult,
}: AnswerInputPanelProps) {
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setError('请输入答案')
      return
    }
    setError('')
    onSubmit()
  }

  return (
    <Card title="作答区">
      <textarea
        value={userAnswer}
        onChange={(e) => { onAnswerChange(e.target.value); setError('') }}
        placeholder="请输入你的答案..."
        style={{
          width: '100%', minHeight: 80, padding: '10px 12px',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontFamily: 'inherit',
          color: 'var(--color-text)', background: 'var(--color-surface)', resize: 'vertical',
        }}
      />
      {error && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-danger)' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Button onClick={handleSubmit} loading={loading} disabled={hasResult && !loading}>
          提交答案
        </Button>
        {hasResult && <Button variant="ghost" onClick={onReset}>重新作答</Button>}
      </div>
    </Card>
  )
}
