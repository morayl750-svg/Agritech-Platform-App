export type TransactionType = 'income' | 'expense'

export interface TransactionRecord {
  id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  created_at?: string
}

export interface LedgerTotals {
  totalBalance: number
  totalIncome: number
  totalExpense: number
}

export interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
