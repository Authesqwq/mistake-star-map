import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'background:var(--color-surface-soft);color:var(--color-text-muted)',
  success: 'background:#dcfce7;color:#166534',
  warning: 'background:#fef3c7;color:#92400e',
  danger: 'background:#fee2e2;color:#991b1b',
  info: 'background:var(--color-primary-soft);color:var(--color-primary)',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '99px',
        fontSize: '0.78rem',
        fontWeight: 500,
        lineHeight: 1.5,
        ...parseStyle(variantStyles[variant]),
      }}
    >
      {children}
    </span>
  )
}

function parseStyle(s: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of s.split(';')) {
    const [k, v] = part.split(':')
    if (k && v) out[k.trim()] = v.trim()
  }
  return out
}
