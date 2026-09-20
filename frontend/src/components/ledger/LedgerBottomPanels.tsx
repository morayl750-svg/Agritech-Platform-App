import { ArrowDownRight, ArrowUpRight, ArrowRight, Plus } from 'lucide-react'
import type { TransactionRecord } from '@/types/ledger'

interface LedgerBottomPanelsProps {
  transactions: TransactionRecord[]
  onOpenAddModal: () => void
}

function formatUSD(val: number): string {
  return `$${Math.abs(val).toFixed(2)}`
}

export function LedgerBottomPanels({ transactions, onOpenAddModal }: LedgerBottomPanelsProps) {
  // If no transactions exist, use screenshot baseline sample records
  const displayTransactions: TransactionRecord[] =
    transactions.length > 0
      ? transactions.slice(0, 5)
      : [
          { id: '1', type: 'expense', amount: 500, description: 'basal', category: 'GENERAL', date: '8/8/2026' },
          { id: '2', type: 'income', amount: 600, description: 'yaanyo', category: 'GENERAL', date: '8/8/2026' },
          { id: '3', type: 'expense', amount: 500, description: 'basal', category: 'GENERAL', date: '8/8/2026' },
          { id: '4', type: 'expense', amount: 500, description: 'basal', category: 'GENERAL', date: '8/8/2026' },
          { id: '5', type: 'expense', amount: 500, description: 'basal', category: 'GENERAL', date: '8/8/2026' },
        ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel: Diiwaanka Maaliyadda */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Diiwaanka Maaliyadda
            </h2>
            <button
              type="button"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Dhan Arag</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Transaction List Rows */}
          <div className="space-y-3.5">
            {displayTransactions.map((t) => {
              const isIncome = t.type === 'income'
              const numVal = Number(t.amount) || 0

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50/80 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100/70 text-emerald-600'
                          : 'bg-red-100/70 text-red-500'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900 capitalize">{t.description}</h4>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase mt-0.5">
                        {t.date} — {t.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold ${
                      isIncome ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    {isIncome ? `+${formatUSD(numVal)}` : `-${formatUSD(numVal)}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Iibka Tooska ah ee Dalagga */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Iibka Tooska ah ee Dalagga
            </h2>
            <button
              type="button"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Maamul</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Banner Card Container */}
          <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-white text-gray-400 border border-gray-200 flex items-center justify-center shadow-2xs">
              <ArrowRight size={20} />
            </div>

            <p className="text-xs font-medium text-gray-500 max-w-sm leading-relaxed">
              Iibi dalagyadaada adigoo aan dulaal isticmaalin. Ku dar dalag cusub si aad u tusto beeraleyda kale iyo iibsadayaasha maxaliga ah.
            </p>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Ku Dar Dalag Cusub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
