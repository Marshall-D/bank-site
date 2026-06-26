import { API_BASE_URL } from '@/lib/api'

import { SupportApiError } from './errors'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  SubmitSupportMessagePayload,
  SubmitSupportMessageResponse,
} from './types'

export async function submitSupportMessage(
  payload: SubmitSupportMessagePayload
): Promise<SubmitSupportMessageResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/support/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      website: payload.website ?? '',
    }),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<SubmitSupportMessageResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new SupportApiError(data as ApiErrorResponse)
  }

  return data.data
}
