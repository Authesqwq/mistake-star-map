import { z } from 'zod'

export const diagnosisModelOutputSchema = z
  .object({
    knowledgePointId: z.string().min(1),
    errorTags: z.array(z.string().min(1)).min(1).max(3),
    confidence: z.number().min(0).max(1),
    explanation: z.string().min(1).max(160),
    suggestedPracticeType: z.enum([
      'original',
      'same_type',
      'variant',
      'review',
    ]),
    recommendationReason: z.string().min(1).max(180),
    needReview: z.boolean(),
  })
  .strict()

export type DiagnosisModelOutputSchema = z.infer<
  typeof diagnosisModelOutputSchema
>
