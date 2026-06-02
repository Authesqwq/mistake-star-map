import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface AtlasHeaderProps {
  localCount: number
  onClearLocal?: () => void
  confirmClear: boolean
  onRequestClear: () => void
}

export function AtlasHeader({ localCount, onClearLocal, confirmClear, onRequestClear }: AtlasHeaderProps) {
  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>
            知识点图鉴
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            根据错题归因结果点亮知识点，查看待修复、修复中和已掌握的知识点
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="info">Mock + 本地记录</Badge>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            本地 {localCount} 条
          </span>
        </div>
      </div>
      {onClearLocal && (
        <div style={{ marginTop: 12 }}>
          {confirmClear ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)' }}>
                再次点击将清空所有本地确认记录，此操作不可撤销。
              </span>
              <Button size="sm" variant="danger" onClick={onClearLocal}>
                确认清空
              </Button>
              <Button size="sm" variant="ghost" onClick={onRequestClear}>
                取消
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={onRequestClear}>
              清空本地确认记录
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
