// Server-side domain types mirroring client/src/types/domain.ts
// MVP: kept in sync manually; future PR will extract shared types.

export type SubjectId = 'math'

export type KnowledgeStatus =
  | 'undiscovered'
  | 'discovered'
  | 'to_repair'
  | 'repairing'
  | 'mastered'

export type ErrorTagId =
  | 'careless_calculation'
  | 'concept_confusion'
  | 'logic_gap'
  | 'question_misread'
  | 'method_transfer_weak'
  | 'incomplete_expression'
  | 'formula_misuse'

export type PracticeType = 'original' | 'same_type' | 'variant' | 'review'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type MistakeSource = 'manual' | 'mock' | 'photo_ocr_future'
export type DiagnosisSource = 'mock' | 'llm' | 'fallback' | 'user_corrected'
export type PracticeTaskStatus = 'pending' | 'completed' | 'skipped'

export interface StudentProfile {
  id: string
  name: string
  grade: string
  streakDays: number
  repairValue: number
  totalMistakes: number
  completedPracticeCount: number
}

export interface KnowledgePoint {
  id: string
  subjectId: SubjectId
  chapterId: string
  name: string
  description: string
  status: KnowledgeStatus
  mastery: number
  relatedMistakeIds: string[]
  majorErrorTagIds: ErrorTagId[]
  nextReviewAt: string | null
}

export interface ErrorTag {
  id: ErrorTagId
  name: string
  category: string
  description: string
  severity: number
}

export interface Mistake {
  id: string
  subjectId: SubjectId
  chapterId: string
  knowledgePointId: string
  title: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  explanation: string
  difficulty: Difficulty
  source: MistakeSource
  errorTagIds: ErrorTagId[]
  createdAt: string
  updatedAt: string
}

export interface DiagnosisResult {
  id: string
  mistakeId: string
  knowledgePointId: string
  errorTags: ErrorTagId[]
  confidence: number
  explanation: string
  suggestedPracticeType: PracticeType
  recommendationReason: string
  needReview: boolean
  source: DiagnosisSource
  createdAt: string
}

export interface PracticeTask {
  id: string
  mistakeId: string
  knowledgePointId: string
  type: PracticeType
  title: string
  question: string
  expectedAnswer: string
  recommendationReason: string
  priorityScore: number
  status: PracticeTaskStatus
  createdAt: string
}
