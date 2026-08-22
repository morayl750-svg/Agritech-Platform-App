import {
  LayoutDashboard,
  BrainCircuit,
  ShoppingBasket,
  Sprout,
  BookOpen,
  Users,
  CloudSun,
} from 'lucide-react'
import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Hoyga', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'AI Agronomist', icon: BrainCircuit, href: '/ai-agronomist' },
  { label: 'Weather', icon: CloudSun, href: '/weather' },
  { label: 'Marketplace', icon: ShoppingBasket, href: '/marketplace' },
  { label: 'Livestock & Crops', icon: Sprout, href: '/livestock-crops' },
  { label: 'Financial Ledger', icon: BookOpen, href: '/financial-ledger' },
  { label: 'Community', icon: Users, href: '/community' },
]

export const ROUTE_META: Record<string, { breadcrumbs: { label: string; href?: string }[] }> = {
  '/dashboard': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Hoyga' }],
  },
  '/ai-agronomist': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'AI Agronomist' }],
  },
  '/weather': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Weather' }],
  },
  '/cimilada': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Weather' }],
  },
  '/marketplace': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Marketplace' }],
  },
  '/livestock-crops': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Livestock & Crops' }],
  },
  '/financial-ledger': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Financial Ledger' }],
  },
  '/community': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Community' }],
  },
  '/profile': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'User Profile' }],
  },
  '/settings': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Settings' }],
  },
}

