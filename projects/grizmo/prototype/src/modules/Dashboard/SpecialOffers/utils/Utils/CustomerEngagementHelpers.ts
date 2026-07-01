import { DollarCircleOutlined, EyeOutlined, MailOutlined, TrophyOutlined, UserAddOutlined } from '@ant-design/icons'
import type { SpecialOfferBreakdownCustomerEngagement } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { type ReactNode, createElement } from 'react'

export type EngagementStageKey = 'Invited' | 'Opened' | 'Viewed' | 'Submitted' | 'Accepted'

export interface EngagementStage {
  key: EngagementStageKey
  title: string
  step: number
  count: number
  percent?: number // relative to previous stage (one decimal)
  customers?: string[]
  lostText?: string // "(x lost)" if applicable
  lostNames?: string[] // NEW: who dropped from previous to this stage
}

/** Safe unique/trim helper */
const uniq = (arr: (string | null | undefined)[] = []): string[] => {
  const out: string[] = []
  const seen = new Set<string>()
  for (const v of arr) {
    const s = (v ?? '').trim()
    if (!s) continue
    if (!seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  return out
}

/** Map a stage key to its customer-name list from the engagement object */
function getNamesForStage(e: SpecialOfferBreakdownCustomerEngagement, key: EngagementStageKey): string[] | undefined {
  switch (key) {
    case 'Invited':
      return uniq(e.InvitedCustomerNames)
    case 'Opened':
      return uniq((e as any).OpenedCustomerNames) // optional / future
    case 'Viewed':
      return uniq(e.ViewedCustomerNames)
    case 'Submitted':
      return uniq(e.SubmittedCustomerNames)
    case 'Accepted':
      return uniq(e.AcceptedCustomerNames)
    default:
      return undefined
  }
}

/** Get numeric count for a stage (fallback if names not present) */
function getCountForStage(e: SpecialOfferBreakdownCustomerEngagement, key: EngagementStageKey): number | undefined {
  switch (key) {
    case 'Invited':
      return e.InvitedCount
    case 'Opened':
      return (e as any).OpenedCount
    case 'Viewed':
      return e.ViewedCount
    case 'Submitted':
      return e.SubmittedCount
    case 'Accepted':
      return e.AcceptedCount
    default:
      return undefined
  }
}

/**
 * Build stages array suitable for mapping into StageStatCard.
 * - Count always uses backend-provided counts (InvitedCount, ViewedCount, BidCount, WonCount)
 * - Percent computed relative to previous stage using backend counts
 * - Includes customers[] per stage and lostNames[] vs previous stage
 */
export function buildEngagementStages(e?: SpecialOfferBreakdownCustomerEngagement): EngagementStage[] {
  if (!e) return []

  // Build the pipeline order; omit any stage where the count is absent/undefined
  const keys: EngagementStageKey[] = ['Invited', 'Opened', 'Viewed', 'Submitted', 'Accepted']
  const pipeline = keys
    .map((key) => {
      const names = getNamesForStage(e, key)
      const count = getCountForStage(e, key)
      // Omit stages that truly don't exist (no count available)
      if (count == null) return undefined
      // Always use backend count, not names.length
      return { key, names: names ?? undefined, count }
    })
    .filter(Boolean) as Array<{ key: EngagementStageKey; names?: string[]; count: number }>

  const stages: EngagementStage[] = []

  pipeline.forEach((stage, idx) => {
    const prev = idx > 0 ? pipeline[idx - 1] : undefined

    // Compute percent relative to previous stage using backend counts
    let percent: number | undefined
    if (prev) {
      const currBase = stage.count
      const prevBase = prev.count
      percent = prevBase > 0 ? Number(((currBase / prevBase) * 100).toFixed(1)) : undefined
    } else {
      percent = undefined
    }

    // Compute drop-off / lost from previous stage (set diff if names exist, else by count)
    let lostNames: string[] | undefined
    let lostText: string | undefined
    if (prev) {
      if (prev.names && stage.names) {
        lostNames = prev.names.filter((n) => !new Set(stage.names!).has(n))
        if (lostNames.length > 0) lostText = `${lostNames.length} lost`
      } else {
        // Use backend counts for lost calculation
        const lost = Math.max(0, prev.count - stage.count)
        if (lost > 0) lostText = `${lost} lost`
      }
    }

    stages.push({
      key: stage.key,
      title: stage.key,
      step: stages.length + 1,
      count: stage.count,
      percent,
      customers: stage.names,
      lostText,
      lostNames,
    })
  })

  // If percent for Won is missing but ApprovalPercentage exists, use it
  const won = stages.find((s) => s.key === 'Accepted')
  if (won && (won.percent == null || Number.isNaN(won.percent))) {
    const fallback = e.ApprovalPercentage
    if (typeof fallback === 'number') won.percent = Number(fallback.toFixed?.(1) ?? fallback)
  }

  return stages
}

export function getStageIcon(key: EngagementStageKey): ReactNode {
  switch (key) {
    case 'Invited':
      return createElement(UserAddOutlined)
    case 'Opened':
      return createElement(MailOutlined)
    case 'Viewed':
      return createElement(EyeOutlined)
    case 'Submitted':
      return createElement(DollarCircleOutlined)
    case 'Accepted':
      return createElement(TrophyOutlined)
    default:
      return null
  }
}
