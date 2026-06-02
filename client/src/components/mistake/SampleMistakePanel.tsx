import { Button } from '../ui/Button'

interface Sample {
  label: string
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  candidateKnowledgePointIds: string[]
  candidateErrorTagIds: string[]
}

const samples: Sample[] = [
  {
    label: '示例 1: 一次函数图像方向判断错误',
    grade: '八年级',
    question: '一次函数 y = kx + b 的图像经过第一、三、四象限，判断 k 和 b 的符号。',
    wrongAnswer: 'k > 0, b > 0',
    correctAnswer: 'k > 0, b < 0',
    candidateKnowledgePointIds: ['kp-func-graph', 'kp-func-expression'],
    candidateErrorTagIds: ['concept_confusion', 'logic_gap'],
  },
  {
    label: '示例 2: 分式方程去分母漏乘',
    grade: '八年级',
    question: '解方程：x/(x-1) + 2/(x+1) = 1',
    wrongAnswer: 'x = 1/3',
    correctAnswer: 'x = 1/3，但需检验 x ≠ ±1，x = 1/3 符合条件',
    candidateKnowledgePointIds: ['kp-clear-denom', 'kp-extraneous-check'],
    candidateErrorTagIds: ['careless_calculation', 'logic_gap'],
  },
  {
    label: '示例 3: 全等三角形证明缺少判定条件',
    grade: '八年级',
    question: '已知 AB = AC，D 为 BC 中点。求证：△ABD ≌ △ACD。',
    wrongAnswer: '因为 AB = AC，BD = CD，所以 △ABD ≌ △ACD',
    correctAnswer: 'AB = AC（已知），BD = CD（D 为中点），AD = AD（公共边），SSS 判定 △ABD ≌ △ACD。',
    candidateKnowledgePointIds: ['kp-ct-criterion', 'kp-proof-completeness'],
    candidateErrorTagIds: ['incomplete_expression', 'logic_gap'],
  },
]

interface SampleMistakePanelProps {
  onSelect: (sample: Sample) => void
}

export function SampleMistakePanel({ onSelect }: SampleMistakePanelProps) {
  return (
    <div style={{
      padding: 16,
      background: 'var(--color-surface-soft)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)',
      marginBottom: 24,
    }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
        示例题（点击自动填入）
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {samples.map((s) => (
          <Button key={s.label} size="sm" variant="secondary" onClick={() => onSelect(s)}>
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export type { Sample }
