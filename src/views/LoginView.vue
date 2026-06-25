<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { extractError } from '@/services/http'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const form = reactive({ email: '', password: '' })
const errors = ref<Record<string, string[]>>({})
const submitting = ref(false)

async function onSubmit() {
  errors.value = {}
  submitting.value = true
  try {
    await auth.login({ ...form })
    toast.success('Login realizado com sucesso.')
    router.push({ name: 'dashboard' })
  } catch (e) {
    const err = extractError(e)
    errors.value = err.errors
    toast.error(err.message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-800">Entrar</h1>
      <p class="mt-1 text-sm text-slate-500">Acesse sua carteira digital</p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Senha</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {{ submitting ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Não tem conta?
        <RouterLink to="/register" class="font-medium text-indigo-600 hover:underline">
          Criar conta
        </RouterLink>
      </p>
    </div>
  </div>
</template>
