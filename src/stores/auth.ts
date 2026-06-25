import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '@/services/auth'
import type { RegisterData, LoginData } from '@/services/auth'
import { TOKEN_KEY } from '@/services/http'
import type { User, Wallet } from '@/types'

const USER_KEY = 'carteira_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(loadUser())

  const isAuthenticated = computed(() => !!token.value)

  function loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  }

  function setSession(newUser: User, newToken: string): void {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  function clearSession(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function register(payload: RegisterData): Promise<Wallet> {
    const result = await authService.register(payload)
    setSession(result.user, result.token)
    return result.wallet
  }

  async function login(payload: LoginData): Promise<Wallet> {
    const result = await authService.login(payload)
    setSession(result.user, result.token)
    return result.wallet
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }

  return { token, user, isAuthenticated, register, login, logout, clearSession }
})
