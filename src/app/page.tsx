'use client'

import { useState } from 'react'
import type { AppState } from '@/types'
import { DEFAULT_ROADMAP } from '@/lib/data'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { WeeklyView } from '@/components/WeeklyView'
import { RoadmapView } from '@/components/RoadmapView'
import { ReflectionView } from '@/components/ReflectionView'

const INITIAL_STATE: AppState = {
  weeks: {},
  reflections: {},
  roadmap: DEFAULT_ROADMAP,
}

type Tab = 'weekly' | 'roadmap' | 'reflect'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'weekly', label: 'This week', icon: '▦' },
  { id: 'roadmap', label: 'Roadmap', icon: '◎' },
  { id: 'reflect', label: 'Reflect', icon: '◇' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('weekly')
  const [state, setState, loaded] = useLocalStorage<AppState>(
    'career-command-center-v1',
    INITIAL_STATE
  )

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-stone-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-100 px-4 pt-6 pb-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-medium text-stone-900">Command Center</h1>
              <p className="text-xs text-stone-400 font-mono">michaelebelle.dev</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Target exit</p>
              <p className="text-xs font-mono font-medium text-stone-900">Q1–Q2 2027</p>
            </div>
          </div>
          {/* Tab nav */}
          <div className="flex gap-1 bg-stone-50 p-1 rounded-xl">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-16">
        {tab === 'weekly' && <WeeklyView state={state} onChange={setState} />}
        {tab === 'roadmap' && <RoadmapView state={state} onChange={setState} />}
        {tab === 'reflect' && <ReflectionView state={state} onChange={setState} />}
      </main>
    </div>
  )
}
