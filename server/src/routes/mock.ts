import { Router, Request, Response } from 'express'
import { successResponse, errorResponse } from '../utils/apiResponse'
import * as mockService from '../services/mockDataService'
import type { KnowledgeStatus, ErrorTagId, Difficulty } from '../types/domain'

export const mockRouter = Router()

// GET /api/mock/summary
mockRouter.get('/summary', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getMockSummary()))
})

// GET /api/mock/student
mockRouter.get('/student', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getStudentProfile()))
})

// GET /api/mock/knowledge-points
mockRouter.get('/knowledge-points', (req: Request, res: Response) => {
  const { status, chapterId } = req.query
  const filters: { status?: KnowledgeStatus; chapterId?: string } = {}
  if (typeof status === 'string') {
    filters.status = status as KnowledgeStatus
  }
  if (typeof chapterId === 'string') {
    filters.chapterId = chapterId
  }
  res.json(successResponse(mockService.getKnowledgePoints(filters)))
})

// GET /api/mock/knowledge-points/:id
mockRouter.get('/knowledge-points/:id', (req: Request, res: Response) => {
  const kp = mockService.getKnowledgePointById(req.params.id)
  if (!kp) {
    res.status(404).json(errorResponse('NOT_FOUND', `Knowledge point '${req.params.id}' not found`))
    return
  }
  res.json(successResponse(kp))
})

// GET /api/mock/error-tags
mockRouter.get('/error-tags', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getErrorTags()))
})

// GET /api/mock/mistakes
mockRouter.get('/mistakes', (req: Request, res: Response) => {
  const { knowledgePointId, errorTagId, difficulty } = req.query
  const filters: {
    knowledgePointId?: string
    errorTagId?: ErrorTagId
    difficulty?: Difficulty
  } = {}
  if (typeof knowledgePointId === 'string') filters.knowledgePointId = knowledgePointId
  if (typeof errorTagId === 'string') filters.errorTagId = errorTagId as ErrorTagId
  if (typeof difficulty === 'string') filters.difficulty = difficulty as Difficulty
  res.json(successResponse(mockService.getMistakes(filters)))
})

// GET /api/mock/mistakes/:id
mockRouter.get('/mistakes/:id', (req: Request, res: Response) => {
  const mistake = mockService.getMistakeById(req.params.id)
  if (!mistake) {
    res.status(404).json(errorResponse('NOT_FOUND', `Mistake '${req.params.id}' not found`))
    return
  }
  res.json(successResponse(mistake))
})

// GET /api/mock/diagnosis/:mistakeId
mockRouter.get('/diagnosis/:mistakeId', (req: Request, res: Response) => {
  const diagnosis = mockService.getDiagnosisByMistakeId(req.params.mistakeId)
  if (!diagnosis) {
    res.status(404).json(
      errorResponse('NOT_FOUND', `Diagnosis for mistake '${req.params.mistakeId}' not found`)
    )
    return
  }
  res.json(successResponse(diagnosis))
})

// GET /api/mock/practice-tasks/today
mockRouter.get('/practice-tasks/today', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getTodayPracticeTasks()))
})

// GET /api/mock/achievements
mockRouter.get('/achievements', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getAchievements()))
})

// GET /api/mock/weekly-report
mockRouter.get('/weekly-report', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getWeeklyReport()))
})

// GET /api/mock/atlas-progress
mockRouter.get('/atlas-progress', (_req: Request, res: Response) => {
  res.json(successResponse(mockService.getKnowledgeAtlasProgress()))
})
