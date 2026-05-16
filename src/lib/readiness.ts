import type { AppState, Gate } from '@/types'
import { GATES } from './data'

export type ReadinessLevel =
  | 'not_ready'
  | 'foundation_building'
  | 'tier2_ready'
  | 'tier1_ready'

export interface ReadinessReport {
  level: ReadinessLevel
  score: number                    // 0–100
  label: string
  sublabel: string
  color: string
  bgColor: string
  foundationDone: number
  foundationTotal: number
  tier2Done: number
  tier2Total: number
  tier1Done: number
  tier1Total: number
  blockers: Gate[]                 // incomplete gates past their hard deadline
  nextActions: Gate[]              // next 3 incomplete gates to focus on
  overdueGates: Gate[]
  daysToTier2: number | null
  daysToTier1: number | null
  onTrackForEOY: boolean           // end of 2026 Tier 1 goal
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function computeReadiness(state: AppState): ReadinessReport {
  const now = new Date()
  const gatesDone = state.gates ?? {}

  const foundation = GATES.filter(g => g.tier === 'foundation')
  const tier2 = GATES.filter(g => g.tier === 'tier2_ready')
  const tier1 = GATES.filter(g => g.tier === 'tier1_ready')

  const foundationDone = foundation.filter(g => gatesDone[g.id]).length
  const tier2Done = tier2.filter(g => gatesDone[g.id]).length
  const tier1Done = tier1.filter(g => gatesDone[g.id]).length

  const foundationTotal = foundation.length
  const tier2Total = tier2.length
  const tier1Total = tier1.length

  const allDone = GATES.filter(g => gatesDone[g.id]).length
  const score = Math.round((allDone / GATES.length) * 100)

  // Overdue: past hard deadline, not done
  const overdueGates = GATES.filter(g => {
    if (gatesDone[g.id]) return false
    return new Date(g.hardDeadline) < now
  })

  // Blockers: overdue foundation gates
  const blockers = overdueGates.filter(g => g.tier === 'foundation')

  // Next actions: earliest incomplete gates not yet due
  const nextActions = GATES
    .filter(g => !gatesDone[g.id])
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3)

  // Readiness level
  const allFoundationDone = foundationDone === foundationTotal
  const allTier2Done = tier2Done === tier2Total
  const allTier1Done = tier1Done === tier1Total

  let level: ReadinessLevel = 'not_ready'
  let label = 'Building foundation'
  let sublabel = `${foundationDone}/${foundationTotal} foundation gates cleared`
  let color = 'text-stone-500'
  let bgColor = 'bg-stone-100'

  if (allTier1Done) {
    level = 'tier1_ready'
    label = 'Tier 1 ready'
    sublabel = 'Apply to Stripe, Plaid, Chime, Brex now'
    color = 'text-emerald-700'
    bgColor = 'bg-emerald-50'
  } else if (allFoundationDone && allTier2Done) {
    level = 'tier2_ready'
    label = 'Tier 2 ready'
    sublabel = 'Apply to Affirm, Robinhood, Capital One now'
    color = 'text-violet-700'
    bgColor = 'bg-violet-50'
  } else if (allFoundationDone) {
    level = 'foundation_building'
    label = 'Foundation complete'
    sublabel = `${tier2Done}/${tier2Total} Tier 2 gates cleared — keep going`
    color = 'text-amber-700'
    bgColor = 'bg-amber-50'
  }

  // Days to Tier 2: estimate based on remaining gates
  const tier2Remaining = tier2.filter(g => !gatesDone[g.id])
  const daysToTier2 = tier2Remaining.length > 0
    ? daysBetween(now, new Date(tier2Remaining[tier2Remaining.length - 1].targetDate))
    : 0

  const tier1Remaining = tier1.filter(g => !gatesDone[g.id])
  const daysToTier1 = tier1Remaining.length > 0
    ? daysBetween(now, new Date(tier1Remaining[tier1Remaining.length - 1].targetDate))
    : 0

  // On track for EOY 2026 Tier 1 (Dec 31, 2026)
  const eoy2026 = new Date('2026-12-31')
  const tier1Gates = tier1.filter(g => !gatesDone[g.id])
  const onTrackForEOY = tier1Gates.every(g => new Date(g.targetDate) <= eoy2026)

  return {
    level,
    score,
    label,
    sublabel,
    color,
    bgColor,
    foundationDone,
    foundationTotal,
    tier2Done,
    tier2Total,
    tier1Done,
    tier1Total,
    blockers,
    nextActions,
    overdueGates,
    daysToTier2: allTier2Done ? null : daysToTier2,
    daysToTier1: allTier1Done ? null : daysToTier1,
    onTrackForEOY,
  }
}

export function weeklyLCTarget(state: AppState): { count: number; onTrack: boolean; message: string } {
  const count = state.leetcodeCount ?? 0
  const now = new Date()
  // By Jul 15 → 20 mediums. By Sep 15 → 40. By Dec 31 → 60+
  const targets = [
    { deadline: new Date('2026-07-15'), count: 20 },
    { deadline: new Date('2026-09-15'), count: 40 },
    { deadline: new Date('2026-12-31'), count: 60 },
  ]
  const current = targets.find(t => now <= t.deadline) ?? targets[targets.length - 1]
  const daysLeft = daysBetween(now, current.deadline)
  const needed = Math.max(0, current.count - count)
  const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7))
  const perWeek = Math.ceil(needed / weeksLeft)
  const onTrack = perWeek <= 5

  return {
    count,
    onTrack,
    message: needed <= 0
      ? `✓ On track — ${count} done, target met`
      : `Need ${perWeek}/week for next ${weeksLeft} weeks to hit ${current.count} by ${current.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
  }
}
