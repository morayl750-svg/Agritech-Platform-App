import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { TransactionRecord, LedgerTotals } from '@/types/ledger'

const DEMO_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1',
    description: 'Bixinta Iibka Sisinta (Sesame Batch Sale)',
    type: 'income',
    amount: 1850.0,
    category: 'Produce Sales',
    date: '2026-09-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    description: "Iibka Caanaha Geela & Lo'da (Daily Milk Supply)",
    type: 'income',
    amount: 450.0,
    category: 'Livestock Sales',
    date: '2026-09-14',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-3',
    description: 'Dhaqaalaha Biyaha & Nafta Bamka (Diesel Fuel)',
    type: 'expense',
    amount: 240.0,
    category: 'Fuel & Utilities',
    date: '2026-09-12',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-4',
    description: 'Iibka 4 Head Ovis Ari (Goat Sales)',
    type: 'income',
    amount: 360.0,
    category: 'Livestock Sales',
    date: '2026-09-10',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-5',
    description: 'Gadaashada Bacriminta DAP & Urea (50kg)',
    type: 'expense',
    amount: 320.0,
    category: 'Supplies & Fertilizer',
    date: '2026-09-08',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tx-6',
    description: 'Bixinta Sahayda Tallaalka Xoolaha (Veterinary)',
    type: 'expense',
    amount: 150.0,
    category: 'Veterinary Services',
    date: '2026-09-02',
    created_at: new Date().toISOString(),
  },
]

function calculateTotals(records: TransactionRecord[]): LedgerTotals {
  let inc = 0
  let exp = 0
  records.forEach((t) => {
    const val = Number(t.amount) || 0
    if (t.type === 'income') {
      inc += val
    } else {
      exp += val
    }
  })
  return {
    totalIncome: inc,
    totalExpense: exp,
    totalBalance: inc - exp,
  }
}

export function useLedgerData() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(DEMO_TRANSACTIONS)
  const [totals, setTotals] = useState<LedgerTotals>(() => calculateTotals(DEMO_TRANSACTIONS))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (supabase) {
        const res = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })

        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          const records = data as TransactionRecord[]
          setTransactions(records)
          setTotals(calculateTotals(records))
          setIsLoading(false)
          return
        }
      }

      setTransactions(DEMO_TRANSACTIONS)
      setTotals(calculateTotals(DEMO_TRANSACTIONS))
    } catch (err) {
      console.warn('[Financial Ledger Fetch Warning]', err)
      setTransactions(DEMO_TRANSACTIONS)
      setTotals(calculateTotals(DEMO_TRANSACTIONS))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    totals,
    isLoading,
    error,
    refetch: fetchTransactions,
  }
}
