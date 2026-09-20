import type { TransactionRecord } from '@/types/ledger'
import { cn } from '@/lib/cn'

interface TransactionTableProps {
  transactions: TransactionRecord[]
}

function formatUSD(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val)
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-2xs">
      <table className="w-full text-left text-xs text-gray-600 border-collapse">
        <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-medium text-[11px] uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold text-right">Amount (USD)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                No financial transactions recorded yet.
              </td>
            </tr>
          ) : (
            transactions.map((item) => {
              const isIncome = item.type === 'income'
              const numVal = Number(item.amount) || 0

              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 align-middle text-gray-500 font-mono text-[11px]">
                    {item.date}
                  </td>

                  <td className="px-4 py-3.5 align-middle font-medium text-gray-900 max-w-sm">
                    {item.description}
                  </td>

                  <td className="px-4 py-3.5 align-middle">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 align-middle">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize',
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      )}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td
                    className={cn(
                      'px-4 py-3.5 align-middle text-right font-semibold text-sm',
                      isIncome ? 'text-emerald-700' : 'text-gray-900'
                    )}
                  >
                    {isIncome ? `+ ${formatUSD(numVal)}` : `- ${formatUSD(numVal)}`}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
