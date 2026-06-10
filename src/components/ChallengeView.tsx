'use client'

import { useState } from 'react'
import type { AppState, ChallengeState } from '@/types'
import { ProgressBar } from './ProgressBar'

// ── Helpers ────────────────────────────────────────────────────────────────
function todayISO() { return new Date().toISOString().slice(0, 10) }

function mondayOfWeek() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().slice(0, 10)
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string) {
  return Math.floor(
    (new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86400000
  )
}

function fmtShort(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Data ───────────────────────────────────────────────────────────────────
const NON_NEG = ['no-explicit', 'no-search-girls'] as const

const DAILY_ITEMS = [
  { id: 'no-explicit',     label: 'No explicit content',            sub: 'Non-negotiable' },
  { id: 'no-search-girls', label: 'No searching for / clicking girls', sub: 'Non-negotiable' },
  { id: 'career-work',     label: 'Career work',                   sub: '1 LC problem or 30 min journal app' },
  { id: 'apply-jobs',      label: 'Apply to 3 jobs',               sub: '' },
  { id: 'workout',         label: 'Workout',                        sub: '' },
  { id: 'eat-clean',       label: 'Eat clean & water',             sub: 'Home-cooked · hit protein · 3L min (4L on training days)' },
] as const

type ItemId = typeof DAILY_ITEMS[number]['id']

const WORKOUT_TYPES = [
  { id: 'w-gym',  label: 'Gym / Lift' },
  { id: 'w-mma',  label: 'MMA' },
  { id: 'w-run',  label: 'Run' },
  { id: 'w-rest', label: 'Rest / Stretch' },
] as const

const WORKOUT_GOALS = [
  { key: 'w-gym', label: 'Gym / Lift', target: 3 },
  { key: 'w-mma', label: 'MMA',        target: 3 },
  { key: 'w-run', label: 'Run',        target: 2 },
] as const

// ── Win logic ──────────────────────────────────────────────────────────────
type DayEntry = Record<string, boolean | number>

function scoreEntry(entry: DayEntry | undefined): { checked: number; nonNegsMet: boolean; win: boolean } {
  if (!entry) return { checked: 0, nonNegsMet: false, win: false }
  const nonNegsMet = !!entry['no-explicit'] && !!entry['no-search-girls']
  const checked = DAILY_ITEMS.filter(i => !!entry[i.id]).length
  return { checked, nonNegsMet, win: nonNegsMet && checked >= 4 }
}

// ── Stats ──────────────────────────────────────────────────────────────────
function computeStats(daily: Record<string, DayEntry>, today: string, start: string) {
  const days: string[] = []
  const cur = new Date(start + 'T12:00:00')
  const end = new Date(today + 'T12:00:00')
  while (cur < end) {
    days.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  const won  = days.filter(d => scoreEntry(daily[d]).win).length
  const lost = days.length - won
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (scoreEntry(daily[days[i]]).win) streak++
    else break
  }
  const wk     = mondayOfWeek()
  const wkDays = days.filter(d => d >= wk)
  const weekRate = wkDays.length > 0
    ? Math.round((wkDays.filter(d => scoreEntry(daily[d]).win).length / wkDays.length) * 100)
    : null
  return { won, lost, streak, weekRate, total: days.length }
}

// ── Checkbox component ─────────────────────────────────────────────────────
function CheckRow({
  label, sub, checked, onToggle, isNonNeg = false,
}: {
  label: string; sub?: string; checked: boolean; onToggle: () => void; isNonNeg?: boolean
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
        checked
          ? 'bg-stone-50 border-stone-100 opacity-55'
          : isNonNeg
          ? 'bg-white border-red-100 hover:border-red-200 hover:bg-red-50/30'
          : 'bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50/50'
      }`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
        checked ? 'bg-stone-800 border-stone-800' : isNonNeg ? 'border-red-300' : 'border-stone-300'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className={`text-sm ${checked ? 'line-through text-stone-400' : 'text-stone-800'}`}>{label}</p>
          {isNonNeg && (
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
              Must
            </span>
          )}
        </div>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

// ── Main view ──────────────────────────────────────────────────────────────
interface Props { state: AppState; onChange: (s: AppState) => void }

export function ChallengeView({ state, onChange }: Props) {
  const [showRules, setShowRules] = useState(false)

  const ch: ChallengeState = state.challenge ?? {
    startDate: null, daily: {}, weekly: {}, lastHaircutDate: null,
  }
  const save = (next: ChallengeState) => onChange({ ...state, challenge: next })

  const today = todayISO()
  const wk    = mondayOfWeek()

  // ── Not started ────────────────────────────────────────────────────────
  if (!ch.startDate) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">60-Day Challenge</p>
        <p className="text-xl font-medium text-stone-900">Start today. Track every day.</p>
        <p className="text-sm text-stone-400 max-w-xs mx-auto leading-relaxed">
          6 daily habits. Win if you hit 4+ and keep the two non-negotiables.
        </p>
        <button
          onClick={() => save({ ...ch, startDate: today })}
          className="bg-stone-900 text-white text-sm px-6 py-2.5 rounded-xl font-medium hover:bg-stone-700 transition-colors"
        >
          Start — Day 1 today
        </button>
      </div>
    )
  }

  const start    = ch.startDate
  const end      = addDays(start, 59)
  const dayNum   = Math.max(1, Math.min(60, daysBetween(start, today) + 1))
  const daysLeft = Math.max(0, daysBetween(today, end))
  const done     = today > end

  // Entries
  const todayE: DayEntry = (ch.daily[today]  ?? {}) as DayEntry
  const weekE:  DayEntry = (ch.weekly[wk]    ?? {}) as DayEntry

  const setDailyBool  = (id: string, v: boolean) =>
    save({ ...ch, daily:  { ...ch.daily,  [today]: { ...todayE, [id]: v } } })
  const setWeeklyNum  = (id: string, v: number)  =>
    save({ ...ch, weekly: { ...ch.weekly, [wk]:    { ...weekE,  [id]: Math.max(0, v) } } })
  const setWeeklyBool = (id: string, v: boolean) =>
    save({ ...ch, weekly: { ...ch.weekly, [wk]:    { ...weekE,  [id]: v } } })

  // Score
  const { checked: score, nonNegsMet, win } = scoreEntry(todayE)

  // Weekly aggregations — only count days up to today
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(wk, i)).filter(d => d <= today)
  const weekEntries = weekDays.map(d => (ch.daily[d] ?? {}) as DayEntry)

  const wkWorkout = {
    'w-gym':  weekEntries.filter(e => e['w-gym']).length,
    'w-mma':  weekEntries.filter(e => e['w-mma']).length,
    'w-run':  weekEntries.filter(e => e['w-run']).length,
    'w-rest': weekEntries.filter(e => e['w-rest']).length,
  }
  const wkJobApps    = weekEntries.filter(e => e['apply-jobs']).length * 3
  const wkEatOut     = weekEntries.filter(e => e['ate-out']).length
  const wkLC         = Number(weekE['lc-count'] ?? 0)
  const wkSocial     = !!weekE['social']

  const stats = computeStats(ch.daily as Record<string, DayEntry>, today, start)

  // Milestones
  const milestones = [
    { date: start,         label: 'Day 1 — Challenge starts',       },
    { date: '2026-07-11',  label: "Mom's 60th — Beach House",       },
    { date: end,           label: 'Day 60 — Challenge complete',     },
  ]

  if (done) {
    return (
      <div className="border border-stone-100 rounded-2xl p-6 text-center space-y-2">
        <p className="text-xl font-medium text-stone-900">60 days done.</p>
        <p className="text-stone-500 text-sm">{stats.won} wins · {stats.lost} losses</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Day counter ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-stone-400 font-mono uppercase tracking-wider mb-0.5">60-Day Challenge</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-stone-900">Day {dayNum}</span>
              <span className="text-stone-400">/&thinsp;60</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-stone-500 font-mono">{daysLeft} left</p>
            <p className="text-xs text-stone-400">{fmtShort(start)} → {fmtShort(end)}</p>
          </div>
        </div>
        <ProgressBar value={dayNum} max={60} />
      </div>

      {/* ════════════════════════════════════ DAILY ══ */}
      <div className="space-y-3">
        {/* Score header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Today</p>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold leading-none ${
              win ? 'text-emerald-600' : !nonNegsMet && score > 1 ? 'text-red-500' : 'text-stone-900'
            }`}>{score}</span>
            <span className="text-stone-300 text-sm">/&thinsp;6</span>
            {score > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                win
                  ? 'bg-emerald-100 text-emerald-700'
                  : !nonNegsMet
                  ? 'bg-red-100 text-red-600'
                  : 'bg-stone-100 text-stone-500'
              }`}>
                {win ? '✓ Win' : !nonNegsMet ? 'Rules broken' : `${4 - score} to win`}
              </span>
            )}
          </div>
        </div>

        {/* Mini score bar */}
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              win ? 'bg-emerald-500' : !nonNegsMet && score > 1 ? 'bg-red-400' : 'bg-stone-400'
            }`}
            style={{ width: `${(score / 6) * 100}%` }}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          {DAILY_ITEMS.map(item => {
            const isNN     = (NON_NEG as readonly string[]).includes(item.id)
            const checked  = !!todayE[item.id]
            const isWorkout = item.id === 'workout'

            return (
              <div key={item.id}>
                <CheckRow
                  label={item.label}
                  sub={item.sub || undefined}
                  checked={checked}
                  onToggle={() => setDailyBool(item.id, !checked)}
                  isNonNeg={isNN}
                />

                {/* Workout type pills — visible when workout is checked */}
                {isWorkout && checked && (
                  <div className="mt-1.5 ml-7 flex flex-wrap gap-1.5">
                    {WORKOUT_TYPES.map(wt => {
                      const active = !!todayE[wt.id]
                      return (
                        <button
                          key={wt.id}
                          onClick={() => setDailyBool(wt.id, !active)}
                          className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                            active
                              ? 'bg-stone-800 text-white border-stone-800'
                              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {wt.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Ate out toggle */}
        <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
          wkEatOut >= 2 && !todayE['ate-out'] ? 'border-amber-200 bg-amber-50/50' : 'border-stone-100 bg-white'
        }`}>
          <div>
            <p className="text-sm text-stone-800">Ate out today</p>
            <p className={`text-xs mt-0.5 ${wkEatOut >= 2 ? 'text-amber-600' : 'text-stone-400'}`}>
              {wkEatOut} / 2 days this week
              {wkEatOut >= 2 && !todayE['ate-out'] ? ' — at limit' : ''}
            </p>
          </div>
          <button
            onClick={() => setDailyBool('ate-out', !todayE['ate-out'])}
            className={`relative w-10 h-5.5 h-[22px] rounded-full transition-colors ${
              todayE['ate-out']
                ? wkEatOut > 2 ? 'bg-red-400' : 'bg-amber-400'
                : 'bg-stone-200'
            }`}
          >
            <div className={`absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all ${
              todayE['ate-out'] ? 'left-[20px]' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════ WEEKLY ══ */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">This Week</p>

        {/* LC problems counter */}
        <div className="bg-white border border-stone-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-stone-800">LeetCode problems</p>
              <p className="text-xs text-stone-400">3 minimum this week</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeeklyNum('lc-count', wkLC - 1)}
                className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 flex items-center justify-center text-base hover:bg-stone-50 transition-colors"
              >−</button>
              <span className={`text-2xl font-bold w-8 text-center ${wkLC >= 3 ? 'text-emerald-600' : 'text-stone-900'}`}>
                {wkLC}
              </span>
              <button
                onClick={() => setWeeklyNum('lc-count', wkLC + 1)}
                className="w-7 h-7 rounded-lg border border-stone-200 text-stone-500 flex items-center justify-center text-base hover:bg-stone-50 transition-colors"
              >+</button>
            </div>
          </div>
          <ProgressBar value={wkLC} max={3} color={wkLC >= 3 ? 'bg-emerald-500' : 'bg-stone-400'} />
        </div>

        {/* Job applications (auto-counted from daily) */}
        <div className="bg-white border border-stone-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-stone-800">Job applications</p>
              <p className="text-xs text-stone-400">15 minimum · 3 per day you check off</p>
            </div>
            <span className={`text-2xl font-bold ${wkJobApps >= 15 ? 'text-emerald-600' : 'text-stone-900'}`}>
              {wkJobApps}
            </span>
          </div>
          <ProgressBar value={wkJobApps} max={15} color={wkJobApps >= 15 ? 'bg-emerald-500' : 'bg-amber-400'} />
          {wkJobApps < 15 && (
            <p className="text-xs text-stone-400 mt-1">{15 - wkJobApps} to go</p>
          )}
        </div>

        {/* Workout breakdown */}
        <div className="bg-white border border-stone-100 rounded-xl p-3">
          <p className="text-sm font-medium text-stone-800 mb-3">Workouts this week</p>
          <div className="space-y-2.5">
            {WORKOUT_GOALS.map(g => {
              const count = wkWorkout[g.key as keyof typeof wkWorkout]
              const met   = count >= g.target
              return (
                <div key={g.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600">{g.label}</span>
                    <span className={`font-mono font-medium ${met ? 'text-emerald-600' : 'text-stone-500'}`}>
                      {count} / {g.target}
                    </span>
                  </div>
                  <ProgressBar
                    value={count}
                    max={g.target}
                    color={met ? 'bg-emerald-500' : 'bg-stone-400'}
                  />
                </div>
              )
            })}
            {wkWorkout['w-rest'] > 0 && (
              <p className="text-xs text-stone-400 pt-1">
                Rest / stretch: {wkWorkout['w-rest']} day{wkWorkout['w-rest'] > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Social activity */}
        <CheckRow
          label="1 social activity this week"
          sub="Real connection outside training"
          checked={wkSocial}
          onToggle={() => setWeeklyBool('social', !wkSocial)}
        />
      </div>

      {/* ════════════════════════════════════ STATS ══ */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: stats.won,
              label: 'Won',
              sub: `${stats.lost} lost`,
              bold: stats.won > stats.lost ? 'text-emerald-600' : 'text-stone-900',
            },
            {
              value: stats.streak,
              label: 'Streak',
              sub: 'days in a row',
              bold: stats.streak >= 3 ? 'text-emerald-600' : 'text-stone-900',
            },
            {
              value: stats.weekRate != null ? `${stats.weekRate}%` : '—',
              label: 'This week',
              sub: 'win rate',
              bold: 'text-stone-900',
            },
          ].map(s => (
            <div key={s.label} className="bg-white border border-stone-100 rounded-xl p-3 text-center">
              <p className={`text-2xl font-bold ${s.bold}`}>{s.value}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">{s.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════ MILESTONES ══ */}
      <div className="border border-stone-100 rounded-xl p-4">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">Milestones</p>
        {milestones.map((m, i) => {
          const reached = today >= m.date
          return (
            <div key={m.date} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full mt-[3px] shrink-0 transition-colors ${
                  reached ? 'bg-emerald-500' : 'bg-stone-200'
                }`} />
                {i < milestones.length - 1 && (
                  <div className={`w-px flex-1 mt-1 mb-1 min-h-[18px] ${reached ? 'bg-emerald-200' : 'bg-stone-100'}`} />
                )}
              </div>
              <div className="pb-3 -mt-0.5">
                <p className={`text-sm ${reached ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                  {m.label}
                </p>
                <p className="text-xs text-stone-400 font-mono mt-0.5">{fmtShort(m.date)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ════════════════════════════════════ RULES ══ */}
      <button
        onClick={() => setShowRules(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors"
      >
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Rules reference</p>
        <span className="text-stone-400 text-xs">{showRules ? '▲' : '▼'}</span>
      </button>

      {showRules && (
        <div className="border border-stone-100 rounded-xl p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
              Hard rules — No exceptions
            </p>
            <ul className="space-y-1.5 text-sm text-stone-600">
              {[
                'No explicit content',
                "No searching for girls on any platform unless they've engaged first (follow request, Hinge like)",
                "No clicking on girls' profiles",
                'Click "Not Interested" on all sexual content on all platforms',
              ].map(r => (
                <li key={r} className="flex gap-2.5">
                  <span className="text-stone-300 shrink-0">—</span>{r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
              The one exception
            </p>
            <ul className="space-y-1.5 text-sm text-stone-600">
              {[
                'Alcohol only on weekends when Prince and Ryan are here. Everything else: substitute.',
                'Never alone',
                'Never to cope with stress, sadness, boredom, or loneliness',
              ].map(r => (
                <li key={r} className="flex gap-2.5">
                  <span className="text-stone-300 shrink-0">—</span>{r}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-stone-400 italic border-t border-stone-100 pt-3">
            The goal is not perfection. Win more days than you lose and become someone who keeps promises to himself.
          </p>
        </div>
      )}
    </div>
  )
}
