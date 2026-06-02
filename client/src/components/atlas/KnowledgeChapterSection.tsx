import type { AtlasKnowledgePointViewModel } from '../../types/atlas'
import { SectionHeader } from '../ui/SectionHeader'
import { KnowledgePointCard } from './KnowledgePointCard'
import { formatChapterName } from '../../utils/atlasMappers'

interface KnowledgeChapterSectionProps {
  chapterId: string
  viewModels: AtlasKnowledgePointViewModel[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function KnowledgeChapterSection({ chapterId, viewModels, selectedId, onSelect }: KnowledgeChapterSectionProps) {
  const mastered = viewModels.filter((v) => v.displayStatus === 'mastered').length

  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <SectionHeader
        title={formatChapterName(chapterId)}
        description={`${viewModels.length} 个知识点 · ${mastered} 已掌握`}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {viewModels.map((vm) => (
          <KnowledgePointCard
            key={vm.id}
            vm={vm}
            active={selectedId === vm.id}
            onClick={() => onSelect(vm.id === selectedId ? vm.id : vm.id)}
          />
        ))}
      </div>
    </div>
  )
}
