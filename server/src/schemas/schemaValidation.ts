import { diagnosisModelOutputSchema } from './diagnosisSchema'
import type { DiagnosisModelOutput } from '../prompts/promptTypes'
import type { CandidateKnowledgePoint, CandidateErrorTag } from '../prompts/promptTypes'

export interface DiagnosisValidationResult {
  valid: boolean
  data?: DiagnosisModelOutput
  errors?: string[]
}

export function validateDiagnosisModelOutput(
  raw: unknown
): DiagnosisValidationResult {
  const result = diagnosisModelOutputSchema.safeParse(raw)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map(
        (issue) => `[${issue.path.join('.')}] ${issue.message}`
      ),
    }
  }

  return { valid: true, data: result.data as DiagnosisModelOutput }
}

export function validateDiagnosisAgainstCandidates(
  output: DiagnosisModelOutput,
  candidateKnowledgePoints: CandidateKnowledgePoint[],
  candidateErrorTags: CandidateErrorTag[]
): DiagnosisValidationResult {
  const errors: string[] = []

  const kpIds = new Set(candidateKnowledgePoints.map((kp) => kp.id))
  if (!kpIds.has(output.knowledgePointId)) {
    errors.push(
      `knowledgePointId "${output.knowledgePointId}" is not in candidate knowledge points`
    )
  }

  const tagIds = new Set(candidateErrorTags.map((t) => t.id))
  for (const tagId of output.errorTags) {
    if (!tagIds.has(tagId)) {
      errors.push(
        `errorTag "${tagId}" is not in candidate error tags`
      )
    }
  }

  if (output.confidence < 0.7 && !output.needReview) {
    errors.push(
      `confidence is ${output.confidence} but needReview is false; consider setting needReview: true`
    )
  }

  if (errors.length > 0) {
    return { valid: false, data: output, errors }
  }

  return { valid: true, data: output }
}
