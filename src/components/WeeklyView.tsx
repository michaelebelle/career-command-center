'use client'

import { useState } from 'react'
import type { AppState, Task } from '@/types'
import { TASKS, CATEGORY_META, MANTRAS } from '@/lib/data'
import { getWeekKey, getWeekLabel } from '@/lib/utils'
import { PriorityBadge } from './PriorityBadge'
import { ProgressBar } from './ProgressBar'

interface WeeklyViewProps {
  state: AppState
  onChange: (s: AppState) => void
}

// Normalize stored value to a count (handles v1 boolean data)
function toCount(val: number | boolean | undefined): number {
  if (val === true) return 1
  if (!val) return 0
  return val as number
}

function isDone(task: Task, count: number): boolean {
  return count >= (task.targetCount ?? 1)
}

// ── Multi-dot check indicator ──────────────────────────────────────────────
function MultiDots({
  count,
  total,
  onDotClick,
}: {
  count: number
  total: number
  onDotClick: (dotIndex: number) => void
}) {
  return (
    <div className="flex items-center gap-1 shrink-0 mt-0.5">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < count
        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              onDotClick(i)
            }}
            aria-label={filled ? `Uncheck session ${i + 1}` : `Check session ${i + 1}`}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              filled
                ? 'bg-stone-800 border-stone-800'
                : 'border-stone-300 hover:border-stone-500'
            }`}
          >
            {filled && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Single checkbox ────────────────────────────────────────────────────────
function SingleCheck({ done }: { done: boolean }) {
  return (
    <div
      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
        done ? 'bg-stone-800 border-stone-800' : 'border-stone-300'
      }`}
    >
      {done && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
          <path
            d="M1 4l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

export function WeeklyView({ state, onChange }: WeeklyViewProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekKey = getWeekKey(weekOffset)
  const completed = state.weeks[weekKey]?.completed ?? {}

  // For multi-count tasks: clicking a dot toggles that specific slot
  // count > dotIndex → unfill back to dotIndex; count ≤ dotIndex → fill to dotIndex+1
  const tapDot = (taskId: string, dotIndex: number) => {
    const current = toCount(completed[taskId])
    const next = current > dotIndex ? dotIndex : dotIndex + 1
    setCount(taskId, next)
  }

  // For single-count tasks: toggle 0↔1
  const toggle = (taskId: string) => {
    const current = toCount(completed[taskId])
    setCount(taskId, current >= 1 ? 0 : 1)
  }

  const setCount = (taskId: string, n: number) => {
    onChange({
      ...state,
      weeks: {
        ...state.weeks,
        [weekKey]: {
          completed: { ...completed, [taskId]: n },
        },
      },
    })
  }

  const resetWeek = () => {
    const updated = { ...state.weeks }
    delete updated[weekKey]
    onChange({ ...state, weeks: updated })
  }

  const totalDone = TASKS.filter((t) => isDone(t, toCount(completed[t.id]))).length
  const total = TASKS.length
  const pct = Math.round((totalDone / total) * 100)

  const mantra = MANTRAS[Math.abs(weekOffset) % MANTRAS.length]
  const categories = ['career', 'wells', 'omscs', 'fitness', 'projects'] as const

  return (
    <div className="space-y-6">
      {/* Week nav */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 font-mono uppercase tracking-wider mb-1">Week</p>
          <h2 className="text-lg font-medium text-stone-900">{getWeekLabel(weekOffset)}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
          >
            ← Prev
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-stone-50 border border-stone-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-600">
            <span className="font-medium text-stone-900">{totalDone}</span> of {total} done
          </span>
          <span className="text-sm font-medium text-stone-900">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
        <p className="text-xs text-stone-400 mt-3 italic">{mantra}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Done', value: totalDone },
          { label: 'Remaining', value: total - totalDone },
          { label: 'Complete', value: `${pct}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-100 rounded-xl p-3 text-center">
            <p className="text-2xl font-medium text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Task categories */}
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat]
        const catTasks = TASKS.filter((t) => t.category === cat)
        const catDone = catTasks.filter((t) =>
          isDone(t, toCount(completed[t.id]))
        ).length

        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <span className={`text-xs font-medium uppercase tracking-wider ${meta.color}`}>
                {meta.label}
              </span>
              <span className="text-xs text-stone-400 ml-auto">
                {catDone}/{catTasks.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {catTasks.map((task) => {
                const tc = task.targetCount ?? 1
                const count = toCount(completed[task.id])
                const done = isDone(task, count)
                const isMulti = tc > 1

                return (
                  <button
                    key={task.id}
                    onClick={isMulti ? undefined : () => toggle(task.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      done
                        ? 'bg-stone-50 border-stone-100 opacity-50'
                        : 'bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                    } ${isMulti ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {/* Check indicator — dots for multi, checkbox for single */}
                    {isMulti ? (
                      <MultiDots
                        count={count}
                        total={tc}
                        onDotClick={(i) => tapDot(task.id, i)}
                      />
                    ) : (
                      <SingleCheck done={done} />
                    )}

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-stone-900 ${done ? 'line-through' : ''}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">{task.target}</p>
                    </div>

                    <PriorityBadge priority={task.priority} />
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Reset */}
      <div className="flex justify-center pt-2">
        <button
          onClick={resetWeek}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
        >
          Reset this week
        </button>
      </div>
    </div>
  )
}
