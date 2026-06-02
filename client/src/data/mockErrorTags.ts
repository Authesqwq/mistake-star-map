import type { ErrorTag } from '../types/domain'

export const mockErrorTags: ErrorTag[] = [
  {
    id: 'careless_calculation',
    name: '粗心计算',
    category: '计算错误',
    description: '符号、数字、单位、漏算等问题',
    severity: 3,
  },
  {
    id: 'concept_confusion',
    name: '概念模糊',
    category: '理解偏差',
    description: '定义、条件、性质理解不稳定',
    severity: 4,
  },
  {
    id: 'logic_gap',
    name: '逻辑断层',
    category: '推理缺陷',
    description: '推导步骤缺失或跳步',
    severity: 4,
  },
  {
    id: 'question_misread',
    name: '审题偏差',
    category: '审题问题',
    description: '漏看条件或误解题意',
    severity: 3,
  },
  {
    id: 'method_transfer_weak',
    name: '方法迁移弱',
    category: '应用能力',
    description: '会原题，不会变式',
    severity: 4,
  },
  {
    id: 'incomplete_expression',
    name: '表达不完整',
    category: '书写规范',
    description: '过程、理由、结论表述不完整',
    severity: 2,
  },
  {
    id: 'formula_misuse',
    name: '公式适用错误',
    category: '应用能力',
    description: '公式选择或使用条件错误',
    severity: 3,
  },
]
