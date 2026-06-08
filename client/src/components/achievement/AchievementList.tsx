import { useMemo, useState } from 'react'
import type { AchievementDefinition, AchievementProgress, AchievementCategory } from '../../types/achievement'

import { Button } from '../ui/Button'
import { AchievementCard } from './AchievementCard'
import { EmptyState } from '../ui/EmptyState'
import { formatAchievementCategory } from '../../utils/achievementMappers'

interface AchievementListProps {
  definitions: AchievementDefinition[]
  progress: AchievementProgress[]
}

export function AchievementList({ definitions, progress }: AchievementListProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const progressMap = useMemo(() => {
    const m: Record<string, AchievementProgress> = {}
    for (const p of progress) m[p.achievementId] = p
    return m
  }, [progress])

  const filtered = useMemo(() => {
    let list = definitions.map((d) => ({ def: d, p: progressMap[d.id] ?? { achievementId: d.id, current: 0, target: d.target, unlocked: false } }))
    if (filter === 'unlocked') list = list.filter((x) => x.p.unlocked)
    if (filter === 'locked') list = list.filter((x) => !x.p.unlocked)
    return list
  }, [definitions, progressMap, filter])

  const byCategory = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const item of filtered) {
      const cat = item.def.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    }
    return groups
  }, [filtered])

  if (filtered.length === 0) return <EmptyState title="暂无匹配成就" />

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'primary' : 'ghost'} onClick={() => setFilter(f)}>
            {f === 'all' ? '全部' : f === 'unlocked' ? '已解锁' : '未解锁'}
          </Button>
        ))}
      </div>
      {(Object.keys(byCategory) as AchievementCategory[]).map((cat) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            {formatAchievementCategory(cat)}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {byCategory[cat].map(({ def, p }) => (
              <AchievementCard key={def.id} def={def} progress={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
