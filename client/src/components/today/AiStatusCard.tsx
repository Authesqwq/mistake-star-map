import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface AiStatusCardProps {
  configured: boolean
  modelConfigured: boolean
  baseUrlConfigured: boolean
}

export function AiStatusCard({ configured, modelConfigured, baseUrlConfigured }: AiStatusCardProps) {
  return (
    <Card title="AI 归因能力" description="当前 LLM 配置状态">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>LLM 已配置</span>
          <Badge variant={configured ? 'success' : 'warning'}>{configured ? '是' : '否'}</Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Base URL</span>
          <Badge variant={baseUrlConfigured ? 'success' : 'warning'}>
            {baseUrlConfigured ? '已配置' : '未配置'}
          </Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Model</span>
          <Badge variant={modelConfigured ? 'success' : 'warning'}>
            {modelConfigured ? '已配置' : '未配置'}
          </Badge>
        </div>
      </div>
      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'var(--color-surface-soft)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.82rem',
        color: 'var(--color-text-muted)',
      }}>
        <p style={{ margin: 0 }}>
          首页不会自动调用 AI · /api/diagnose 已就绪
        </p>
        {!configured && (
          <p style={{ margin: '4px 0 0', color: 'var(--color-warning)' }}>
            未配置时自动使用 Fallback 模式
          </p>
        )}
      </div>
    </Card>
  )
}
