import type {
  KnowledgePoint,
  ErrorTag,
  Mistake,
  DiagnosisResult,
  PracticeTask,
  Achievement,
  WeeklyReport,
  KnowledgeStatus,
  Difficulty,
  ErrorTagId,
} from '../types/domain'
import {
  mockStudent,
  mockErrorTags,
  mockKnowledgePoints,
  mockChapters,
  mockMistakes,
  mockDiagnoses,
  mockPracticeTasks,
  mockAchievements,
  mockWeeklyReport,
} from '../data/mockData'

export function getMockSummary() {
  return {
    studentCount: 1,
    subjectCount: 1,
    chapterCount: mockChapters.length,
    knowledgePointCount: mockKnowledgePoints.length,
    mistakeCount: mockMistakes.length,
    errorTagCount: mockErrorTags.length,
    practiceTaskCount: mockPracticeTasks.length,
    achievementCount: mockAchievements.length,
  }
}

export function getStudentProfile() {
  return mockStudent
}

export function getKnowledgePoints(filters?: {
  status?: KnowledgeStatus
  chapterId?: string
}): KnowledgePoint[] {
  let result = mockKnowledgePoints
  if (filters?.status) {
    result = result.filter((kp) => kp.status === filters.status)
  }
  if (filters?.chapterId) {
    result = result.filter((kp) => kp.chapterId === filters.chapterId)
  }
  return result
}

export function getKnowledgePointById(id: string): KnowledgePoint | null {
  return mockKnowledgePoints.find((kp) => kp.id === id) ?? null
}

export function getErrorTags(): ErrorTag[] {
  return mockErrorTags
}

export function getMistakes(filters?: {
  knowledgePointId?: string
  errorTagId?: ErrorTagId
  difficulty?: Difficulty
}): Mistake[] {
  let result = mockMistakes
  if (filters?.knowledgePointId) {
    result = result.filter((m) => m.knowledgePointId === filters.knowledgePointId)
  }
  if (filters?.errorTagId) {
    result = result.filter((m) => m.errorTagIds.includes(filters.errorTagId!))
  }
  if (filters?.difficulty) {
    result = result.filter((m) => m.difficulty === filters.difficulty)
  }
  return result
}

export function getMistakeById(id: string): Mistake | null {
  return mockMistakes.find((m) => m.id === id) ?? null
}

export function getDiagnosisByMistakeId(mistakeId: string): DiagnosisResult | null {
  return mockDiagnoses.find((d) => d.mistakeId === mistakeId) ?? null
}

export function getTodayPracticeTasks(): PracticeTask[] {
  return mockPracticeTasks.filter((t) => t.status === 'pending')
}

export function getAchievements(): Achievement[] {
  return mockAchievements
}

export function getWeeklyReport(): WeeklyReport {
  return mockWeeklyReport
}

export function getKnowledgeAtlasProgress() {
  const total = mockKnowledgePoints.length
  const undiscovered = mockKnowledgePoints.filter((kp) => kp.status === 'undiscovered').length
  const discovered = mockKnowledgePoints.filter((kp) => kp.status === 'discovered').length
  const toRepair = mockKnowledgePoints.filter((kp) => kp.status === 'to_repair').length
  const repairing = mockKnowledgePoints.filter((kp) => kp.status === 'repairing').length
  const mastered = mockKnowledgePoints.filter((kp) => kp.status === 'mastered').length
  return { total, undiscovered, discovered, toRepair, repairing, mastered }
}
