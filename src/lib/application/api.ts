import { API_BASE_URL } from '@/lib/api'
import { ApplicationApiError } from './errors'
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApplicationStatusResponse,
  CreateApplicationPayload,
  CreateApplicationResponse,
} from './types'

export async function createApplication(
  payload: CreateApplicationPayload
): Promise<CreateApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<CreateApplicationResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new ApplicationApiError(data as ApiErrorResponse)
  }

  return data.data
}

export async function fetchApplicationStatus(
  reference: string,
  email: string
): Promise<ApplicationStatusResponse> {
  const params = new URLSearchParams({
    reference: reference.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/v1/applications/status?${params.toString()}`,
    { cache: 'no-store' }
  )

  const data = (await response.json()) as
    | ApiSuccessResponse<ApplicationStatusResponse>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new ApplicationApiError(data as ApiErrorResponse)
  }

  return data.data
}
