import {
  LayoutDashboard,
  BrainCircuit,
  Sprout,
  BookOpen,
  Users,
  CloudSun,
  Carrot,
  Bug,
  MapPin,
  Camera,
  TrendingUp,
  Sparkles,
  MessageSquare,
  CalendarDays,
  BarChart3,
} from 'lucide-react'
import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Hoyga', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'AI Agronomist', icon: BrainCircuit, href: '/ai-agronomist' },
  { label: 'Farriimaha Tooska ah', icon: MessageSquare, href: '/messages' },
  { label: 'Jadwalka Beerista', icon: CalendarDays, href: '/schedule' },
  { label: 'Khariidadda Beeraha', icon: MapPin, href: '/farm-map' },
  { label: 'Cudurada Dhirta AI', icon: Camera, href: '/crop-disease' },
  { label: 'Saadaasha AI', icon: Sparkles, href: '/yield-prediction' },
  { label: 'Qiimaha Suuqa', icon: TrendingUp, href: '/market-prices' },
  { label: 'Dalabka Khudaarta', icon: Carrot, href: '/khudaar' },
  { label: 'Sunta Cayayaanka', icon: Bug, href: '/marketplace' },
  { label: 'Weather & Alerts', icon: CloudSun, href: '/weather' },
  { label: 'Livestock & Crops', icon: Sprout, href: '/livestock-crops' },
  { label: 'Financial Ledger', icon: BookOpen, href: '/financial-ledger' },
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Xogta Maamulka', icon: BarChart3, href: '/admin' },
]

export const ROUTE_META: Record<string, { breadcrumbs: { label: string; href?: string }[] }> = {
  '/dashboard': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Hoyga' }],
  },
  '/ai-agronomist': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'AI Agronomist' }],
  },
  '/messages': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Farriimaha Tooska ah' }],
  },
  '/schedule': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Jadwalka Beerista' }],
  },
  '/admin': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Xogta Maamulka' }],
  },
  '/farm-map': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Khariidadda Beeraha' }],
  },
  '/crop-disease': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Cudurada Dhirta AI' }],
  },
  '/diagnose': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Cudurada Dhirta AI' }],
  },
  '/yield-prediction': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Saadaasha Wax Soo Saarka' }],
  },
  '/yield-predict': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Saadaasha Wax Soo Saarka' }],
  },
  '/market-prices': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Qiimaha Suuqa' }],
  },
  '/prices': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Qiimaha Suuqa' }],
  },
  '/khudaar': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Dalabka Khudaarta Cusub' }],
  },
  '/dalabka-khudaarta': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Dalabka Khudaarta Cusub' }],
  },
  '/produce': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Dalabka Khudaarta Cusub' }],
  },
  '/weather': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Weather & Ogeysiisyada' }],
  },
  '/cimilada': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Weather & Ogeysiisyada' }],
  },
  '/marketplace': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Suuqa Sunta Cayayaanka' }],
  },
  '/pesticides': {
    breadcrumbs: [{ label: 'AgriSmart' }, { label: 'Suuqa Sunta Cayayaanka' }],
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
