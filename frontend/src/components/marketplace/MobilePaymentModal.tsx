import React, { useState, useEffect } from 'react'
import {
  X,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Lock,
} from 'lucide-react'
import type { ProduceOrder } from '@/types/produce'

interface MobilePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  order: ProduceOrder | null
  onPaymentSuccess: (orderId: string, txId: string) => void
}

type NetworkProvider = 'EVC Plus (Hormuud)' | 'Zaad Service (Telesom)' | 'Sahal (Golis)'

export function MobilePaymentModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}: MobilePaymentModalProps) {
  const [provider, setProvider] = useState<NetworkProvider>('EVC Plus (Hormuud)')
  const [phoneNumber, setPhoneNumber] = useState(order?.customer.phone || '')
  const [pin, setPin] = useState('')
  const [isPushing, setIsPushing] = useState(false)
  const [isUssdReceived, setIsUssdReceived] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(order?.payment_status === 'Paid')
  const [transactionId, setTransactionId] = useState(order?.transaction_id || '')

  useEffect(() => {
    if (order) {
      setPhoneNumber(order.customer.phone || '')
      setIsSuccess(order.payment_status === 'Paid')
      setTransactionId(order.transaction_id || '')
      setIsUssdReceived(false)
      setIsPushing(false)
      setPin('')
    }
  }, [order, isOpen])

  if (!isOpen || !order) return null

  const getUssdCode = () => {
    const cleanAmount = order.total_amount.toFixed(2)
    switch (provider) {
      case 'Zaad Service (Telesom)':
        return `*880*634448899*${cleanAmount}#`
      case 'Sahal (Golis)':
        return `*888*645551234*${cleanAmount}#`
      case 'EVC Plus (Hormuud)':
      default:
        return `*712*615550192*${cleanAmount}#`
    }
  }

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPushing(true)

    // Simulate sending network USSD push to mobile device
    setTimeout(() => {
      setIsPushing(false)
      setIsUssdReceived(true)
    }, 1200)
  }

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    setTimeout(() => {
      const generatedTxId = `TX-${provider.split(' ')[0].toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      setTransactionId(generatedTxId)
      setIsVerifying(false)
      setIsSuccess(true)

      onPaymentSuccess(order.id, generatedTxId)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Smartphone size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Bixinta Lacagta Tooska ah ee Mobile-ka
              </h3>
              <p className="text-[11px] text-gray-500">
                Fariin lacag bixin toos ah ayaa kuugu imanaysa taleefankaaga
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Order Snapshot */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                Dalabka: {order.id}
              </p>
              <p className="text-xs text-gray-700 font-medium">
                {order.customer.full_name} ({order.customer.city})
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase block">Wadarta</span>
              <span className="text-base font-black text-emerald-800 font-mono">
                ${order.total_amount.toFixed(2)} USD
              </span>
            </div>
          </div>

          {isSuccess ? (
            /* Success View */
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-base font-bold text-gray-900">Lacagtii Waa Lagu Guuleystay!</h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Lacagta ${order.total_amount.toFixed(2)} USD waxaa laga jaray taleefankaaga. Dalabkaagu hadda wuxuu u gudbay diyaarin & delivery.
              </p>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
                Tixraaca Lacagta: <strong className="text-emerald-800">{transactionId}</strong>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Waad Mahadsan tahay (Xidh)
              </button>
            </div>
          ) : isUssdReceived ? (
            /* USSD Interactive Prompt View (Simulates Prompt on Customer's Phone) */
            <form onSubmit={handleConfirmPin} className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-900 text-white shadow-xl border-2 border-emerald-500/40 space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <Smartphone size={14} />
                    <span>Fariinta USSD ee Taleefankaaga ({provider})</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Toos ah</span>
                </div>

                <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
                  <p className="font-semibold text-white">AgriSmart Supermarket:</p>
                  <p>
                    Fadlan xaqiiji inaad bixiso <strong className="text-emerald-400">${order.total_amount.toFixed(2)} USD</strong> oo ku socota Merchant ID: <strong className="text-emerald-400">889211 (AgriSmart Fresh Produce)</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-300 font-semibold mb-1">
                    Geli PIN-kaaga Sirta ah:
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      autoFocus
                      required
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsUssdReceived(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium cursor-pointer"
                  >
                    Jooji
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || !pin}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Xaqiijinayaa...</span>
                      </>
                    ) : (
                      <>
                        <span>Xaqiiji & Bixi</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Direct dialer fallback */}
              <div className="text-center pt-1">
                <a
                  href={`tel:${getUssdCode().replace('#', '%23')}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  <PhoneCall size={12} />
                  <span>Ama toos uga garaac taleefankaaga ({getUssdCode()})</span>
                </a>
              </div>
            </form>
          ) : (
            /* Initiation View */
            <form onSubmit={handleSendPush} className="space-y-4">
              {/* Network Provider Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Dooro Shirkadda Isgaarsiinta:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(['EVC Plus (Hormuud)', 'Zaad Service (Telesom)', 'Sahal (Golis)'] as NetworkProvider[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setProvider(net)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        provider === net
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{net}</span>
                      {provider === net && <CheckCircle2 size={15} className="text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Phone Confirmation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Lambarka Lacagta Laga Jarayo:
                </label>
                <div className="relative">
                  <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+252 61 XXX XXXX"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Taleefankani wuxuu toos u heli doonaa fariinta bixinta lacagta (USSD Push).
                </p>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isPushing}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPushing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Dirayaa Fariinta Taleefanka...</span>
                  </>
                ) : (
                  <>
                    <Smartphone size={15} />
                    <span>U Soo Dir Taleefankeyga Fariinta Lacagta (${order.total_amount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 justify-center border-t border-gray-100 pt-3">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Xogtaadu waa mid si ammaan ah u dhowran (Encrypted 256-Bit)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
