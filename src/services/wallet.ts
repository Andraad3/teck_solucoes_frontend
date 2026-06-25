import { http } from './http'
import type {
  ApiResponse,
  Dashboard,
  OperationResult,
  TransactionFilters,
  TransactionsPage,
  Wallet,
} from '@/types'

export interface OperationData {
  amount: number
  description?: string | null
}

export async function getWallet(): Promise<Wallet> {
  const { data } = await http.get<ApiResponse<Wallet>>('/wallet')
  return data.data
}

export async function deposit(payload: OperationData): Promise<OperationResult> {
  const { data } = await http.post<ApiResponse<OperationResult>>('/wallet/deposit', payload)
  return data.data
}

export async function withdraw(payload: OperationData): Promise<OperationResult> {
  const { data } = await http.post<ApiResponse<OperationResult>>('/wallet/withdraw', payload)
  return data.data
}

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await http.get<ApiResponse<Dashboard>>('/dashboard')
  return data.data
}

export async function getTransactions(
  filters: TransactionFilters,
  page = 1,
): Promise<TransactionsPage> {
  const params: Record<string, string | number> = { page }
  if (filters.type) params.type = filters.type
  if (filters.start_date) params.start_date = filters.start_date
  if (filters.end_date) params.end_date = filters.end_date
  if (filters.per_page) params.per_page = filters.per_page

  const { data } = await http.get<ApiResponse<TransactionsPage>>('/transactions', { params })
  return data.data
}
