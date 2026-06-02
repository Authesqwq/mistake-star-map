import { Button } from '../ui/Button'

interface FormData {
  grade: string
  question: string
  wrongAnswer: string
  correctAnswer: string
}

interface MistakeInputFormProps {
  data: FormData
  onChange: (data: FormData) => void
  onSubmit: () => void
  onClear: () => void
  loading: boolean
  errors: string[]
}

const fieldStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16,
}
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }
const inputStyle: React.CSSProperties = {
  padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
  fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--color-text)', background: 'var(--color-surface)',
}
export function MistakeInputForm({ data, onChange, onSubmit, onClear, loading, errors }: MistakeInputFormProps) {
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [k]: e.target.value })

  return (
    <div>
      {errors.length > 0 && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fee2e2', borderRadius: 'var(--radius-sm)' }}>
          {errors.map((e, i) => (
            <p key={i} style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-danger)' }}>{e}</p>
          ))}
        </div>
      )}

      <div style={fieldStyle}>
        <label style={labelStyle}>年级</label>
        <input style={inputStyle} value={data.grade} onChange={set('grade')} placeholder="八年级" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>题目 *</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={data.question}
          onChange={set('question')}
          placeholder="请输入题目内容..."
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>学生错误答案 *</label>
        <input style={inputStyle} value={data.wrongAnswer} onChange={set('wrongAnswer')} placeholder="学生的错误答案" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>正确答案 *</label>
        <input style={inputStyle} value={data.correctAnswer} onChange={set('correctAnswer')} placeholder="正确答案" />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button onClick={onSubmit} loading={loading}>
          开始 AI 归因
        </Button>
        <Button variant="ghost" onClick={onClear} disabled={loading}>
          清空
        </Button>
      </div>
    </div>
  )
}
