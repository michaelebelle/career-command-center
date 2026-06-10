'use client'

import { useState } from 'react'
import type { AppState } from '@/types'
import { DEFAULT_ROADMAP } from '@/lib/data'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { WeeklyView } from '@/components/WeeklyView'
import { RoadmapView } from '@/components/RoadmapView'
import { ReflectionView } from '@/components/ReflectionView'
import { ReadinessView } from '@/components/ReadinessView'
import { ChallengeView } from '@/components/ChallengeView'
import { computeReadiness } from '@/lib/readiness'

const INITIAL_STATE: AppState = {
  weeks: {},
  reflections: {},
  roadmap: DEFAULT_ROADMAP,
  gates: {},
  leetcodeCount: 0,
  ragModulesCount: 0,
  challenge: { startDate: null, daily: {}, weekly: {}, lastHaircutDate: null },
}

type Tab = 'weekly' | 'challenge' | 'readiness' | 'roadmap' | 'reflect'

export default function App() {
  const [tab, setTab] = useState<Tab>('readiness')
  const [state, setState, loaded] = useLocalStorage<AppState>(
    'career-command-center-v2',
    INITIAL_STATE
  )

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-stone-200 animate-pulse" />
      </div>
    )
  }

  const report = computeReadiness(state)

  const _today = new Date().toISOString().slice(0, 10)
  const _start = state.challenge?.startDate
  const challengeDay = _start
    ? Math.max(1, Math.min(60, Math.floor(
        (new Date(_today + 'T12:00:00').getTime() - new Date(_start + 'T12:00:00').getTime()) / 86400000
      ) + 1))
    : 0

  const TABS: { id: Tab; label: string; alert?: boolean }[] = [
    { id: 'weekly', label: 'Week' },
    { id: 'challenge', label: challengeDay > 0 ? `Day ${challengeDay}` : 'Challenge' },
    { id: 'readiness', label: 'Readiness', alert: report.overdueGates.length > 0 },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'reflect', label: 'Reflect' },
  ]

  const levelDot = {
    not_ready: 'bg-stone-400',
    foundation_building: 'bg-amber-400',
    tier2_ready: 'bg-violet-500',
    tier1_ready: 'bg-emerald-500',
  }[report.level]

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-stone-100 px-4 pt-5 pb-0 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-medium text-stone-900">Command Center</h1>
              <p className="text-xs text-stone-400 font-mono">michaelebelle.dev</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${levelDot}`} />
              <div className="text-right">
                <p className={`text-xs font-medium ${report.color}`}>{report.label}</p>
                <p className="text-xs text-stone-400 font-mono">Exit target: Q1 2027</p>
              </div>
            </div>
          </div>
          <div className="flex gap-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex-1 py-2.5 text-sm font-medium transition-all border-b-2 ${
                  tab === t.id
                    ? 'text-stone-900 border-stone-900'
                    : 'text-stone-400 border-transparent hover:text-stone-600'
                }`}
              >
                {t.label}
                {t.alert && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-16">
        {tab === 'weekly' && <WeeklyView state={state} onChange={setState} />}
        {tab === 'challenge' && <ChallengeView state={state} onChange={setState} />}
        {tab === 'readiness' && <ReadinessView state={state} onChange={setState} />}
        {tab === 'roadmap' && <RoadmapView state={state} onChange={setState} />}
        {tab === 'reflect' && <ReflectionView state={state} onChange={setState} />}
      </main>
    </div>
  )
}
