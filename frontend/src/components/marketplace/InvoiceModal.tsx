import React, { useRef } from 'react'
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Leaf,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import type { ProduceOrder } from '@/types/produce'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: ProduceOrder | null
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const isPaid = order.payment_status === 'Paid'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl my-auto flex flex-col overflow-hidden max-h-[95vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                Invoice & Risiidka Lacag-Bixinta ({order.id})
              </h3>
              <p className="text-[10px] text-gray-500">
                Waxaad toos u daabacan kartaa ama PDF ugu keydsan kartaa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Printer size={13} />
              <span>Daabaco / Keydi PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div
          ref={printAreaRef}
          id="printable-invoice"
          className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-800 bg-white"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Leaf size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-gray-900">AgriSmart Somalia</h1>
                  <p className="text-[10px] text-emerald-800 font-semibold tracking-wider uppercase">
                    Fresh Farm Produce & Agricultural Network
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Suuqa Bakaaraha & Wadada KM4, Muqdisho, Soomaaliya
              </p>
              <p className="text-[11px] text-gray-500">
                Tel: +252 61 555 0192 | Email: sales@agrismart.so | Web: agrismart.so
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block">
                Official Tax Invoice
              </span>
              <p className="text-base font-black text-gray-900 font-mono">
                INV-{order.id}
              </p>
              <p className="text-[11px] text-gray-500 flex sm:justify-end items-center gap-1">
                <Calendar size={12} className="text-gray-400" />
                <span>
                  {new Date(order.created_at).toLocaleDateString('so-SO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>

              {/* Status Badge */}
              <div className="sm:flex sm:justify-end mt-2">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 size={12} /> WAA LA BIXIYAY (PAID)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Clock size={12} /> SUGAYA LACAGTA (PENDING)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer and Delivery Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Macmiilka (Billed To):
              </span>
              <p className="font-bold text-gray-900 text-sm">{order.customer.full_name}</p>
              <p className="text-gray-600 flex items-center gap-1 mt-0.5">
                <Phone size={11} className="text-gray-400" /> {order.customer.phone}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Goobta Delivery-ga (Delivery Address):
              </span>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <MapPin size={12} className="text-emerald-600 flex-shrink-0" />
                <span>{order.customer.city} - Xaafadda {order.customer.district}</span>
              </p>
              {order.customer.delivery_notes && (
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  Tilmaam: {order.customer.delivery_notes}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-600 uppercase text-[10px] tracking-wider bg-gray-100/50">
                  <th className="py-2 px-2.5">#</th>
                  <th className="py-2 px-2.5">Khudaarta / Produce</th>
                  <th className="py-2 px-2.5 text-center">Beerta Asalka</th>
                  <th className="py-2 px-2.5 text-center">Miisaanka / Qty</th>
                  <th className="py-2 px-2.5 text-right">Qiimaha</th>
                  <th className="py-2 px-2.5 text-right">Wadarta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={item.produce.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-2.5">
                      <p className="font-bold text-gray-900">{item.produce.somali_name}</p>
                      <p className="text-[10px] text-gray-500">{item.produce.name}</p>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-gray-600 text-[11px]">
                      {item.produce.farm_origin}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold text-gray-900">
                      {item.quantity} x {item.produce.unit}
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-gray-600">
                      ${item.produce.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-bold text-gray-900">
                      ${(item.produce.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            {/* Payment Meta */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Xogta Lacag-Bixinta:
              </span>
              <div className="flex justify-between">
                <span className="text-gray-500">Qaabka Bixinta:</span>
                <strong className="text-gray-800">{order.payment_method}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Xaaladda:</span>
                <span className={`font-bold ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isPaid ? 'Waa La Bixiyay (Confirmed)' : 'Sugaya Bixinta'}
                </span>
              </div>
              {order.transaction_id && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-500">TxID:</span>
                  <strong className="text-emerald-800">{order.transaction_id}</strong>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Qiimaha Khudaarta (Subtotal):</span>
                <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery (Gaadiidka):</span>
                <span className="font-semibold text-gray-900">
                  {order.delivery_fee === 0 ? 'Bilaash ($0.00)' : `$${order.delivery_fee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Wadarta Guud:</span>
                <span className="text-base text-emerald-800 font-extrabold font-mono">
                  ${order.total_amount.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Verification Footer */}
          <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-400 gap-2">
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck size={14} />
              <span>AgriSmart Verified Digital Receipt - Dhamaan xuquuqaha way dhowran yihiin</span>
            </div>
            <p className="font-mono">AgriSmart Merchant ID: 889211</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white transition-colors cursor-pointer"
          >
            Xidh
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Daabaco / Keydi PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
