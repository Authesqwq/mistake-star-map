import type { DiagnosisPromptInput, DiagnosisModelOutput } from '../../prompts/promptTypes'
import type { DiagnoseRequest } from '../../schemas/diagnoseRequestSchema'
import type { ApiResponse } from '../../types/api'
import { buildDiagnosisMessages } from '../../prompts/diagnosisPrompt'
import { getLlmProviderStatus, chatCompletion } from '../llm'
import { LlmTimeoutError, LlmProviderError, LlmResponseParseError } from '../llm/llmErrors'
import { parseDiagnosisModelOutput } from './diagnosisParser'
import { validateDiagnosisAgainstCandidates } from '../../schemas/schemaValidation'
import { buildFallbackDiagnosis } from './diagnosisFallback'
import { getKnowledgePoints, getErrorTags } from '../mockDataService'
import {
  recordRequest,
  recordLlmSuccess,
  recordFallback,
  recordLlmNotConfigured,
  recordParseFailure,
  recordCandidateValidationFailure,
} from './diagnosisMetrics'
import { successResponse, errorResponse } from '../../utils/apiResponse'
import type { ErrorTag } from '../../types/domain'

export interface DiagnoseResponseData {
  knowledgePointId: string
  knowledgePointName: string
  errorTags: { id: string; name: string; severity: number }[]
  confidence: number
  explanation: string
  suggestedPracticeType: string
  recommendationReason: string
  needReview: boolean
  source: 'llm' | 'fallback'
  llm: {
    used: boolean
    model?: string
    latencyMs: number
    usage?: {
      promptTokens?: number
      completionTokens?: number
      totalTokens?: number
    }
  }
  warnings: string[]
}

export async function diagnoseMistake(
  request: DiagnoseRequest
): Promise<DiagnoseResponseData> {
  recordRequest()

  const warnings: string[] = []
  const allKnowledgePoints = getKnowledgePoints()
  const allErrorTags = getErrorTags()

  // Filter candidates
  let candidateKps = allKnowledgePoints.map((kp) => ({
    id: kp.id,
    name: kp.name,
    chapterId: kp.chapterId,
    chapterName: kp.name,
    description: kp.description,
  }))

  if (request.candidateKnowledgePointIds && request.candidateKnowledgePointIds.length > 0) {
    const ids = new Set(request.candidateKnowledgePointIds)
    candidateKps = candidateKps.filter((kp) => ids.has(kp.id))
  }

  if (candidateKps.length === 0) {
    throw new DiagnosisError('EMPTY_CANDIDATE_KNOWLEDGE_POINTS', 'Candidate knowledge points are empty')
  }

  let candidateTags: ErrorTag[] = allErrorTags
  if (request.candidateErrorTagIds && request.candidateErrorTagIds.length > 0) {
    const ids = new Set(request.candidateErrorTagIds)
    candidateTags = candidateTags.filter((t) => ids.has(t.id))
  }

  if (candidateTags.length === 0) {
    throw new DiagnosisError('EMPTY_CANDIDATE_ERROR_TAGS', 'Candidate error tags are empty')
  }

  const promptInput: DiagnosisPromptInput = {
    subjectId: request.subjectId,
    subjectName: request.subjectName ?? '数学',
    grade: request.grade,
    question: request.question,
    wrongAnswer: request.wrongAnswer,
    correctAnswer: request.correctAnswer,
    candidateKnowledgePoints: candidateKps.map((kp) => ({
      id: kp.id,
      name: kp.name,
      chapterId: kp.chapterId,
      chapterName: kp.chapterName,
      description: kp.description,
    })),
    candidateErrorTags: candidateTags.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      severity: t.severity,
    })),
  }

  const llmStatus = getLlmProviderStatus()

  if (!llmStatus.configured) {
    recordLlmNotConfigured()
    recordFallback()
    return buildResponse(
      buildFallbackDiagnosis(promptInput, 'LLM 未配置'),
      'fallback',
      { used: false, latencyMs: 0 },
      ['LLM_NOT_CONFIGURED_FALLBACK_USED'],
      allKnowledgePoints,
      allErrorTags
    )
  }

  // Try LLM
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[diagnose] question_len=${request.question.length}, candidates=${candidateKps.length} kps, ${candidateTags.length} tags`
      )
    }

    const messages = buildDiagnosisMessages(promptInput)
    const llmResponse = await chatCompletion({ messages })

    const parseResult = parseDiagnosisModelOutput(llmResponse.content)

    if (!parseResult.valid || !parseResult.data) {
      recordParseFailure()
      recordFallback()
      warnings.push('MODEL_OUTPUT_PARSE_FAILED_FALLBACK_USED')
      return buildResponse(
        buildFallbackDiagnosis(promptInput, '模型输出解析失败'),
        'fallback',
        { used: true, model: llmResponse.model, latencyMs: llmResponse.latencyMs, usage: llmResponse.usage },
        warnings,
        allKnowledgePoints,
        allErrorTags
      )
    }

    const candResult = validateDiagnosisAgainstCandidates(
      parseResult.data,
      promptInput.candidateKnowledgePoints,
      promptInput.candidateErrorTags
    )

    if (!candResult.valid) {
      recordCandidateValidationFailure()
      recordFallback()
      warnings.push('MODEL_OUTPUT_CANDIDATE_VALIDATION_FAILED_FALLBACK_USED')
      return buildResponse(
        buildFallbackDiagnosis(promptInput, '模型输出候选校验失败'),
        'fallback',
        { used: true, model: llmResponse.model, latencyMs: llmResponse.latencyMs, usage: llmResponse.usage },
        warnings,
        allKnowledgePoints,
        allErrorTags
      )
    }

    recordLlmSuccess(llmResponse.latencyMs)

    if (parseResult.data.confidence < 0.7) {
      warnings.push('LOW_CONFIDENCE_NEEDS_REVIEW')
    }

    return buildResponse(
      parseResult.data,
      'llm',
      {
        used: true,
        model: llmResponse.model,
        latencyMs: llmResponse.latencyMs,
        usage: llmResponse.usage,
      },
      warnings,
      allKnowledgePoints,
      allErrorTags
    )
  } catch (err) {
    const reason =
      err instanceof LlmTimeoutError
        ? 'LLM 超时'
        : err instanceof LlmProviderError
        ? 'LLM Provider 错误'
        : err instanceof LlmResponseParseError
        ? 'LLM 响应解析错误'
        : '未知错误'

    if (process.env.NODE_ENV === 'development') {
      console.log(`[diagnose] fallback: ${reason}`)
    }

    recordFallback()
    return buildResponse(
      buildFallbackDiagnosis(promptInput, reason),
      'fallback',
      { used: !!llmStatus.configured, latencyMs: 0 },
      [...warnings, 'LLM_NOT_CONFIGURED_FALLBACK_USED'],
      allKnowledgePoints,
      allErrorTags
    )
  }
}

function buildResponse(
  output: DiagnosisModelOutput,
  source: 'llm' | 'fallback',
  llm: DiagnoseResponseData['llm'],
  warnings: string[],
  allKps: { id: string; name: string }[],
  allTags: ErrorTag[]
): DiagnoseResponseData {
  const kp = allKps.find((k) => k.id === output.knowledgePointId)
  const tags = output.errorTags
    .map((id) => {
      const t = allTags.find((tag) => tag.id === id)
      return t ? { id: t.id, name: t.name, severity: t.severity } : null
    })
    .filter(Boolean) as { id: string; name: string; severity: number }[]

  return {
    knowledgePointId: output.knowledgePointId,
    knowledgePointName: kp?.name ?? output.knowledgePointId,
    errorTags: tags,
    confidence: output.confidence,
    explanation: output.explanation,
    suggestedPracticeType: output.suggestedPracticeType,
    recommendationReason: output.recommendationReason,
    needReview: output.needReview,
    source,
    llm,
    warnings,
  }
}

export class DiagnosisError extends Error {
  public readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'DiagnosisError'
    this.code = code
  }
}
