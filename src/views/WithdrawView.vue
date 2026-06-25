<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useToast } from '@/composables/useToast'
import { useMoney } from '@/composables/useMoney'
import { extractError } from '@/services/http'
import AmountField from '@/components/AmountField.vue'

const wallet = useWalletStore()
const router = useRouter()
const toast = useToast()
const { formatBRL, parseAmount } = useMoney()

const amount = ref('')
const description = ref('')
const error = ref('')
const submitting = ref(false)

const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/

onMounted(() => {
  wallet.fetchDashboard().catch((e) => toast.error(extractError(e).message))
})

// Validação de saldo insuficiente no frontend, comparando em centavos (exato).
const insufficient = computed(() => {
  const raw = amount.value.trim()
  if (!raw || !AMOUNT_PATTERN.test(raw)) return false
  const cents = Math.round(parseAmount(raw) * 100)
  return cents > wallet.balanceCents
})

function validate(): number | null {
  error.value = ''
  const raw = amount.value.trim()
  if (!raw || !AMOUNT_PATTERN.test(raw)) {
    error.value = 'Informe um valor válido (até 2 casas decimais).'
    return null
  }
  const value = parseAmount(raw)
  if (!Number.isFinite(value) || value < 0.01) {
    error.value = 'O valor deve ser de no mínimo R$ 0,01.'
    return null
  }
  if (Math.round(value * 100) > wallet.balanceCents) {
    error.value = 'Saldo insuficiente para este saque.'
    return null
  }
  return value
}

async function onSubmit() {
  const value = validate()
  if (value === null) return

  submitting.value = true
  try {
    await wallet.withdraw({ amount: value, description: description.value || null })
    toast.success(`Saque de ${formatBRL(value)} realizado com sucesso.`)
    router.push({ name: 'dashboard' })
  } catch (e) {
    const err = extractError(e)
    // O 422 do servidor (ex.: saldo insuficiente) é a fonte de verdade.
    error.value = err.errors.amount?.[0] ?? err.message
    toast.error(err.message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="mb-1 text-2xl font-bold text-slate-800">Sacar</h1>
    <p class="mb-6 text-sm text-slate-500">
      Saldo disponível: <strong>{{ formatBRL(wallet.balance) }}</strong>
    </p>

    <form
      class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="onSubmit"
    >
      <AmountField
        v-model="amount"
        label="Valor do saque"
        :error="error || (insufficient ? 'Saldo insuficiente para este saque.' : '')"
      />

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Descrição (opcional)</label>
        <input
          v-model="description"
          type="text"
          maxlength="255"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <button
        type="submit"
        :disabled="submitting || insufficient"
        class="w-full rounded-lg bg-slate-800 py-2.5 font-medium text-white hover:bg-slate-900 disabled:opacity-60"
      >
        {{ submitting ? 'Processando...' : 'Confirmar saque' }}
      </button>
    </form>
  </div>
</template>
