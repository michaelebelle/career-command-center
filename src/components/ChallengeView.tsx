'use client'

import { useState } from 'react'
import type { AppState, ChallengeState } from '@/types'
import { ProgressBar } from './ProgressBar'

// ── Helpers ────────────────────────────────────────────────────────────────
function todayISO() { return new Date().toISOString().slice(0, 10) }

function yesterdayISO() {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10)
}

function mondayISO(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1) + offset * 7)
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string) {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function currentDay(startDate: string) {
  return Math.max(1, daysBetween(startDate, todayISO()) + 1)
}

// ── Challenge data ─────────────────────────────────────────────────────────

type FeedTag = { label: string; cls: string }

interface Item { id: string; label: string; sub: string; feeds: FeedTag[] }

// "feeds" tags use existing app category colors
const F = {
  careerPrep: { label: 'Career Prep',  cls: 'bg-amber-50  text-amber-700'  },
  readiness:  { label: 'Readiness',    cls: 'bg-violet-50 text-violet-700' },
  fitness:    { label: 'Fitness',      cls: 'bg-emerald-50 text-emerald-700' },
  focus:      { label: 'Focus',        cls: 'bg-stone-100  text-stone-600'  },
  clarity:    { label: 'Clarity',      cls: 'bg-sky-50     text-sky-700'   },
  exitFund:   { label: 'Exit fund',    cls: 'bg-teal-50    text-teal-700'  },
}

const DAILY_T1: Item[] = [
  {
    id: 'dopamine',
    label: 'Dopamine clean',
    sub: 'No social media · no looking up women · no porn',
    feeds: [F.focus],
  },
  {
    id: 'career-work',
    label: '30+ min career work',
    sub: 'Interview prep · AI/RAG · OMSCS · journal app',
    feeds: [F.careerPrep, F.readiness],
  },
  {
    id: 'weed-rule',
    label: 'Weed rule',
    sub: 'Never alone, never owned',
    feeds: [F.clarity],
  },
]

function hingeItem(day: number): Item {
  const sub =
    day <= 15 ? 'No Hinge today (Days 1–15)'
    : day <= 30 ? 'Max 1x this week · 15 min · not after 8pm'
    : 'Max 2x this week · 15 min · not after 8pm'
  return { id: 'hinge', label: 'Hinge rule', sub, feeds: [F.focus] }
}

const DAILY_T2: Item[] = [
  {
    id: 'wakeup',
    label: 'Up by 6am',
    sub: 'Workdays · kickball/social exceptions ok',
    feeds: [F.careerPrep],
  },
  {
    id: 'skincare',
    label: 'Night skincare',
    sub: 'Azelaic + tretinoin',
    feeds: [],
  },
]

const WEEKLY_T1: Item[] = [
  {
    id: 'workouts',
    label: '4+ workouts this week',
    sub: '',
    feeds: [F.fitness, F.focus],
  },
]

const WEEKLY_T2: Item[] = [
  {
    id: 'martial-arts',
    label: '2+ martial arts sessions',
    sub: '',
    feeds: [F.fitness],
  },
  {
    id: 'alcohol',
    label: 'Alcohol: social only, ≤1x',
    sub: '',
    feeds: [F.clarity],
  },
  {
    id: 'eating-out',
    label: 'Eating out: ≤2x',
    sub: '',
    feeds: [F.exitFund],
  },
]

const REWARDS = [
  { days: 7,  label: 'GT gear 🐝' },
  { days: 14, label: 'Athletic PT 💪' },
  { days: 30, label: 'Boxing lesson 🥊' },
  { days: 60, label: 'Watch ⌚' },
  { days: 90, label: 'Training vacation ✈️' },
]

// ── Shared check row ───────────────────────────────────────────────────────
function CheckRow({
  item,
  checked,
  onToggle,
  warning,
}: {
  item: Item
  checked: boolean
  onToggle: () => void
  warning?: string
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
        checked
          ? 'bg-stone-50 border-stone-100 opacity-50'
          : warning
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50'
      }`}
    >
      {/* Checkbox */}
      <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
        checked ? 'bg-stone-800 border-stone-800' : warning ? 'border-red-400' : 'border-stone-300'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Label + feeds */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium ${checked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
            {item.label}
          </p>
          {item.feeds.length > 0 && (
            <div className="flex gap-1 flex-wrap shrink-0">
              {item.feeds.map(f => (
                <span key={f.label} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${f.cls}`}>
                  {f.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.sub && (
          <p className="text-xs text-stone-400 mt-0.5">{item.sub}</p>
        )}
        {warning && (
          <p className="text-xs text-red-500 font-medium mt-0.5">⚠ {warning}</p>
        )}
      </div>
    </button>
  )
}

// ── Section label ──────────────────────────────────────────────────────────
function SectionLabel({ dot, text }: { dot: string; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div className={`w-2 h-2 rounded-full ${dot}`} />
      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{text}</p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props { state: AppState; onChange: (s: AppState) => void }

export function ChallengeView({ state, onChange }: Props) {
  const [showBreak, setShowBreak] = useState(false)

  // Normalise — existing state may predate challenge field
  const ch: ChallengeState = state.challenge ?? { startDate: null, daily: {}, weekly: {}, lastHaircutDate: null }

  const saveChallenge = (next: ChallengeState) => onChange({ ...state, challenge: next })

  const today     = todayISO()
  const yesterday = yesterdayISO()
  const wk        = mondayISO(0)
  const lastWk    = mondayISO(-1)

  const day         = ch.startDate ? currentDay(ch.startDate) : 0
  const todayChecks = ch.daily[today]   ?? {}
  const yChecks     = ch.daily[yesterday] ?? {}
  const weekChecks  = ch.weekly[wk]     ?? {}
  const lastWkChecks = ch.weekly[lastWk] ?? {}

  const setDaily  = (id: string, v: boolean) =>
    saveChallenge({ ...ch, daily:  { ...ch.daily,  [today]: { ...todayChecks, [id]: v } } })
  const setWeekly = (id: string, v: boolean) =>
    saveChallenge({ ...ch, weekly: { ...ch.weekly, [wk]:   { ...weekChecks,  [id]: v } } })

  const missedYesterday = (id: string) =>
    !!ch.startDate && yesterday >= ch.startDate && yChecks[id] === false

  const missedLastWeek = (id: string) =>
    !!ch.startDate && lastWkChecks[id] === false

  const daysSinceHaircut = ch.lastHaircutDate ? daysBetween(ch.lastHaircutDate, today) : null
  const nextReward = REWARDS.find(r => r.days > day)

  // ── Not started ────────────────────────────────────────────────────────
  if (!ch.startDate) {
    return (
      <div className="py-8 text-center space-y-4">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Get Money Challenge</p>
        <p className="text-lg font-medium text-stone-900">30–90 days. No excuses.</p>
        <p className="text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
          Daily discipline that feeds your career exit. Each habit is linked to the goal it builds.
        </p>
        <button
          onClick={() => saveChallenge({ ...ch, startDate: today })}
          className="bg-stone-900 text-white text-sm px-6 py-2.5 rounded-xl font-medium hover:bg-stone-700 transition-colors"
        >
          Start — Day 1
        </button>
      </div>
    )
  }

  const dailyT1 = [hingeItem(day), ...DAILY_T1]
  const allDailyDone = [...dailyT1, ...DAILY_T2].filter(i => todayChecks[i.id]).length
  const allDailyTotal = dailyT1.length + DAILY_T2.length

  return (
    <div className="space-y-5">

      {/* ── Compact header ── */}
      <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-mono uppercase tracking-wider mb-0.5">Get Money</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-stone-900">Day {day}</span>
              <span className="text-sm text-stone-400">/ 90</span>
            </div>
          </div>
          <div className="text-right">
            {nextReward ? (
              <>
                <p className="text-xs text-stone-400">Next reward</p>
                <p className="text-sm font-medium text-stone-700">{nextReward.label}</p>
                <p className="text-xs font-mono text-stone-400">{nextReward.days - day}d</p>
              </>
            ) : (
              <p className="text-sm font-medium text-emerald-600">All rewards earned 🎉</p>
            )}
          </div>
        </div>
        <ProgressBar value={day} max={90} color="bg-stone-800" />

        {/* Reward strip */}
        <div className="flex gap-1.5 flex-wrap">
          {REWARDS.map(r => (
            <span
              key={r.days}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-all ${
                day >= r.days
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Daily progress pill ── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider">Today</p>
        <span className="text-xs font-medium text-stone-500 font-mono">
          {allDailyDone}/{allDailyTotal} checked
        </span>
      </div>

      {/* ── Tier 1 daily ── */}
      <div>
        <SectionLabel dot="bg-red-400" text="Tier 1 — Cannot break" />
        <div className="space-y-2">
          {dailyT1.map(item => (
            <CheckRow
              key={item.id}
              item={item}
              checked={!!todayChecks[item.id]}
              onToggle={() => setDaily(item.id, !todayChecks[item.id])}
            />
          ))}
        </div>
      </div>

      {/* ── Tier 2 daily ── */}
      <div>
        <SectionLabel dot="bg-amber-400" text="Tier 2 — Can miss, not twice in a row" />
        <div className="space-y-2">
          {DAILY_T2.map(item => (
            <CheckRow
              key={item.id}
              item={item}
              checked={!!todayChecks[item.id]}
              onToggle={() => setDaily(item.id, !todayChecks[item.id])}
              warning={missedYesterday(item.id) ? 'Missed yesterday — cannot skip today' : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Weekly ── */}
      <div>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2.5">This week — due Sunday</p>
        <SectionLabel dot="bg-red-400" text="Tier 1" />
        <div className="space-y-2 mb-4">
          {WEEKLY_T1.map(item => (
            <CheckRow
              key={item.id}
              item={item}
              checked={!!weekChecks[item.id]}
              onToggle={() => setWeekly(item.id, !weekChecks[item.id])}
            />
          ))}
        </div>
        <SectionLabel dot="bg-amber-400" text="Tier 2" />
        <div className="space-y-2">
          {WEEKLY_T2.map(item => (
            <CheckRow
              key={item.id}
              item={item}
              checked={!!weekChecks[item.id]}
              onToggle={() => setWeekly(item.id, !weekChecks[item.id])}
              warning={missedLastWeek(item.id) ? 'Missed last week — cannot skip this week' : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Haircut tracker ── */}
      <div className="border border-stone-100 rounded-xl p-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-stone-700">Haircut tracker <span className="font-normal text-stone-400">· Tier 2, every 2 weeks</span></p>
          {ch.lastHaircutDate ? (
            <p className={`text-xs mt-0.5 font-mono ${
              daysSinceHaircut! >= 21 ? 'text-red-500'
              : daysSinceHaircut! >= 14 ? 'text-amber-500'
              : 'text-stone-400'
            }`}>
              {daysSinceHaircut}d ago
              {daysSinceHaircut! >= 21 && ' — overdue'}
              {daysSinceHaircut! >= 14 && daysSinceHaircut! < 21 && ' — book it'}
            </p>
          ) : (
            <p className="text-xs text-stone-400 mt-0.5">Not logged yet</p>
          )}
        </div>
        <button
          onClick={() => saveChallenge({ ...ch, lastHaircutDate: today })}
          className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50 transition-colors shrink-0"
        >
          Log today
        </button>
      </div>

      {/* ── Protect energy reminders ── */}
      <div className="border-l-2 border-stone-200 pl-4 py-1 space-y-1">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Protect energy</p>
        <p className="text-xs text-stone-400">No hero mode at Wells · Stop comparing · Move when stressed</p>
      </div>

      {/* ── Rule break ── */}
      <div className="text-center space-y-3">
        <button
          onClick={() => setShowBreak(!showBreak)}
          className="text-xs text-stone-300 hover:text-red-500 transition-colors underline underline-offset-2"
        >
          Log a rule break
        </button>
        {showBreak && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left space-y-3">
            <p className="text-sm font-medium text-red-800">🚨 Consequences</p>
            {day <= 15 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-red-700">Relapse (Days 1–15):</p>
                <p className="text-xs text-red-600 pl-2">— Delete Hinge for 30 days</p>
                <p className="text-xs text-red-600 pl-2">— 6-mile run or 100 burpees</p>
                <a
                  href={`mailto:ebellem007@gmail.com?subject=GMC — I owe Keerat $20&body=Broke the rules on Day ${day}. I owe Keerat $20.`}
                  className="mt-2 flex items-center justify-center gap-1 bg-red-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Send accountability email →
                </a>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-red-700">Hinge rule break:</p>
              <p className="text-xs text-red-600 pl-2">— 7-day Hinge ban</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
