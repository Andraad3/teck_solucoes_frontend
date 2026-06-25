import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

// Estado global compartilhado (fora do setup) para uma única fila de toasts.
const toasts = ref<Toast[]>([])
let counter = 0

function push(type: ToastType, message: string, timeout = 4000): void {
  const id = ++counter
  toasts.value.push({ id, type, message })
  window.setTimeout(() => dismiss(id), timeout)
}

function dismiss(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function useToast() {
  return {
    toasts,
    dismiss,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
  }
}
