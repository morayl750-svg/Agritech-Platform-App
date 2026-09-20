import { useState, type FormEvent } from 'react'
import { X, Loader2, PlusCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { AddProductModalProps, ProductCategory } from '@/types'

const CATEGORY_OPTIONS: Exclude<ProductCategory, 'All'>[] = [
  'Sunta Cayayaanka',
  'Sunta Boqoshaada',
  'Sunta Haramaanka',
  'Qalabka Buufinta',
  'Seeds',
  'Tools',
  'Fertilizers',
]

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Exclude<ProductCategory, 'All'>>('Sunta Cayayaanka')
  const [stock, setStock] = useState('10')
  const [imageUrl, setImageUrl] = useState('')
  const [targetPest, setTargetPest] = useState('')
  const [activeIngredient, setActiveIngredient] = useState('')
  const [dosage, setDosage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !price) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10) || 0,
        image_url: imageUrl.trim() || null,
        seller_name: 'AgriSmart Admin',
        unit: '1 Litir (Dhalo)',
        target_pest: targetPest.trim() || undefined,
        active_ingredient: activeIngredient.trim() || undefined,
        dosage: dosage.trim() || undefined,
      }

      let createdProduct: any = null

      if (supabase) {
        const { data, error: err } = await supabase
          .from('products')
          .insert([payload])
          .select()

        if (!err && data && data.length > 0) {
          createdProduct = data[0]
        } else if (err) {
          console.warn('[Supabase product insert notice]', err.message)
        }
      }

      if (!createdProduct) {
        createdProduct = {
          id: `prod-${Date.now()}`,
          ...payload,
          image_url:
            imageUrl.trim() ||
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
          created_at: new Date().toISOString(),
        }
      }

      onSuccess(createdProduct)
      onClose()

      // Reset form
      setName('')
      setDescription('')
      setPrice('')
      setCategory('Seeds')
      setStock('10')
      setImageUrl('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to insert product into Supabase'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
      aria-label="Modal overlay"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <PlusCircle size={18} className="text-gray-900" />
              Add New Product
            </h2>
            <p className="text-xs text-gray-500">Insert item directly into Supabase catalog</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {submitError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drought-Resistant Sorghum Seeds 10kg"
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Description *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product description or specification…"
              className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<ProductCategory, 'All'>)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">
                Cayayaanka ay Disho (Target Pests)
              </label>
              <input
                type="text"
                value={targetPest}
                onChange={(e) => setTargetPest(e.target.value)}
                placeholder="e.g., Diirka Galayda, Ayaxa, Caaryada..."
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Maadada Firfircoon (Active Ingredient)
                </label>
                <input
                  type="text"
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                  placeholder="e.g., Emamectin Benzoate..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Qiyaasta Buufinta (Dosage)
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 25ml halkii 16L biyo ah"
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
