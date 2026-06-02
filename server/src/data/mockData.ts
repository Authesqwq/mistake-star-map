import type { StudentProfile, ErrorTag, Mistake, KnowledgePoint, DiagnosisResult, PracticeTask, Achievement, WeeklyReport } from '../types/domain'

// ── Student ──

export const mockStudent: StudentProfile = {
  id: 'student-001',
  name: '小星',
  grade: '八年级',
  streakDays: 3,
  repairValue: 42,
  totalMistakes: 10,
  completedPracticeCount: 7,
}

// ── Error Tags ──

export const mockErrorTags: ErrorTag[] = [
  { id: 'careless_calculation', name: '粗心计算', category: '计算错误', description: '符号、数字、单位、漏算等问题', severity: 3 },
  { id: 'concept_confusion', name: '概念模糊', category: '理解偏差', description: '定义、条件、性质理解不稳定', severity: 4 },
  { id: 'logic_gap', name: '逻辑断层', category: '推理缺陷', description: '推导步骤缺失或跳步', severity: 4 },
  { id: 'question_misread', name: '审题偏差', category: '审题问题', description: '漏看条件或误解题意', severity: 3 },
  { id: 'method_transfer_weak', name: '方法迁移弱', category: '应用能力', description: '会原题，不会变式', severity: 4 },
  { id: 'incomplete_expression', name: '表达不完整', category: '书写规范', description: '过程、理由、结论表述不完整', severity: 2 },
  { id: 'formula_misuse', name: '公式适用错误', category: '应用能力', description: '公式选择或使用条件错误', severity: 3 },
]

// ── Knowledge Points ──

export const mockKnowledgePoints: KnowledgePoint[] = [
  { id: 'kp-func-concept', subjectId: 'math', chapterId: 'ch-linear-function', name: '函数概念', description: '理解变量之间的函数关系，能区分自变量与因变量', status: 'mastered', mastery: 88, relatedMistakeIds: ['mistake-001'], majorErrorTagIds: ['concept_confusion'], nextReviewAt: null },
  { id: 'kp-func-expression', subjectId: 'math', chapterId: 'ch-linear-function', name: '一次函数解析式', description: '掌握 y = kx + b 的形式与参数含义', status: 'discovered', mastery: 62, relatedMistakeIds: ['mistake-001', 'mistake-002'], majorErrorTagIds: ['careless_calculation', 'concept_confusion'], nextReviewAt: '2026-06-05T00:00:00.000Z' },
  { id: 'kp-func-graph', subjectId: 'math', chapterId: 'ch-linear-function', name: '一次函数图像', description: '能根据解析式画出图像，判断 k、b 对图像的影响', status: 'to_repair', mastery: 45, relatedMistakeIds: ['mistake-002'], majorErrorTagIds: ['concept_confusion', 'logic_gap'], nextReviewAt: '2026-06-03T00:00:00.000Z' },
  { id: 'kp-graph-expr-switch', subjectId: 'math', chapterId: 'ch-linear-function', name: '图像与表达式转换', description: '能在图像与解析式之间相互转换', status: 'undiscovered', mastery: 0, relatedMistakeIds: [], majorErrorTagIds: [], nextReviewAt: null },
  { id: 'kp-clear-denom', subjectId: 'math', chapterId: 'ch-fractional-eq', name: '去分母', description: '正确找到最简公分母并去分母转化为整式方程', status: 'repairing', mastery: 40, relatedMistakeIds: ['mistake-003'], majorErrorTagIds: ['careless_calculation', 'logic_gap'], nextReviewAt: '2026-06-04T00:00:00.000Z' },
  { id: 'kp-extraneous-check', subjectId: 'math', chapterId: 'ch-fractional-eq', name: '增根检验', description: '理解增根产生的原因，养成检验习惯', status: 'to_repair', mastery: 30, relatedMistakeIds: ['mistake-004'], majorErrorTagIds: ['logic_gap', 'incomplete_expression'], nextReviewAt: '2026-06-03T00:00:00.000Z' },
  { id: 'kp-frac-app', subjectId: 'math', chapterId: 'ch-fractional-eq', name: '分式方程应用题', description: '将实际问题转化为分式方程模型并求解', status: 'discovered', mastery: 55, relatedMistakeIds: ['mistake-005'], majorErrorTagIds: ['question_misread', 'method_transfer_weak'], nextReviewAt: '2026-06-06T00:00:00.000Z' },
  { id: 'kp-ct-criterion', subjectId: 'math', chapterId: 'ch-congruent-tri', name: '全等三角形判定', description: '掌握 SSS、SAS、ASA、AAS 判定方法', status: 'to_repair', mastery: 38, relatedMistakeIds: ['mistake-006', 'mistake-007'], majorErrorTagIds: ['concept_confusion', 'incomplete_expression'], nextReviewAt: '2026-06-03T00:00:00.000Z' },
  { id: 'kp-aux-line', subjectId: 'math', chapterId: 'ch-congruent-tri', name: '辅助线构造', description: '通过添加辅助线构造全等三角形解决问题', status: 'discovered', mastery: 50, relatedMistakeIds: ['mistake-008'], majorErrorTagIds: ['logic_gap', 'method_transfer_weak'], nextReviewAt: '2026-06-07T00:00:00.000Z' },
  { id: 'kp-proof-completeness', subjectId: 'math', chapterId: 'ch-congruent-tri', name: '证明步骤完整性', description: '规范书写几何证明过程，步骤清晰、理由充分', status: 'repairing', mastery: 42, relatedMistakeIds: ['mistake-006', 'mistake-007', 'mistake-009'], majorErrorTagIds: ['incomplete_expression', 'logic_gap'], nextReviewAt: '2026-06-05T00:00:00.000Z' },
  { id: 'kp-app-modeling', subjectId: 'math', chapterId: 'ch-congruent-tri', name: '应用题建模', description: '将实际问题抽象为几何模型，转化为全等问题求解', status: 'discovered', mastery: 55, relatedMistakeIds: ['mistake-009'], majorErrorTagIds: ['question_misread', 'method_transfer_weak'], nextReviewAt: null },
]

export const mockChapters = [
  { id: 'ch-linear-function', subjectId: 'math' as const, name: '一次函数', knowledgePointIds: ['kp-func-concept', 'kp-func-expression', 'kp-func-graph', 'kp-graph-expr-switch'] },
  { id: 'ch-fractional-eq', subjectId: 'math' as const, name: '分式方程', knowledgePointIds: ['kp-clear-denom', 'kp-extraneous-check', 'kp-frac-app'] },
  { id: 'ch-congruent-tri', subjectId: 'math' as const, name: '全等三角形', knowledgePointIds: ['kp-ct-criterion', 'kp-aux-line', 'kp-proof-completeness', 'kp-app-modeling'] },
]

// ── Mistakes (10) ──

export const mockMistakes: Mistake[] = [
  { id: 'mistake-001', subjectId: 'math', chapterId: 'ch-linear-function', knowledgePointId: 'kp-func-expression', title: '一次函数斜率符号判断错误', question: '已知一次函数 y = -2x + 3，判断其图像经过哪些象限。', wrongAnswer: '第一、二、三象限', correctAnswer: '第一、二、四象限', explanation: 'k = -2 < 0，图像从左到右下降；b = 3 > 0，与 y 轴正半轴相交。', difficulty: 'easy', source: 'mock', errorTagIds: ['concept_confusion', 'careless_calculation'], createdAt: '2026-05-20T08:00:00.000Z', updatedAt: '2026-05-20T08:00:00.000Z' },
  { id: 'mistake-002', subjectId: 'math', chapterId: 'ch-linear-function', knowledgePointId: 'kp-func-graph', title: '一次函数图像象限判断错误', question: '一次函数 y = kx + b 的图像经过第一、三、四象限，判断 k 和 b 的符号。', wrongAnswer: 'k > 0, b > 0', correctAnswer: 'k > 0, b < 0', explanation: '经过一、三象限说明 k > 0；经过第四象限说明 b < 0。', difficulty: 'medium', source: 'mock', errorTagIds: ['concept_confusion', 'logic_gap'], createdAt: '2026-05-21T09:30:00.000Z', updatedAt: '2026-05-21T09:30:00.000Z' },
  { id: 'mistake-003', subjectId: 'math', chapterId: 'ch-fractional-eq', knowledgePointId: 'kp-clear-denom', title: '分式方程去分母漏乘', question: '解方程：x/(x-1) + 2/(x+1) = 1', wrongAnswer: 'x = 1/3', correctAnswer: 'x = 1/3，但需检验 x ≠ ±1，x = 1/3 符合条件', explanation: '去分母时漏乘了等号右边的常数项 1。', difficulty: 'medium', source: 'mock', errorTagIds: ['careless_calculation', 'logic_gap'], createdAt: '2026-05-22T10:00:00.000Z', updatedAt: '2026-05-22T10:00:00.000Z' },
  { id: 'mistake-004', subjectId: 'math', chapterId: 'ch-fractional-eq', knowledgePointId: 'kp-extraneous-check', title: '分式方程忘记检验增根', question: '解方程：(x+2)/(x-2) - 2 = 4/(x-2)', wrongAnswer: 'x = 2', correctAnswer: '无解（x = 2 使分母为 0，是增根，舍去后原方程无解）', explanation: '去分母得 x+2-2(x-2)=4 → -x+6=4 → x=2。但 x=2 使分母为 0，为增根。', difficulty: 'medium', source: 'mock', errorTagIds: ['logic_gap', 'incomplete_expression'], createdAt: '2026-05-23T11:30:00.000Z', updatedAt: '2026-05-23T11:30:00.000Z' },
  { id: 'mistake-005', subjectId: 'math', chapterId: 'ch-fractional-eq', knowledgePointId: 'kp-frac-app', title: '应用题建模条件遗漏', question: '一项工程，甲单独完成需 6 天，乙单独完成需 8 天。甲先做 2 天后乙加入，两人合作还需几天完成？', wrongAnswer: 'x = 2.5 天', correctAnswer: '(2+x)/6 + x/8 = 1 → 7x=16 → x = 16/7 ≈ 2.29 天', explanation: '方程列对但通分计算有误。', difficulty: 'hard', source: 'mock', errorTagIds: ['question_misread', 'method_transfer_weak'], createdAt: '2026-05-24T14:00:00.000Z', updatedAt: '2026-05-24T14:00:00.000Z' },
  { id: 'mistake-006', subjectId: 'math', chapterId: 'ch-congruent-tri', knowledgePointId: 'kp-ct-criterion', title: '全等三角形判定条件缺失', question: '如图，AB = DE，∠A = ∠D，要使 △ABC ≌ △DEF，还需要什么条件？', wrongAnswer: 'BC = EF（SSS）', correctAnswer: 'AC = DF（SAS），角是夹角才能用 SAS。', explanation: '学生混淆了 SSS 和 SAS 的适用条件。', difficulty: 'medium', source: 'mock', errorTagIds: ['concept_confusion', 'incomplete_expression'], createdAt: '2026-05-25T08:30:00.000Z', updatedAt: '2026-05-25T08:30:00.000Z' },
  { id: 'mistake-007', subjectId: 'math', chapterId: 'ch-congruent-tri', knowledgePointId: 'kp-ct-criterion', title: '全等三角形证明逻辑不严谨', question: '已知 AB = AC，D 为 BC 中点。求证：△ABD ≌ △ACD。', wrongAnswer: '因为 AB = AC，BD = CD，所以 △ABD ≌ △ACD', correctAnswer: 'AB = AC，BD = CD，AD = AD，SSS 判定 △ABD ≌ △ACD。', explanation: '遗漏了公共边 AD = AD，未注明判定依据 SSS。', difficulty: 'easy', source: 'mock', errorTagIds: ['incomplete_expression', 'logic_gap'], createdAt: '2026-05-25T09:00:00.000Z', updatedAt: '2026-05-25T09:00:00.000Z' },
  { id: 'mistake-008', subjectId: 'math', chapterId: 'ch-congruent-tri', knowledgePointId: 'kp-aux-line', title: '辅助线构造错误', question: '在四边形 ABCD 中，AB = CD，AD = BC。求证：四边形 ABCD 是平行四边形。', wrongAnswer: '连接 AC，SSS 得 △ABC ≌ △CDA，所以 AB ∥ CD', correctAnswer: '连接 AC，SSS 得 △ABC ≌ △CDA。∠BAC = ∠DCA → AB ∥ CD；∠BCA = ∠DAC → AD ∥ BC。两组对边分别平行 → 平行四边形。', explanation: '只证了一组平行，漏证了另一组。', difficulty: 'hard', source: 'mock', errorTagIds: ['logic_gap', 'method_transfer_weak'], createdAt: '2026-05-26T10:30:00.000Z', updatedAt: '2026-05-26T10:30:00.000Z' },
  { id: 'mistake-009', subjectId: 'math', chapterId: 'ch-congruent-tri', knowledgePointId: 'kp-app-modeling', title: '单位与符号错误', question: '要测量河两岸 A、B 的距离，在 AB 垂线 BF 上取 C、D 使 BC = CD，过 D 作 DE⊥BF，A、C、E 共线。DE = 15m，求 AB。', wrongAnswer: 'AB = 30m', correctAnswer: 'AB = 15m（△ABC ≌ △EDC，ASA）', explanation: '全等判定正确，但口算时误将 15 翻倍。', difficulty: 'medium', source: 'mock', errorTagIds: ['question_misread', 'careless_calculation'], createdAt: '2026-05-26T14:00:00.000Z', updatedAt: '2026-05-26T14:00:00.000Z' },
  { id: 'mistake-010', subjectId: 'math', chapterId: 'ch-linear-function', knowledgePointId: 'kp-func-expression', title: '公式适用错误', question: '已知一次函数图像经过点 (1, 5) 和 (3, 9)，求该函数的解析式。', wrongAnswer: 'y = 4x + 1', correctAnswer: 'k = (9-5)/(3-1) = 2，b = 3，y = 2x + 3', explanation: '斜率公式计算 (9-5)/(3-1)=4/2=2，学生未除以 2 得 k=4。', difficulty: 'easy', source: 'mock', errorTagIds: ['formula_misuse', 'careless_calculation'], createdAt: '2026-05-27T08:00:00.000Z', updatedAt: '2026-05-27T08:00:00.000Z' },
]

// ── Diagnoses (10) ──

export const mockDiagnoses: DiagnosisResult[] = [
  { id: 'diag-001', mistakeId: 'mistake-001', knowledgePointId: 'kp-func-expression', errorTags: ['concept_confusion', 'careless_calculation'], confidence: 0.85, explanation: '对一次函数 k 的符号与图像方向的关系理解不够扎实。', suggestedPracticeType: 'same_type', recommendationReason: '建议再练 1 道斜率与象限关系题', needReview: false, source: 'mock', createdAt: '2026-05-30T08:00:00.000Z' },
  { id: 'diag-002', mistakeId: 'mistake-002', knowledgePointId: 'kp-func-graph', errorTags: ['concept_confusion', 'logic_gap'], confidence: 0.62, explanation: '能识别图像经过的象限，但反向推断 k、b 符号时逻辑链条断裂。', suggestedPracticeType: 'variant', recommendationReason: '练习从图像反推参数，正反两个方向推理', needReview: true, source: 'mock', createdAt: '2026-05-30T08:10:00.000Z' },
  { id: 'diag-003', mistakeId: 'mistake-003', knowledgePointId: 'kp-clear-denom', errorTags: ['careless_calculation', 'logic_gap'], confidence: 0.78, explanation: '去分母时对等式右边常数项漏乘。', suggestedPracticeType: 'original', recommendationReason: '重做原题，注意每一项都乘以最简公分母', needReview: false, source: 'mock', createdAt: '2026-05-30T08:20:00.000Z' },
  { id: 'diag-004', mistakeId: 'mistake-004', knowledgePointId: 'kp-extraneous-check', errorTags: ['logic_gap', 'incomplete_expression'], confidence: 0.55, explanation: '解完方程后未检验增根。', suggestedPracticeType: 'same_type', recommendationReason: '做一道同类题，特别注意解完后检验分母是否为零', needReview: true, source: 'mock', createdAt: '2026-05-30T08:30:00.000Z' },
  { id: 'diag-005', mistakeId: 'mistake-005', knowledgePointId: 'kp-frac-app', errorTags: ['question_misread', 'method_transfer_weak'], confidence: 0.71, explanation: '能正确设未知数，但通分计算过程中出错。', suggestedPracticeType: 'variant', recommendationReason: '变式题检验工程问题建模方法', needReview: false, source: 'mock', createdAt: '2026-05-30T08:40:00.000Z' },
  { id: 'diag-006', mistakeId: 'mistake-006', knowledgePointId: 'kp-ct-criterion', errorTags: ['concept_confusion', 'incomplete_expression'], confidence: 0.80, explanation: '对全等判定条件中边角关系理解有偏差。', suggestedPracticeType: 'original', recommendationReason: '重做原题，逐步写出已知条件和判定依据', needReview: false, source: 'mock', createdAt: '2026-05-30T08:50:00.000Z' },
  { id: 'diag-007', mistakeId: 'mistake-007', knowledgePointId: 'kp-ct-criterion', errorTags: ['incomplete_expression', 'logic_gap'], confidence: 0.88, explanation: '证明书写不够完整，遗漏公共边条件。', suggestedPracticeType: 'same_type', recommendationReason: '同类题型再练一次，规范书写格式', needReview: false, source: 'mock', createdAt: '2026-05-30T09:00:00.000Z' },
  { id: 'diag-008', mistakeId: 'mistake-008', knowledgePointId: 'kp-aux-line', errorTags: ['logic_gap', 'method_transfer_weak'], confidence: 0.68, explanation: '辅助线添加方向正确，但证明只完成了一半。', suggestedPracticeType: 'variant', recommendationReason: '试试不同辅助线策略的变式题', needReview: false, source: 'mock', createdAt: '2026-05-30T09:10:00.000Z' },
  { id: 'diag-009', mistakeId: 'mistake-009', knowledgePointId: 'kp-app-modeling', errorTags: ['question_misread', 'careless_calculation'], confidence: 0.90, explanation: '全等模型理解正确，但答案计算出现粗心。', suggestedPracticeType: 'review', recommendationReason: '作为复查确认已掌握全等测距方法', needReview: false, source: 'mock', createdAt: '2026-05-30T09:20:00.000Z' },
  { id: 'diag-010', mistakeId: 'mistake-010', knowledgePointId: 'kp-func-expression', errorTags: ['formula_misuse', 'careless_calculation'], confidence: 0.82, explanation: '知道用两点求斜率公式，但计算时出现基本运算错误。', suggestedPracticeType: 'same_type', recommendationReason: '同类题再练，注意斜率公式分子分母对应关系', needReview: false, source: 'mock', createdAt: '2026-05-30T09:30:00.000Z' },
]

// ── Practice Tasks ──

export const mockPracticeTasks: PracticeTask[] = [
  { id: 'task-001', mistakeId: 'mistake-002', knowledgePointId: 'kp-func-graph', type: 'original', title: '核心修复：一次函数图像与象限判断', question: '一次函数 y = kx + b 的图像经过第一、三、四象限，判断 k 和 b 的符号。', expectedAnswer: 'k > 0, b < 0', recommendationReason: '图像方向是你的高频错因，先修复原题', priorityScore: 95, status: 'pending', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'task-002', mistakeId: 'mistake-002', knowledgePointId: 'kp-func-graph', type: 'same_type', title: '同类巩固：一次函数图像方向判断', question: '若一次函数 y = (m-2)x + (3-m) 的图像经过第二、三、四象限，求 m 的取值范围。', expectedAnswer: 'm < 2 且 m > 3 → 无解', recommendationReason: '检验 k、b 符号与象限对应关系', priorityScore: 85, status: 'pending', createdAt: '2026-06-01T08:10:00.000Z' },
  { id: 'task-003', mistakeId: 'mistake-004', knowledgePointId: 'kp-extraneous-check', type: 'variant', title: '间隔复查：增根检验', question: '解方程：x/(x-3) - 2 = 3/(x-3)', expectedAnswer: 'x = 3 为增根，原方程无解', recommendationReason: '检验习惯很重要，这道题恰好有增根', priorityScore: 75, status: 'pending', createdAt: '2026-06-01T08:20:00.000Z' },
]

// ── Achievements ──

export const mockAchievements: Achievement[] = [
  { id: 'ach-001', title: '首次发现知识点', description: '发现第一个未掌握的知识点', category: '探索', icon: 'compass', unlocked: true, unlockedAt: '2026-05-20T08:00:00.000Z' },
  { id: 'ach-002', title: '首次完成复练', description: '完成第一次错题复练任务', category: '复练', icon: 'target', unlocked: true, unlockedAt: '2026-05-22T10:00:00.000Z' },
  { id: 'ach-003', title: '今日三题完成', description: '一天内完成今日三题全部任务', category: '日常', icon: 'calendar-check', unlocked: false, unlockedAt: null },
  { id: 'ach-004', title: '高频错因突破', description: '某个高频错因关联的知识点全部达到已掌握', category: '突破', icon: 'flame', unlocked: false, unlockedAt: null },
  { id: 'ach-005', title: '连续修复 3 天', description: '连续 3 天完成至少一次错题复练', category: '毅力', icon: 'streak', unlocked: true, unlockedAt: '2026-05-31T20:00:00.000Z' },
  { id: 'ach-006', title: '知识拓荒者', description: '累计发现 5 个以上的知识点', category: '探索', icon: 'map', unlocked: true, unlockedAt: '2026-05-28T15:00:00.000Z' },
  { id: 'ach-007', title: '满分复查', description: '一次间隔复查题正确率达到 100%', category: '复练', icon: 'star', unlocked: false, unlockedAt: null },
]

// ── Weekly Report ──

export const mockWeeklyReport: WeeklyReport = {
  id: 'report-2026-w22',
  weekRange: '2026-05-26 ~ 2026-06-01',
  completedPracticeCount: 7,
  repairedErrorTags: ['careless_calculation'],
  masteryImprovedKnowledgePoints: [
    { knowledgePointId: 'kp-func-expression', name: '一次函数解析式', beforeMastery: 50, afterMastery: 62 },
    { knowledgePointId: 'kp-clear-denom', name: '去分母', beforeMastery: 30, afterMastery: 40 },
  ],
  highRiskKnowledgePoints: [
    { knowledgePointId: 'kp-func-graph', reason: '掌握度仅 45，连续两次图像方向判断出错' },
    { knowledgePointId: 'kp-extraneous-check', reason: '掌握度仅 30，多次忘记增根检验' },
    { knowledgePointId: 'kp-ct-criterion', reason: '掌握度仅 38，全等判定条件混淆' },
  ],
  nextWeekSuggestions: [
    '每天完成 1 道一次函数图像方向判断题',
    '分式方程解题后强制写检验步骤',
    '全等三角形证明题至少做 3 道',
    '重点关注逻辑断层类错因',
  ],
  generatedAt: '2026-06-01T12:00:00.000Z',
}
