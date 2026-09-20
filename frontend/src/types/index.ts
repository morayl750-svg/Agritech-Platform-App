import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

export interface SidebarProps {
  activeRoute: string
  onNavigate: (href: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export interface StatCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
}

export interface InsightItem {
  id: string
  icon: LucideIcon
  label: string
  detail: string
  iconColor: string
}

export interface WeatherDay {
  day: string
  tempCelsius: number
  rainHeight: number
}

export interface WeatherMetric {
  label: string
  value: string
}

export type MessageSender = 'user' | 'ai'

export interface ChatMessageItem {
  id: string
  sender: MessageSender
  text: string
  timestamp: string
  imageUrl?: string
  suggestedActions?: string[]
}

export interface ChatMessageProps {
  message: ChatMessageItem
  onSelectAction?: (actionText: string) => void
}

export interface ChatInputProps {
  onSendMessage: (text: string) => void
  onToggleVision: () => void
  isVisionOpen: boolean
  disabled?: boolean
}

export interface VisionUploaderProps {
  onImageSelected: (file: File) => void
  onClose?: () => void
  previewUrl?: string | null
  onClearPreview?: () => void
}

export interface AttachmentMenuItem {
  id: string
  label: string
  icon: LucideIcon
  iconColor?: string
}

export interface AttachmentMenuProps {
  onSelect: (id: string) => void
  onClose: () => void
}

export interface ChatHistoryItem {
  id: string
  title: string
  date: string
}

export interface ChatHistorySidebarProps {
  isOpen: boolean
  activeChatId: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  sessions?: ChatHistoryItem[]
  isLoading?: boolean
}

export interface DbDashboardMetric {
  id: string
  title: string
  value: string
  trend_value: string
  trend_label: 'up' | 'down'
  icon_name: string
  created_at?: string
}

export interface DbAiInsight {
  id: string
  type: string
  title: string
  description: string
  region: string
  timestamp: string
  icon_color?: string
  created_at?: string
}

export interface DbWeatherData {
  id: string
  location: string
  temperature: number
  condition: string
  humidity: string
  wind_speed: string
  rain_mm: string
  forecast_json: WeatherDay[]
  created_at?: string
}

export interface DbChatSession {
  id: string
  title: string
  created_at: string
}

export type ProductCategory =
  | 'All'
  | 'Sunta Cayayaanka'
  | 'Sunta Boqoshaada'
  | 'Sunta Haramaanka'
  | 'Qalabka Buufinta'
  | 'Seeds'
  | 'Tools'
  | 'Fertilizers'
  | 'Produce'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  seller_name: string
  image_url?: string | null
  stock: number
  unit?: string
  target_pest?: string
  active_ingredient?: string
  dosage?: string
  safety_warning?: string
  suitable_crops?: string
  waiting_period?: string
  application_method?: string
  created_at?: string
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  onEditProduct?: (product: Product) => void
}

export interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newProduct?: Product) => void
}

export interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess: (updatedProduct: Product) => void
}

export interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onAddToCart?: (product: Product, quantity?: number) => void
  onEditProduct?: (product: Product) => void
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled'

export interface MarketplaceOrder {
  id: string
  customer_name: string
  customer_phone: string
  location: string
  total_amount: number
  status: OrderStatus
  items: CartItem[]
  created_at: string
}


// Farm Module Types
export type AnimalType = 'Camel' | 'Goat' | 'Sheep' | 'Cattle'
export type AnimalHealthStatus = 'Healthy' | 'Sick' | 'Recovering'

export interface LivestockRecord {
  id: string
  animal_type: AnimalType
  count: number
  health_status: AnimalHealthStatus
  last_vaccination?: string | null
  notes?: string | null
  created_at?: string
}

export type CropStatus = 'Planted' | 'Growing' | 'Ready' | 'Harvested'

export interface CropRecord {
  id: string
  crop_name: string
  plot_number: string
  status: CropStatus
  planted_date: string
  expected_yield: string
  created_at?: string
}

export type FarmTab = 'livestock' | 'crops'

export interface AddFarmRecordModalProps {
  isOpen: boolean
  activeTab: FarmTab
  onClose: () => void
  onSuccess: () => void
}
