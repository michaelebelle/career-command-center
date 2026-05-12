interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: string
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'bg-stone-800',
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className={`h-1.5 bg-stone-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
