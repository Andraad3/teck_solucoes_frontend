<script setup lang="ts">
import { useMoney } from '@/composables/useMoney'

defineProps<{
  balance: number
}>()

const { formatBRL } = useMoney()
</script>

<template>
  <div class="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-6 text-white shadow-sm">
    <p class="text-sm text-indigo-100">Saldo atual</p>
    <p class="mt-2 text-4xl font-bold tracking-tight">{{ formatBRL(balance) }}</p>
  </div>
</template>
