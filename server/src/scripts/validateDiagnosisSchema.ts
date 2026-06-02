import { diagnosisExamples } from '../prompts/diagnosisExamples'
import {
  validateDiagnosisModelOutput,
  validateDiagnosisAgainstCandidates,
} from '../schemas/schemaValidation'

let allPassed = true

for (const example of diagnosisExamples) {
  console.log(`\n--- ${example.name} ---`)

  const result = validateDiagnosisModelOutput(example.expectedOutput)

  if (!result.valid) {
    console.log(`  FAIL: Schema validation failed`)
    console.log(`  Errors: ${result.errors?.join('; ')}`)
    allPassed = false
    continue
  }

  console.log(`  PASS: Schema validation`)

  const candidateResult = validateDiagnosisAgainstCandidates(
    result.data!,
    example.input.candidateKnowledgePoints,
    example.input.candidateErrorTags
  )

  if (!candidateResult.valid) {
    console.log(`  FAIL: Candidate validation failed`)
    console.log(`  Errors: ${candidateResult.errors?.join('; ')}`)
    allPassed = false
    continue
  }

  console.log(`  PASS: Candidate validation`)
  console.log(
    `  knowledgePointId: ${candidateResult.data!.knowledgePointId}, confidence: ${candidateResult.data!.confidence}`
  )
}

console.log('')

if (allPassed) {
  console.log('Diagnosis schema validation passed.')
} else {
  console.log('Diagnosis schema validation FAILED.')
  process.exit(1)
}
