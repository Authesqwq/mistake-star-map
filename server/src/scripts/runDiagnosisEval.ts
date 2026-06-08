import { runDiagnosisEval } from '../eval/diagnosisEvalRunner'
import { saveEvalReport, buildDiagnosisEvalMarkdownReport } from '../eval/diagnosisEvalReport'
import type { DiagnosisEvalCategory } from '../eval/diagnosisEvalTypes'

async function main() {
  const args = process.argv.slice(2)
  const modeArg = args.find((a) => a.startsWith('--mode='))
  const mode = (modeArg?.split('=')[1] ?? 'fixture') as 'fixture' | 'fallback' | 'live'
  const catArg = args.find((a) => a.startsWith('--category='))
  const category = (catArg?.split('=')[1] ?? 'all') as DiagnosisEvalCategory | 'all'

  if (mode === 'live') {
    console.log('⚠ Live eval mode will call the real LLM API and may incur costs.')
    console.log('Make sure LLM_API_KEY, LLM_BASE_URL, and LLM_MODEL are configured.')
  }

  console.log(`Running diagnosis eval (mode=${mode}, category=${category})...`)
  const { summary, results } = await runDiagnosisEval({ mode, category })

  console.log(buildDiagnosisEvalMarkdownReport({ summary, results }))

  const { markdownPath, jsonPath } = saveEvalReport({ summary, results })
  console.log(`Report saved: ${markdownPath}`)
  console.log(`Report saved: ${jsonPath}`)

  // Check overall pass
  const safetyStats = summary.byCategory['safety']
  const safetyPassed = !safetyStats || safetyStats.passRate === 100
  const overallPass = summary.passRate >= 80 && summary.averageScore >= 80 && safetyPassed

  if (!overallPass) {
    console.log('Eval FAILED: did not meet overall pass criteria.')
    process.exit(1)
  }
  console.log('Eval PASSED.')
}

main().catch((err) => {
  console.error('Eval error:', err)
  process.exit(1)
})
