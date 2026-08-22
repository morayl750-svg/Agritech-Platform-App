import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { RemindersPopover } from '@/components/reminders/RemindersPopover'
import { cn } from '@/lib/cn'

interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  breadcrumbs: Breadcrumb[]
  onMenuOpen: () => void
}

export function Header({ breadcrumbs, onMenuOpen }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-[250px] h-14 bg-white border-b border-gray-200 z-20 flex items-center px-4 gap-4"
      role="banner"
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.label} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span className="text-gray-300 flex-shrink-0" aria-hidden="true">
                  /
                </span>
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900 truncate" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <span className="text-gray-400 truncate">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div
          className={cn(
            'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-all duration-150',
            searchFocused
              ? 'border-gray-400 bg-white w-52'
              : 'border-gray-200 bg-gray-50 w-40 hover:border-gray-300'
          )}
        >
          <Search size={13} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search AgriSmart"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-full"
          />
          <kbd
            className="hidden sm:inline-flex items-center text-[10px] font-medium text-gray-400"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        </div>

        {/* Farmer Reminders & Emergency Weather Alerts Popover */}
        <RemindersPopover />
      </div>
    </header>
  )
}
