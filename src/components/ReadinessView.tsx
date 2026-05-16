'use client'

import type { AppState, Gate } from '@/types'
import { GATES } from '@/lib/data'
import { computeReadiness, weeklyLCTarget } from '@/lib/readiness'
import { ProgressBar } from './ProgressBar'

interface ReadinessViewProps {
  state: AppState
  onChange: (s: AppState) => void
}

const TIER_COLORS = {
  foundation: { dot: 'bg-stone-400', label: 'text-stone-600', badge: 'bg-stone-100 text-stone-600', border: 'border-stone-200' },
  tier2_ready: { dot: 'bg-violet-500', label: 'text-violet-700', badge: 'bg-violet-50 text-violet-700', border: 'border-violet-200' },
  tier1_ready: { dot: 'bg-emerald-500', label: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
}

const TIER_LABELS = {
  foundation: 'Foundation',
  tier2_ready: 'Tier 2 gate',
  tier1_ready: 'Tier 1 gate',
}

const CAT_ICONS: Record<string, string> = {
  leetcode: '{ }',
  rag: '◎',
  portfolio: '▦',
  network: '◇',
  apply: '→',
  wells: '⊘',
  omscs: '△',
}

function GateCard({ gate, done, onToggle }: { gate: Gate; done: boolean; onToggle: () => void }) {
  const tc = TIER_COLORS[gate.tier]
  const now = new Date()
  const target = new Date(gate.targetDate)
  const hard = new Date(gate.hardDeadline)
  const isOverdue = !done && hard < now
  const isDueSoon = !done && !isOverdue && target <= new Date(now.getTime() + 14 * 86400000)

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      done ? 'opacity-50 bg-stone-50 border-stone-100' :
      isOverdue ? 'bg-red-50 border-red-200' :
      isDueSoon ? 'bg-amber-50 border-amber-200' :
      'bg-white border-stone-100 hover:border-stone-200'
    }`}>
      <button
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          done ? 'bg-stone-800 border-stone-800' : `border-stone-300 hover:border-stone-500`
        }`}
      >
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium ${done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
            <span className="font-mono text-xs mr-1.5 text-stone-400">{CAT_ICONS[gate.category]}</span>
            {gate.label}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {isOverdue && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Overdue</span>}
            {isDueSoon && !isOverdue && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Due soon</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.badge}`}>
              {TIER_LABELS[gate.tier]}
            </span>
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{gate.description}</p>
        <p className={`text-xs font-mono mt-1 ${isOverdue ? 'text-red-500' : 'text-stone-400'}`}>
          Target: {new Date(gate.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {isOverdue && ' — PAST DUE'}
        </p>
      </div>
    </div>
  )
}

export function ReadinessView({ state, onChange }: ReadinessViewProps) {
  const report = computeReadiness(state)
  const lcStatus = weeklyLCTarget(state)
  const gatesDone = state.gates ?? {}

  const toggleGate = (id: string) => {
    onChange({
      ...state,
      gates: { ...gatesDone, [id]: !gatesDone[id] },
    })
  }

  const setLCCount = (n: number) => onChange({ ...state, leetcodeCount: Math.max(0, n) })
  const setRAGCount = (n: number) => onChange({ ...state, ragModulesCount: Math.max(0, n) })

  const tiers = ['foundation', 'tier2_ready', 'tier1_ready'] as const
  const tierLabels = {
    foundation: { label: 'Foundation', sub: 'Clear before applying anywhere' },
    tier2_ready: { label: 'Tier 2 gates', sub: 'Affirm · Robinhood · Capital One · Databricks' },
    tier1_ready: { label: 'Tier 1 gates', sub: 'Stripe · Plaid · Chime · Brex' },
  }

  return (
    <div className="space-y-6">

      {/* Readiness status card */}
      <div className={`rounded-2xl p-5 border ${report.bgColor} ${
        report.level === 'tier1_ready' ? 'border-emerald-200' :
        report.level === 'tier2_ready' ? 'border-violet-200' :
        report.level === 'foundation_building' ? 'border-amber-200' :
        'border-stone-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">Readiness status</p>
            <p className={`text-2xl font-medium ${report.color}`}>{report.label}</p>
            <p className={`text-sm mt-0.5 ${report.color}`}>{report.sublabel}</p>
          </div>
          <div className={`text-3xl font-medium ${report.color}`}>{report.score}%</div>
        </div>

        {/* Gate progress bars */}
        <div className="space-y-2 mt-4">
          <div>
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Foundation</span>
              <span className="font-mono">{report.foundationDone}/{report.foundationTotal}</span>
            </div>
            <ProgressBar value={report.foundationDone} max={report.foundationTotal} color="bg-stone-700" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Tier 2 gates</span>
              <span className="font-mono">{report.tier2Done}/{report.tier2Total}</span>
            </div>
            <ProgressBar value={report.tier2Done} max={report.tier2Total} color="bg-violet-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Tier 1 gates</span>
              <span className="font-mono">{report.tier1Done}/{report.tier1Total}</span>
            </div>
            <ProgressBar value={report.tier1Done} max={report.tier1Total} color="bg-emerald-500" />
          </div>
        </div>

        {/* EOY track */}
        <div className={`mt-4 pt-3 border-t ${
          report.level === 'tier1_ready' ? 'border-emerald-200' :
          report.level === 'tier2_ready' ? 'border-violet-200' :
          'border-stone-200'
        } flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${report.onTrackForEOY ? 'bg-emerald-500' : 'bg-red-400'}`} />
          <p className="text-xs text-stone-600">
            {report.onTrackForEOY
              ? 'On track for Tier 1 by end of 2026 if you execute the gates below'
              : 'Some gates need to move faster to hit Tier 1 by end of 2026'}
          </p>
        </div>
      </div>

      {/* Overdue alert */}
      {report.overdueGates.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-medium text-red-800 mb-2">
            {report.overdueGates.length} gate{report.overdueGates.length > 1 ? 's' : ''} past deadline
          </p>
          {report.overdueGates.map(g => (
            <p key={g.id} className="text-xs text-red-600">
              — {g.label} (was due {new Date(g.hardDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
            </p>
          ))}
          <p className="text-xs text-red-500 mt-2 italic">These block your timeline. Clear them first.</p>
        </div>
      )}

      {/* Key counters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-stone-100 rounded-xl p-4">
          <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">LeetCode done</p>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setLCCount((state.leetcodeCount ?? 0) - 1)} className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 flex items-center justify-center text-lg leading-none">−</button>
            <span className="text-2xl font-medium text-stone-900 flex-1 text-center">{state.leetcodeCount ?? 0}</span>
            <button onClick={() => setLCCount((state.leetcodeCount ?? 0) + 1)} className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 flex items-center justify-center text-lg leading-none">+</button>
          </div>
          <p className={`text-xs leading-relaxed ${lcStatus.onTrack ? 'text-emerald-600' : 'text-amber-600'}`}>
            {lcStatus.message}
          </p>
        </div>
        <div className="border border-stone-100 rounded-xl p-4">
          <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">RAG modules done</p>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setRAGCount((state.ragModulesCount ?? 0) - 1)} className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 flex items-center justify-center text-lg leading-none">−</button>
            <span className="text-2xl font-medium text-stone-900 flex-1 text-center">{state.ragModulesCount ?? 0}</span>
            <button onClick={() => setRAGCount((state.ragModulesCount ?? 0) + 1)} className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 flex items-center justify-center text-lg leading-none">+</button>
          </div>
          <p className="text-xs text-stone-400">of ~12 total DL.AI modules</p>
          <ProgressBar value={state.ragModulesCount ?? 0} max={12} color="bg-amber-500" className="mt-2" />
        </div>
      </div>

      {/* Next 3 actions */}
      {report.nextActions.length > 0 && (
        <div>
          <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">Focus now — next gates</p>
          <div className="space-y-2">
            {report.nextActions.map(g => (
              <GateCard key={g.id} gate={g} done={!!gatesDone[g.id]} onToggle={() => toggleGate(g.id)} />
            ))}
          </div>
        </div>
      )}

      {/* All gates by tier */}
      {tiers.map(tier => {
        const tierGates = GATES.filter(g => g.tier === tier)
        const doneCt = tierGates.filter(g => gatesDone[g.id]).length
        const tc = TIER_COLORS[tier]
        const tl = tierLabels[tier]
        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${tc.dot}`} />
              <div className="flex-1">
                <span className={`text-xs font-medium uppercase tracking-wider ${tc.label}`}>{tl.label}</span>
                <span className="text-xs text-stone-400 ml-2">{tl.sub}</span>
              </div>
              <span className="text-xs font-mono text-stone-400">{doneCt}/{tierGates.length}</span>
            </div>
            <div className="space-y-2">
              {tierGates.map(g => (
                <GateCard key={g.id} gate={g} done={!!gatesDone[g.id]} onToggle={() => toggleGate(g.id)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
