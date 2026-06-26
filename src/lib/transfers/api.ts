import { API_BASE_URL } from '@/lib/api'

import { TransferApiError } from './errors'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ExternalTransferPayload,
  InternalTransferPayload,
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

export async function submitExternalTransfer(
  token: string,
  payload: ExternalTransferPayload
): Promise<never> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transfers/external`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as ApiErrorResponse

  throw new TransferApiError(data)
}
