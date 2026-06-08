import type { AnalyticsEventName, AnalyticsPageName } from '../types/analytics'
import type { MetricsRange } from '../types/metrics'

export function formatAnalyticsEventName(name: AnalyticsEventName): string {
  const m: Record<string, string> = {
    page_view: '页面访问', today_recommendation_loaded: '推荐加载', today_recommendation_failed: '推荐失败',
    diagnosis_started: '开始AI归因', diagnosis_succeeded: 'AI归因成功', diagnosis_failed: 'AI归因失败',
    diagnosis_confirmed: '确认归因', atlas_viewed: '查看图鉴', atlas_filter_changed: '图鉴筛选',
    practice_started: '开始复练', practice_submitted: '提交复练', practice_feedback_received: '收到反馈',
    mastery_snapshot_updated: '掌握度更新', achievement_unlocked: '解锁成就',
    achievement_center_viewed: '查看成就', report_generated: '生成报告',
    report_markdown_copied: '复制Markdown', report_json_exported: '导出JSON',
    eval_panel_opened: '打开评测', eval_run_completed: '评测完成', quick_entry_click: '快捷入口',
  }
  return m[name] ?? name
}

export function formatAnalyticsPageName(page: AnalyticsPageName): string {
  const m: Record<string, string> = {
    today: '今日修复', mistake_input: '错题录入', atlas: '知识点图鉴',
    practice: '复练任务', achievements: '成就中心', report: '学习报告', metrics: '指标看板', dev: '开发联调',
  }
  return m[page] ?? page
}

export function formatMetricsRange(range: MetricsRange): string {
  const m: Record<string, string> = { today: '今日', last_7_days: '近7天', last_30_days: '近30天', all: '全部' }
  return m[range] ?? range
}

export function formatRate(value: number): string { return `${Math.round(value * 100)}%` }
export function formatEventDate(value: string): string { return new Date(value).toLocaleString('zh-CN') }
