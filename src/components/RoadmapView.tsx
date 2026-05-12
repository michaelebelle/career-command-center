'use client'

import type { AppState } from '@/types'
import type { RoadmapProgress } from '@/types'
import { MILESTONES, ROADMAP_LABELS, DEFAULT_ROADMAP } from '@/lib/data'
import { ProgressBar } from './ProgressBar'

interface RoadmapViewProps {
  state: AppState
  onChange: (s: AppState) => void
}

const PROGRESS_COLORS: Record<keyof RoadmapProgress, string> = {
  leetcode: 'bg-amber-500',
  systemDesign: 'bg-violet-500',
  journalApp: 'bg-rose-500',
  aiLearning: 'bg-sky-500',
  omscs: 'bg-violet-600',
  networking: 'bg-teal-500',
  exitFund: 'bg-emerald-500',
}

function jobReadinessScore(r: RoadmapProgress): number {
  const weights: Record<keyof RoadmapProgress, number> = {
    leetcode: 0.20,
    systemDesign: 0.15,
    journalApp: 0.20,
    aiLearning: 0.15,
    omscs: 0.10,
    networking: 0.12,
    exitFund: 0.08,
  }
  return Math.round(
    (Object.keys(weights) as Array<keyof RoadmapProgress>).reduce(
      (sum, k) => sum + r[k] * weights[k],
      0
    )
  )
}

function readinessLabel(score: number): { label: string; color: string } {
  if (score < 20) return { label: 'Building foundation', color: 'text-stone-500' }
  if (score < 40) return { label: 'Gaining momentum', color: 'text-amber-600' }
  if (score < 60) return { label: 'Getting competitive', color: 'text-sky-600' }
  if (score < 80) return { label: 'Tier 2 ready', color: 'text-violet-600' }
  return { label: 'Tier 1 ready', color: 'text-emerald-600' }
}

export function RoadmapView({ state, onChange }: RoadmapViewProps) {
  const roadmap = state.roadmap ?? DEFAULT_ROADMAP
  const score = jobReadinessScore(roadmap)
  const { label, color } = readinessLabel(score)

  const setProgress = (key: keyof RoadmapProgress, value: number) => {
    onChange({
      ...state,
      roadmap: { ...roadmap, [key]: value },
    })
  }

  return (
    <div className="space-y-8">

      {/* Goal statement */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">Mission</p>
        <p className="text-base leading-relaxed">
          Leave Wells Fargo for a significantly better opportunity in{' '}
          <span className="text-amber-400 font-medium">Applied AI / ML Engineering / AI-Backend</span>{' '}
          at a fintech, AI infrastructure, or high-growth tech company.
        </p>
        <p className="text-xs text-stone-500 mt-3 font-mono">Target: Q1–Q2 2027 · $180–250k TC</p>
      </div>

      {/* Job readiness score */}
      <div className="border border-stone-100 rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
              Job readiness score
            </p>
            <p className={`text-3xl font-medium ${color}`}>{score}</p>
            <p className={`text-sm mt-0.5 ${color}`}>{label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Tier 2 ready</p>
            <p className="text-xs font-mono text-stone-500">≥ 60</p>
            <p className="text-xs text-stone-400 mt-1">Tier 1 ready</p>
            <p className="text-xs font-mono text-stone-500">≥ 80</p>
          </div>
        </div>
        <ProgressBar value={score} color={score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-violet-500' : score >= 40 ? 'bg-sky-500' : 'bg-amber-500'} />
      </div>

      {/* Progress sliders */}
      <div>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
          Progress — drag to update
        </p>
        <div className="space-y-4">
          {(Object.keys(ROADMAP_LABELS) as Array<keyof RoadmapProgress>).map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-stone-700">{ROADMAP_LABELS[key]}</span>
                <span className="text-sm font-medium text-stone-900 font-mono w-8 text-right">
                  {roadmap[key]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar
                    value={roadmap[key]}
                    color={PROGRESS_COLORS[key]}
                    className="mb-1"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={roadmap[key]}
                    onChange={(e) => setProgress(key, Number(e.target.value))}
                    className="w-full accent-stone-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wells effort cap */}
      <div className="border-l-2 border-stone-800 pl-4 py-1">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
          Wells effort cap
        </p>
        <p className="text-sm text-stone-700 leading-relaxed">
          <span className="font-medium text-stone-900">80% output. Full stop.</span> Deliver your commitments.
          Hard stop at 6pm. Don't rescue teammates. Don't volunteer for new scope.
          You are a professional completing a contract — not Wells Fargo's problem to solve.
        </p>
      </div>

      {/* Quarterly milestones */}
      <div>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
          Quarterly milestones
        </p>
        <div className="space-y-4">
          {MILESTONES.map((m, i) => (
            <div key={i} className="border border-stone-100 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-stone-400">{m.quarter}</span>
                  <h3 className="text-sm font-medium text-stone-900">{m.title}</h3>
                </div>
                <span className="text-xs text-stone-400">{m.targetDate}</span>
              </div>
              <ul className="divide-y divide-stone-50">
                {m.items.map((item, j) => (
                  <li key={j} className="px-4 py-2.5 flex items-start gap-2.5">
                    <span className="text-stone-300 mt-0.5 shrink-0">—</span>
                    <span className="text-sm text-stone-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Job readiness timeline */}
      <div>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
          When to apply
        </p>
        <div className="space-y-3">
          {[
            {
              date: 'Sep 2026',
              title: 'Begin warm outreach',
              desc: 'Portfolio live. Resume done. 2–3 DMs/week to ML engineers. No cold apps yet.',
              dot: 'bg-stone-400',
            },
            {
              date: 'Oct 2026',
              title: 'Exploratory / practice interviews',
              desc: 'Low-stakes rounds. Use these to calibrate gaps. Monthly mocks.',
              dot: 'bg-stone-400',
            },
            {
              date: 'Nov–Dec 2026',
              title: 'Tier 2 — apply seriously',
              desc: 'Affirm, Robinhood, Databricks, Capital One. 50+ LC done, app demoable.',
              dot: 'bg-violet-500',
            },
            {
              date: 'Jan–Feb 2027',
              title: 'Tier 1 — Stripe, Plaid, Chime, Brex',
              desc: '7641 complete. Strong referral network. Journal app battle-tested in interviews.',
              dot: 'bg-emerald-500',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                {i < 3 && <div className="w-px flex-1 bg-stone-100 mt-1" />}
              </div>
              <div className="pb-4">
                <p className="text-xs font-mono text-stone-400 mb-0.5">{item.date}</p>
                <p className="text-sm font-medium text-stone-900">{item.title}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
