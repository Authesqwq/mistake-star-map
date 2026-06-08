import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import { validatePracticeEvaluateRequest } from '../schemas/practiceEvaluateRequestSchema'
import { evaluatePracticeAnswer } from '../services/practice/practiceService'
import { getPracticeMetrics } from '../services/practice/practiceMetrics'

export const practiceRouter = Router()

// POST /api/practice/evaluate
practiceRouter.post('/evaluate', (req: Request, res: Response) => {
  const validation = validatePracticeEvaluateRequest(req.body)
  if (!validation.valid) {
    res.status(400).json(
      errorResponse(
        'INVALID_PRACTICE_EVALUATE_REQUEST',
        'Invalid practice evaluate request',
        validation.errors
      )
    )
    return
  }

  try {
    const result = evaluatePracticeAnswer(validation.data)
    res.json(successResponse(result))
  } catch {
    res.status(500).json(
      errorResponse('EVALUATION_FAILED', 'Failed to evaluate answer')
    )
  }
})

// GET /api/practice/metrics
practiceRouter.get('/metrics', (_req: Request, res: Response) => {
  res.json(successResponse(getPracticeMetrics()))
})
