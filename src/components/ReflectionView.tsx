'use client'

import type { AppState, Reflection } from '@/types'
import { getWeekKey, getWeekLabel } from '@/lib/utils'
import { useState } from 'react'

interface ReflectionViewProps {
  state: AppState
  onChange: (s: AppState) => void
}

const EMPTY_REFLECTION: Reflection = {
  energy: 3,
  burnout: 3,
  confidence: 3,
  win: '',
  adjustment: '',
}

function ScaleInput({
  label,
  sublabel,
  value,
  onChange,
  lowLabel,
  highLabel,
  invertColor = false,
}: {
  label: string
  sublabel: string
  value: number
  onChange: (v: number) => void
  lowLabel: string
  highLabel: string
  invertColor?: boolean
}) {
  const getColor = (v: number) => {
    if (invertColor) {
      if (v <= 2) return 'bg-emerald-500'
      if (v === 3) return 'bg-amber-500'
      return 'bg-red-400'
    }
    if (v <= 2) return 'bg-red-400'
    if (v === 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-stone-900">{label}</p>
          <p className="text-xs text-stone-400">{sublabel}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColor(value)}`}
        >
          {value}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400 w-16">{lowLabel}</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-stone-800 cursor-pointer"
        />
        <span className="text-xs text-stone-400 w-16 text-right">{highLabel}</span>
      </div>
    </div>
  )
}

export function ReflectionView({ state, onChange }: ReflectionViewProps) {
  const [weekOffset] = useState(0)
  const weekKey = getWeekKey(weekOffset)
  const reflection = state.reflections?.[weekKey] ?? { ...EMPTY_REFLECTION }

  const update = (updates: Partial<Reflection>) => {
    onChange({
      ...state,
      reflections: {
        ...state.reflections,
        [weekKey]: { ...reflection, ...updates },
      },
    })
  }

  const burnoutWarning = reflection.burnout >= 4 || reflection.energy <= 2

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">Reflection</p>
        <h2 className="text-lg font-medium text-stone-900">{getWeekLabel(weekOffset)}</h2>
        <p className="text-xs text-stone-400 mt-0.5">
          A 5-minute check-in. Honest data beats wishful thinking.
        </p>
      </div>

      {burnoutWarning && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm font-medium text-red-800 mb-1">Burnout signal detected</p>
          <p className="text-xs text-red-600 leading-relaxed">
            Your energy is low or burnout is high. This week: drop to fitness-only mode if needed.
            Career prep can pause for 1–2 weeks. It is not failure — it is maintenance.
          </p>
        </div>
      )}

      {/* Scales */}
      <div className="space-y-5">
        <ScaleInput
          label="Energy level"
          sublabel="How do you physically and mentally feel?"
          value={reflection.energy}
          onChange={(v) => update({ energy: v })}
          lowLabel="Depleted"
          highLabel="Strong"
        />
        <ScaleInput
          label="Burnout level"
          sublabel="How close to the edge are you?"
          value={reflection.burnout}
          onChange={(v) => update({ burnout: v })}
          lowLabel="None"
          highLabel="Severe"
          invertColor
        />
        <ScaleInput
          label="Confidence level"
          sublabel="How do you feel about the transition plan?"
          value={reflection.confidence}
          onChange={(v) => update({ confidence: v })}
          lowLabel="Shaky"
          highLabel="Solid"
        />
      </div>

      {/* Text fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-1.5">
            One win this week
          </label>
          <p className="text-xs text-stone-400 mb-2">
            Any size. Shipped code, a good workout, held the Wells boundary.
          </p>
          <textarea
            value={reflection.win}
            onChange={(e) => update({ win: e.target.value })}
            placeholder="This week I..."
            rows={3}
            className="w-full text-sm text-stone-900 border border-stone-200 rounded-xl p-3 resize-none placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-1.5">
            One adjustment for next week
          </label>
          <p className="text-xs text-stone-400 mb-2">
            One thing only. What specifically changes next week?
          </p>
          <textarea
            value={reflection.adjustment}
            onChange={(e) => update({ adjustment: e.target.value })}
            placeholder="Next week I will..."
            rows={3}
            className="w-full text-sm text-stone-900 border border-stone-200 rounded-xl p-3 resize-none placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
      </div>

      {/* Past reflections summary */}
      {Object.keys(state.reflections ?? {}).length > 1 && (
        <div>
          <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
            Past weeks
          </p>
          <div className="space-y-2">
            {Object.entries(state.reflections ?? {})
              .filter(([k]) => k !== weekKey)
              .slice(-4)
              .reverse()
              .map(([key, r]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-100 rounded-xl"
                >
                  <div className="text-xs font-mono text-stone-400 w-24 shrink-0">{key}</div>
                  <div className="flex gap-3 flex-1">
                    <span className="text-xs text-stone-500">
                      Energy {r.energy}/5
                    </span>
                    <span className="text-xs text-stone-500">
                      Burnout {r.burnout}/5
                    </span>
                    <span className="text-xs text-stone-500">
                      Confidence {r.confidence}/5
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
