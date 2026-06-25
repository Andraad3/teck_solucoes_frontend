<script setup lang="ts">
import { useMoney } from '@/composables/useMoney'
import type { Transaction } from '@/types'

defineProps<{
  items: Transaction[]
  emptyMessage?: string
}>()

const { formatBRL } = useMoney()

function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR')
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-200">
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-500">
        <tr>
          <th class="px-4 py-3 font-medium">Data/Hora</th>
          <th class="px-4 py-3 font-medium">Tipo</th>
          <th class="px-4 py-3 text-right font-medium">Valor</th>
          <th class="px-4 py-3 text-right font-medium">Saldo após</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="t in items" :key="t.id" class="hover:bg-slate-50">
          <td class="px-4 py-3 text-slate-600">{{ formatDate(t.created_at) }}</td>
          <td class="px-4 py-3">
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
              :class="
                t.type === 'credit'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ t.type === 'credit' ? 'Crédito' : 'Débito' }}
            </span>
          </td>
          <td
            class="px-4 py-3 text-right font-medium"
            :class="t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ t.type === 'credit' ? '+' : '−' }} {{ formatBRL(t.amount) }}
          </td>
          <td class="px-4 py-3 text-right text-slate-700">{{ formatBRL(t.balance_after) }}</td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="4" class="px-4 py-8 text-center text-slate-400">
            {{ emptyMessage ?? 'Nenhuma transação encontrada.' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
