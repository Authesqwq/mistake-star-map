import type { PracticeEvaluateRequest, PracticeEvaluateResponse } from './practiceTypes'
import { evaluateAnswer } from './answerEvaluator'
import { buildPracticeFeedback } from './practiceFeedback'
import { recordEvaluateRequest } from './practiceMetrics'

export function evaluatePracticeAnswer(
  request: PracticeEvaluateRequest
): PracticeEvaluateResponse {
  const start = Date.now()

  const evalResult = evaluateAnswer({
    expectedAnswer: request.expectedAnswer,
    userAnswer: request.userAnswer,
  })

  const feedback = buildPracticeFeedback({
    status: evalResult.status,
    practiceType: request.practiceType,
    knowledgePointName: request.knowledgePointName,
  })

  recordEvaluateRequest(evalResult.status, Date.now() - start)

  return {
    taskId: request.taskId,
    status: evalResult.status,
    isCorrect: evalResult.isCorrect,
    normalizedExpectedAnswer: evalResult.normalizedExpectedAnswer,
    normalizedUserAnswer: evalResult.normalizedUserAnswer,
    feedback: feedback.feedback,
    suggestion: feedback.suggestion,
    shouldRetry: feedback.shouldRetry,
    evaluatedBy: 'rule',
    warnings: evalResult.warnings,
  }
}
