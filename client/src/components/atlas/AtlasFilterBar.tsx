import type { AtlasFilters } from '../../types/atlas'
import { Button } from '../ui/Button'

interface AtlasFilterBarProps {
  filters: AtlasFilters
  chapters: Array<{ id: string; name: string }>
  onChange: (filters: AtlasFilters) => void
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

const inputStyle: React.CSSProperties = {
  ...selectStyle,
  flex: '1 1 180px',
}

export function AtlasFilterBar({ filters, chapters, onChange }: AtlasFilterBarProps) {
  const set = (k: keyof AtlasFilters, v: string | boolean) => onChange({ ...filters, [k]: v })

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'var(--space-5)',
      padding: 16, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}>
      <input
        style={inputStyle}
        placeholder="搜索知识点..."
        value={filters.keyword}
        onChange={(e) => set('keyword', e.target.value)}
      />

      <select style={selectStyle} value={filters.chapterId} onChange={(e) => set('chapterId', e.target.value)}>
        <option value="all">全部章节</option>
        {chapters.map((ch) => (
          <option key={ch.id} value={ch.id}>{ch.name}</option>
        ))}
      </select>

      <select style={selectStyle} value={filters.status} onChange={(e) => set('status', e.target.value)}>
        <option value="all">全部状态</option>
        <option value="undiscovered">未发现</option>
        <option value="discovered">已发现</option>
        <option value="to_repair">待修复</option>
        <option value="repairing">修复中</option>
        <option value="mastered">已掌握</option>
      </select>

      <select style={selectStyle} value={filters.riskLevel} onChange={(e) => set('riskLevel', e.target.value)}>
        <option value="all">全部风险</option>
        <option value="high">优先修复</option>
        <option value="medium">需关注</option>
        <option value="low">稳定</option>
      </select>

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={filters.localOnly}
          onChange={(e) => set('localOnly', e.target.checked)}
        />
        只看本地新增
      </label>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onChange({
          keyword: '', chapterId: 'all', status: 'all', riskLevel: 'all', localOnly: false,
        })}
      >
        重置
      </Button>
    </div>
  )
}
