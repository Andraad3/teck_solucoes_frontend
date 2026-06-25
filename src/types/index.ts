// Tipos que espelham o contrato da API (envelope padronizado do backend Laravel).

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]> | null
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Wallet {
  id: number
  balance: number // em reais
  balance_cents: number // em centavos (comparações exatas)
  updated_at: string
}

export type TransactionType = 'credit' | 'debit'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number // em reais
  balance_after: number // em reais
  description: string | null
  created_at: string
}

export interface AuthPayload {
  user: User
  wallet: Wallet
  token: string
}

export interface MonthSummary {
  total_deposited: number
  total_withdrawn: number
}

export interface Dashboard {
  balance: number
  latest_transactions: Transaction[]
  month_summary: MonthSummary
}

export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface TransactionsPage {
  transactions: Transaction[]
  pagination: Pagination
}

export interface OperationResult {
  transaction: Transaction
  wallet: Wallet
}

export interface TransactionFilters {
  type?: TransactionType | ''
  start_date?: string
  end_date?: string
  per_page?: number
}
