import { Card } from '../ui/Card'
import { QuickEntryCard } from './QuickEntryCard'

interface QuickEntryGridProps {
  onOpenMistakeInput?: () => void
  onOpenAtlas?: () => void
  onOpenAchievements?: () => void
  onOpenReport?: () => void
}

export function QuickEntryGrid({ onOpenMistakeInput, onOpenAtlas, onOpenAchievements, onOpenReport }: QuickEntryGridProps) {
  const entries = [
    { title: '录入新错题', description: '手动添加或拍照录入错题', pr: 'PR9', icon: 'plus', action: onOpenMistakeInput },
    { title: '查看知识点图鉴', description: '浏览数学知识图谱与掌握度', pr: 'PR10', icon: 'map', action: onOpenAtlas },
    { title: '成就中心', description: '查看修复值、连续修复和成就进度', pr: 'PR14', icon: 'star', action: onOpenAchievements },
    { title: '继续复练', description: '完成推荐任务，巩固薄弱点', pr: 'PR12', icon: 'target' },
    { title: '查看学习报告', description: '每周掌握度变化与修复建议', pr: 'PR15', icon: 'chart', action: onOpenReport },
  ]

  return (
    <Card title="学习入口" description="以下功能将在后续 PR 中逐步实现">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
      }}>
        {entries.map((e) => (
          <div
            key={e.title}
            onClick={e.action}
            style={{ cursor: e.action ? 'pointer' : 'default' }}
          >
            <QuickEntryCard title={e.title} description={e.description} pr={e.pr} icon={e.icon} />
          </div>
        ))}
      </div>
    </Card>
  )
}
