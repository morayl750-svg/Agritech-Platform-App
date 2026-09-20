import { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { CartItem, MarketplaceOrder } from '@/types'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onPlaceOrder: (order: MarketplaceOrder) => void
}

export function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}: CartModalProps) {
  const { user } = useAuth()
  const [customerName, setCustomerName] = useState(user?.full_name || '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '')
  const [location, setLocation] = useState(user?.city || 'Muqdisho')
  const [district, setDistrict] = useState(user?.district || 'Hodan')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name || '')
      if (!customerPhone) setCustomerPhone(user.phone || '')
      if (user.city) setLocation(user.city)
      if (user.district) setDistrict(user.district)
    }
  }, [user])

  if (!isOpen) return null

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) return

    const deliveryAddress = district ? `${location} (${district})` : location

    const newOrder: MarketplaceOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: customerName.trim() || user?.full_name || 'Beeraley',
      customer_phone: customerPhone.trim() || user?.phone || '+252 61 555 1234',
      location: deliveryAddress,
      total_amount: subtotal,
      status: 'Pending',
      items: [...cartItems],
      created_at: new Date().toISOString(),
    }

    onPlaceOrder(newOrder)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      onClearCart()
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
              <p className="text-xs text-gray-500">Dhamaan alaabta aad ka dooratay suuqa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Dalabkaaga waa la gudbiyay!</h3>
            <p className="text-xs text-gray-500 max-w-xs">
              Dalabkaaga waxaa lagu daray liiska New Orders. Ganacsadaha ayaa kula soo xiriiri doona toos.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Basket-kaaga waa madhan yahay</h3>
            <p className="text-xs text-gray-500">Kee ka dooro alaabta suuqa si aad ugu darto cart-ka.</p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold cursor-pointer"
            >
              Kala Eeg Suuqyada
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200/80 bg-white hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-medium">
                        {product.category}
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{product.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        USD ${product.price.toFixed(2)} {product.unit ? `/ ${product.unit}` : ''}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        USD ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg p-1 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="p-1 rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-gray-900 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="p-1 rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Clear item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Price Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Warta Isku-gayn (Total):</span>
              <span className="text-base font-extrabold text-emerald-700">
                USD ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Customer Details & Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 tracking-wide uppercase">
                Xogta Dalabka & Delivery-ga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Magaca Macmiilka (Name)
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Amina Barre"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Telefoonka (Phone)
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="+252 61 555 1234"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Magaalada (City)
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Muqdisho">Muqdisho (Banaadir)</option>
                      <option value="Hargeysa">Hargeysa</option>
                      <option value="Baydhabo">Baydhabo</option>
                      <option value="Boosaaso">Boosaaso</option>
                      <option value="Garoowe">Garoowe</option>
                      <option value="Kismaayo">Kismaayo</option>
                      <option value="Jowhar">Jowhar</option>
                      <option value="Afgooye">Afgooye</option>
                      <option value="Beledweyne">Beledweyne</option>
                      <option value="Dhusamareeb">Dhusamareeb</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Xaafadda (District / Area)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tusaale: Hodan, Waaberi, Kaaraan..."
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  Clear Cart
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Gudbi Dalabka (Place Order)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
