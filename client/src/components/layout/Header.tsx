import { StatusDot } from '../ui/StatusDot'

interface HeaderProps {
  backendOk: boolean
}

export function Header({ backendOk }: HeaderProps) {
  return (
    <header style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--space-4) var(--space-6)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--color-text)',
        }}>
          错题星图
        </h1>
        <p style={{
          margin: '2px 0 0',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
        }}>
          AI 错题复练与知识点掌握系统
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusDot status={backendOk ? 'ok' : 'error'} label={backendOk ? '后端正常' : '后端异常'} />
        <span style={{
          fontSize: '0.72rem',
          padding: '2px 10px',
          borderRadius: 99,
          background: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
          fontWeight: 600,
        }}>
          MVP Preview
        </span>
      </div>
    </header>
  )
}
