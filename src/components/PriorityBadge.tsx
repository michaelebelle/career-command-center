import type { Priority } from '@/types'

const styles: Record<Priority, string> = {
  critical: 'bg-red-50 text-red-700 border border-red-200',
  high: 'bg-amber-50 text-amber-700 border border-amber-200',
  medium: 'bg-stone-100 text-stone-600 border border-stone-200',
}

const labels: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}
