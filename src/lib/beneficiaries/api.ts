import { API_BASE_URL } from '@/lib/api'
import { CustomerAuthError } from '@/lib/auth/errors'

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  Beneficiary,
  CreateBeneficiaryPayload,
} from './types'

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function fetchBeneficiaries(token: string): Promise<Beneficiary[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<{ items: Beneficiary[] }>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data.items
}

export async function createBeneficiary(
  token: string,
  payload: CreateBeneficiaryPayload
): Promise<Beneficiary> {
  const response = await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      name: payload.name.trim(),
      bankName: payload.bankName.trim(),
      accountNumber: payload.accountNumber.trim(),
    }),
  })

  const data = (await response.json()) as ApiSuccessResponse<Beneficiary> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }

  return data.data
}

export async function deleteBeneficiary(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/beneficiaries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = (await response.json()) as ApiSuccessResponse<{ deleted: boolean }> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new CustomerAuthError(data as ApiErrorResponse)
  }
}
