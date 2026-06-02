import { validateDiagnosisModelOutput } from '../../schemas/schemaValidation'
import type { DiagnosisValidationResult } from '../../schemas/schemaValidation'

export function extractJsonFromLlmContent(content: string): unknown {
  let text = content.trim()

  // Strip ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim()
  }

  // Try to extract JSON object from surrounding text
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1)
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function parseDiagnosisModelOutput(
  content: string
): DiagnosisValidationResult {
  const raw = extractJsonFromLlmContent(content)

  if (raw === null || typeof raw !== 'object') {
    return {
      valid: false,
      errors: ['Failed to extract valid JSON from LLM content'],
    }
  }

  return validateDiagnosisModelOutput(raw)
}
