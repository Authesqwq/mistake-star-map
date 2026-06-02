import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/apiResponse'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (process.env.NODE_ENV === 'development') {
    console.error('[server error]', err.message, err.stack)
  } else {
    console.error('[server error]', err.message)
  }

  if (res.headersSent) {
    return _next(err)
  }

  res.status(500).json(
    errorResponse(
      'INTERNAL_SERVER_ERROR',
      process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    )
  )
}
