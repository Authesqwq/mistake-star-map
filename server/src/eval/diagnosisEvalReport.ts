import type { DiagnosisEvalSummary, DiagnosisEvalCaseResult } from './diagnosisEvalTypes'
import * as fs from 'fs'
import * as path from 'path'

export function buildDiagnosisEvalMarkdownReport(params: {
  summary: DiagnosisEvalSummary; results: DiagnosisEvalCaseResult[]
}): string {
  const { summary: s, results } = params
  const lines = [
    '# Diagnosis Eval Report',
    '',
    `Generated at: ${s.generatedAt}`,
    `Mode: ${s.mode}`,
    '',
    '## Summary',
    `- Total cases: ${s.totalCases}`,
    `- Passed: ${s.passedCases}`,
    `- Failed: ${s.failedCases}`,
    `- Pass rate: ${s.passRate}%`,
    `- Average score: ${s.averageScore}`,
    '',
    '## By Category',
    '| Category | Total | Passed | Pass Rate | Avg Score |',
    '|---|---:|---:|---:|---:|',
  ]
  for (const [cat, stats] of Object.entries(s.byCategory)) {
    lines.push(`| ${cat} | ${stats.total} | ${stats.passed} | ${stats.passRate}% | ${stats.averageScore} |`)
  }
  const failed = results.filter((r) => !r.passed)
  if (failed.length > 0) {
    lines.push('', '## Failed Cases', '')
    for (const r of failed) {
      lines.push(`### ${r.caseId} ${r.title}`, '',
        `- Category: ${r.category}`, `- Score: ${r.score}/${r.maxScore}`,
        `- Expected KP: ${r.expected.knowledgePointId}`,
        `- Predicted KP: ${r.prediction.knowledgePointId}`,
        `- Expected Tags: [${r.expected.errorTagIds.join(', ')}]`,
        `- Predicted Tags: [${r.prediction.errorTags.join(', ')}]`,
      )
      if (r.messages.length > 0) {
        lines.push('', '**Messages:**', ...r.messages.map((m) => `- ${m}`))
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}

export function buildDiagnosisEvalJsonReport(params: {
  summary: DiagnosisEvalSummary; results: DiagnosisEvalCaseResult[]
}): object {
  return {
    summary: params.summary,
    results: params.results.map((r) => ({
      caseId: r.caseId, title: r.title, category: r.category,
      passed: r.passed, score: r.score, maxScore: r.maxScore,
      checks: r.checks, messages: r.messages,
    })),
  }
}

const REPORT_DIR = path.resolve(__dirname, '../../../server', 'eval-reports')

export function saveEvalReport(params: {
  summary: DiagnosisEvalSummary; results: DiagnosisEvalCaseResult[]
}): { markdownPath: string; jsonPath: string } {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const mdPath = path.join(REPORT_DIR, `eval-report-${ts}.md`)
  const jsonPath = path.join(REPORT_DIR, `eval-report-${ts}.json`)
  fs.writeFileSync(mdPath, buildDiagnosisEvalMarkdownReport(params), 'utf-8')
  fs.writeFileSync(jsonPath, JSON.stringify(buildDiagnosisEvalJsonReport(params), null, 2), 'utf-8')
  return { markdownPath: mdPath, jsonPath }
}
