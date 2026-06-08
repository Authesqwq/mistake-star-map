import type { PracticeEvaluateResponse, PracticeResultRecord } from '../types/practice'
import type { RecommendedPracticeTask } from '../types/recommendation'

export function formatPracticeType(type: string): string {
  const map: Record<string, string> = {
    original: '原题回看', same_type: '同类巩固', variant: '变式迁移', review: '间隔复查',
  }
  return map[type] ?? type
}

export function formatEvaluationStatus(status: string): string {
  const map: Record<string, string> = {
    correct: '已答对', incorrect: '待重试', needs_review: '需对照确认',
  }
  return map[status] ?? status
}

export function formatIsCorrect(isCorrect: boolean | null): string {
  if (isCorrect === true) return '正确'
  if (isCorrect === false) return '错误'
  return '需确认'
}

export function getPracticeStatusBadgeVariant(
  status: string
): 'success' | 'danger' | 'warning' {
  if (status === 'correct') return 'success'
  if (status === 'incorrect') return 'danger'
  return 'warning'
}

export function buildPracticeRecordFromTask(
  task: RecommendedPracticeTask,
  evalResponse: PracticeEvaluateResponse
): PracticeResultRecord {
  return {
    id: `pr-${Date.now()}`,
    createdAt: new Date().toISOString(),
    taskId: task.id,
    knowledgePointId: task.knowledgePointId,
    knowledgePointName: task.knowledgePointName,
    practiceType: task.practiceType as PracticeResultRecord['practiceType'],
    question: task.question ?? '',
    expectedAnswer: task.expectedAnswer,
    userAnswer: evalResponse.normalizedUserAnswer ?? '',
    status: evalResponse.status,
    isCorrect: evalResponse.isCorrect,
    feedback: evalResponse.feedback,
    suggestion: evalResponse.suggestion,
    sourceTaskTitle: task.title,
  }
}
