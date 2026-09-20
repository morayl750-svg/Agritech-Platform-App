import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { StatCardProps } from '@/types'

export function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  const isUp = trend === 'up'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="p-1.5 rounded-md bg-gray-50">
          <Icon size={14} className="text-gray-400" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-1">
        <ArrowUpRight
          size={13}
          className={cn(isUp ? 'text-emerald-600' : 'text-red-500 rotate-90')}
          aria-hidden="true"
        />
        <span className={cn('text-xs font-medium', isUp ? 'text-emerald-600' : 'text-red-500')}>
          {change}
        </span>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </div>
  )
}
