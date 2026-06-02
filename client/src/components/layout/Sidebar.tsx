const navItems = [
  { id: 'today', label: '今日修复中心', icon: '?' },
  { id: 'mistake-input', label: '错题录入', icon: '?' },
  { id: 'atlas', label: '知识点图鉴', icon: '?' },
  { id: 'practice', label: '复练任务', icon: '?' },
  { id: 'report', label: '学习报告', icon: '?' },
  { id: 'dev', label: '开发联调', icon: '?' },
]

interface SidebarProps {
  active?: string
}

export function Sidebar({ active = 'dev' }: SidebarProps) {
  return (
    <nav style={{
      width: 220,
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      padding: 'var(--space-4) 0',
      flexShrink: 0,
    }}>
      <div style={{ padding: '0 var(--space-4)', marginBottom: 8 }}>
        <p style={{
          margin: 0,
          fontSize: '0.72rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-text-muted)',
        }}>
          导航
        </p>
      </div>
      {navItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px var(--space-4)',
            margin: '2px var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            color: active === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
            background: active === item.id ? 'var(--color-primary-soft)' : 'transparent',
            fontWeight: active === item.id ? 600 : 400,
            cursor: 'default',
            transition: 'background 0.15s',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </nav>
  )
}
