import { cn } from '@/lib/cn'
import type { FarmTab } from '@/types'

interface FarmTabsProps {
  activeTab: FarmTab
  onTabChange: (tab: FarmTab) => void
  livestockCount: number
  cropsCount: number
}

export function FarmTabs({
  activeTab,
  onTabChange,
  livestockCount,
  cropsCount,
}: FarmTabsProps) {
  return (
    <div className="border-b border-gray-200 w-full flex items-center gap-6 mb-6">
      <button
        type="button"
        onClick={() => onTabChange('livestock')}
        className={cn(
          'flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-colors cursor-pointer relative',
          activeTab === 'livestock'
            ? 'text-gray-900 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        <span>Livestock Herd</span>
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-xs font-normal',
            activeTab === 'livestock'
              ? 'bg-gray-100 text-gray-900 border border-gray-200'
              : 'bg-gray-50 text-gray-500 border border-gray-100'
          )}
        >
          {livestockCount}
        </span>
        {activeTab === 'livestock' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange('crops')}
        className={cn(
          'flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-colors cursor-pointer relative',
          activeTab === 'crops'
            ? 'text-gray-900 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        <span>Crop Plots</span>
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-xs font-normal',
            activeTab === 'crops'
              ? 'bg-gray-100 text-gray-900 border border-gray-200'
              : 'bg-gray-50 text-gray-500 border border-gray-100'
          )}
        >
          {cropsCount}
        </span>
        {activeTab === 'crops' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
        )}
      </button>
    </div>
  )
}
