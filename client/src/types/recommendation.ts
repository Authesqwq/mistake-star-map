export type RecommendationSource = 'rule' | 'rule_with_ai_reason' | 'mock_fallback'
export type TaskRole = 'core_repair' | 'same_type_reinforce' | 'spaced_review'
export type PracticeType = 'original' | 'same_type' | 'variant' | 'review'

export interface LocalDiagnosisSignal {
  knowledgePointId: string
  errorTagIds: string[]
  createdAt: string
  source: 'llm' | 'fallback'
  needReview: boolean
}

export interface PriorityBreakdown {
  mistakeFrequencyScore: number
  errorSeverityScore: number
  masteryGapScore: number
  reviewDueScore: number
  weightedScore: number
}

export interface RecommendedPracticeTask {
  id: string
  taskRole: TaskRole
  mistakeId?: string
  knowledgePointId: string
  knowledgePointName: string
  chapterId: string
  chapterName: string
  practiceType: PracticeType
  title: string
  question?: string
  expectedAnswer?: string
  recommendationReason: string
  priorityScore: number
  priorityBreakdown: PriorityBreakdown
  sourceSignals: {
    relatedMistakeCount: number
    localDiagnosisCount: number
    majorErrorTagIds: string[]
    mastery: number
    nextReviewAt?: string | null
  }
  status: 'pending'
}

export interface RecommendationResponse {
  source: RecommendationSource
  tasks: RecommendedPracticeTask[]
  summary: {
    candidateCount: number
    returnedCount: number
    localSignalCount: number
    scoringVersion: string
    generatedAt: string
    aiReasonUsed: boolean
  }
  warnings: string[]
}

export interface TodayRecommendationRequest {
  subjectId: 'math'
  grade?: string
  limit?: number
  useAiReason?: boolean
  localDiagnosisSignals?: LocalDiagnosisSignal[]
}
