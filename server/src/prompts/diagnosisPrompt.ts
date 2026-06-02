import type { LlmMessage } from '../services/llm/llmTypes'
import type { DiagnosisPromptInput } from './promptTypes'

export function buildDiagnosisSystemPrompt(): string {
  return [
    '你是一个中小学错题诊断助手。你的任务是：',
    '',
    '1. 根据题目、学生错误答案、正确答案，分析学生的错因；',
    '2. 从给定的候选知识点中选择最匹配的一个；',
    '3. 从给定的候选错因标签中选择 1-3 个最准确的标签；',
    '4. 给出置信度（0-1）、简短解释和复练建议。',
    '',
    '规则：',
    '- 只输出 JSON，不要输出 Markdown、不要输出推理过程；',
    '- knowledgePointId 必须从候选知识点中选；',
    '- errorTags 必须从候选错因标签中选；',
    '- explanation 控制在 1-2 句，面向学生，语言简洁友好；',
    '- 不能使用羞辱、焦虑诱导或贬低性语言；',
    '- 如果信息不足以做出确定性判断，设置 needReview: true；',
    '- 输出格式必须是合法的 JSON 对象。',
  ].join('\n')
}

export function buildDiagnosisUserPrompt(input: DiagnosisPromptInput): string {
  const kpList = input.candidateKnowledgePoints
    .map(
      (kp) =>
        `- ${kp.id}: ${kp.name}（${kp.chapterName}${kp.description ? ' - ' + kp.description : ''}）`
    )
    .join('\n')

  const tagList = input.candidateErrorTags
    .map(
      (tag) =>
        `- ${tag.id}: ${tag.name}（${tag.category}：${tag.description}）`
    )
    .join('\n')

  return [
    `学科：${input.subjectName}`,
    `年级：${input.grade}`,
    '',
    `题目：${input.question}`,
    '',
    `学生错误答案：${input.wrongAnswer}`,
    '',
    `正确答案：${input.correctAnswer}`,
    '',
    '候选知识点：',
    kpList,
    '',
    '候选错因标签：',
    tagList,
    '',
    '请输出 JSON（不要包含 markdown 代码块标记）：',
    '{',
    '  "knowledgePointId": "<候选知识点 id>",',
    '  "errorTags": ["<候选错因标签 id>"],',
    '  "confidence": 0.8,',
    '  "explanation": "<1-2 句面向学生的简短解释>",',
    '  "suggestedPracticeType": "same_type",',
    '  "recommendationReason": "<复练推荐理由>",',
    '  "needReview": false',
    '}',
  ].join('\n')
}

export function buildDiagnosisMessages(
  input: DiagnosisPromptInput
): LlmMessage[] {
  return [
    { role: 'system', content: buildDiagnosisSystemPrompt() },
    { role: 'user', content: buildDiagnosisUserPrompt(input) },
  ]
}
