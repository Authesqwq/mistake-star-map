import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const checks = []
let failed = false

function check(name, test) {
  try {
    const ok = test()
    checks.push({ name, ok })
    console.log(ok ? `  PASS ${name}` : `  FAIL ${name}`)
    if (!ok) failed = true
  } catch (e) {
    checks.push({ name, ok: false, error: e.message })
    console.log(`  FAIL ${name}: ${e.message}`)
    failed = true
  }
}

function fileExists(relPath) { return existsSync(join(root, relPath)) }
function readFile(relPath) { return readFileSync(join(root, relPath), 'utf-8') }

check('README.md exists', () => fileExists('README.md'))
check('.env.example exists', () => fileExists('.env.example'))
check('.gitignore exists', () => fileExists('.gitignore'))

const docsFiles = ['PRODUCT_OVERVIEW.md', 'DEMO_GUIDE.md', 'AI_CAPABILITY_BOUNDARY.md', 'PROMPT_AND_EVAL.md', 'LOCAL_DATA_AND_PRIVACY.md', 'PR_ROADMAP.md', 'FINAL_CHECKLIST.md']
for (const f of docsFiles) check(`docs/${f} exists`, () => fileExists(`docs/${f}`))

const serverFiles = ['server/src/routes/diagnose.ts', 'server/src/routes/recommendations.ts', 'server/src/routes/practice.ts']
for (const f of serverFiles) check(`${f} exists`, () => fileExists(f))

const clientFiles = ['TodayRepairCenter', 'MistakeInputPage', 'KnowledgeAtlasPage', 'PracticePage', 'AchievementCenterPage', 'LearningReportPage', 'MetricsDashboardPage']
for (const f of clientFiles) check(`client/src/pages/${f}.tsx exists`, () => fileExists(`client/src/pages/${f}.tsx`))

check('README contains run command', () => { const c = readFile('README.md'); return c.includes('npm run dev') && c.includes('npm run build') })
check('README contains AI boundary', () => { const c = readFile('README.md'); return c.includes('AI') && c.includes('LLM') })
check('.gitignore contains .env', () => { const c = readFile('.gitignore'); return c.includes('.env') })

// Security: no API keys in source/docs
check('No "sk-" in source (API key pattern)', () => {
  const sensitive = readFile('.env.example')
  return !sensitive.includes('sk-') && !sensitive.includes('YOUR_REAL')
})

check('.gitignore covers eval reports', () => { const c = readFile('.gitignore'); return c.includes('eval-reports') })
check('.env.example has all fields', () => { const c = readFile('.env.example'); return c.includes('LLM_API_KEY') && c.includes('LLM_MODEL') && c.includes('LLM_TIMEOUT_MS') && c.includes('LLM_MAX_RETRIES') })

console.log('')
if (failed) {
  console.log('Final check FAILED.')
  process.exit(1)
} else {
  console.log('Final check passed.')
}
