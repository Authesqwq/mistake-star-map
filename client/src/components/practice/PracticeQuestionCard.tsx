import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface PracticeQuestionCardProps {
  question: string
  expectedAnswer?: string
}

export function PracticeQuestionCard({ question, expectedAnswer }: PracticeQuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Card title="题目">
      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-text)' }}>
        {question}
      </p>
      <div style={{ marginTop: 16, padding: 12, background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
        {!showAnswer ? (
          <Button variant="ghost" size="sm" onClick={() => setShowAnswer(true)}>
            查看参考答案
          </Button>
        ) : expectedAnswer ? (
          <div>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>参考答案</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--color-text)' }}>{expectedAnswer}</p>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            该任务暂无标准答案，将以需对照确认处理。
          </p>
        )}
      </div>
    </Card>
  )
}
