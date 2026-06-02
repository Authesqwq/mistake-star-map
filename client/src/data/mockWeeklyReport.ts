import type { WeeklyReport } from '../types/domain'

export const mockWeeklyReport: WeeklyReport = {
  id: 'report-2026-w22',
  weekRange: '2026-05-26 ~ 2026-06-01',
  completedPracticeCount: 7,
  repairedErrorTags: ['careless_calculation'],
  masteryImprovedKnowledgePoints: [
    {
      knowledgePointId: 'kp-func-expression',
      name: '一次函数解析式',
      beforeMastery: 50,
      afterMastery: 62,
    },
    {
      knowledgePointId: 'kp-clear-denom',
      name: '去分母',
      beforeMastery: 30,
      afterMastery: 40,
    },
  ],
  highRiskKnowledgePoints: [
    {
      knowledgePointId: 'kp-func-graph',
      reason: '掌握度仅 45，连续两次图像方向判断出错，建议重点突破',
    },
    {
      knowledgePointId: 'kp-extraneous-check',
      reason: '掌握度仅 30，多次忘记增根检验，且 confidence 低',
    },
    {
      knowledgePointId: 'kp-ct-criterion',
      reason: '掌握度仅 38，全等判定条件混淆，证明书写不完整',
    },
  ],
  nextWeekSuggestions: [
    '每天完成 1 道一次函数图像方向判断题，强化 k/b 符号与象限的对应关系',
    '分式方程解题后强制写检验步骤，养成习惯',
    '全等三角形证明题至少做 3 道，重点练习 SSS/SAS/ASA 的选择与书写格式',
    '本周已修复粗心计算错因，下周重点关注逻辑断层类错因',
  ],
  generatedAt: '2026-06-01T12:00:00.000Z',
}
