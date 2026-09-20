import { useState } from 'react'
import {
  X,
  ShoppingBag,
  Store,
  ShieldAlert,
  Bug,
  FlaskConical,
  Sprout,
  Clock,
  Droplets,
  Edit,
  Send,
  CheckCircle2,
  Package,
  Plus,
  Minus,
} from 'lucide-react'
import type { ProductDetailModalProps } from '@/types'

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onEditProduct,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)

  if (!isOpen || !product) return null

  const handleAdd = () => {
    onAddToCart?.(product, quantity)
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2000)
  }

  // Create WhatsApp consultation link
  const createWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Asc Khuburada AgriSmart, waxaan doonayaa inaan su'aal ka weydiiyo sunta/daawada: *${product.name}* (Qiimaha: $${product.price} USD). Fadlan ma iiga faahfaahin kartaa habka ugu fiican ee aan beertayda ugu isticmaali karo? Mahadsanidiin.`
    )
    return `https://wa.me/252615550192?text=${text}`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      aria-label="Modal overlay"
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl my-auto flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Bug size={16} />
            </span>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Edit Button in Header */}
            {onEditProduct && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onEditProduct(product)
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-white hover:border-emerald-500 hover:text-emerald-700 text-xs font-semibold transition-all cursor-pointer"
                title="Wax ka beddel suntaan"
              >
                <Edit size={13} />
                <span className="hidden sm:inline">Wax ka beddel</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
              title="Xidh daaqadda"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Image, Price, & Actions (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              {/* Product Image */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-2xs flex items-center justify-center group">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Package size={44} />
                    <span className="text-xs mt-2 font-medium">Sawir Ma Jiro</span>
                  </div>
                )}

                <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
                  {product.unit || '1 Litir'}
                </span>
              </div>

              {/* Price & Stock Card */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
                      Qiimaha Iibka
                    </span>
                    <span className="text-xl font-extrabold text-emerald-800 font-mono">
                      ${Number(product.price).toFixed(2)} USD
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✅ Keydka: {product.stock} xabo
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1 border-t border-gray-200/70">
                  <Store size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Iibiyaha:</strong> {product.seller_name || 'AgriSmart Vendor'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                      title="Dhim tirada"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center cursor-pointer hover:bg-emerald-800 transition-colors"
                      title="Kordhi tirada"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Ku Dar Kiro (${(product.price * quantity).toFixed(2)})</span>
                  </button>
                </div>

                {addedNotice && (
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Si guul leh ayaa loogu daray Gaarigacan/Cart!</span>
                  </div>
                )}

                {/* WhatsApp Agronomist Consultation */}
                <a
                  href={createWhatsAppInquiry()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold border border-[#25D366]/30 transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>La Tasho Khabiirka Beeraha (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* Right Column: Deep Technical Specs & Instructions (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 mb-1.5">
                  Faahfaahinta Guud ee Sunta / Daawada
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-900">
                  Astaamaha Farsamo & Macluumaadka Beeraleyda
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Active Ingredient */}
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                      <FlaskConical size={14} className="text-blue-700" />
                      <span>Maadada Firfircoon:</span>
                    </div>
                    <p className="text-blue-800 text-[11px] font-medium leading-tight">
                      {product.active_ingredient || 'Chemical formulation standard'}
                    </p>
                  </div>

                  {/* Target Pests */}
                  <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                    <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                      <Bug size={14} className="text-rose-700" />
                      <span>Cayayaanka ay Disho:</span>
                    </div>
                    <p className="text-rose-800 text-[11px] font-medium leading-tight">
                      {product.target_pest || 'Dhammaan cayayaanka dalagyada waxyeelleeya'}
                    </p>
                  </div>

                  {/* Dosage */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                      <Droplets size={14} className="text-amber-700" />
                      <span>Qiyaasta Buufinta (Dosage):</span>
                    </div>
                    <p className="text-amber-800 text-[11px] font-medium leading-tight">
                      {product.dosage || '25ml - 40ml halkii 16L biyo ah'}
                    </p>
                  </div>

                  {/* Suitable Crops */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                      <Sprout size={14} className="text-emerald-700" />
                      <span>Dalagyada Ku Habboon:</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] font-medium leading-tight">
                      {product.suitable_crops || 'Galeyda, Masagada, Tamaandhada, Basasha, Qaraha'}
                    </p>
                  </div>

                  {/* Waiting Period (PHI) */}
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
                    <div className="flex items-center gap-1.5 text-purple-900 font-bold mb-1">
                      <Clock size={14} className="text-purple-700" />
                      <span>Muddada Sugitaanka (PHI):</span>
                    </div>
                    <p className="text-purple-800 text-[11px] font-medium leading-tight">
                      {product.waiting_period || '7 Maalmood kahor intaan dalagga la goosan'}
                    </p>
                  </div>

                  {/* Application Method */}
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-1.5 text-gray-900 font-bold mb-1">
                      <Droplets size={14} className="text-gray-700" />
                      <span>Qaabka Loo Isticmaalo:</span>
                    </div>
                    <p className="text-gray-700 text-[11px] font-medium leading-tight">
                      {product.application_method || 'Buufinta caleemaha (Foliar Spray) aroortii hore'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Advisory Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ShieldAlert size={15} className="text-amber-700" />
                  <span>Digniinta Badbaadada & Caafimaadka Beeraleyda:</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  {product.safety_warning ||
                    'Mar kasta xidho maaskaro iyo galoofisyo xilliga buufinta. Ka fogee carruurta, xoolaha iyo ilaha biyaha la cabbo. Gacmaha si fiican ugu maydh saabuun.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white transition-colors cursor-pointer"
          >
            Xidh Daakadda
          </button>

          {onEditProduct && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onEditProduct(product)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Edit size={13} />
              <span>Wax ka beddel Suntaan (Edit)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
