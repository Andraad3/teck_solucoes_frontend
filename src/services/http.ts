import axios, { AxiosError } from 'axios'

export const TOKEN_KEY = 'carteira_token'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Injeta o token Bearer em toda requisição.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Em 401, limpa a sessão e manda para o login.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Normaliza qualquer erro da API para { message, errors } a partir do
 * envelope padronizado do backend.
 */
export interface NormalizedError {
  message: string
  errors: Record<string, string[]>
}

export function extractError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> | null }
      | undefined
    return {
      message: data?.message ?? 'Ocorreu um erro inesperado.',
      errors: data?.errors ?? {},
    }
  }
  return { message: 'Ocorreu um erro inesperado.', errors: {} }
}
