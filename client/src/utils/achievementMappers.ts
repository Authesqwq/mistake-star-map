import type { AchievementCategory, AchievementRarity } from '../types/achievement'

export function formatAchievementCategory(category: AchievementCategory): string {
  const map: Record<AchievementCategory, string> = {
    discovery: '知识点发现', practice: '复练行动', mastery: '掌握提升',
    streak: '连续修复', error_repair: '错因修复',
  }
  return map[category] ?? category
}

export function formatAchievementRarity(rarity: AchievementRarity): string {
  const map: Record<AchievementRarity, string> = {
    common: '基础', rare: '进阶', epic: '挑战',
  }
  return map[rarity] ?? rarity
}

export function getAchievementBadgeVariant(
  rarity: AchievementRarity
): 'success' | 'warning' | 'danger' | 'info' {
  if (rarity === 'epic') return 'danger'
  if (rarity === 'rare') return 'warning'
  return 'success'
}

export function formatRepairValue(value: number): string {
  return `${value}`
}

export function formatStreakDays(days: number): string {
  return `${days} 天`
}

export function getAchievementProgressText(current: number, target: number): string {
  return `${Math.min(current, target)}/${target}`
}
