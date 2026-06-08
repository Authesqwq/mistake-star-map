export interface DiagnosisEvalCaseResultView {
  caseId: string; title: string; category: string
  passed: boolean; score: number; maxScore: number
  checks: Record<string, boolean>; messages: string[]
}

export interface DiagnosisEvalRunResponse {
  summary: {
    totalCases: number; passedCases: number; failedCases: number
    passRate: number; averageScore: number
    mode: 'fixture' | 'fallback' | 'live'; generatedAt: string
  }
  results: DiagnosisEvalCaseResultView[]
}
