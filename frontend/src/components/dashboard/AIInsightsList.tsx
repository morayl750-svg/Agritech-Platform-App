import type { InsightItem } from '@/types'

interface InsightRowProps {
  item: InsightItem
}

function InsightRow({ item }: InsightRowProps) {
  const Icon = item.icon
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon size={15} className={item.iconColor} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{item.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
      </div>
    </div>
  )
}

interface AIInsightsListProps {
  items: InsightItem[]
  updatedLabel: string
}

export function AIInsightsList({ items, updatedLabel }: AIInsightsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">AI Field Insights</h2>
        <span className="text-xs text-gray-400 font-mono">{updatedLabel}</span>
      </div>
      <div className="px-5 py-3">
        {items.map((item) => (
          <InsightRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
