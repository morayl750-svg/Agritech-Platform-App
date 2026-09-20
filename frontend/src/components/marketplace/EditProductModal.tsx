import { useState, useEffect, type FormEvent } from 'react'
import {
  X,
  Edit,
  Save,
  CheckCircle2,
  Bug,
  DollarSign,
  Package,
  Store,
  FlaskConical,
  Sprout,
  Clock,
  Droplets,
  ShieldAlert,
  Image,
} from 'lucide-react'
import type { EditProductModalProps, ProductCategory, Product } from '@/types'

const CATEGORY_OPTIONS: Exclude<ProductCategory, 'All'>[] = [
  'Sunta Cayayaanka',
  'Sunta Boqoshaada',
  'Sunta Haramaanka',
  'Qalabka Buufinta',
  'Seeds',
  'Tools',
  'Fertilizers',
]

export function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Exclude<ProductCategory, 'All'>>('Sunta Cayayaanka')
  const [unit, setUnit] = useState('1 Litir (Dhalo)')
  const [stock, setStock] = useState('50')
  const [sellerName, setSellerName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [targetPest, setTargetPest] = useState('')
  const [activeIngredient, setActiveIngredient] = useState('')
  const [dosage, setDosage] = useState('')
  const [suitableCrops, setSuitableCrops] = useState('')
  const [waitingPeriod, setWaitingPeriod] = useState('')
  const [applicationMethod, setApplicationMethod] = useState('')
  const [safetyWarning, setSafetyWarning] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  // Sync state whenever product changes
  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setDescription(product.description || '')
      setPrice(String(product.price || ''))
      setCategory(
        (product.category as Exclude<ProductCategory, 'All'>) || 'Sunta Cayayaanka'
      )
      setUnit(product.unit || '1 Litir (Dhalo)')
      setStock(String(product.stock || '50'))
      setSellerName(product.seller_name || '')
      setImageUrl(product.image_url || '')
      setTargetPest(product.target_pest || '')
      setActiveIngredient(product.active_ingredient || '')
      setDosage(product.dosage || '')
      setSuitableCrops(product.suitable_crops || '')
      setWaitingPeriod(product.waiting_period || '')
      setApplicationMethod(product.application_method || '')
      setSafetyWarning(product.safety_warning || '')
      setSuccessMessage(false)
    }
  }, [product, isOpen])

  if (!isOpen || !product) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price) return

    setIsSubmitting(true)

    const updated: Product = {
      ...product,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || product.price,
      category,
      unit: unit.trim() || product.unit,
      stock: parseInt(stock, 10) || 0,
      seller_name: sellerName.trim() || product.seller_name,
      image_url: imageUrl.trim() || product.image_url,
      target_pest: targetPest.trim(),
      active_ingredient: activeIngredient.trim(),
      dosage: dosage.trim(),
      suitable_crops: suitableCrops.trim(),
      waiting_period: waitingPeriod.trim(),
      application_method: applicationMethod.trim(),
      safety_warning: safetyWarning.trim(),
    }

    onSuccess(updated)
    setSuccessMessage(true)
    setIsSubmitting(false)

    setTimeout(() => {
      onClose()
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      aria-label="Modal overlay"
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl my-auto flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Edit size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Wax ka beddel Sunta: {product.name}
              </h3>
              <p className="text-[10px] text-gray-500">
                Cusboonaysii qiimaha, xogta farsamada, beegsiga cayayaanka iyo badbaadada
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Xogta suntaan si guul leh ayaa loo cusboonaysiiyay!</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-100">
              <Package size={14} className="text-emerald-700" />
              <span>1. Xogta Aasaasiga ah ee Sunta</span>
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Magaca Sunta / Daawada <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tusaale: Beltas 100EC (Sunta Diirka Galayda)"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Qeybta (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Exclude<ProductCategory, 'All'>)
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Qiimaha USD ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="24.50"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Cabbirka / Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="1 Litir (Dhalo), 1 kg Baakad..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Tirada Keydka (Stock Available)
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Iibiyaha / Ganacsadaha (Seller / Dealer)
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="Tusaale: Somali Agro-Chemicals (Afgooye)"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Agricultural Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-100">
              <FlaskConical size={14} className="text-emerald-700" />
              <span>2. Astaamaha Farsamada & Isticmaalka Beerta</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Cayayaanka & Cudurrada ay Disho (Target Pests)
                </label>
                <input
                  type="text"
                  value={targetPest}
                  onChange={(e) => setTargetPest(e.target.value)}
                  placeholder="Tusaale: Diirka Galayda, Ayaxa, Miridha..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Maadada Firfircoon (Active Ingredient)
                </label>
                <input
                  type="text"
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                  placeholder="Tusaale: Emamectin Benzoate 5% + Cypermethrin"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Qiyaasta Buufinta (Dosage)
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Tusaale: 25ml halkii 16L biyo ah"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Dalagyada Ku Habboon (Suitable Crops)
                </label>
                <input
                  type="text"
                  value={suitableCrops}
                  onChange={(e) => setSuitableCrops(e.target.value)}
                  placeholder="Tusaale: Galeyda, Tamaandhada, Basasha, Qaraha..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Muddada Sugitaanka Kahor Goynta (PHI)
                </label>
                <input
                  type="text"
                  value={waitingPeriod}
                  onChange={(e) => setWaitingPeriod(e.target.value)}
                  placeholder="Tusaale: 7 Maalmood kahor intaan la goosan"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Qaabka Loo Isticmaalo (Application Method)
                </label>
                <input
                  type="text"
                  value={applicationMethod}
                  onChange={(e) => setApplicationMethod(e.target.value)}
                  placeholder="Tusaale: Buufinta caleemaha aroortii hore"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Safety & Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-100">
              <ShieldAlert size={14} className="text-emerald-700" />
              <span>3. Badbaadada, Sawirka & Faahfaahinta</span>
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Digniinta Badbaadada (Safety Warning)
              </label>
              <input
                type="text"
                value={safetyWarning}
                onChange={(e) => setSafetyWarning(e.target.value)}
                placeholder="Tusaale: Xidho maaskarada iyo galoofisyada. Ka fogee carruurta."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Sawirka URL (Image URL)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Faahfaahinta Guud ee Sunta (Full Description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Faahfaahin dheeraad ah oo ku saabsan tayada, waxqabadka, iyo cudurrada ay daweyso..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Ka Noqo
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSubmitting ? 'Keydinayaa...' : 'Keydi Wax-ka-beddelka'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
