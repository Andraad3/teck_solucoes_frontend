<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-slate-700">{{ label }}</label>
    <div class="relative">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        R$
      </span>
      <input
        :value="modelValue"
        type="text"
        inputmode="decimal"
        :disabled="disabled"
        :placeholder="placeholder ?? '0,00'"
        class="w-full rounded-lg border px-3 py-2 pl-9 text-slate-800 outline-none focus:ring-2 disabled:bg-slate-100"
        :class="
          error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-slate-300 focus:ring-indigo-300'
        "
        @input="onInput"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
