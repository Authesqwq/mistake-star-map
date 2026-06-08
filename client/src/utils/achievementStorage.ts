import type { AchievementRecord, MotivationProfile } from '../types/achievement'

const RECORDS_KEY = 'mistake-star-map.achievement-records'
const PROFILE_KEY = 'mistake-star-map.motivation-profile'

export function getAchievementRecords(): AchievementRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as AchievementRecord[]
  } catch { return [] }
}

export function saveAchievementRecords(records: AchievementRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function clearAchievementRecords(): void {
  localStorage.removeItem(RECORDS_KEY)
}

export function getMotivationProfile(): MotivationProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MotivationProfile
  } catch { return null }
}

export function saveMotivationProfile(profile: MotivationProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearMotivationProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
}

export function clearAchievementState(): void {
  clearAchievementRecords()
  clearMotivationProfile()
}
