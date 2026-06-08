import type { AchievementRecord, MotivationProfile, AchievementEvaluationResult } from '../types/achievement'
import { getConfirmedDiagnoses } from './diagnosisStorage'
import { getPracticeResults } from './practiceStorage'
import { getSavedMasterySnapshots } from './masteryStorage'
import { evaluateAchievements } from './achievementRules'
import { getAchievementRecords, saveAchievementRecords, saveMotivationProfile, getMotivationProfile } from './achievementStorage'

export function evaluateAndPersistAchievements(): AchievementEvaluationResult {
  const diagnoses = getConfirmedDiagnoses()
  const practices = getPracticeResults()
  const masterySnapshots = getSavedMasterySnapshots()
  const prevRecords = getAchievementRecords()

  const result = evaluateAchievements({
    confirmedDiagnoses: diagnoses,
    practiceResults: practices,
    masterySnapshots,
    previousRecords: prevRecords,
  })

  const allRecords = [...prevRecords, ...result.newlyUnlocked]
  if (result.newlyUnlocked.length > 0) {
    saveAchievementRecords(allRecords)
  }
  saveMotivationProfile(result.profile)

  // Update repair value to include new achievement rewards
  result.profile.repairValue = result.profile.repairValue
  saveMotivationProfile(result.profile)

  return result
}

export function getCurrentMotivationProfile(): MotivationProfile {
  return (
    getMotivationProfile() ?? {
      repairValue: 0, streakDays: 0,
      unlockedAchievementCount: 0, recentAchievements: [],
    }
  )
}

export function getRecentAchievements(limit = 5): AchievementRecord[] {
  return getAchievementRecords().slice(-limit).reverse()
}
