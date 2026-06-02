import { Request, Response } from 'express'
import { errorResponse } from '../utils/apiResponse'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json(
    errorResponse('NOT_FOUND', 'Route not found')
  )
}
