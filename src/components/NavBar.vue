<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/deposit', label: 'Depositar' },
  { to: '/withdraw', label: 'Sacar' },
  { to: '/transactions', label: 'Histórico' },
]

async function handleLogout() {
  await auth.logout()
  toast.info('Sessão encerrada.')
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-6">
        <span class="text-lg font-bold text-indigo-600">Carteira</span>
        <nav class="flex gap-1">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            active-class="bg-indigo-50 text-indigo-700"
            exact-active-class="bg-indigo-50 text-indigo-700"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
      <div class="flex items-center gap-3">
        <span class="hidden text-sm text-slate-500 sm:inline">{{ auth.user?.name }}</span>
        <button
          class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </div>
  </header>
</template>
