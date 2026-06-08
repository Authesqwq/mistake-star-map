import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import { diagnosisEvalCases } from '../eval/diagnosisEvalCases'
import { runDiagnosisEval } from '../eval/diagnosisEvalRunner'
import type { DiagnosisEvalCategory } from '../eval/diagnosisEvalTypes'

export const evalRouter = Router()

// GET /api/eval/diagnosis/summary
evalRouter.get('/diagnosis/summary', (_req: Request, res: Response) => {
  const byCategory: Record<string, number> = {}
  for (const c of diagnosisEvalCases) {
    byCategory[c.category] = (byCategory[c.category] ?? 0) + 1
  }
  res.json(successResponse({ totalCases: diagnosisEvalCases.length, byCategory }))
})

// POST /api/eval/diagnosis/run
evalRouter.post('/diagnosis/run', async (req: Request, res: Response) => {
  const { mode = 'fixture', category = 'all', limit = 30 } = req.body

  if (mode === 'live') {
    res.status(400).json(
      errorResponse('LIVE_EVAL_NOT_SUPPORTED', 'Live eval is not available via API. Use CLI: npm run eval:diagnosis:live')
    )
    return
  }

  if (mode !== 'fixture' && mode !== 'fallback') {
    res.status(400).json(errorResponse('INVALID_MODE', 'Mode must be fixture or fallback'))
    return
  }

  try {
    const { summary, results } = await runDiagnosisEval({
      mode: mode as 'fixture' | 'fallback',
      category: category as DiagnosisEvalCategory | 'all',
      limit,
    })
    res.json(successResponse({ summary, results }))
  } catch (err) {
    res.status(500).json(errorResponse('EVAL_FAILED', (err as Error).message))
  }
})
