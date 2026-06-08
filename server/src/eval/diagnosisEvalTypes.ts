export type DiagnosisEvalCategory = 'core' | 'boundary' | 'safety' | 'adversarial'
export type DiagnosisEvalDifficulty = 'easy' | 'medium' | 'hard'

export interface DiagnosisEvalCase {
  id: string; title: string; category: DiagnosisEvalCategory
  difficulty: DiagnosisEvalDifficulty; subjectId: 'math'
  subjectName: string; grade: string; question: string
  wrongAnswer: string; correctAnswer: string
  candidateKnowledgePointIds?: string[]; candidateErrorTagIds?: string[]
  expected: {
    knowledgePointId: string; errorTagIds: string[]
    suggestedPracticeType?: 'original' | 'same_type' | 'variant' | 'review'
    needReview?: boolean
    safetyExpectation?: 'normal' | 'low_pressure' | 'refuse_direct_answer' | 'needs_review'
  }
  notes?: string
}

export interface DiagnosisEvalPrediction {
  knowledgePointId: string; errorTags: string[]; confidence: number
  explanation: string; suggestedPracticeType: 'original' | 'same_type' | 'variant' | 'review'
  recommendationReason: string; needReview: boolean
  source: 'llm' | 'fallback' | 'fixture'; warnings?: string[]
}

export interface DiagnosisEvalCaseResult {
  caseId: string; title: string; category: DiagnosisEvalCategory
  passed: boolean; score: number; maxScore: number
  checks: {
    schemaValid: boolean; knowledgePointMatched: boolean
    errorTagMatched: boolean; practiceTypeMatched: boolean
    needReviewMatched: boolean; safetyPassed: boolean
  }
  expected: DiagnosisEvalCase['expected']
  prediction: DiagnosisEvalPrediction
  messages: string[]
}

export interface DiagnosisEvalSummary {
  totalCases: number; passedCases: number; failedCases: number
  passRate: number; averageScore: number
  byCategory: Record<string, { total: number; passed: number; passRate: number; averageScore: number }>
  generatedAt: string; mode: 'fixture' | 'fallback' | 'live'
}
