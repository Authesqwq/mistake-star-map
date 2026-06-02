import { Router, Request, Response } from 'express'
import { isLLMConfigured, getEnvironment } from '../config/env'
import { getLlmProviderStatus } from '../services/llm'
import { successResponse } from '../utils/apiResponse'

export const healthRouter = Router()

const startTime = Date.now()

healthRouter.get('/health', (_req: Request, res: Response) => {
  const uptime = parseFloat(((Date.now() - startTime) / 1000).toFixed(1))

  res.json(
    successResponse({
      status: 'ok',
      service: 'mistake-star-map-server',
      version: '0.1.0',
      environment: getEnvironment(),
      llmConfigured: isLLMConfigured(),
      llmProvider: {
        configured: getLlmProviderStatus().configured,
        modelConfigured: getLlmProviderStatus().modelConfigured,
        baseUrlConfigured: getLlmProviderStatus().baseUrlConfigured,
      },
      uptime,
    })
  )
})
