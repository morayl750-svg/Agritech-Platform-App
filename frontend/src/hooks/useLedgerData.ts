import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { TransactionRecord, LedgerTotals } from '@/types/ledger'

export function useLedgerData() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [totals, setTotals] = useState<LedgerTotals>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (err) throw err

      if (data) {
        const records = data as TransactionRecord[]
        setTransactions(records)

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

        setTotals({
          totalIncome: inc,
          totalExpense: exp,
          totalBalance: inc - exp,
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch financial ledger transactions'
      console.warn('[Supabase Transactions Fetch Error]', msg)
      setError(msg)
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
