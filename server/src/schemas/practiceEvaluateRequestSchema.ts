import { z } from 'zod'

export const practiceEvaluateRequestSchema = z.object({
  taskId: z.string().min(1),
  knowledgePointId: z.string().min(1),
  knowledgePointName: z.string().optional(),
  practiceType: z.enum(['original', 'same_type', 'variant', 'review']),
  question: z.string().min(1).max(3000),
  expectedAnswer: z.string().max(1000).optional(),
  userAnswer: z.string().min(1).max(1000),
})

export type PracticeEvaluateRequest = z.infer<typeof practiceEvaluateRequestSchema>

export function validatePracticeEvaluateRequest(body: unknown):
  | { valid: true; data: PracticeEvaluateRequest }
  | { valid: false; errors: string[] } {
  const result = practiceEvaluateRequestSchema.safeParse(body)
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map(
        (i) => `${i.path.join('.')}: ${i.message}`
      ),
    }
  }
  return { valid: true, data: result.data }
}
