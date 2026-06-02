import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import { getLlmProviderStatus, assertLlmConfigured, chatCompletion } from '../services/llm'
import {
  LlmConfigurationError,
  LlmTimeoutError,
  LlmProviderError,
  LlmResponseParseError,
} from '../services/llm/llmErrors'

export const llmRouter = Router()

// GET /api/llm/status
llmRouter.get('/status', (_req: Request, res: Response) => {
  const status = getLlmProviderStatus()
  res.json(successResponse(status))
})

// POST /api/llm/smoke-test
llmRouter.post('/smoke-test', async (req: Request, res: Response) => {
  try {
    assertLlmConfigured()
  } catch (err) {
    if (err instanceof LlmConfigurationError) {
      res
        .status(400)
        .json(errorResponse('LLM_NOT_CONFIGURED', err.message))
      return
    }
    throw err
  }

  const { message } = req.body
  if (!message || typeof message !== 'string') {
    res
      .status(400)
      .json(errorResponse('BAD_REQUEST', 'Missing "message" field in request body'))
    return
  }

  try {
    const result = await chatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Keep responses brief.' },
        { role: 'user', content: message },
      ],
    })

    res.json(successResponse(result))
  } catch (err) {
    if (err instanceof LlmTimeoutError) {
      res.status(504).json(errorResponse('LLM_TIMEOUT', err.message))
      return
    }
    if (err instanceof LlmProviderError) {
      res
        .status(502)
        .json(errorResponse('LLM_PROVIDER_ERROR', err.message, { status: err.status }))
      return
    }
    if (err instanceof LlmResponseParseError) {
      res.status(502).json(errorResponse('LLM_RESPONSE_PARSE_ERROR', err.message))
      return
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[llm smoke-test error]', err)
    }
    res
      .status(500)
      .json(errorResponse('LLM_UNEXPECTED_ERROR', 'Unexpected error during smoke test'))
  }
})
