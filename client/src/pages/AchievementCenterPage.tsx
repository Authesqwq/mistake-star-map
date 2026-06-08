import { useEffect, useMemo, useState } from 'react'
import type { MotivationProfile, AchievementProgress } from '../types/achievement'
import { getAchievementDefinitions } from '../utils/achievementRules'
import { evaluateAndPersistAchievements, getCurrentMotivationProfile } from '../utils/achievementSignals'
import { getAchievementRecords, saveAchievementRecords, clearAchievementState } from '../utils/achievementStorage'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/ui/LoadingState'
import { AchievementSummaryPanel } from '../components/achievement/AchievementSummaryPanel'
import { RepairValueCard } from '../components/achievement/RepairValueCard'
import { StreakCard } from '../components/achievement/StreakCard'
import { AchievementProgressCard } from '../components/achievement/AchievementProgressCard'
import { AchievementList } from '../components/achievement/AchievementList'

export function AchievementCenterPage() {
  const [profile, setProfile] = useState<MotivationProfile>(() => getCurrentMotivationProfile())
  const [progress, setProgress] = useState<AchievementProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmClear, setConfirmClear] = useState(false)

  const definitions = useMemo(() => getAchievementDefinitions(), [])

  useEffect(() => {
    const result = evaluateAndPersistAchievements()
    setProfile(result.profile)
    setProgress(result.progress)
    saveAchievementRecords(getAchievementRecords())
    setLoading(false)
  }, [])

  const handleClear = () => {
    if (confirmClear) {
      clearAchievementState()
      const result = evaluateAndPersistAchievements()
      setProfile(result.profile)
      setProgress(result.progress)
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  if (loading) return <LoadingState text="加载成就..." />

  return (
    <div>
      <SectionHeader title="成就中心" description="你的学习行动会获得成就。修复值记录有效复练和错因修复的过程。" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        {confirmClear ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)' }}>再次点击确认清空所有成就数据。</span>
            <Button size="sm" variant="danger" onClick={handleClear}>确认清空</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>取消</Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={handleClear}>清空成就数据</Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <RepairValueCard value={profile.repairValue} />
        <StreakCard days={profile.streakDays} />
        <AchievementProgressCard unlocked={profile.unlockedAchievementCount} total={definitions.length} />
      </div>

      <AchievementSummaryPanel profile={profile} />

      <div style={{ marginTop: 24 }}>
        <AchievementList definitions={definitions} progress={progress} />
      </div>
    </div>
  )
}
