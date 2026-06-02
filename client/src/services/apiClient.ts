import type { ApiResponse } from './apiTypes'

export async function requestJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const json: ApiResponse<T> = await res.json()

  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message, json.error.details)
  }

  if (!res.ok) {
    throw new ApiError('HTTP_ERROR', `HTTP ${res.status}`)
  }

  return json.data
}

export class ApiError extends Error {
  public readonly code: string
  public readonly details?: unknown

  constructor(code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

// ── Typed helpers ──

interface HealthData {
  status: string
  service: string
  version: string
  environment: string
  llmConfigured: boolean
  llmProvider?: { configured: boolean; modelConfigured: boolean; baseUrlConfigured: boolean }
  uptime: number
}

interface MockSummary {
  studentCount: number; subjectCount: number; chapterCount: number
  knowledgePointCount: number; mistakeCount: number; errorTagCount: number
  practiceTaskCount: number; achievementCount: number
}

interface LlmStatus {
  configured: boolean; modelConfigured: boolean; baseUrlConfigured: boolean
  apiKeyConfigured: boolean; model: string; timeoutMs: number; maxRetries: number
}

interface DiagnoseData {
  knowledgePointId: string; knowledgePointName: string
  errorTags: { id: string; name: string; severity: number }[]
  confidence: number; explanation: string
  suggestedPracticeType: string; recommendationReason: string
  needReview: boolean; source: string
  llm: { used: boolean; model?: string; latencyMs: number }
  warnings: string[]
}

export function getHealth(): Promise<HealthData> {
  return requestJson<HealthData>('/api/health')
}

export function getMockSummary(): Promise<MockSummary> {
  return requestJson<MockSummary>('/api/mock/summary')
}

export function getLlmStatus(): Promise<LlmStatus> {
  return requestJson<LlmStatus>('/api/llm/status')
}

export function diagnoseSample(): Promise<DiagnoseData> {
  return requestJson<DiagnoseData>('/api/diagnose', {
    method: 'POST',
    body: JSON.stringify({
      subjectId: 'math',
      subjectName: '数学',
      grade: '八年级',
      question: '已知一次函数 y = -2x + 3，判断函数图像随 x 增大如何变化。',
      wrongAnswer: '随 x 增大而增大',
      correctAnswer: '随 x 增大而减小',
    }),
  })
}
