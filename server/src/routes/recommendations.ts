import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import { validateRecommendationRequest } from '../schemas/recommendationRequestSchema'
import { getTodayRecommendations } from '../services/recommendations/recommendationService'
import { getRecommendationMetrics } from '../services/recommendations/recommendationMetrics'

export const recommendationRouter = Router()

// POST /api/recommendations/today
recommendationRouter.post('/today', async (req: Request, res: Response) => {
  const validation = validateRecommendationRequest(req.body)
  if (!validation.valid) {
    res.status(400).json(
      errorResponse(
        'INVALID_RECOMMENDATION_REQUEST',
        'Invalid recommendation request',
        validation.errors
      )
    )
    return
  }

  try {
    const result = await getTodayRecommendations(validation.data)
    res.json(successResponse(result))
  } catch {
    res.status(500).json(
      errorResponse('RECOMMENDATION_FAILED', 'Failed to generate recommendations')
    )
  }
})

// GET /api/recommendations/metrics
recommendationRouter.get('/metrics', (_req: Request, res: Response) => {
  res.json(successResponse(getRecommendationMetrics()))
})
