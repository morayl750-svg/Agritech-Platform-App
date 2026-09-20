import { useState, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'
import type { AddTransactionModalProps, TransactionType } from '@/types/ledger'

export function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('income')
  const [amount, setAmount] = useState('150.00')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Produce Sales')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const numAmount = Number(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Please enter a valid positive dollar amount')
      }
      if (!description.trim()) {
        throw new Error('Description is required')
      }

      const { error: err } = await supabase.from('transactions').insert([
        {
          type,
          amount: numAmount,
          description: description.trim(),
          category: category.trim(),
          date,
        },
      ])

      if (err) throw err

      onSuccess()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add transaction'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Record Financial Transaction</h2>
            <p className="text-xs text-gray-500 mt-0.5">Persist income or expense into farm ledger.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Type Toggle Switcher */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setType('income')
                  setCategory('Produce Sales')
                }}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center',
                  type === 'income'
                    ? 'bg-white text-emerald-700 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                + Income / Revenue
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('expense')
                  setCategory('Equipment')
                }}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center',
                  type === 'expense'
                    ? 'bg-white text-gray-900 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                - Expense / Cost
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Sold 50kg Sorghum grain to Afgooye market"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white outline-none focus:border-gray-400"
            >
              <option value="Produce Sales">Produce Sales</option>
              <option value="Livestock Sales">Livestock Sales</option>
              <option value="Equipment">Equipment</option>
              <option value="Fertilizers & Bio">Fertilizers & Bio</option>
              <option value="Farm Operations">Farm Operations</option>
              <option value="Labor">Labor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>Save Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
