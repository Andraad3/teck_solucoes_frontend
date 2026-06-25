<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useToast } from '@/composables/useToast'
import { extractError } from '@/services/http'
import type { TransactionFilters } from '@/types'
import TransactionTable from '@/components/TransactionTable.vue'
import Pagination from '@/components/Pagination.vue'

const wallet = useWalletStore()
const toast = useToast()

const filters = reactive<TransactionFilters>({
  type: '',
  start_date: '',
  end_date: '',
  per_page: 10,
})

async function load(page = 1) {
  try {
    await wallet.fetchTransactions(filters, page)
  } catch (e) {
    toast.error(extractError(e).message)
  }
}

function applyFilters() {
  load(1)
}

function resetFilters() {
  filters.type = ''
  filters.start_date = ''
  filters.end_date = ''
  filters.per_page = 10
  load(1)
}

onMounted(() => load(1))
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Histórico de transações</h1>

    <form
      class="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-5"
      @submit.prevent="applyFilters"
    >
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Tipo</label>
        <select
          v-model="filters.type"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Todos</option>
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">De</label>
        <input
          v-model="filters.start_date"
          type="date"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Até</label>
        <input
          v-model="filters.end_date"
          type="date"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Por página</label>
        <select
          v-model.number="filters.per_page"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
      <div class="flex items-end gap-2">
        <button
          type="submit"
          class="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Filtrar
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          @click="resetFilters"
        >
          Limpar
        </button>
      </div>
    </form>

    <TransactionTable :items="wallet.transactions" />

    <Pagination :pagination="wallet.pagination" @change="load" />
  </div>
</template>
