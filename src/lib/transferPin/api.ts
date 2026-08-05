import { API_BASE_URL } from '@/lib/api'

export type TransferPinApiError = {
  success: false
  message: string
  code: string
  lockedUntil?: string
  attemptsRemaining?: number
}

export class TransferPinError extends Error {
  code: string
  lockedUntil?: string
  attemptsRemaining?: number

  constructor(payload: TransferPinApiError) {
    super(payload.message)
    this.name = 'TransferPinError'
    this.code = payload.code
    this.lockedUntil = payload.lockedUntil
    this.attemptsRemaining = payload.attemptsRemaining
  }
}

type ApiSuccess<T> = { success: true; data: T }

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function setTransferPin(
  token: string,
  payload: { password: string; pin: string; confirmPin: string }
): Promise<{ hasTransferPin: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/security/transfer-pin`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccess<{ hasTransferPin: boolean }>
    | TransferPinApiError

  if (!response.ok || !data.success) {
    throw new TransferPinError(data as TransferPinApiError)
  }

  return data.data
}

export async function changeTransferPin(
  token: string,
  payload: { currentPin: string; newPin: string; confirmNewPin: string }
): Promise<{ hasTransferPin: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/security/transfer-pin`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as
    | ApiSuccess<{ hasTransferPin: boolean }>
    | TransferPinApiError

  if (!response.ok || !data.success) {
    throw new TransferPinError(data as TransferPinApiError)
  }

  return data.data
}

export function getTransferPinErrorMessage(error: unknown): string {
  if (error instanceof TransferPinError) {
    if (error.code === 'INVALID_TRANSFER_PIN') {
      const remaining = error.attemptsRemaining
      if (typeof remaining === 'number' && remaining > 0) {
        const attemptWord = remaining === 1 ? 'attempt' : 'attempts'
        return `Incorrect transfer PIN. You have ${remaining} ${attemptWord} left before your PIN is temporarily locked.`
      }
      return 'Incorrect transfer PIN. Please try again.'
    }

    if (error.code === 'TRANSFER_PIN_LOCKED') {
      if (error.lockedUntil) {
        const ms = new Date(error.lockedUntil).getTime() - Date.now()
        const minutes = Number.isFinite(ms) && ms > 0 ? Math.max(1, Math.ceil(ms / 60_000)) : null
        if (minutes) {
          const label = minutes === 1 ? '1 minute' : `${minutes} minutes`
          return `Transfer PIN is temporarily locked. Please wait ${label} before trying again.`
        }
      }
      return 'Transfer PIN is temporarily locked. Please wait and try again later.'
    }

    return error.message
  }

  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
