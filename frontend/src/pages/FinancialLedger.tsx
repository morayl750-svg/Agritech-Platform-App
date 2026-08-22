import { useState } from 'react'
import { Plus, Download, Printer } from 'lucide-react'
import { LedgerSummary } from '@/components/ledger/LedgerSummary'
import { TransactionTable } from '@/components/ledger/TransactionTable'
import { AddTransactionModal } from '@/components/ledger/AddTransactionModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLedgerData } from '@/hooks/useLedgerData'
import { exportLedgerToCSV, printFinancialStatement } from '@/utils/exportUtils'

export default function FinancialLedger() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { transactions, totals, isLoading, refetch } = useLedgerData()

  return (
    <div className="w-full flex flex-col gap-6 items-stretch pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Financial Ledger</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Stripe-inspired farm bookkeeping & transaction management.
          </p>
        </div>

        {/* Action buttons: Export CSV, Print/PDF, Add Transaction */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => exportLedgerToCSV(transactions)}
            disabled={transactions.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            title="Download Excel / CSV file"
          >
            <Download size={14} className="text-emerald-600" />
            <span>Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => printFinancialStatement(totals, transactions)}
            disabled={transactions.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            title="Print or Save as PDF"
          >
            <Printer size={14} className="text-blue-600" />
            <span>Daabac / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Plus size={15} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons vs Content */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <LedgerSummary totals={totals} />

          {/* Transactions Table */}
          <TransactionTable transactions={transactions} />
        </>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  )
}
