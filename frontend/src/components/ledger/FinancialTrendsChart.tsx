import type { TransactionRecord } from '@/types/ledger'

interface FinancialTrendsChartProps {
  transactions: TransactionRecord[]
}

export function FinancialTrendsChart({ transactions }: FinancialTrendsChartProps) {
  // Compute recent income & expense points for chart
  let incomeVal = 600
  let expenseVal = 2000

  if (transactions.length > 0) {
    let inc = 0
    let exp = 0
    transactions.forEach((t) => {
      if (t.type === 'income') inc += Number(t.amount) || 0
      else exp += Number(t.amount) || 0
    })
    if (inc > 0) incomeVal = inc
    if (exp > 0) expenseVal = exp
  }

  // Calculate percentage heights relative to $2000 baseline
  const maxVal = Math.max(incomeVal, expenseVal, 2000)
  const incomeYPercent = Math.min((incomeVal / maxVal) * 100, 100)
  const expenseYPercent = Math.min((expenseVal / maxVal) * 100, 100)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-2xs">
      <h2 className="text-base font-bold text-gray-900 mb-6 tracking-tight">
        Isbedelka Maaliyadda (Financial Trends)
      </h2>

      {/* SVG / HTML Chart Container */}
      <div className="relative h-64 w-full flex flex-col justify-between pt-2 pb-6 border-b border-gray-100">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] text-gray-400">
          <div className="flex items-center gap-4 w-full">
            <span className="w-10 text-right font-mono">$2000</span>
            <div className="flex-1 border-b border-dashed border-gray-200" />
          </div>

          <div className="flex items-center gap-4 w-full">
            <span className="w-10 text-right font-mono">$1500</span>
            <div className="flex-1 border-b border-dashed border-gray-200" />
          </div>

          <div className="flex items-center gap-4 w-full">
            <span className="w-10 text-right font-mono">$1000</span>
            <div className="flex-1 border-b border-dashed border-gray-200" />
          </div>

          <div className="flex items-center gap-4 w-full">
            <span className="w-10 text-right font-mono">$500</span>
            <div className="flex-1 border-b border-dashed border-gray-200" />
          </div>

          <div className="flex items-center gap-4 w-full">
            <span className="w-10 text-right font-mono">$0</span>
            <div className="flex-1 border-b border-gray-200" />
          </div>
        </div>

        {/* Data Points Plot Area */}
        <div className="relative flex-1 ml-14 mr-4">
          {/* Expense Data Dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 shadow-md transition-all duration-500 cursor-pointer group"
            style={{ bottom: `${expenseYPercent}%` }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded shadow-md pointer-events-none whitespace-nowrap transition-opacity">
              Kharashka: ${expenseVal.toFixed(2)}
            </div>
          </div>

          {/* Income Data Dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shadow-md transition-all duration-500 cursor-pointer group"
            style={{ bottom: `${incomeYPercent}%` }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded shadow-md pointer-events-none whitespace-nowrap transition-opacity">
              Dakhliga: ${incomeVal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* X-Axis Date Label */}
        <div className="ml-14 flex justify-center pt-3 text-[11px] font-bold text-gray-500">
          Aug 8
        </div>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-emerald-800">Dakhliga (Income)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="text-red-800">Kharashka (Expense)</span>
        </div>
      </div>
    </div>
  )
}
