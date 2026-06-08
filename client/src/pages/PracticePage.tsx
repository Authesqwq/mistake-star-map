import { useState } from 'react'
import type { RecommendedPracticeTask } from '../types/recommendation'
import type { PracticeEvaluateResponse } from '../types/practice'
import { evaluatePracticeAnswer, ApiError } from '../services/apiClient'
import { savePracticeResult } from '../utils/practiceStorage'
import { buildPracticeRecordFromTask } from '../utils/practiceMappers'
import { PracticeTaskHeader } from '../components/practice/PracticeTaskHeader'
import { PracticeQuestionCard } from '../components/practice/PracticeQuestionCard'
import { AnswerInputPanel } from '../components/practice/AnswerInputPanel'
import { PracticeFeedbackCard } from '../components/practice/PracticeFeedbackCard'
import { PracticeResultList } from '../components/practice/PracticeResultList'
import { PracticeEmptyState } from '../components/practice/PracticeEmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'

interface PracticePageProps {
  selectedTask: RecommendedPracticeTask | null
  onBack: () => void
}

export function PracticePage({ selectedTask, onBack }: PracticePageProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState<PracticeEvaluateResponse | null>(null)
  const [saved, setSaved] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!selectedTask) {
    return (
      <div>
        <SectionHeader title="复练任务" description="从今日三题中选择一个任务开始复练" />
        <PracticeEmptyState onBackToToday={onBack} />
      </div>
    )
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await evaluatePracticeAnswer({
        taskId: selectedTask.id,
        knowledgePointId: selectedTask.knowledgePointId,
        knowledgePointName: selectedTask.knowledgePointName,
        practiceType: selectedTask.practiceType as 'original' | 'same_type' | 'variant' | 'review',
        question: selectedTask.question ?? selectedTask.title,
        expectedAnswer: selectedTask.expectedAnswer,
        userAnswer,
      })
      setEvaluation(result)

      // Save to localStorage
      if (!saved) {
        const record = buildPracticeRecordFromTask(selectedTask, result)
        savePracticeResult(record)
        setSaved(true)
      }
    } catch (e) {
      setSubmitError(e instanceof ApiError ? `${e.code}: ${e.message}` : '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setUserAnswer('')
    setEvaluation(null)
    setSaved(false)
    setSubmitError(null)
  }

  return (
    <div>
      <SectionHeader title="复练任务" description="仔细阅读题目，输入你的答案，提交后查看反馈" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 24,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PracticeTaskHeader task={selectedTask} onBack={onBack} />
          <PracticeQuestionCard
            question={selectedTask.question ?? '该任务暂无具体题干，这是一个知识点级复练任务。'}
            expectedAnswer={selectedTask.expectedAnswer}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnswerInputPanel
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={submitting}
            hasResult={!!evaluation}
          />

          {submitError && (
            <div style={{
              padding: 12, background: '#fee2e2', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', color: 'var(--color-danger)',
            }}>
              {submitError}
            </div>
          )}

          {evaluation && (
            <PracticeFeedbackCard
              evaluation={evaluation}
              userAnswer={userAnswer}
              expectedAnswer={selectedTask.expectedAnswer}
            />
          )}
        </div>
      </div>

      <PracticeResultList />
    </div>
  )
}
