import { useEffect, useState } from 'react'
import { getMockSummary, ApiError } from '../../services/apiClient'
import { Card } from '../ui/Card'
import { MetricCard } from '../ui/MetricCard'
import { LoadingState } from '../ui/LoadingState'
import { ErrorState } from '../ui/ErrorState'

interface Summary {
  studentCount: number; subjectCount: number; chapterCount: number
  knowledgePointCount: number; mistakeCount: number; errorTagCount: number
  practiceTaskCount: number; achievementCount: number
}

export function MockSummaryPanel() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMockSummary()
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title="Mock 数据总览">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {data && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
        }}>
          <MetricCard title="知识点" value={data.knowledgePointCount} />
          <MetricCard title="错题" value={data.mistakeCount} />
          <MetricCard title="错因标签" value={data.errorTagCount} />
          <MetricCard title="今日三题" value={data.practiceTaskCount} />
          <MetricCard title="成就" value={data.achievementCount} />
          <MetricCard title="章节" value={data.chapterCount} />
        </div>
      )}
    </Card>
  )
}
