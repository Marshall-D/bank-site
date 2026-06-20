import { API_BASE_URL } from '@/lib/api'
import { AdminAuthError } from './errors'
import type {
  AdminLoginResponse,
  AdminMeResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
} from './types'

async function parseResponse<T>(
  response: Response
): Promise<ApiSuccessResponse<T> | ApiErrorResponse> {
  return response.json() as Promise<ApiSuccessResponse<T> | ApiErrorResponse>
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await parseResponse<AdminLoginResponse>(response)

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function fetchAdminMe(token: string): Promise<AdminMeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const data = await parseResponse<AdminMeResponse>(response)

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}
