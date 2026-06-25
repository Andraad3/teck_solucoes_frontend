<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useToast } from '@/composables/useToast'
import { extractError } from '@/services/http'
import BalanceCard from '@/components/BalanceCard.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import TransactionTable from '@/components/TransactionTable.vue'

const wallet = useWalletStore()
const toast = useToast()

onMounted(async () => {
  try {
    await wallet.fetchDashboard()
  } catch (e) {
    toast.error(extractError(e).message)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
      <div class="flex gap-2">
        <RouterLink
          to="/deposit"
          class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Depositar
        </RouterLink>
        <RouterLink
          to="/withdraw"
          class="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Sacar
        </RouterLink>
      </div>
    </div>

    <BalanceCard :balance="wallet.balance" />
    <SummaryCards :summary="wallet.monthSummary" />

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-700">Últimas transações</h2>
        <RouterLink to="/transactions" class="text-sm font-medium text-indigo-600 hover:underline">
          Ver tudo
        </RouterLink>
      </div>
      <TransactionTable
        :items="wallet.latestTransactions"
        empty-message="Você ainda não tem transações."
      />
    </section>
  </div>
</template>
