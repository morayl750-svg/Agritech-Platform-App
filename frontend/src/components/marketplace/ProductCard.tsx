import { ShoppingBag, Package, Store } from 'lucide-react'
import type { ProductCardProps } from '@/types'

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between group">
      <div>
        {/* Top Image Thumbnail Container */}
        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-3">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Package size={32} />
              <span className="text-[10px] mt-1 font-medium text-gray-400">Specimen Spec</span>
            </div>
          )}

          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
            {product.category}
          </span>
        </div>

        {/* Title & Seller */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <Store size={12} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{product.seller_name}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer Price & Sleek Add to Cart Action */}
      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Price</span>
          <p className="text-sm font-semibold text-gray-900">
            USD ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => onAddToCart?.(product)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-2xs"
          title="Add to cart"
        >
          <ShoppingBag size={13} />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}
