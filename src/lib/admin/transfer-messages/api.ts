import { API_BASE_URL } from '@/lib/api'
import { AdminAuthError } from '@/lib/admin/errors'
import { authHeaders } from '@/lib/admin/api'

import type { ApiErrorResponse, ApiSuccessResponse, TransferMessage } from './types'

export async function fetchTransferMessages(token: string): Promise<TransferMessage[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/transfer-messages`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<{ items: TransferMessage[] }>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data.items
}

export async function updateTransferMessage(
  token: string,
  key: string,
  message: string
): Promise<TransferMessage> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/transfer-messages/${key}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  const data = (await response.json()) as ApiSuccessResponse<TransferMessage> | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new AdminAuthError(data as ApiErrorResponse)
  }

  return data.data
}
