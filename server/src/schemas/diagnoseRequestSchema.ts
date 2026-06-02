import { z } from 'zod'

export const diagnoseRequestSchema = z.object({
  subjectId: z.literal('math'),
  subjectName: z.string().optional().default('数学'),
  grade: z.string().min(1).max(20),
  question: z.string().min(5).max(2000),
  wrongAnswer: z.string().min(1).max(1000),
  correctAnswer: z.string().min(1).max(1000),
  candidateKnowledgePointIds: z.array(z.string().min(1)).optional(),
  candidateErrorTagIds: z.array(z.string().min(1)).optional(),
})

export type DiagnoseRequest = z.infer<typeof diagnoseRequestSchema>

export function validateDiagnoseRequest(body: unknown): {
  valid: true
  data: DiagnoseRequest
} | {
  valid: false
  errors: string[]
} {
  const result = diagnoseRequestSchema.safeParse(body)
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
