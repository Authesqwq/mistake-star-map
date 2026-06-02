import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import { validateDiagnoseRequest } from '../schemas/diagnoseRequestSchema'
import { diagnoseMistake, DiagnosisError } from '../services/diagnosis/diagnosisService'
import { getMetrics } from '../services/diagnosis/diagnosisMetrics'

export const diagnoseRouter = Router()

// POST /api/diagnose
diagnoseRouter.post('/', async (req: Request, res: Response) => {
  const validation = validateDiagnoseRequest(req.body)

  if (!validation.valid) {
    res.status(400).json(
      errorResponse('INVALID_DIAGNOSIS_REQUEST', 'Invalid diagnosis request', validation.errors)
    )
    return
  }

  try {
    const result = await diagnoseMistake(validation.data)
    res.json(successResponse(result))
  } catch (err) {
    if (err instanceof DiagnosisError) {
      res.status(400).json(errorResponse(err.code, err.message))
      return
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('[diagnose error]', err)
    }
    res.status(500).json(
      errorResponse('DIAGNOSIS_FAILED', 'Diagnosis failed unexpectedly')
    )
  }
})

// GET /api/diagnose/metrics
diagnoseRouter.get('/metrics', (_req: Request, res: Response) => {
  res.json(successResponse(getMetrics()))
})
