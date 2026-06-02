export { diagnoseMistake, DiagnosisError } from './diagnosisService'
export type { DiagnoseResponseData } from './diagnosisService'
export { buildFallbackDiagnosis } from './diagnosisFallback'
export { extractJsonFromLlmContent, parseDiagnosisModelOutput } from './diagnosisParser'
export {
  recordRequest,
  recordLlmSuccess,
  recordFallback,
  recordLlmNotConfigured,
  recordParseFailure,
  recordCandidateValidationFailure,
  getMetrics,
} from './diagnosisMetrics'
export type {
  SubjectId,
  PracticeType,
  CandidateKnowledgePoint,
  CandidateErrorTag,
  DiagnosisPromptInput,
  DiagnosisModelOutput,
} from './diagnosisTypes'
