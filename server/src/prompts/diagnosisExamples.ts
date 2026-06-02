import type { DiagnosisPromptInput, DiagnosisModelOutput } from './promptTypes'

const mathCandidateKnowledgePoints = [
  { id: 'kp-func-concept', name: '函数概念', chapterId: 'ch-linear-function', chapterName: '一次函数', description: '理解变量之间的函数关系' },
  { id: 'kp-func-expression', name: '一次函数解析式', chapterId: 'ch-linear-function', chapterName: '一次函数', description: '掌握 y = kx + b 的形式与参数含义' },
  { id: 'kp-func-graph', name: '一次函数图像', chapterId: 'ch-linear-function', chapterName: '一次函数', description: '判断 k、b 对图像的影响' },
  { id: 'kp-clear-denom', name: '去分母', chapterId: 'ch-fractional-eq', chapterName: '分式方程', description: '找最简公分母并去分母' },
  { id: 'kp-extraneous-check', name: '增根检验', chapterId: 'ch-fractional-eq', chapterName: '分式方程', description: '理解增根产生原因' },
  { id: 'kp-frac-app', name: '分式方程应用题', chapterId: 'ch-fractional-eq', chapterName: '分式方程', description: '实际问题转化为分式方程' },
  { id: 'kp-ct-criterion', name: '全等三角形判定', chapterId: 'ch-congruent-tri', chapterName: '全等三角形', description: '掌握 SSS、SAS、ASA、AAS' },
  { id: 'kp-aux-line', name: '辅助线构造', chapterId: 'ch-congruent-tri', chapterName: '全等三角形', description: '添加辅助线构造全等' },
  { id: 'kp-proof-completeness', name: '证明步骤完整性', chapterId: 'ch-congruent-tri', chapterName: '全等三角形', description: '规范书写几何证明' },
]

const mathCandidateErrorTags = [
  { id: 'careless_calculation', name: '粗心计算', category: '计算错误', description: '符号、数字、单位、漏算', severity: 3 },
  { id: 'concept_confusion', name: '概念模糊', category: '理解偏差', description: '定义、条件、性质理解不稳定', severity: 4 },
  { id: 'logic_gap', name: '逻辑断层', category: '推理缺陷', description: '推导步骤缺失或跳步', severity: 4 },
  { id: 'question_misread', name: '审题偏差', category: '审题问题', description: '漏看条件或误解题意', severity: 3 },
  { id: 'method_transfer_weak', name: '方法迁移弱', category: '应用能力', description: '会原题，不会变式', severity: 4 },
  { id: 'incomplete_expression', name: '表达不完整', category: '书写规范', description: '过程、理由、结论不完整', severity: 2 },
  { id: 'formula_misuse', name: '公式适用错误', category: '应用能力', description: '公式选择或使用条件错误', severity: 3 },
]

export interface DiagnosisExample {
  name: string
  input: DiagnosisPromptInput
  expectedOutput: DiagnosisModelOutput
}

export const diagnosisExamples: DiagnosisExample[] = [
  // ── Example 1: 一次函数图像方向判断错误 ──
  {
    name: '一次函数图像方向判断错误',
    input: {
      subjectId: 'math',
      subjectName: '数学',
      grade: '八年级',
      question: '一次函数 y = kx + b 的图像经过第一、三、四象限，判断 k 和 b 的符号。',
      wrongAnswer: 'k > 0, b > 0',
      correctAnswer: 'k > 0, b < 0',
      candidateKnowledgePoints: mathCandidateKnowledgePoints,
      candidateErrorTags: mathCandidateErrorTags,
    },
    expectedOutput: {
      knowledgePointId: 'kp-func-graph',
      errorTags: ['concept_confusion', 'logic_gap'],
      confidence: 0.82,
      explanation: '你能判断 k 的正负对图像方向的影响，但从象限分布反推 b 的符号时逻辑不完整，忘记了第四象限意味着 b < 0。',
      suggestedPracticeType: 'same_type',
      recommendationReason: '同类题巩固 k、b 符号与象限的对应关系',
      needReview: false,
    },
  },

  // ── Example 2: 分式方程去分母漏乘 ──
  {
    name: '分式方程去分母漏乘',
    input: {
      subjectId: 'math',
      subjectName: '数学',
      grade: '八年级',
      question: '解方程：x/(x-1) + 2/(x+1) = 1',
      wrongAnswer: 'x = 1/3',
      correctAnswer: 'x = 1/3，但需检验 x ≠ ±1，x = 1/3 符合条件',
      candidateKnowledgePoints: mathCandidateKnowledgePoints,
      candidateErrorTags: mathCandidateErrorTags,
    },
    expectedOutput: {
      knowledgePointId: 'kp-clear-denom',
      errorTags: ['careless_calculation', 'logic_gap'],
      confidence: 0.68,
      explanation: '去分母时部分项漏乘了最简公分母，导致后续计算偏差。',
      suggestedPracticeType: 'original',
      recommendationReason: '重做原题，逐步检查每一项是否都乘了公分母',
      needReview: true,
    },
  },

  // ── Example 3: 全等三角形证明缺少判定条件 ──
  {
    name: '全等三角形证明缺少判定条件',
    input: {
      subjectId: 'math',
      subjectName: '数学',
      grade: '八年级',
      question: '已知 AB = AC，D 为 BC 中点。求证：△ABD ≌ △ACD。',
      wrongAnswer: '因为 AB = AC，BD = CD，所以 △ABD ≌ △ACD',
      correctAnswer: 'AB = AC（已知），BD = CD（D 为中点），AD = AD（公共边），SSS 判定 △ABD ≌ △ACD。',
      candidateKnowledgePoints: mathCandidateKnowledgePoints,
      candidateErrorTags: mathCandidateErrorTags,
    },
    expectedOutput: {
      knowledgePointId: 'kp-ct-criterion',
      errorTags: ['incomplete_expression', 'logic_gap'],
      confidence: 0.88,
      explanation: '证明过程中遗漏了公共边 AD = AD，且未写出判定依据 SSS。',
      suggestedPracticeType: 'same_type',
      recommendationReason: '同类题型再练，养成写全条件和判定依据的习惯',
      needReview: false,
    },
  },

  // ── Example 4: 应用题建模条件遗漏 ──
  {
    name: '应用题建模条件遗漏',
    input: {
      subjectId: 'math',
      subjectName: '数学',
      grade: '八年级',
      question: '一项工程，甲单独完成需 6 天，乙单独完成需 8 天。甲先做 2 天后乙加入，两人合作还需几天完成？',
      wrongAnswer: 'x = 2.5 天',
      correctAnswer: '(2+x)/6 + x/8 = 1 → 7x=16 → x = 16/7 ≈ 2.29 天',
      candidateKnowledgePoints: mathCandidateKnowledgePoints,
      candidateErrorTags: mathCandidateErrorTags,
    },
    expectedOutput: {
      knowledgePointId: 'kp-frac-app',
      errorTags: ['method_transfer_weak', 'careless_calculation'],
      confidence: 0.65,
      explanation: '方程模型建立正确，但在通分运算环节出现计算错误。',
      suggestedPracticeType: 'variant',
      recommendationReason: '变式题练习，关注计算过程的准确性',
      needReview: true,
    },
  },
]
