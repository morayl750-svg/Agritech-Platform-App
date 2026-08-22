import type { NavItem } from '@/types'
import { cn } from '@/lib/cn'

interface NavLinkProps {
  item: NavItem
  active: boolean
  onClick: () => void
  isCollapsed?: boolean
}

export function NavLink({ item, active, onClick, isCollapsed = false }: NavLinkProps) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'w-full flex items-center gap-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-left cursor-pointer',
        isCollapsed ? 'justify-center px-2' : 'px-3',
        active
          ? 'bg-gray-100 text-gray-900 font-semibold shadow-2xs'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      )}
    >
      <Icon
        size={17}
        className={cn('flex-shrink-0', active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600')}
        aria-hidden="true"
      />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </button>
  )
}
