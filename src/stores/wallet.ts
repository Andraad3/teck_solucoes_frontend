import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as walletService from '@/services/wallet'
import type { OperationData } from '@/services/wallet'
import type {
  MonthSummary,
  OperationResult,
  Pagination,
  Transaction,
  TransactionFilters,
} from '@/types'

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(0) // em reais
  const balanceCents = ref(0) // em centavos (validação exata)
  const monthSummary = ref<MonthSummary>({ total_deposited: 0, total_withdrawn: 0 })
  const latestTransactions = ref<Transaction[]>([])

  const transactions = ref<Transaction[]>([])
  const pagination = ref<Pagination>({ current_page: 1, per_page: 15, total: 0, last_page: 1 })

  const loading = ref(false)

  function applyWallet(reais: number, cents: number): void {
    balance.value = reais
    balanceCents.value = cents
  }

  async function fetchDashboard(): Promise<void> {
    loading.value = true
    try {
      const data = await walletService.getDashboard()
      balance.value = data.balance
      balanceCents.value = Math.round(data.balance * 100)
      monthSummary.value = data.month_summary
      latestTransactions.value = data.latest_transactions
    } finally {
      loading.value = false
    }
  }

  async function deposit(payload: OperationData): Promise<OperationResult> {
    const result = await walletService.deposit(payload)
    applyWallet(result.wallet.balance, result.wallet.balance_cents)
    return result
  }

  async function withdraw(payload: OperationData): Promise<OperationResult> {
    const result = await walletService.withdraw(payload)
    applyWallet(result.wallet.balance, result.wallet.balance_cents)
    return result
  }

  async function fetchTransactions(filters: TransactionFilters, page = 1): Promise<void> {
    loading.value = true
    try {
      const data = await walletService.getTransactions(filters, page)
      transactions.value = data.transactions
      pagination.value = data.pagination
    } finally {
      loading.value = false
    }
  }

  return {
    balance,
    balanceCents,
    monthSummary,
    latestTransactions,
    transactions,
    pagination,
    loading,
    fetchDashboard,
    deposit,
    withdraw,
    fetchTransactions,
  }
})
