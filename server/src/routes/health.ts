import { Router, Request, Response } from 'express'
import { isLLMConfigured } from '../config/env'

export const healthRouter = Router()

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'mistake-star-map-server',
    llmConfigured: isLLMConfigured(),
    timestamp: new Date().toISOString(),
  })
})
