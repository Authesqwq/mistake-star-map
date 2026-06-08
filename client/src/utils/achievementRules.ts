import type { ConfirmedDiagnosisRecord } from '../types/diagnosis'
import type { PracticeResultRecord } from '../types/practice'
import type { MasterySnapshot } from '../types/mastery'
import type {
  AchievementDefinition, AchievementProgress,
  AchievementRecord, MotivationProfile, AchievementEvaluationResult,
} from '../types/achievement'

const DEFINITIONS: AchievementDefinition[] = [
  // ── Discovery ──
  { id: 'ach-first-discovery', title: '首次发现', description: '发现第一个知识点', category: 'discovery', rarity: 'common', target: 1, rewardRepairValue: 10 },
  { id: 'ach-confirm-3', title: '归因起步', description: '确认 3 个错题归因结果', category: 'discovery', rarity: 'common', target: 3, rewardRepairValue: 10 },
  { id: 'ach-confirm-5', title: '归因能手', description: '确认 5 个错题归因结果', category: 'discovery', rarity: 'rare', target: 5, rewardRepairValue: 20 },
  { id: 'ach-light-3', title: '点亮星图', description: '点亮 3 个知识点', category: 'discovery', rarity: 'common', target: 3, rewardRepairValue: 10 },

  // ── Practice ──
  { id: 'ach-first-practice', title: '初次复练', description: '完成首次复练', category: 'practice', rarity: 'common', target: 1, rewardRepairValue: 10 },
  { id: 'ach-today-one', title: '今日行动', description: '完成今日三题中的 1 题', category: 'practice', rarity: 'common', target: 1, rewardRepairValue: 10 },
  { id: 'ach-practice-5', title: '复练战士', description: '累计完成 5 次复练', category: 'practice', rarity: 'rare', target: 5, rewardRepairValue: 20 },
  { id: 'ach-correct-3', title: '三连胜', description: '累计答对 3 次复练', category: 'practice', rarity: 'rare', target: 3, rewardRepairValue: 20 },
  { id: 'ach-variant-1', title: '变式挑战', description: '完成 1 次变式迁移复练', category: 'practice', rarity: 'rare', target: 1, rewardRepairValue: 20 },
  { id: 'ach-review-1', title: '记忆巩固', description: '完成 1 次间隔复查复练', category: 'practice', rarity: 'common', target: 1, rewardRepairValue: 10 },

  // ── Mastery ──
  { id: 'ach-mastery-85', title: '初登巅峰', description: '首次有知识点掌握度达到 85', category: 'mastery', rarity: 'rare', target: 1, rewardRepairValue: 20 },
  { id: 'ach-master-3', title: '知识达人', description: '累计 3 个知识点进入已掌握', category: 'mastery', rarity: 'epic', target: 3, rewardRepairValue: 35 },
  { id: 'ach-mastery-boost', title: '飞跃进步', description: '一个知识点掌握度提升 20 分', category: 'mastery', rarity: 'rare', target: 20, rewardRepairValue: 20 },

  // ── Streak ──
  { id: 'ach-streak-2', title: '稳步前行', description: '连续修复 2 天', category: 'streak', rarity: 'common', target: 2, rewardRepairValue: 10 },
  { id: 'ach-streak-3', title: '三天连修', description: '连续修复 3 天', category: 'streak', rarity: 'rare', target: 3, rewardRepairValue: 20 },
  { id: 'ach-streak-7', title: '七日之星', description: '连续修复 7 天', category: 'streak', rarity: 'epic', target: 7, rewardRepairValue: 35 },

  // ── Error Repair ──
  { id: 'ach-error-fix', title: '错因攻克', description: '高频错因标签完成一次修复', category: 'error_repair', rarity: 'rare', target: 1, rewardRepairValue: 20 },
  { id: 'ach-error-double', title: '连对认证', description: '同一错因连续两次复练答对', category: 'error_repair', rarity: 'epic', target: 2, rewardRepairValue: 35 },
]

export function getAchievementDefinitions(): AchievementDefinition[] {
  return DEFINITIONS
}

export function calculateStreakDays(practiceResults: PracticeResultRecord[]): number {
  const dates = new Set<string>()
  for (const pr of practiceResults) {
    dates.add(pr.createdAt.slice(0, 10))
  }
  const sorted = [...dates].sort().reverse()
  if (sorted.length === 0) return 0
  let streak = 1
  const today = new Date().toISOString().slice(0, 10)
  if (sorted[0] !== today) return 0
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const cur = new Date(sorted[i])
    const diff = (prev.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24)
    if (Math.round(diff) === 1) streak++
    else break
  }
  return streak
}

export function calculateRepairValue(params: {
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
  unlockedAchievements: AchievementRecord[]
}): number {
  let value = 0
  const today = new Date().toISOString().slice(0, 10)
  let dailyDiag = 0
  let dailyPractice = 0

  for (const d of params.confirmedDiagnoses) {
    if (d.createdAt?.slice(0, 10) === today) dailyDiag++
    if (dailyDiag <= 5) value += 2
  }

  for (const pr of params.practiceResults) {
    if (pr.createdAt?.slice(0, 10) === today) dailyPractice++
    if (dailyPractice <= 6) value += 5
    if (pr.status === 'correct') {
      value += 5
      if (pr.practiceType === 'variant') value += 4
      if (pr.practiceType === 'review') value += 4
    }
  }

  for (const ach of params.unlockedAchievements) {
    value += ach.rewardRepairValue
  }

  return value
}

export function evaluateAchievements(params: {
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
  masterySnapshots: MasterySnapshot[]
  previousRecords: AchievementRecord[]
}): AchievementEvaluationResult {
  const { confirmedDiagnoses, practiceResults, masterySnapshots, previousRecords } = params
  const unlockedIds = new Set(previousRecords.map((r) => r.achievementId))
  const progress: AchievementProgress[] = []
  const newlyUnlocked: AchievementRecord[] = []

  const diagCount = confirmedDiagnoses.length
  const practiceCount = practiceResults.length
  const correctCount = practiceResults.filter((p) => p.status === 'correct').length
  const variantCount = practiceResults.filter((p) => p.practiceType === 'variant').length
  const reviewCount = practiceResults.filter((p) => p.practiceType === 'review').length
  const maxMastery = Math.max(0, ...masterySnapshots.map((s) => s.currentMastery))
  const masteredCount = masterySnapshots.filter((s) => s.displayStatus === 'mastered').length
  const maxBoost = masterySnapshots.reduce((max, s) => {
    const boost = s.currentMastery - s.baseMastery
    return boost > max ? boost : max
  }, 0)
  const streakDays = calculateStreakDays(practiceResults)
  const todayPracticeCount = practiceResults.filter((p) => p.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length

  // Error repair tracking
  const errorTagIds = new Set<string>()
  let errorDoubleFixed = false
  const tagCorrectStreaks: Record<string, number> = {}
  for (const pr of practiceResults) {
    if (pr.status === 'correct') {
      // Count consecutive correct per day group
      errorTagIds.add(pr.knowledgePointId)
    }
    for (const tagId of errorTagIds) {
      if (pr.status === 'correct') {
        tagCorrectStreaks[tagId] = (tagCorrectStreaks[tagId] ?? 0) + 1
        if (tagCorrectStreaks[tagId] >= 2) errorDoubleFixed = true
      }
    }
  }

  // Evaluate each definition
  const evaluators: Record<string, number> = {
    'ach-first-discovery': masterySnapshots.length > 0 ? 1 : 0,
    'ach-confirm-3': diagCount,
    'ach-confirm-5': diagCount,
    'ach-light-3': masteredCount,
    'ach-first-practice': practiceCount,
    'ach-today-one': todayPracticeCount,
    'ach-practice-5': practiceCount,
    'ach-correct-3': correctCount,
    'ach-variant-1': variantCount,
    'ach-review-1': reviewCount,
    'ach-mastery-85': maxMastery >= 85 ? 1 : 0,
    'ach-master-3': masteredCount,
    'ach-mastery-boost': maxBoost,
    'ach-streak-2': streakDays,
    'ach-streak-3': streakDays,
    'ach-streak-7': streakDays,
    'ach-error-fix': errorTagIds.size > 0 ? 1 : 0,
    'ach-error-double': errorDoubleFixed ? 2 : 0,
  }

  for (const def of DEFINITIONS) {
    const current = evaluators[def.id] ?? 0
    const unlocked = current >= def.target
    progress.push({
      achievementId: def.id,
      current: Math.min(current, def.target),
      target: def.target,
      unlocked,
      unlockedAt: unlocked ? previousRecords.find((r) => r.achievementId === def.id)?.unlockedAt ?? (unlockedIds.has(def.id) ? undefined : new Date().toISOString()) : undefined,
    })

    if (unlocked && !unlockedIds.has(def.id)) {
      const record: AchievementRecord = {
        id: `rec-${def.id}-${Date.now()}`,
        achievementId: def.id,
        title: def.title, description: def.description,
        category: def.category, rarity: def.rarity,
        unlockedAt: new Date().toISOString(),
        rewardRepairValue: def.rewardRepairValue,
      }
      newlyUnlocked.push(record)
      unlockedIds.add(def.id)
    }
  }

  const allRecords = [...previousRecords, ...newlyUnlocked]
  const profile: MotivationProfile = {
    repairValue: calculateRepairValue({ confirmedDiagnoses, practiceResults, unlockedAchievements: allRecords }),
    streakDays,
    lastEffectivePracticeDate: practiceResults[practiceResults.length - 1]?.createdAt?.slice(0, 10),
    unlockedAchievementCount: allRecords.length,
    recentAchievements: allRecords.slice(-5).reverse(),
  }

  return { profile, progress, newlyUnlocked }
}

export function getAchievementProgress(params: {
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
  masterySnapshots: MasterySnapshot[]
  previousRecords: AchievementRecord[]
}): AchievementProgress[] {
  return evaluateAchievements(params).progress
}

export function getNewlyUnlockedAchievements(params: {
  confirmedDiagnoses: ConfirmedDiagnosisRecord[]
  practiceResults: PracticeResultRecord[]
  masterySnapshots: MasterySnapshot[]
  previousRecords: AchievementRecord[]
}): AchievementRecord[] {
  return evaluateAchievements(params).newlyUnlocked
}
