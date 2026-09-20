import { useState, useEffect } from 'react'
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  Phone,
  User,
  Clock,
  Carrot,
  Leaf,
  Send,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Smartphone,
  CreditCard,
  Printer,
  Download,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { INITIAL_PRODUCE_ITEMS } from '@/data/produceData'
import { InvoiceModal } from '@/components/marketplace/InvoiceModal'
import { MobilePaymentModal } from '@/components/marketplace/MobilePaymentModal'
import type {
  ProduceItem,
  ProduceCategory,
  ProduceCartItem,
  ProduceOrder,
  ProduceOrderStatus,
} from '@/types/produce'
import { cn } from '@/lib/cn'

const PRODUCE_CATEGORIES: ProduceCategory[] = [
  'All',
  'Khudaarta Cagaaran',
  'Khudaarta Asalka ah',
  'Miraha Beeraha',
  'Sanduuqyo & Jumlo',
]

const SOMALI_CITIES = [
  'Muqdisho (Banaadir)',
  'Hargeysa',
  'Baydhabo',
  'Kismaayo',
  'Garoowe',
  'Boosaaso',
  'Jowhar',
  'Afgooye',
  'Beledweyne',
  'Gaalkacyo',
]

const STORAGE_ORDERS_KEY = 'agrismart_vegetable_orders'

export default function VegetableMarket() {
  const { user, signup, updateUserProfile } = useAuth()

  // State
  const [items] = useState<ProduceItem[]>(INITIAL_PRODUCE_ITEMS)
  const [selectedCategory, setSelectedCategory] = useState<ProduceCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<ProduceCartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSideCartOpen, setIsSideCartOpen] = useState(false)
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false)
  const [orders, setOrders] = useState<ProduceOrder[]>([])
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<ProduceOrder | null>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [activeModalOrder, setActiveModalOrder] = useState<ProduceOrder | null>(null)

  // Checkout Form State (Linked to User)
  const [customerName, setCustomerName] = useState(user?.full_name || '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '')
  const [customerCity, setCustomerCity] = useState(user?.city || 'Muqdisho (Banaadir)')
  const [customerDistrict, setCustomerDistrict] = useState(user?.district || 'Hodan')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'EVC Plus / Zaad / Sahal' | 'Kaash marka la keeno (COD)'>('EVC Plus / Zaad / Sahal')
  const [saveAsNewUser, setSaveAsNewUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')

  // Load orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ORDERS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setOrders(parsed)
        }
      }
    } catch (e) {
      console.error('Error loading orders:', e)
    }
  }, [])

  // Auto-populate when active user changes
  useEffect(() => {
    if (user) {
      setCustomerName(user.full_name || '')
      setCustomerPhone(user.phone || '')
      if (user.city) setCustomerCity(user.city)
      if (user.district) setCustomerDistrict(user.district)
    }
  }, [user])

  // Save orders to localStorage
  const saveOrders = (newOrders: ProduceOrder[]) => {
    setOrders(newOrders)
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(newOrders))
    } catch (e) {
      console.error('Failed to save orders:', e)
    }
  }

  // Cart Functions
  const addToCart = (produce: ProduceItem, delta: number = 1) => {
    if (delta > 0) {
      setIsSideCartOpen(true) // Automatically pop open the right-side window when choosing items
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.produce.id === produce.id)
      if (existing) {
        const updatedQty = existing.quantity + delta
        if (updatedQty <= 0) {
          return prev.filter((item) => item.produce.id !== produce.id)
        }
        return prev.map((item) =>
          item.produce.id === produce.id ? { ...item, quantity: updatedQty } : item
        )
      }
      if (delta > 0) {
        return [...prev, { produce, quantity: delta }]
      }
      return prev
    })
  }

  const getCartItemQuantity = (produceId: string) => {
    const found = cart.find((item) => item.produce.id === produceId)
    return found ? found.quantity : 0
  }

  const removeFromCart = (produceId: string) => {
    setCart((prev) => prev.filter((item) => item.produce.id !== produceId))
  }

  const clearCart = () => {
    setCart([])
  }

  // Financial Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.produce.price * item.quantity, 0)
  const deliveryFee = subtotal >= 25 || cart.length === 0 ? 0.0 : 1.5
  const totalAmount = subtotal + deliveryFee

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.somali_name.toLowerCase().includes(q) ||
      item.farm_origin.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Submit Order & Link/Create User
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    // 1. Create or update user identity if requested
    if (saveAsNewUser && newUserEmail) {
      const usernameClean = customerName.toLowerCase().replace(/\s+/g, '_') || `user_${Date.now()}`
      await signup({
        email: newUserEmail,
        username: usernameClean,
        full_name: customerName,
        phone: customerPhone,
        city: customerCity,
        district: customerDistrict,
        password: 'password123',
      })
    } else if (user) {
      // Keep existing profile updated with latest city/district/phone
      updateUserProfile({
        full_name: customerName,
        phone: customerPhone,
        city: customerCity,
        district: customerDistrict,
      })
    }

    // 2. Build Produce Order
    const newOrder: ProduceOrder = {
      id: `KHU-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        full_name: customerName.trim() || 'Macmiil Sharaf leh',
        phone: customerPhone.trim() || '+252 61 000 0000',
        city: customerCity,
        district: customerDistrict.trim() || 'Hodan',
        delivery_notes: deliveryNotes,
      },
      items: [...cart],
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      status: 'Diyaarin',
      payment_method: paymentMethod,
      payment_status: 'Pending',
      order_step: 2,
      created_at: new Date().toISOString(),
    }

    const updated = [newOrder, ...orders]
    saveOrders(updated)
    setLastConfirmedOrder(newOrder)
    setActiveModalOrder(newOrder)
    clearCart()
  }

  // Handle mobile money payment success (USSD Push confirmation)
  const handlePaymentSuccess = (orderId: string, txId: string) => {
    const updateOrder = (o: ProduceOrder): ProduceOrder =>
      o.id === orderId
        ? {
            ...o,
            payment_status: 'Paid',
            transaction_id: txId,
            status: 'Gaadiidka ayaa wada',
            order_step: 3,
          }
        : o

    setOrders((prev) => {
      const updated = prev.map(updateOrder)
      saveOrders(updated)
      return updated
    })

    if (lastConfirmedOrder && lastConfirmedOrder.id === orderId) {
      setLastConfirmedOrder((prev) => (prev ? updateOrder(prev) : null))
    }
    if (activeModalOrder && activeModalOrder.id === orderId) {
      setActiveModalOrder((prev) => (prev ? updateOrder(prev) : null))
    }
  }

  // Generate WhatsApp Message for Order
  const createWhatsAppLink = (order: ProduceOrder) => {
    const itemsText = order.items
      .map((it) => `- ${it.produce.name} (${it.quantity} ${it.produce.unit}) = $${(it.produce.price * it.quantity).toFixed(2)}`)
      .join('%0A')

    const message = `*DALABKA KHUDAARTA EE AGRISMART*%0A` +
      `*Lambarka Dalabka:* ${order.id}%0A` +
      `*Magaca Macmiilka:* ${order.customer.full_name}%0A` +
      `*Telefoonka:* ${order.customer.phone}%0A` +
      `*Magaalada:* ${order.customer.city}%0A` +
      `*Xaafadda:* ${order.customer.district}%0A%0A` +
      `*Alaabta Dalabka:*%0A${itemsText}%0A%0A` +
      `*Isku-gaynta:* $${order.total_amount.toFixed(2)} USD%0A` +
      `*Qaabka Lacag-bixinta:* ${order.payment_method}%0A` +
      `Fadlan ii soo xaqiiji xilliga la keenayo. Mahadsanidiin!`

    return `https://wa.me/252615550192?text=${message}`
  }

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-12">
      {/* 1. Header Section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Carrot size={20} />
            </span>
            <h1 className="text-xl font-bold text-gray-900">
              Dalabka Khudaarta Cusub ee Beeraha
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Khudaar dabiici ah oo toos looga soo guray beeraha Afgooye, Jowhar iyo Balcad - Maalin kasta la keeno
          </p>
        </div>

        {/* Action Buttons: Cart Drawer & Orders History */}
        <div className="flex items-center gap-2">
          {/* Order History Button */}
          <button
            onClick={() => setIsOrderHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Clock size={14} className="text-gray-500" />
            <span>Dalabyadayda ({orders.length})</span>
          </button>

          {/* Cart Button (Toggles Right-Side Mini Window) */}
          <button
            onClick={() => setIsSideCartOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            title="Muuji ama qari daaqadda wixii aad dooratay"
          >
            <ShoppingCart size={15} />
            <span>Wixii Aad Doiratay</span>
            <span className="px-1.5 py-0.2 rounded bg-white text-emerald-800 text-[11px] font-bold">
              {cartItemCount}
            </span>
            {subtotal > 0 && (
              <span className="text-[11px] font-medium opacity-90 border-l border-emerald-600 pl-1.5">
                ${subtotal.toFixed(2)} USD
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Highlights & Fresh Delivery Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <Leaf size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">100% Dabiici & Tayo Sare</h4>
            <p className="text-[11px] text-gray-500">Toos looga keenay wabiga Shabelle</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Delivery Maalinle ah</h4>
            <p className="text-[11px] text-gray-500">Gurigaaga ama goobtaada shaqo la keeno</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Delivery Lacag La'aan ah</h4>
            <p className="text-[11px] text-gray-500">Dhamaan dalabyada $25 ka badan</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Raadi khudaar (tusaale: tamaandho, basal, afgooye)..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {PRODUCE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                )}
              >
                {cat === 'All' ? 'Dhamaan Khudaarta' : cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Fresh Produce Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Carrot size={36} className="text-gray-300" />
          <h3 className="text-sm font-bold text-gray-800">Khudaar looma helin raadintaada</h3>
          <p className="text-xs text-gray-500">Isku day inaad raadiso magac kale ama aad dib u dejiso shaandhada.</p>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSearchQuery('')
            }}
            className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold cursor-pointer"
          >
            Dib u deji
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((produce) => {
            const currentQty = getCartItemQuantity(produce.id)

            return (
              <div
                key={produce.id}
                className="bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                    <img
                      src={produce.image_url}
                      alt={produce.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 shadow-2xs flex items-center gap-1">
                        <Leaf size={10} className="text-emerald-600" />
                        {produce.freshness}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        <MapPin size={10} />
                        <span className="truncate">{produce.farm_origin}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Somali Name */}
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {produce.somali_name}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{produce.name}</p>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {produce.description}
                  </p>

                  {/* Nutrition benefit badge */}
                  {produce.nutrition_highlight && (
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <Sparkles size={11} className="text-emerald-600" />
                      <span className="truncate">{produce.nutrition_highlight}</span>
                    </div>
                  )}
                </div>

                {/* Price & Cart Actions */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                      Qiimaha
                    </span>
                    <p className="text-sm font-extrabold text-emerald-800">
                      ${produce.price.toFixed(2)}{' '}
                      <span className="text-[11px] font-normal text-gray-500">/ {produce.unit}</span>
                    </p>
                  </div>

                  {currentQty > 0 ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => addToCart(produce, -1)}
                        className="w-6 h-6 rounded bg-white text-emerald-800 flex items-center justify-center font-bold hover:bg-emerald-100 cursor-pointer shadow-2xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-emerald-900 w-6 text-center">
                        {currentQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(produce, 1)}
                        className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center font-bold hover:bg-emerald-800 cursor-pointer shadow-2xs"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(produce, 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus size={13} />
                      <span>Dalbo</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4.5. Right-Side Mini Window ("Daaqad Yar oo kasoo Baxeysa Midigta") */}
      {isSideCartOpen && cart.length > 0 && (
        <aside
          className="fixed top-18 right-3 sm:right-5 z-40 w-[320px] sm:w-[380px] max-h-[calc(100vh-6rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-300/80 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
          aria-label="Daaqadda Dalabka Khudaarta ee Midigta"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20 text-white">
                <Carrot size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                  <span>Wixii Aad Dalbatay</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-800 text-[10px] font-extrabold">
                    {cartItemCount}
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-100">Daaqadda La-socodka Dalabka Tooska ah</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSideCartOpen(false)}
              className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Qari daaqaddan"
            >
              <X size={16} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 divide-y divide-gray-100 max-h-[290px] sm:max-h-[350px]">
            {cart.map(({ produce, quantity }) => (
              <div
                key={produce.id}
                className="pt-2.5 first:pt-0 flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={produce.image_url}
                    alt={produce.name}
                    className="w-11 h-11 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {produce.somali_name}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      ${produce.price.toFixed(2)} / {produce.unit}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-800">
                      ${(produce.price * quantity).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => addToCart(produce, -1)}
                      className="w-5 h-5 rounded text-gray-600 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                      title="Dhim tirada"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold text-gray-900 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(produce, 1)}
                      className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center cursor-pointer hover:bg-emerald-800 transition-colors"
                      title="Kordhi tirada"
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(produce.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Tirtir"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Real-time Calculations Footer */}
          <div className="p-3.5 bg-gray-50/90 border-t border-gray-200 space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tirada Noocyada:</span>
                <strong className="text-gray-900">{cart.length} nooc ({cartItemCount} xabo/kg)</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Qiimaha Khudaarta:</span>
                <strong className="text-gray-900">${subtotal.toFixed(2)} USD</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Gaadiidka Delivery-ga:</span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Bilaash ($0.00)</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)} USD`
                  )}
                </span>
              </div>
            </div>

            {/* Free delivery prompt */}
            {subtotal < 25 && (
              <div className="p-1.5 rounded-lg bg-emerald-50 text-[10px] text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                <Sparkles size={11} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Ku dar <strong>${(25 - subtotal).toFixed(2)}</strong> kale si aad u hesho <strong>Delivery Bilaash ah!</strong>
                </span>
              </div>
            )}

            {/* Prominent Total Callout */}
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white flex items-center justify-between shadow-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wide">
                  Wadarta Guud (Total)
                </p>
                <p className="text-sm font-extrabold tracking-tight">
                  ${totalAmount.toFixed(2)} USD
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSideCartOpen(false)
                  setIsCartOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 shadow-xs transition-all cursor-pointer"
              >
                <span>Gudbi Dalabka</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Pill on Right-Edge to Toggle Window */}
      {!isSideCartOpen && cart.length > 0 && (
        <button
          type="button"
          onClick={() => setIsSideCartOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xl border-2 border-white transition-all cursor-pointer animate-pulse group"
          title="Fur daaqadda wixii aad dooratay"
        >
          <div className="relative">
            <ShoppingCart size={18} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-gray-900 text-[10px] font-black flex items-center justify-center">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">
              Dalabkaaga Khudaarta
            </p>
            <p className="text-xs font-extrabold">
              ${totalAmount.toFixed(2)} USD
            </p>
          </div>
          <ChevronLeft size={16} className="text-emerald-200 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 5. Checkout & Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Dalabka Khudaarta ({cartItemCount} Nooc)
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Xaqiiji khudaartaada iyo goobta lagugu soo gaarsiinayo
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {lastConfirmedOrder ? (
              /* Success Confirmation View with Order Progress Tracker, USSD Payment & PDF Invoice */
              <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Dalabkaaga Khudaarta Waa La Xaqiijiyay!
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Waxaa lagu diiwaangeliyay tixraaca: <strong className="font-mono text-emerald-700">{lastConfirmedOrder.id}</strong>.
                  </p>
                </div>

                {/* 1. Order Progress Stepper (Xaaladda Dalabkaaga) */}
                <div className="w-full max-w-lg p-4 rounded-xl bg-white border border-gray-200 shadow-2xs text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">
                        Xaaladda Dalabka (Order Progress)
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {lastConfirmedOrder.payment_status === 'Paid'
                          ? 'Tallaabada 3/4: Lacagta waa la bixiyay, diyaarinta ayaa socota'
                          : 'Tallaabada 2/4: Dalabka waa diyaar, sugaya bixinta lacagta'}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2.5 py-1 rounded-full border',
                        lastConfirmedOrder.payment_status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      )}
                    >
                      {lastConfirmedOrder.payment_status === 'Paid' ? '✅ Waa La Bixiyay' : '⏳ Bixi Lacagta Hadda'}
                    </span>
                  </div>

                  {/* 4-Step Visual Progress Bar */}
                  <div className="relative flex items-center justify-between my-3 px-3">
                    {/* Connecting line background */}
                    <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 -z-0" />
                    {/* Filled connecting line */}
                    <div
                      className="absolute left-6 top-3 h-0.5 bg-emerald-600 transition-all duration-500 -z-0"
                      style={{
                        width: lastConfirmedOrder.payment_status === 'Paid' ? '66%' : '33%',
                      }}
                    />

                    {/* Step 1: Dalabka */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 mt-1.5">1. Dalabka</span>
                      <span className="text-[9px] text-gray-400">Waa la helay</span>
                    </div>

                    {/* Step 2: Bixinta Lacagta */}
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all',
                          lastConfirmedOrder.payment_status === 'Paid'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        )}
                      >
                        {lastConfirmedOrder.payment_status === 'Paid' ? '✓' : '2'}
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 mt-1.5">2. Bixinta Lacagta</span>
                      <span className="text-[9px] text-gray-500">
                        {lastConfirmedOrder.payment_status === 'Paid' ? 'Waa bixisan' : 'Toos Mobile-ka'}
                      </span>
                    </div>

                    {/* Step 3: Diyaarinta & Gaadiidka */}
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs',
                          lastConfirmedOrder.payment_status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-200 text-gray-400'
                        )}
                      >
                        3
                      </div>
                      <span className="text-[10px] font-semibold text-gray-700 mt-1.5">3. Gaadiidka</span>
                      <span className="text-[9px] text-gray-400">Jidka ku jira</span>
                    </div>

                    {/* Step 4: Gaarsiinta */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-bold shadow-xs">
                        4
                      </div>
                      <span className="text-[10px] font-semibold text-gray-700 mt-1.5">4. Gaarsiinta</span>
                      <span className="text-[9px] text-gray-400">Gacantaada</span>
                    </div>
                  </div>

                  {/* Payment status notification inside progress card */}
                  {lastConfirmedOrder.payment_status !== 'Paid' ? (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-2 text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} className="text-amber-600 flex-shrink-0" />
                        <span className="text-[11px] leading-tight">
                          Dalabku wuxuu taagan yahay <strong>Bixinta Lacagta</strong>. Taleefankaaga ({lastConfirmedOrder.customer.phone}) waxaa toos loogu soo diri karaa USSD push si aad lacagta ugu bixiso automatic.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-[11px] leading-tight">
                          Lacagtii waa la xaqiijiyay! Tixraaca: <strong>{lastConfirmedOrder.transaction_id || 'EVC-882390'}</strong>. Khudaartaada hadda ayaa loo diyaarinayaa gaadiidka.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Order Summary Box */}
                <div className="w-full max-w-lg p-4 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span className="text-gray-500">Magaca Macmiilka:</span>
                    <strong className="text-gray-900">{lastConfirmedOrder.customer.full_name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span className="text-gray-500">Telefoonka:</span>
                    <strong className="text-gray-900">{lastConfirmedOrder.customer.phone}</strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span className="text-gray-500">Magaalada & Xaafadda:</span>
                    <strong className="text-gray-900">
                      {lastConfirmedOrder.customer.city} - {lastConfirmedOrder.customer.district}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span className="text-gray-500">Qaabka & Xaaladda Lacagta:</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <span>{lastConfirmedOrder.payment_method}</span>
                      {lastConfirmedOrder.payment_status === 'Paid' ? (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Waa La Bixiyay
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Lama Bixin
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Wadarta Guud:</span>
                    <strong className="text-sm font-bold text-emerald-800">
                      ${lastConfirmedOrder.total_amount.toFixed(2)} USD
                    </strong>
                  </div>
                </div>

                {/* 3. Action Buttons Grid */}
                <div className="w-full max-w-lg flex flex-col gap-2 pt-1">
                  {/* Automatic Mobile Payment (USSD Push) Button */}
                  {lastConfirmedOrder.payment_status !== 'Paid' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalOrder(lastConfirmedOrder)
                        setIsPaymentModalOpen(true)
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer ring-2 ring-emerald-500/30"
                    >
                      <Smartphone size={15} />
                      <span>📱 Bixi Lacagta Mobile-ka (USSD Push Toos ah)</span>
                    </button>
                  ) : (
                    <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Lacagta Waa La Bixiyay (TxID: {lastConfirmedOrder.transaction_id || 'EVC-882390'})</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* PDF Invoice Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalOrder(lastConfirmedOrder)
                        setIsInvoiceOpen(true)
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <FileText size={15} />
                      <span>📄 Soo Dejiso / Fiiri PDF Invoice</span>
                    </button>

                    {/* WhatsApp Action Button */}
                    <a
                      href={createWhatsAppLink(lastConfirmedOrder)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Send size={14} />
                      <span>Ku Dir WhatsApp</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setLastConfirmedOrder(null)
                      setIsCartOpen(false)
                    }}
                    className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Xidh Daakadda
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart View */
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Carrot size={30} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Basket-ka khudaartu waa madhan yahay</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Xulo khudaarta aad u baahan tahay si aad ugu darto dalabkaaga.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Xulo Khudaar Hadda
                </button>
              </div>
            ) : (
              /* Normal Cart & Checkout Form */
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Selected Produce Items */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Khudaarta Aad Dooratay
                  </h3>
                  {cart.map(({ produce, quantity }) => (
                    <div
                      key={produce.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={produce.image_url}
                          alt={produce.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{produce.somali_name}</h4>
                          <p className="text-[11px] text-gray-500">
                            ${produce.price.toFixed(2)} / {produce.unit}
                          </p>
                          <span className="text-[11px] font-bold text-emerald-800">
                            Wadarta: ${(produce.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => addToCart(produce, -1)}
                            className="p-1 rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-5 text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(produce, 1)}
                            className="p-1 rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(produce.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Qiimaha Khudaarta (Subtotal):</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery (Gaadiidka keenista):</span>
                    <span className="font-semibold text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">Bilaash ($0.00)</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                    <span>Wadarta Guud:</span>
                    <span className="text-base text-emerald-800">${totalAmount.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* 2. Customer Delivery & User Connection Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        Xogta Macmiilka & Goobta Delivery-ga
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Fadlan xaqiiji magacaaga, taleefankaaga, magaalada iyo xaafadda
                      </p>
                    </div>

                    {user && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                        ✓ Ku xiran User: @{user.username}
                      </span>
                    )}
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Magacaaga oo Buuxa <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Tusaale: Faarax Cali"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Lambarka Taleefanka (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+252 61 XXX XXXX"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City and District (Mandatory as requested) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Magaalada aad joogto <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                        >
                          {SOMALI_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Xaafadda aad ka joogto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerDistrict}
                        onChange={(e) => setCustomerDistrict(e.target.value)}
                        placeholder="Tusaale: Hodan, Waaberi, Kaaraan, Dayniile..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Tilmaam Dheeraad ah oo Guriga / Goobta (Ikhtiyaar)
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Tusaale: Laamiga agtiisa, Fooqa 2-aad ama Masaajidka dhabarkiisa"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  {/* Option to create a new user on the fly if user is not registered */}
                  {!user && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="saveUser"
                          checked={saveAsNewUser}
                          onChange={(e) => setSaveAsNewUser(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="saveUser" className="text-xs font-bold text-gray-900 cursor-pointer">
                          Sameyso User cusub oo xogtaada lagu keydiyo
                        </label>
                      </div>

                      {saveAsNewUser && (
                        <div className="pt-2">
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Email ama Gmail (Loogu talagalay Login-ka)
                          </label>
                          <input
                            type="email"
                            required={saveAsNewUser}
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="macmiil@gmail.com"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                      Qaabka Lacag Bixinta
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('EVC Plus / Zaad / Sahal')}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer',
                          paymentMethod === 'EVC Plus / Zaad / Sahal'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        📱 EVC Plus / Zaad / Sahal
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Kaash marka la keeno (COD)')}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer',
                          paymentMethod === 'Kaash marka la keeno (COD)'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        💵 Kaash marka la keeno
                      </button>
                    </div>
                  </div>

                  {/* Order Progress / Flow Indicator */}
                  <div className="p-3.5 rounded-xl bg-gray-50/90 border border-gray-200/90 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-700" />
                        <span>Xaaladda & Tallaabooyinka Dalabka:</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Tallaabada 1/3 Hadda
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="p-2 rounded-lg bg-emerald-700 text-white font-bold flex flex-col items-center justify-center shadow-2xs">
                        <span>1. Xogtaada & Dalabka</span>
                        <span className="text-[8px] text-emerald-200">Diyaarinta</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold flex flex-col items-center justify-center">
                        <span>2. USSD Push Toos ah</span>
                        <span className="text-[8px] text-emerald-700">Taleefanka gacanta</span>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-600 font-medium flex flex-col items-center justify-center">
                        <span>3. PDF & Gaarsiinta</span>
                        <span className="text-[8px] text-gray-400">Risiidka & Keenis</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      💡 Markaad gujiso <strong>Xaqiiji oo Gudbi Dalabka</strong>, dalabkaaga waa la diiwaangelinayaa, waxaadna toos u helaysaa <strong>USSD Push</strong> taleefankaaga gacanta ku soo dhacaya si automatic ah iyo <strong>PDF Invoice</strong> dhameystiran.
                    </p>
                  </div>

                  {/* Submit Order Button */}
                  <div className="flex items-center justify-between pt-3">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      Madhi Basket-ka
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      <span>Xaqiiji oo Gudbi Dalabka (${totalAmount.toFixed(2)})</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Order History Drawer / Modal */}
      {isOrderHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-700" />
                <h3 className="text-sm font-bold text-gray-900">
                  Taariikhda Dalabyadaada Khudaarta ({orders.length})
                </h3>
              </div>
              <button
                onClick={() => setIsOrderHistoryOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <Carrot size={32} className="mx-auto text-gray-300" />
                  <p className="text-xs">Weli wax dalab ah ma aadan gudbin.</p>
                </div>
              ) : (
                orders.map((ord) => {
                  const getStatusBadge = (status: ProduceOrderStatus) => {
                    switch (status) {
                      case 'Diyaarin':
                        return 'bg-amber-50 text-amber-700 border-amber-200'
                      case 'Gaadiidka ayaa wada':
                        return 'bg-blue-50 text-blue-700 border-blue-200'
                      case 'Waa la keenay':
                        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      default:
                        return 'bg-gray-50 text-gray-700 border-gray-200'
                    }
                  }

                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-200 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900">{ord.id}</span>
                          <span
                            className={cn(
                              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                              getStatusBadge(ord.status)
                            )}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(ord.created_at).toLocaleDateString('so-SO', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p>
                          <strong className="text-gray-800">{ord.customer.full_name}</strong> -{' '}
                          {ord.customer.phone}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          📍 {ord.customer.city} ({ord.customer.district})
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-2 flex items-center justify-between">
                        <span>{ord.items.length} Nooc oo Khudaar ah</span>
                        <strong className="text-xs text-emerald-800 font-bold">
                          ${ord.total_amount.toFixed(2)} USD
                        </strong>
                      </div>

                      {/* Quick Action Buttons for previous orders */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                        {ord.payment_status !== 'Paid' && ord.payment_method === 'EVC Plus / Zaad / Sahal' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveModalOrder(ord)
                              setIsPaymentModalOpen(true)
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <Smartphone size={12} />
                            <span>📱 Bixi Hadda</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalOrder(ord)
                            setIsInvoiceOpen(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <FileText size={12} />
                          <span>📄 PDF Invoice</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. PDF Invoice & Payment Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={activeModalOrder || lastConfirmedOrder}
      />

      {/* 8. USSD Mobile Money Payment Modal (Automatic Push Simulator) */}
      <MobilePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={activeModalOrder || lastConfirmedOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
