import { useState } from 'react'
import { Leaf, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink } from './NavLink'
import { ProfilePopover } from './ProfilePopover'
import { NAV_ITEMS } from '@/lib/navigation.data'
import { cn } from '@/lib/cn'
import type { SidebarProps } from '@/types'

export interface ExtendedSidebarProps extends SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

function SidebarContent({
  activeRoute,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: {
  activeRoute: string
  onNavigate: (href: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="flex flex-col h-full relative">
      {/* Top Header & Logo */}
      <div
        className={cn(
          'flex items-center py-3.5 border-b border-gray-200 transition-all duration-300',
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 flex-shrink-0 text-white shadow-2xs">
                <Leaf size={14} aria-hidden="true" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-gray-900 truncate">
                AgriSmart
              </span>
            </div>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            )}
          </>
        ) : (
          onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="group relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Leaf size={15} className="group-hover:hidden transition-all" />
              <PanelLeftOpen size={16} className="hidden group-hover:block transition-all" />
            </button>
          )
        )}
      </div>

      {/* Navigation Links */}
      <nav aria-label="Primary navigation" className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={activeRoute === item.href}
            isCollapsed={isCollapsed}
            onClick={() => onNavigate(item.href)}
          />
        ))}
      </nav>

      {/* Bottom User Profile Section with Popover */}
      <div className="px-2.5 py-3 border-t border-gray-200 relative">
        <ProfilePopover
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          isCollapsed={isCollapsed}
        />

        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className={cn(
            'w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-left',
            isCollapsed && 'justify-center p-2'
          )}
          title="User profile & settings"
        >
          <div
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 font-medium text-xs shadow-2xs"
            aria-hidden="true"
          >
            AB
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Amina Barre</p>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                Admin
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export function Sidebar({
  activeRoute,
  onNavigate,
  mobileOpen,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse,
}: ExtendedSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Site navigation"
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[70px]' : 'w-[250px]'
        )}
      >
        <SidebarContent
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer (Always expanded) */}
      <aside
        aria-label="Site navigation"
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onMobileClose}
          aria-label="Close navigation menu"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors z-20"
        >
          <X size={16} />
        </button>
        <SidebarContent
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          isCollapsed={false}
        />
      </aside>
    </>
  )
}
