import { useState } from 'react'
import { Search, Plus, X, PackageCheck, ShoppingCart, ShieldAlert, Sparkles, ArrowRight, Bug } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { AddProductModal } from '@/components/marketplace/AddProductModal'
import { CartModal } from '@/components/marketplace/CartModal'
import { NewOrderModal } from '@/components/marketplace/NewOrderModal'
import { ProductDetailModal } from '@/components/marketplace/ProductDetailModal'
import { EditProductModal } from '@/components/marketplace/EditProductModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProducts } from '@/hooks/useProducts'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import type { ProductCategory, Product, CartItem, MarketplaceOrder, OrderStatus } from '@/types'

const CATEGORIES: ProductCategory[] = [
  'All',
  'Sunta Cayayaanka',
  'Sunta Boqoshaada',
  'Sunta Haramaanka',
  'Qalabka Buufinta',
]

export default function Marketplace() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null)

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Orders list state
  const [ordersList, setOrdersList] = useState<MarketplaceOrder[]>([
    {
      id: 'ORD-1042',
      customer_name: 'Faarax Cali',
      customer_phone: '+252 61 511 2233',
      location: 'Muqdisho (Banaadir)',
      total_amount: 44.0,
      status: 'Pending',
      items: [],
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'ORD-1041',
      customer_name: 'Foosiya Maxamed',
      customer_phone: '+252 63 444 8899',
      location: 'Hargeysa',
      total_amount: 84.0,
      status: 'Completed',
      items: [],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ])

  const { products, isLoading, refetch, addProduct, updateProduct } = useProducts(
    selectedCategory,
    searchQuery
  )

  // Calculate total items quantity in cart
  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Handle successful creation of a new product
  function handleProductAdded(newProduct?: Product) {
    if (newProduct) {
      addProduct(newProduct)
    }
    refetch()
  }

  // Handle successful update of an existing product
  function handleProductUpdated(updatedProduct: Product) {
    updateProduct(updatedProduct)
    if (selectedProductForDetail?.id === updatedProduct.id) {
      setSelectedProductForDetail(updatedProduct)
    }
    refetch()
  }

  // Add product to cart with custom quantity
  function handleAddToCart(product: Product, quantity: number = 1) {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }
      return [...prev, { product, quantity }]
    })
  }

  // Update item quantity in cart
  function handleUpdateQuantity(productId: string, delta: number) {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  // Remove single item from cart
  function handleRemoveItem(productId: string) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  // Clear all items from cart
  function handleClearCart() {
    setCartItems([])
  }

  // Place a new order from cart
  function handlePlaceOrder(newOrder: MarketplaceOrder) {
    setOrdersList((prev) => [newOrder, ...prev])
  }

  // Create order manually from NewOrderModal
  function handleCreateManualOrder(newOrder: MarketplaceOrder) {
    setOrdersList((prev) => [newOrder, ...prev])
  }

  // Update order status
  function handleUpdateOrderStatus(orderId: string, status: OrderStatus) {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 items-stretch">
      {/* 1. Add Product Admin Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleProductAdded}
      />

      {/* 2. Interactive Cart Items Modal / Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* 3. New Order & Order History Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        products={products}
        orders={ordersList}
        onCreateOrder={handleCreateManualOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* 4. Product Detail & In-Depth Agriculture Specifications Modal */}
      <ProductDetailModal
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        product={selectedProductForDetail}
        onAddToCart={handleAddToCart}
        onEditProduct={
          isAdmin
            ? (prod) => {
                setSelectedProductForDetail(null)
                setSelectedProductForEdit(prod)
              }
            : undefined
        }
      />

      {/* 5. Edit Pesticide Product Modal */}
      {isAdmin && (
        <EditProductModal
          isOpen={Boolean(selectedProductForEdit)}
          onClose={() => setSelectedProductForEdit(null)}
          product={selectedProductForEdit}
          onSuccess={handleProductUpdated}
        />
      )}

      {/* Full-width Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bug className="text-emerald-700" size={20} />
            Suuqa Sunta Cayayaanka & Daryeelka Dalagyada
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Suuq khaas ah: Sunta diirka galayda, ayaxa, boqoshaada, haramaanka, iyo qalabka buufinta beeraha
          </p>
        </div>

        {/* Action Bar: Add Product | New Order | Cart Items */}
        <div className="flex items-center gap-2">
          {/* + Add Product Button (Only visible to Mohamed Rayl Admin) */}
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <Plus size={14} />
              <span>+ Ku Dar Sun Cusub</span>
            </button>
          )}

          {/* New Order Button */}
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-2xs"
            title="Create or manage orders"
          >
            <PackageCheck size={14} />
            <span>Dalabyada (Orders)</span>
          </button>

          {/* Cart Items Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 shadow-2xs cursor-pointer transition-colors"
            title="View items in your cart"
          >
            <ShoppingCart size={14} className="text-gray-700" />
            <span>Kiro/Cart</span>
            <span className="w-5 h-5 rounded-md bg-gray-900 text-white flex items-center justify-center text-[11px] font-semibold">
              {totalCartQuantity}
            </span>
          </button>
        </div>
      </div>

      {/* Prominent Banners: 1. Safety Advisory, 2. Fast link to Fresh Produce */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {/* Safety Warning for Pesticides */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
            <ShieldAlert size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">Digniinta Badbaadada Sunta Kimikada:</h4>
            <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
              Mar kasta xidho maaskarada iyo galoofisyada xilliga buufinta. Hubi qiyaasta saxda ah (dosage) si aadan u waxyeellayn dalagga.
            </p>
          </div>
        </div>

        {/* Link to Dedicated Vegetable Ordering Market */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Ma doonaysaa inaad dalbato Khudaar Cusub?</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Tamaandho, Basal, Baradho, Moos iyo miro toos beeraha looga keenay.
              </p>
            </div>
          </div>
          <Link
            to="/khudaar"
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Dalbo Khudaar</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Search & Vercel-Style Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* Search Bar Input */}
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Tabs (Vercel style) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-semibold border border-gray-200/80'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Product Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center w-full bg-white flex flex-col items-center justify-center">
          <ShoppingBag className="text-gray-300 mb-2" size={32} />
          <h3 className="text-sm font-medium text-gray-900">No products found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            No agricultural items match your selected category or search query.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Add First Product
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={(prod) => setSelectedProductForDetail(prod)}
              onEditProduct={(prod) => setSelectedProductForEdit(prod)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
