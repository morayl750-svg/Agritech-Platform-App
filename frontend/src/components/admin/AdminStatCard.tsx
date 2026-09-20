import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AdminStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: string
}

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: AdminStatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs hover:border-gray-300 dark:hover:border-neutral-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}
