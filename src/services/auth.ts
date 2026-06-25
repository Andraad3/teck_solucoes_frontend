import { http } from './http'
import type { ApiResponse, AuthPayload } from '@/types'

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

export async function register(payload: RegisterData): Promise<AuthPayload> {
  const { data } = await http.post<ApiResponse<AuthPayload>>('/register', payload)
  return data.data
}

export async function login(payload: LoginData): Promise<AuthPayload> {
  const { data } = await http.post<ApiResponse<AuthPayload>>('/login', payload)
  return data.data
}

export async function logout(): Promise<void> {
  await http.post('/logout')
}
