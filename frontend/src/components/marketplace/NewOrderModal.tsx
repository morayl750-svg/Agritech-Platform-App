import { useState } from 'react'
import {
  X,
  PackageCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  ListOrdered,
  Download,
  Printer,
} from 'lucide-react'
import type { Product, MarketplaceOrder, OrderStatus } from '@/types'
import { exportOrdersToCSV, printOrderInvoice } from '@/utils/exportUtils'

interface NewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  orders: MarketplaceOrder[]
  onCreateOrder: (order: MarketplaceOrder) => void
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void
}

export function NewOrderModal({
  isOpen,
  onClose,
  products,
  orders,
  onCreateOrder,
  onUpdateOrderStatus,
}: NewOrderModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')

  // Create order state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '')
  const [quantity, setQuantity] = useState<number>(1)
  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [location, setLocation] = useState<string>('Muqdisho')
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Pending')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0]
  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const newOrder: MarketplaceOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: customerName.trim() || 'Amina Barre',
      customer_phone: customerPhone.trim() || '+252 61 555 0000',
      location: location || 'Muqdisho',
      total_amount: totalAmount,
      status: orderStatus,
      items: [
        {
          product: selectedProduct,
          quantity: quantity,
        },
      ],
      created_at: new Date().toISOString(),
    }

    onCreateOrder(newOrder)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      setActiveTab('list')
    }, 1500)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={10} /> Completed
          </span>
        )
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock size={10} /> Processing
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle size={10} /> Pending
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gray-900 text-white shadow-2xs">
              <PackageCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">New Order & Management</h2>
              <p className="text-xs text-gray-500">Kee jar ama maamul dalabyada beerta & suuqa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-gray-100 bg-gray-50/30">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <PlusCircle size={14} />
            <span>Dalab Cusub (Create Order)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'list'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ListOrdered size={14} />
            <span>Dalabyada La Sameeyay ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Create New Order */}
        {activeTab === 'create' ? (
          <div className="flex-1 overflow-y-auto p-6">
            {isSuccess ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Dalabka cusub si guul leh ayaa loo jartay!</h3>
                <p className="text-xs text-gray-500">Waxaa si toos ah loogu daray liiska Orders-ka.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Dooro Alaabta (Select Product from Catalog)
                  </label>
                  <div className="relative">
                    <ShoppingBag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — USD ${p.price.toFixed(2)} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity & Unit Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Tirada (Quantity)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Warta Lacagta (Total USD)
                    </label>
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-emerald-700">
                      USD ${totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Magaca Macmiilka (Customer Name)
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Cumar Xasan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
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
                        placeholder="+252 61 700 8899"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Deegaanka / Gobolka
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 cursor-pointer"
                      >
                        <option value="Muqdisho">Muqdisho (Banaadir)</option>
                        <option value="Hargeysa">Hargeysa (Woqooyi Galbeed)</option>
                        <option value="Baydhabo">Baydhabo (Bay)</option>
                        <option value="Boosaaso">Boosaaso (Bari)</option>
                        <option value="Kismaayo">Kismaayo (Jubbada Hoose)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Xaaladda Dalabka (Order Status)
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 cursor-pointer"
                    >
                      <option value="Pending">Pending (Lagu dhex jiro)</option>
                      <option value="Processing">Processing (Waa loo diray)</option>
                      <option value="Completed">Completed (Waa la wareejiyay)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Kansal (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Jartaa Dalabka (Process Order)
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Tab 2: Orders List */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.length > 0 && (
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-700">
                  Dhamaan Dalabyada ({orders.length})
                </span>
                <button
                  type="button"
                  onClick={() => exportOrdersToCSV(orders)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                  title="Export orders list to Excel / CSV"
                >
                  <Download size={13} className="text-emerald-600" />
                  <span>Export to Excel (CSV)</span>
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <ListOrdered className="mx-auto mb-2" size={32} />
                <p className="text-xs font-medium">Wali dalabyo ma jiraan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{ord.id}</span>
                        {getStatusBadge(ord.status)}
                      </div>
                      <p className="text-xs font-semibold text-gray-800">
                        {ord.customer_name} ({ord.customer_phone})
                      </p>
                      <p className="text-[11px] text-gray-500">
                        📍 {ord.location} — {ord.items.length || 1} item(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-700 block">
                          USD ${ord.total_amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Print Receipt Button */}
                      <button
                        type="button"
                        onClick={() => printOrderInvoice(ord)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                        title="Print Order Invoice / PDF Receipt"
                      >
                        <Printer size={15} />
                      </button>

                      {onUpdateOrderStatus && (
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="text-[10px] bg-gray-50 border border-gray-200 rounded-md px-2 py-1 font-semibold text-gray-700 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
