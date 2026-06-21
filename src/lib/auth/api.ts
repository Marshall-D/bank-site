import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from './errors'
import type {
  ActivatePayload,
  ApiErrorResponse,
  ApiSuccessResponse,
  AuthResponse,
  CustomerMeResponse,
  LoginPayload,
} from './types'

export async function activateAccount(payload: ActivatePayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as ApiSuccessResponse<AuthResponse> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function loginCustomer(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as ApiSuccessResponse<AuthResponse> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function fetchCustomerMe(token: string): Promise<CustomerMeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const data = (await response.json()) as ApiSuccessResponse<CustomerMeResponse> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}
