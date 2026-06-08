export type AchievementCategory = 'discovery' | 'practice' | 'mastery' | 'streak' | 'error_repair'
export type AchievementRarity = 'common' | 'rare' | 'epic'

export interface AchievementDefinition {
  id: string; title: string; description: string
  category: AchievementCategory; rarity: AchievementRarity
  target: number; rewardRepairValue: number
}

export interface AchievementProgress {
  achievementId: string; current: number; target: number
  unlocked: boolean; unlockedAt?: string
}

export interface AchievementRecord {
  id: string; achievementId: string; title: string; description: string
  category: AchievementCategory; rarity: AchievementRarity
  unlockedAt: string; rewardRepairValue: number
}

export interface MotivationProfile {
  repairValue: number; streakDays: number
  lastEffectivePracticeDate?: string
  unlockedAchievementCount: number
  recentAchievements: AchievementRecord[]
}

export interface AchievementEvaluationResult {
  profile: MotivationProfile
  progress: AchievementProgress[]
  newlyUnlocked: AchievementRecord[]
}
