export interface DiagnoseRequest {
  subjectId: 'math'
  subjectName?: string
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  candidateKnowledgePointIds?: string[]
  candidateErrorTagIds?: string[]
}

export interface DiagnoseResponse {
  knowledgePointId: string
  knowledgePointName: string
  errorTags: Array<{ id: string; name: string; severity: number }>
  confidence: number
  explanation: string
  suggestedPracticeType: 'original' | 'same_type' | 'variant' | 'review'
  recommendationReason: string
  needReview: boolean
  source: 'llm' | 'fallback'
  llm?: {
    used: boolean
    model?: string
    latencyMs?: number
    usage?: {
      promptTokens?: number
      completionTokens?: number
      totalTokens?: number
    }
  }
  warnings: string[]
}

export interface ConfirmedDiagnosisRecord {
  id: string
  createdAt: string
  subjectId: 'math'
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  originalDiagnosis: DiagnoseResponse
  correctedKnowledgePointId: string
  correctedKnowledgePointName: string
  correctedErrorTags: Array<{ id: string; name: string; severity: number }>
  source: 'llm' | 'fallback'
  needReview: boolean
}
