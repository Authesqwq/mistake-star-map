type ActiveView = 'today' | 'mistake-input' | 'dev'

interface NavItem {
  id: string
  label: string
  icon: string
  view?: ActiveView
  disabled?: boolean
}

const navItems: NavItem[] = [
  { id: 'today', label: '今日修复中心', icon: '?', view: 'today' },
  { id: 'mistake-input', label: '错题录入', icon: '?', view: 'mistake-input' },
  { id: 'atlas', label: '知识点图鉴', icon: '?', disabled: true },
  { id: 'practice', label: '复练任务', icon: '?', disabled: true },
  { id: 'report', label: '学习报告', icon: '?', disabled: true },
  { id: 'dev', label: '开发联调', icon: '?', view: 'dev' },
]

interface SidebarProps {
  active: ActiveView
  onNavigate: (view: string) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
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
      {navItems.map((item) => {
        const isActive = item.view === active
        const clickable = !!item.view && !item.disabled

        return (
          <div
            key={item.id}
            onClick={() => clickable && onNavigate(item.view!)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px var(--space-4)',
              margin: '2px var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              color: isActive
                ? 'var(--color-primary)'
                : item.disabled
                  ? 'var(--color-text-muted)'
                  : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-primary-soft)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              cursor: clickable ? 'pointer' : 'default',
              opacity: item.disabled ? 0.45 : 1,
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
            {item.label}
            {item.disabled && (
              <span style={{ fontSize: '0.65rem', marginLeft: 'auto', opacity: 0.6 }}>
                后续
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
