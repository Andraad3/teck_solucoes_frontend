<script setup lang="ts">
import type { Pagination } from '@/types'

const props = defineProps<{
  pagination: Pagination
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

function go(page: number) {
  if (page >= 1 && page <= props.pagination.last_page && page !== props.pagination.current_page) {
    emit('change', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between text-sm text-slate-600">
    <span>
      Página {{ pagination.current_page }} de {{ pagination.last_page }}
      · {{ pagination.total }} transações
    </span>
    <div class="flex gap-2">
      <button
        class="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
        :disabled="pagination.current_page <= 1"
        @click="go(pagination.current_page - 1)"
      >
        Anterior
      </button>
      <button
        class="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
        :disabled="pagination.current_page >= pagination.last_page"
        @click="go(pagination.current_page + 1)"
      >
        Próxima
      </button>
    </div>
  </div>
</template>
