import { cn } from '@/lib/cn'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase().trim()

  let colorClass = 'bg-gray-100 text-gray-700 border-gray-200'

  if (normalized === 'healthy' || normalized === 'growing' || normalized === 'ready') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  } else if (normalized === 'sick') {
    colorClass = 'bg-red-50 text-red-700 border-red-200/80'
  } else if (normalized === 'recovering' || normalized === 'planted') {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200/80'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClass
      )}
    >
      {status}
    </span>
  )
}
