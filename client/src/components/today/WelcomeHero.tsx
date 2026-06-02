interface WelcomeHeroProps {
  name: string
  grade: string
  streakDays: number
}

export function WelcomeHero({ name, grade, streakDays }: WelcomeHeroProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-5)',
    }}>
      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)' }}>
        今天先修复 3 个关键问题
      </h2>
      <p style={{ margin: '8px 0 0', fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: 520 }}>
        根据错因、掌握度和复查时间，优先处理最值得复练的错题。
      </p>
      <p style={{
        margin: '16px 0 0',
        fontSize: '0.85rem',
        color: 'var(--color-text)',
      }}>
        {name} · {grade} · 连续修复 <strong>{streakDays}</strong> 天
      </p>
    </div>
  )
}
