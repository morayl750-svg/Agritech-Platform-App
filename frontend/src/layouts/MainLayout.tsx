import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ROUTE_META } from '@/lib/navigation.data'
import { cn } from '@/lib/cn'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeRoute = location.pathname === '/' ? '/dashboard' : location.pathname
  const meta = ROUTE_META[activeRoute] ?? {
    breadcrumbs: [{ label: 'AgriSmart' }],
  }

  function handleNavigate(href: string) {
    navigate(href)
    setMobileOpen(false)
  }

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAFA] flex flex-col">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <Header
        breadcrumbs={meta.breadcrumbs}
        onMenuOpen={() => setMobileOpen(true)}
      />

      <main
        className={cn(
          'pt-14 flex-1 h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-[70px]' : 'lg:pl-[250px]'
        )}
        id="main-content"
        tabIndex={-1}
        aria-label="Main content"
      >
        <div className="flex-1 h-full p-4 lg:p-6 overflow-y-auto flex flex-col">{children}</div>
      </main>
    </div>
  )
}
