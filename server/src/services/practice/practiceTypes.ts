export type PracticeEvaluationStatus = 'correct' | 'incorrect' | 'needs_review'
export type PracticeFeedbackTone = 'encouraging' | 'neutral'

export interface PracticeEvaluateRequest {
  taskId: string
  knowledgePointId: string
  knowledgePointName?: string
  practiceType: 'original' | 'same_type' | 'variant' | 'review'
  question: string
  expectedAnswer?: string
  userAnswer: string
}

export interface PracticeEvaluateResponse {
  taskId: string
  status: PracticeEvaluationStatus
  isCorrect: boolean | null
  normalizedExpectedAnswer?: string
  normalizedUserAnswer?: string
  feedback: string
  suggestion: string
  shouldRetry: boolean
  evaluatedBy: 'rule'
  warnings: string[]
}
