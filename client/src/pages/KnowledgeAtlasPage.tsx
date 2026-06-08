import { useEffect, useState, useMemo } from 'react'
import type { KnowledgePoint, Mistake, ErrorTag } from '../types/domain'
import type { AtlasFilters } from '../types/atlas'
import { defaultAtlasFilters } from '../types/atlas'
import {
  getKnowledgePoints, getMistakes, getErrorTags, getAtlasProgress, ApiError,
} from '../services/apiClient'
import { getConfirmedDiagnoses, clearConfirmedDiagnoses } from '../utils/diagnosisStorage'
import {
  buildAtlasViewModels,
  groupKnowledgePointsByChapter,
  filterKnowledgePoints,
  getAtlasStats,
  sortKnowledgePoints,
  getLocalDiagnosesByKnowledgePointId,
} from '../utils/atlasSelectors'
import { LoadingState } from '../components/ui/LoadingState'
import { ErrorState } from '../components/ui/ErrorState'
import { trackEvent } from "../utils/analyticsTracker"
import { AtlasHeader } from '../components/atlas/AtlasHeader'
import { AtlasStatsGrid } from '../components/atlas/AtlasStatsGrid'
import { AtlasFilterBar } from '../components/atlas/AtlasFilterBar'
import { KnowledgeChapterSection } from '../components/atlas/KnowledgeChapterSection'
import { KnowledgePointDetailPanel } from '../components/atlas/KnowledgePointDetailPanel'
import { AtlasEmptyState } from '../components/atlas/AtlasEmptyState'

const chapters = [
  { id: 'ch-linear-function', name: '一次函数' },
  { id: 'ch-fractional-eq', name: '分式方程' },
  { id: 'ch-congruent-tri', name: '全等三角形' },
]

export function KnowledgeAtlasPage() {
  const [kps, setKps] = useState<KnowledgePoint[]>([])
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [errorTags, setErrorTags] = useState<ErrorTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<AtlasFilters>(defaultAtlasFilters)
  const [selectedKpId, setSelectedKpId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    Promise.all([getKnowledgePoints(), getMistakes(), getErrorTags(), getAtlasProgress()])
      .then(([kpData, mData, tData]) => {
        setKps(kpData as unknown as KnowledgePoint[])
        setMistakes(mData as unknown as Mistake[])
        setErrorTags(tData as unknown as ErrorTag[])
        setLoading(false)
        trackEvent("atlas_viewed", "atlas");
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : '加载失败')
        setLoading(false)
        trackEvent("atlas_viewed", "atlas");
      })
  }, [])

  const confirmedDiags = useMemo(() => getConfirmedDiagnoses(), [localRefresh])

  const viewModels = useMemo(
    () => buildAtlasViewModels(kps, confirmedDiags),
    [kps, confirmedDiags]
  )

  const filtered = useMemo(
    () => sortKnowledgePoints(filterKnowledgePoints(viewModels, filters)),
    [viewModels, filters]
  )

  const grouped = useMemo(() => groupKnowledgePointsByChapter(filtered), [filtered])
  const stats = useMemo(() => getAtlasStats(viewModels), [viewModels])

  const selectedVm = selectedKpId ? viewModels.find((v) => v.id === selectedKpId) ?? null : null
  const selectedMistakes = selectedVm
    ? mistakes.filter((m) => selectedVm.relatedMistakeIds.includes(m.id))
    : []
  const selectedLocal = selectedVm
    ? getLocalDiagnosesByKnowledgePointId(confirmedDiags, selectedVm.id)
    : []

  const handleClear = () => {
    clearConfirmedDiagnoses()
    setLocalRefresh((n) => n + 1)
    setConfirmClear(false)
    setSelectedKpId(null)
  }

  if (loading) return <LoadingState text="加载知识点图鉴..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <AtlasHeader
        localCount={stats.localCount}
        onClearLocal={handleClear}
        confirmClear={confirmClear}
        onRequestClear={() => setConfirmClear((p) => !p)}
      />

      <AtlasStatsGrid
        total={stats.total} discovered={stats.discovered}
        toRepair={stats.toRepair} repairing={stats.repairing}
        mastered={stats.mastered} localCount={stats.localCount}
      />

      <AtlasFilterBar filters={filters} chapters={chapters} onChange={setFilters} />

      <div style={{ display: 'grid', gridTemplateColumns: selectedVm ? '1fr 380px' : '1fr', gap: 24 }}>
        <div>
          {filtered.length === 0 ? (
            <AtlasEmptyState reason={filters.localOnly ? '没有匹配的本地记录知识点' : undefined} />
          ) : (
            Object.entries(grouped).map(([chapterId, vms]) => (
              <KnowledgeChapterSection
                key={chapterId}
                chapterId={chapterId}
                viewModels={vms}
                selectedId={selectedKpId}
                onSelect={setSelectedKpId}
              />
            ))
          )}
        </div>

        {selectedVm && (
          <div style={{ alignSelf: 'start', position: 'sticky', top: 24 }}>
            <KnowledgePointDetailPanel
              vm={selectedVm}
              relatedMistakes={selectedMistakes}
              relatedErrorTags={errorTags}
              localDiagnoses={selectedLocal}
              onClose={() => setSelectedKpId(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
