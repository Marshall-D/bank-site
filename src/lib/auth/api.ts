import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from './errors'
import type {
  ActivatePayload,
  ApiErrorResponse,
  ApiSuccessResponse,
  AuthResponse,
  CustomerMeResponse,
  LoginPayload,
  RefreshPayload,
  RefreshResponse,
  RevokeResponse,
} from './types'

async function parseJson<T>(
  response: Response
): Promise<ApiSuccessResponse<T> | ApiErrorResponse> {
  return response.json() as Promise<ApiSuccessResponse<T> | ApiErrorResponse>
}

export async function activateAccount(payload: ActivatePayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await parseJson<AuthResponse>(response)

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

  const data = await parseJson<AuthResponse>(response)

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function refreshCustomerSession(
  payload: RefreshPayload
): Promise<RefreshResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await parseJson<RefreshResponse>(response)

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function logoutCustomerSession(
  payload: RefreshPayload
): Promise<RevokeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await parseJson<RevokeResponse>(response)

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function revokeCustomerSession(
  payload: RefreshPayload
): Promise<RevokeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await parseJson<RevokeResponse>(response)

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

  const data = await parseJson<CustomerMeResponse>(response)

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}
