import { useState } from 'react'
import { ShoppingBag, Package, Store, Edit, Info, ArrowRight, MessageSquare, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ProductCardProps } from '@/types'
import PaymentModal from '@/components/marketplace/PaymentModal'

export function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onEditProduct,
}: ProductCardProps) {
  const navigate = useNavigate()
  const [showPayment, setShowPayment] = useState(false)

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/messages`)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between group relative">
      <div>
        {/* Top Image Thumbnail Container with Click to Details & Edit Button */}
        <div
          onClick={() => onViewDetails?.(product)}
          className="relative w-full h-44 rounded-lg overflow-hidden bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-3 cursor-pointer group/img"
          title="Riix si aad gudaha ugu gasho macluumaadka suntaan"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Package size={32} />
              <span className="text-[10px] mt-1 font-medium text-gray-400">Specimen Spec</span>
            </div>
          )}

          {/* Category Badge */}
          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
            {product.category}
          </span>

          {/* Quick Edit Button */}
          {onEditProduct && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEditProduct(product)
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/95 backdrop-blur-xs text-gray-700 hover:text-emerald-700 hover:bg-white border border-gray-200 shadow-2xs transition-all cursor-pointer opacity-90 group-hover:opacity-100"
              title="Wax ka beddel suntaan (Edit)"
            >
              <Edit size={13} />
            </button>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-[10px] font-medium flex items-center justify-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
            <Info size={11} />
            <span>Gudaha u gal si aad wax badan uga ogaato</span>
          </div>
        </div>

        {/* Title & Seller */}
        <h3
          onClick={() => onViewDetails?.(product)}
          className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-800 transition-colors cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-between">
          <span className="flex items-center gap-1 truncate">
            <Store size={12} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{product.seller_name}</span>
          </span>
          <button
            type="button"
            onClick={handleChat}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer shrink-0 ml-1"
            title="Wadahadal toos ah la yeelo beeraleyda"
          >
            <MessageSquare size={11} />
            <span>Chat</span>
          </button>
        </p>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Target Pests & Ingredients if available */}
        {product.target_pest && (
          <div className="mt-2.5 pt-2 border-t border-gray-100/80 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-100">
              <span className="font-semibold">Beegsiga:</span>
              <span className="truncate">{product.target_pest}</span>
            </div>
            {product.dosage && (
              <p className="text-[10px] text-gray-500 truncate">
                <span className="font-medium text-gray-600">Qiyaasta:</span> {product.dosage}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Price & Actions */}
      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block">
            Qiimaha
          </span>
          <p className="text-sm font-bold text-gray-900 font-mono">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Pay with EVC / Zaad */}
          <button
            type="button"
            onClick={() => setShowPayment(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
            title="Ku bixi EVC Plus ama Zaad"
          >
            <CreditCard size={11} />
            <span>Iibso</span>
          </button>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs transition-colors cursor-pointer"
            title="Ku dar Gaarigacan/Cart"
          >
            <ShoppingBag size={11} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Mobile Payment Modal */}
      {showPayment && (
        <PaymentModal
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            unit: 'item',
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
