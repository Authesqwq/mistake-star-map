export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[×x]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/[＝]/g, '=')
    .replace(/[－]/g, '-')
    .replace(/，/g, ',')
    .replace(/；/g, ';')
    .replace(/：/g, ':')
    // Fullwidth to halfwidth
    .replace(/[！-～]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
    )
}

export function evaluateAnswer(params: {
  expectedAnswer?: string
  userAnswer: string
}): {
  status: 'correct' | 'incorrect' | 'needs_review'
  isCorrect: boolean | null
  normalizedExpectedAnswer?: string
  normalizedUserAnswer?: string
  warnings: string[]
} {
  const warnings: string[] = []

  if (!params.expectedAnswer || params.expectedAnswer.trim() === '') {
    return {
      status: 'needs_review',
      isCorrect: null,
      normalizedUserAnswer: normalizeAnswer(params.userAnswer),
      warnings: ['EXPECTED_ANSWER_MISSING'],
    }
  }

  const normalizedExpected = normalizeAnswer(params.expectedAnswer)
  const normalizedUser = normalizeAnswer(params.userAnswer)

  if (normalizedExpected === normalizedUser) {
    return {
      status: 'correct',
      isCorrect: true,
      normalizedExpectedAnswer: normalizedExpected,
      normalizedUserAnswer: normalizedUser,
      warnings: [],
    }
  }

  // Try numeric equivalence
  const expNum = tryParseFloat(normalizedExpected)
  const userNum = tryParseFloat(normalizedUser)
  if (expNum !== null && userNum !== null && Math.abs(expNum - userNum) < 1e-6) {
    return {
      status: 'correct',
      isCorrect: true,
      normalizedExpectedAnswer: normalizedExpected,
      normalizedUserAnswer: normalizedUser,
      warnings: ['NUMERIC_EQUIVALENCE_USED'],
    }
  }

  return {
    status: 'incorrect',
    isCorrect: false,
    normalizedExpectedAnswer: normalizedExpected,
    normalizedUserAnswer: normalizedUser,
    warnings: [],
  }
}

function tryParseFloat(s: string): number | null {
  const trimmed = s.replace(/[^0-9.\-/]/g, '').trim()
  if (!trimmed) return null
  // Try simple fraction like "1/2"
  const frac = trimmed.match(/^(-?\d+)\/(-?\d+)$/)
  if (frac) {
    const num = parseFloat(frac[1])
    const den = parseFloat(frac[2])
    if (den !== 0) return num / den
  }
  const n = parseFloat(trimmed)
  return isNaN(n) ? null : n
}
