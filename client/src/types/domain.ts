// ── ID aliases ──

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

// ── Student ──

export interface StudentProfile {
  id: string
  name: string
  grade: string
  streakDays: number
  repairValue: number
  totalMistakes: number
  completedPracticeCount: number
}

// ── Subject & Knowledge ──

export interface Subject {
  id: SubjectId
  name: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  subjectId: SubjectId
  name: string
  knowledgePoints: KnowledgePoint[]
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

// ── Error Tag ──

export interface ErrorTag {
  id: ErrorTagId
  name: string
  category: string
  description: string
  severity: number
}

// ── Mistake ──

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

// ── Diagnosis ──

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

// ── Practice ──

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

export interface PracticeResult {
  taskId: string
  studentAnswer: string
  isCorrect: boolean
  timeSpentSeconds: number
  completedAt: string
}

// ── Achievement ──

export interface Achievement {
  id: string
  title: string
  description: string
  category: string
  icon: string
  unlocked: boolean
  unlockedAt: string | null
}

// ── Weekly Report ──

export interface MasterySnapshot {
  knowledgePointId: string
  name: string
  beforeMastery: number
  afterMastery: number
}

export interface WeeklyReport {
  id: string
  weekRange: string
  completedPracticeCount: number
  repairedErrorTags: ErrorTagId[]
  masteryImprovedKnowledgePoints: MasterySnapshot[]
  highRiskKnowledgePoints: { knowledgePointId: string; reason: string }[]
  nextWeekSuggestions: string[]
  generatedAt: string
}

// ── Knowledge Atlas Progress ──

export interface KnowledgeAtlasProgress {
  total: number
  undiscovered: number
  discovered: number
  toRepair: number
  repairing: number
  mastered: number
}
