export type SubjectId = 'math'

export type PracticeType = 'original' | 'same_type' | 'variant' | 'review'

export interface CandidateKnowledgePoint {
  id: string
  name: string
  chapterId: string
  chapterName: string
  description?: string
}

export interface CandidateErrorTag {
  id: string
  name: string
  category: string
  description: string
  severity: number
}

export interface DiagnosisPromptInput {
  subjectId: SubjectId
  subjectName: string
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  candidateKnowledgePoints: CandidateKnowledgePoint[]
  candidateErrorTags: CandidateErrorTag[]
}

export interface DiagnosisModelOutput {
  knowledgePointId: string
  errorTags: string[]
  confidence: number
  explanation: string
  suggestedPracticeType: PracticeType
  recommendationReason: string
  needReview: boolean
}
