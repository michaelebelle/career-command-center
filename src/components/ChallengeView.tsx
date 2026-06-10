'use client'

import { useState } from 'react'
import type { AppState, ChallengeState } from '@/types'

// ── Constants ──────────────────────────────────────────────────────────────
export const CHALLENGE_START = '2026-06-23'
export const CHALLENGE_END   = '2026-08-22'
const TOTAL_DAYS = 60

// ── Helpers ────────────────────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function mondayOfWeek() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
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

function fmtFull(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function countChecked(entry: Record<string, boolean> | undefined) {
  if (!entry) return 0
  return Object.values(entry).filter(Boolean).length
}

function isWin(entry: Record<string, boolean> | undefined) {
  return countChecked(entry) >= 5
}

function computeStats(daily: Record<string, Record<string, boolean>>, today: string) {
  if (today < CHALLENGE_START) return { won: 0, lost: 0, streak: 0, weekRate: null, total: 0 }

  // Collect all completed days (start → yesterday)
  const days: string[] = []
  const cursor = new Date(CHALLENGE_START + 'T12:00:00')
  const end    = new Date(today  + 'T12:00:00')
  while (cursor < end) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  const won  = days.filter(d => isWin(daily[d])).length
  const lost = days.length - won

  // Current streak — consecutive wins going backwards from yesterday
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (isWin(daily[days[i]])) streak++
    else break
  }

  // This-week win rate (Mon → yesterday)
  const wk = mondayOfWeek()
  const wkDays = days.filter(d => d >= wk)
  const weekRate = wkDays.length > 0
    ? Math.round((wkDays.filter(d => isWin(daily[d])).length / wkDays.length) * 100)
    : null

  return { won, lost, streak, weekRate, total: days.length }
}

// ── Data ───────────────────────────────────────────────────────────────────
const DAILY_ITEMS = [
  {
    id: 'work',
    label: 'LeetCode or Journal App',
    sub: 'LeetCode priority Mon–Thu',
  },
  {
    id: 'train',
    label: 'Train or move',
    sub: 'Lift · MMA · BJJ · run · jump rope · walk',
  },
  {
    id: 'eat-clean',
    label: 'Eat clean',
    sub: 'Home-cooked · hit protein · no Starbucks meals',
  },
  {
    id: 'water',
    label: 'Water — 3L min',
    sub: '4L on training days',
  },
  {
    id: 'no-social-am',
    label: 'No social first 30 min',
    sub: 'Phone stays down after waking',
  },
  {
    id: 'hard-rules',
    label: 'Hard rules kept',
    sub: 'No porn · no searching girls · Not Interested on all sexual content',
  },
]

const WEEKLY_ITEMS = [
  { id: 'lc-sessions', label: '2 LeetCode sessions' },
  { id: 'social',      label: '1 social activity — real connection outside training' },
]

const MILESTONES = [
  { date: '2026-06-23', label: 'Challenge starts',         sub: 'Day 1' },
  { date: '2026-07-11', label: "Mom's 60th — Beach House", sub: 'Day 19 · 4-week check-in' },
  { date: '2026-08-22', label: 'Challenge complete',       sub: 'Day 60' },
]

// ── Sub-components ─────────────────────────────────────────────────────────
function DarkCheck({
  label, sub, checked, onToggle,
}: {
  label: string; sub?: string; checked: boolean; onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
        checked ? 'opacity-40' : 'hover:bg-zinc-800'
      }`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
        checked ? 'bg-white border-white' : 'border-zinc-600'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${checked ? 'line-through text-zinc-500' : 'text-white'}`}>{label}</p>
        {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

function RulesCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4 space-y-4">
      <div>
        <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest mb-2.5">
          Hard rules — No exceptions
        </p>
        <ul className="space-y-2">
          {[
            'No porn',
            "No searching for girls on any platform unless they've engaged first (follow request, Hinge like)",
            "No clicking on girls' profiles",
            'Click "Not Interested" on all sexual content on all platforms',
          ].map(rule => (
            <li key={rule} className="flex gap-2.5 text-sm text-zinc-300">
              <span className="text-zinc-700 shrink-0 mt-0.5">—</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-zinc-800 pt-4">
        <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-2.5">
          The one exception
        </p>
        <ul className="space-y-2">
          {[
            'Alcohol only on weekends when Prince and Ryan are here. Everything else: substitute.',
            'Never alone',
            'Never to cope with stress, sadness, boredom, or loneliness',
          ].map(rule => (
            <li key={rule} className="flex gap-2.5 text-sm text-zinc-300">
              <span className="text-zinc-700 shrink-0 mt-0.5">—</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props { state: AppState; onChange: (s: AppState) => void }

export function ChallengeView({ state, onChange }: Props) {
  const [showRules, setShowRules] = useState(false)

  const ch: ChallengeState = state.challenge ?? {
    startDate: null, daily: {}, weekly: {}, lastHaircutDate: null,
  }

  const save = (next: ChallengeState) => onChange({ ...state, challenge: next })

  const today = todayISO()
  const wk    = mondayOfWeek()

  const before   = today < CHALLENGE_START
  const after    = today > CHALLENGE_END
  const dayNum   = before ? 0 : Math.min(TOTAL_DAYS, daysBetween(CHALLENGE_START, today) + 1)
  const daysLeft = after  ? 0 : Math.max(0, daysBetween(today, CHALLENGE_END))

  const todayEntry = ch.daily[today] ?? {}
  const weekEntry  = ch.weekly[wk]   ?? {}
  const score      = countChecked(todayEntry)
  const win        = score >= 5
  const stats      = computeStats(ch.daily, today)

  const setDaily  = (id: string, v: boolean) =>
    save({ ...ch, daily:  { ...ch.daily,  [today]: { ...todayEntry, [id]: v } } })
  const setWeekly = (id: string, v: boolean) =>
    save({ ...ch, weekly: { ...ch.weekly, [wk]:    { ...weekEntry,  [id]: v } } })

  // ── Pre-challenge ──────────────────────────────────────────────────────
  if (before) {
    const countdown = daysBetween(today, CHALLENGE_START)
    return (
      <div className="space-y-4">
        <div className="bg-zinc-900 rounded-2xl p-6 text-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Get Money Challenge
          </p>
          <p className="text-5xl font-bold text-white mb-1">{countdown}</p>
          <p className="text-zinc-400 text-sm mb-4">days until Day 1</p>
          <p className="text-zinc-600 text-xs font-mono">
            {fmtShort(CHALLENGE_START)} → {fmtShort(CHALLENGE_END)}
          </p>
        </div>
        <RulesCard />
      </div>
    )
  }

  // ── Post-challenge ─────────────────────────────────────────────────────
  if (after) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-6 text-center space-y-2">
        <p className="text-2xl font-bold text-white">60 days. Done.</p>
        <p className="text-zinc-400 text-sm">
          {stats.won} wins · {stats.lost} losses
        </p>
        <p className="text-zinc-600 text-xs">
          {fmtFull(CHALLENGE_START)} → {fmtFull(CHALLENGE_END)}
        </p>
      </div>
    )
  }

  // ── Active challenge ───────────────────────────────────────────────────
  const pct = Math.round((dayNum / TOTAL_DAYS) * 100)

  return (
    <div className="space-y-4">

      {/* ── Header card ── */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
              Get Money Challenge
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-white">{dayNum}</span>
              <span className="text-zinc-500 text-base">/ {TOTAL_DAYS}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-zinc-500">{daysLeft}</p>
            <p className="text-xs text-zinc-600">days left</p>
            <p className="text-[10px] font-mono text-zinc-700 mt-1">
              ends {fmtShort(CHALLENGE_END)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Milestone ticks */}
        <div className="relative mt-1.5 h-2">
          {MILESTONES.slice(1, -1).map(m => {
            const mDay = daysBetween(CHALLENGE_START, m.date) + 1
            const left = (mDay / TOTAL_DAYS) * 100
            return (
              <div
                key={m.date}
                className="absolute top-0 w-px h-2 bg-zinc-700"
                style={{ left: `${left}%` }}
              />
            )
          })}
        </div>
      </div>

      {/* ── Today's check-in ── */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Today</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{score} / 6</span>
            {score > 0 && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                win
                  ? 'bg-emerald-500 text-white'
                  : score >= 4
                  ? 'bg-zinc-700 text-zinc-300'
                  : 'bg-zinc-800 text-zinc-500'
              }`}>
                {win ? 'Win' : 'Keep going'}
              </span>
            )}
          </div>
        </div>

        {/* Score bar */}
        <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${win ? 'bg-emerald-500' : 'bg-zinc-500'}`}
            style={{ width: `${(score / 6) * 100}%` }}
          />
        </div>

        <div className="space-y-0.5">
          {DAILY_ITEMS.map(item => (
            <DarkCheck
              key={item.id}
              label={item.label}
              sub={item.sub}
              checked={!!todayEntry[item.id]}
              onToggle={() => setDaily(item.id, !todayEntry[item.id])}
            />
          ))}
        </div>
      </div>

      {/* ── Weekly minimums ── */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
          This week — resets Monday
        </p>
        <div className="space-y-0.5">
          {WEEKLY_ITEMS.map(item => (
            <DarkCheck
              key={item.id}
              label={item.label}
              checked={!!weekEntry[item.id]}
              onToggle={() => setWeekly(item.id, !weekEntry[item.id])}
            />
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.won}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Won</p>
            <p className="text-xs text-zinc-700">{stats.lost} lost</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${stats.streak > 0 ? 'text-emerald-400' : 'text-white'}`}>
              {stats.streak}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Streak</p>
            <p className="text-xs text-zinc-700">days</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {stats.weekRate != null ? `${stats.weekRate}%` : '—'}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">This week</p>
            <p className="text-xs text-zinc-700">win rate</p>
          </div>
        </div>
      )}

      {/* ── Milestones ── */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
          Milestones
        </p>
        <div className="space-y-0">
          {MILESTONES.map((m, i) => {
            const reached = today >= m.date
            const isCurrent = i < MILESTONES.length - 1 &&
              today >= m.date &&
              today < MILESTONES[i + 1].date
            return (
              <div key={m.date} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ring-2 transition-all ${
                    reached
                      ? 'bg-emerald-500 ring-emerald-500/30'
                      : isCurrent
                      ? 'bg-white ring-white/20'
                      : 'bg-zinc-700 ring-zinc-700/30'
                  }`} />
                  {i < MILESTONES.length - 1 && (
                    <div className={`w-px flex-1 mt-1 mb-1 min-h-[20px] ${
                      reached ? 'bg-emerald-800' : 'bg-zinc-800'
                    }`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-sm font-medium leading-tight ${
                    reached ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-zinc-700 font-mono mt-0.5">
                    {fmtShort(m.date)} · {m.sub}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Rules toggle ── */}
      <button
        onClick={() => setShowRules(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl transition-colors hover:bg-zinc-800"
      >
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Rules reference
        </p>
        <span className="text-zinc-600 text-xs">{showRules ? '▲' : '▼'}</span>
      </button>

      {showRules && <RulesCard />}

      {/* ── Guiding principle ── */}
      <p className="text-center text-xs text-zinc-400 leading-relaxed pb-2">
        The goal is not perfection.<br />
        Win more days than you lose and become someone who keeps promises to himself.
      </p>
    </div>
  )
}
