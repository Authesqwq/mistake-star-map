import { z } from 'zod'

export const localDiagnosisSignalSchema = z.object({
  knowledgePointId: z.string().min(1),
  errorTagIds: z.array(z.string().min(1)).default([]),
  createdAt: z.string().min(1),
  source: z.enum(['llm', 'fallback']),
  needReview: z.boolean(),
})

export const recommendationRequestSchema = z.object({
  subjectId: z.literal('math').default('math'),
  grade: z.string().max(20).optional(),
  limit: z.number().int().min(1).max(5).default(3),
  useAiReason: z.boolean().default(false),
  localDiagnosisSignals: z
    .array(localDiagnosisSignalSchema)
    .max(50)
    .default([]),
})

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>

export function validateRecommendationRequest(
  body: unknown
):
  | { valid: true; data: RecommendationRequest }
  | { valid: false; errors: string[] } {
  const result = recommendationRequestSchema.safeParse(body)
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
    }
  }
  return { valid: true, data: result.data }
}
