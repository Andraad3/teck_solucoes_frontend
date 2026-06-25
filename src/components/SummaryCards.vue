<script setup lang="ts">
import { useMoney } from '@/composables/useMoney'
import type { MonthSummary } from '@/types'

defineProps<{
  summary: MonthSummary
}>()

const { formatBRL } = useMoney()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="rounded-xl border border-slate-200 bg-white p-5">
      <p class="text-sm text-slate-500">Depositado no mês</p>
      <p class="mt-1 text-2xl font-semibold text-emerald-600">
        {{ formatBRL(summary.total_deposited) }}
      </p>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-5">
      <p class="text-sm text-slate-500">Sacado no mês</p>
      <p class="mt-1 text-2xl font-semibold text-red-600">
        {{ formatBRL(summary.total_withdrawn) }}
      </p>
    </div>
  </div>
</template>
