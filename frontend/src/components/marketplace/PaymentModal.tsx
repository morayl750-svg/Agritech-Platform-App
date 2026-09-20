import { useState } from 'react'
import {
  CreditCard,
  Phone,
  CheckCircle2,
  Loader2,
  X,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'
import { initiatePayment, type PaymentMethod } from '@/lib/paymentApi'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'

interface Product {
  id: string
  name: string
  price: number
  unit?: string
}

interface PaymentModalProps {
  product: Product
  onClose: () => void
  onSuccess?: (reference: string) => void
}

const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  badge: string
  color: string
  description: string
}[] = [
  {
    value: 'evc_plus',
    label: 'EVC Plus',
    badge: 'Hormuud',
    color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    description: 'Lacag-bixinta degdegga ah ee Koonfurta & Bartamaha Soomaaliya',
  },
  {
    value: 'zaad',
    label: 'Zaad Service',
    badge: 'Telesom',
    color: 'border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-300',
    description: 'Lacag-bixinta Somaliland & Gobollada Waqooyi',
  },
  {
    value: 'amiin',
    label: 'Amiin Money',
    badge: 'Amal Bank',
    color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
    description: 'Adeegga Bangiga Amal ee Puntland & Soomaaliya oo dhan',
  },
  {
    value: 'cash',
    label: 'Lacag Caddaan (Cash on Delivery)',
    badge: 'Gacanta',
    color: 'border-gray-400 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300',
    description: 'Bixi lacagta marka alaabtu kuu timaado',
  },
]

export default function PaymentModal({ product, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('evc_plus')
  const [form, setForm] = useState({ buyerName: '', phoneNumber: '', quantity: 1 })
  const [result, setResult] = useState<{ reference: string; message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalAmount = product.price * (form.quantity || 1)

  const handlePay = async () => {
    if (!form.buyerName.trim() || !form.phoneNumber.trim()) {
      setError('Fadlan magacaaga iyo lambarka telefoonka buuxi.')
      return
    }
    setError(null)
    setStep('processing')

    try {
      const payResult = await initiatePayment({
        amount: totalAmount,
        currency: 'USD',
        phoneNumber: form.phoneNumber.trim(),
        paymentMethod: selectedMethod,
        productName: product.name,
        buyerName: form.buyerName.trim(),
      })

      // Save order to Supabase
      await supabase.from('orders').insert({
        product_id: product.id.startsWith('temp-') ? null : product.id,
        product_name: product.name,
        quantity: Number(form.quantity),
        unit_price: product.price,
        total_amount: totalAmount,
        currency: 'USD',
        buyer_name: form.buyerName.trim(),
        buyer_phone: form.phoneNumber.trim(),
        payment_method: selectedMethod,
        payment_status: 'completed',
        payment_reference: payResult.reference,
        paid_at: payResult.timestamp,
      })

      setResult({ reference: payResult.reference, message: payResult.message })
      setStep('success')
      onSuccess?.(payResult.reference)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lacag-bixintu way fashilantay'
      setError(msg)
      setStep('details')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Lacag-bixinta Mobaylka
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                EVC Plus, Zaad & Amiin Money
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Product Summary Pill */}
          <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                📦
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                  {product.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                  ${product.price} {product.unit ? `/ ${product.unit}` : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                Wadarta: ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* STEP 1: Select Payment Method */}
          {step === 'method' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
                Dooro Habka Lacag-bixinta
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => {
                  const isSelected = selectedMethod === m.value
                  return (
                    <button
                      type="button"
                      key={m.value}
                      onClick={() => setSelectedMethod(m.value)}
                      className={cn(
                        'w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer',
                        isSelected
                          ? m.color
                          : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      )}
                    >
                      <div className="p-1.5 rounded-xl bg-gray-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{m.label}</p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 font-medium">
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5">
                          {m.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all cursor-pointer mt-2"
              >
                U Gudub Tallaabada Xigta →
              </button>
            </div>
          )}

          {/* STEP 2: Buyer & Payment Details */}
          {step === 'details' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                  Magacaaga Buuxa
                </label>
                <input
                  type="text"
                  required
                  value={form.buyerName}
                  onChange={(e) => setForm((p) => ({ ...p, buyerName: e.target.value }))}
                  placeholder="e.g. Axmed Maxamed"
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                  Lambarka Telefoonka (EVC / Zaad)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={form.phoneNumber}
                    onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                    placeholder="+252 61 xxx xxxx ama 61xxxxxxx"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                  Tirada (Quantity)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm((p) => ({ ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  ← Dib u Noqo
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bixi Hadda (${totalAmount.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Lacag-bixinta ayaa la xaqiijinayaa...
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-xs">
                  Farriin ayaa loo diray telefoonka {form.phoneNumber}. Fadlan sug inta ay ka dhamaystirmayso.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && result && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Lacag-bixintu Way Guulaysatay!
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                  {result.message}
                </p>
              </div>

              <div className="w-full p-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                  Reference Number
                </span>
                <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {result.reference}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Xir Daaqadda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
