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

// ── PR8 additions ──

interface StudentData {
  id: string; name: string; grade: string
  streakDays: number; repairValue: number
  totalMistakes: number; completedPracticeCount: number
}

interface PracticeTaskData {
  id: string; mistakeId: string; knowledgePointId: string
  type: string; title: string; question: string
  expectedAnswer: string; recommendationReason: string
  priorityScore: number; status: string; createdAt: string
}

interface AtlasProgressData {
  total: number; undiscovered: number; discovered: number
  toRepair: number; repairing: number; mastered: number
}

interface KnowledgePointData {
  id: string; subjectId: string; chapterId: string
  name: string; description: string; status: string
  mastery: number; relatedMistakeIds: string[]
  majorErrorTagIds: string[]; nextReviewAt: string | null
}

interface MistakeData {
  id: string; subjectId: string; chapterId: string
  knowledgePointId: string; title: string; question: string
  wrongAnswer: string; correctAnswer: string; explanation: string
  difficulty: string; source: string; errorTagIds: string[]
  createdAt: string; updatedAt: string
}

interface ErrorTagData {
  id: string; name: string; category: string
  description: string; severity: number
}

export function getStudentProfile(): Promise<StudentData> {
  return requestJson<StudentData>('/api/mock/student')
}

export function getTodayPracticeTasks(): Promise<PracticeTaskData[]> {
  return requestJson<PracticeTaskData[]>('/api/mock/practice-tasks/today')
}

export function getAtlasProgress(): Promise<AtlasProgressData> {
  return requestJson<AtlasProgressData>('/api/mock/atlas-progress')
}

export function getKnowledgePoints(): Promise<KnowledgePointData[]> {
  return requestJson<KnowledgePointData[]>('/api/mock/knowledge-points')
}

export function getMistakes(): Promise<MistakeData[]> {
  return requestJson<MistakeData[]>('/api/mock/mistakes')
}

export function getErrorTags(): Promise<ErrorTagData[]> {
  return requestJson<ErrorTagData[]>('/api/mock/error-tags')
}

// ── PR9: Diagnosis ──

import type { DiagnoseRequest, DiagnoseResponse } from '../types/diagnosis'

export function diagnoseMistake(payload: DiagnoseRequest): Promise<DiagnoseResponse> {
  return requestJson<DiagnoseResponse>('/api/diagnose', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
