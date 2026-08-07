import { API_BASE_URL } from '@/lib/api'

import { TransferApiError } from './errors'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ExternalTransferPayload,
  ExternalTransferResult,
  InternalTransferPayload,
  ResolvedBrcbAccount,
  SameBankTransferPayload,
  SameBankTransferResult,
  TransferResult,
} from './types'

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function submitInternalTransfer(
  token: string,
  payload: InternalTransferPayload
): Promise<TransferResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transfers/internal`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as ApiSuccessResponse<TransferResult> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new TransferApiError(data as ApiErrorResponse)
  }

  return data.data
}

export async function resolveBrcbAccount(
  token: string,
  accountNumber: string
): Promise<ResolvedBrcbAccount> {
  const params = new URLSearchParams({ accountNumber: accountNumber.trim() })
  const response = await fetch(`${API_BASE_URL}/api/v1/accounts/resolve?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<{ account: ResolvedBrcbAccount }>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new TransferApiError(data as ApiErrorResponse)
  }

  return data.data.account
}

export async function submitSameBankTransfer(
  token: string,
  payload: SameBankTransferPayload
): Promise<SameBankTransferResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transfers/same-bank`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<SameBankTransferResult>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new TransferApiError(data as ApiErrorResponse)
  }

  return data.data
}

export async function submitExternalTransfer(
  token: string,
  payload: ExternalTransferPayload
): Promise<ExternalTransferResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transfers/external`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<ExternalTransferResult>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new TransferApiError(data as ApiErrorResponse)
  }

  return data.data
}
