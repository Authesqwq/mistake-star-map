import type { ApiSuccessResponse, ApiErrorResponse } from '../types/api'

export function successResponse<T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  }
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: { code, message, ...(details !== undefined && { details }) },
    timestamp: new Date().toISOString(),
  }
}
