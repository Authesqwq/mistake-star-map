import type { KnowledgeStatus } from './domain'

export type MasteryChangeReason =
  | 'local_diagnosis'
  | 'practice_correct'
  | 'practice_incorrect'
  | 'practice_needs_review'
  | 'time_decay'

export interface MasteryChange {
  id: string
  knowledgePointId: string
  createdAt: string
  reason: MasteryChangeReason
  delta: number
  sourceRecordId?: string
  description: string
}

export interface MasterySnapshot {
  knowledgePointId: string
  baseMastery: number
  currentMastery: number
  displayStatus: KnowledgeStatus
  changes: MasteryChange[]
  localDiagnosisCount: number
  practiceResultCount: number
  correctCount: number
  incorrectCount: number
  needsReviewCount: number
  lastPracticedAt?: string
  nextReviewAt?: string | null
}

export interface MasteryOverview {
  total: number
  discovered: number
  toRepair: number
  repairing: number
  mastered: number
  averageMastery: number
  highRiskCount: number
}
