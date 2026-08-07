import type { ApiErrorResponse } from './types'

export class TransferApiError extends Error {
  code: string
  reference?: string
  lockedUntil?: string
  attemptsRemaining?: number
  errors?: ApiErrorResponse['errors']

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'TransferApiError'
    this.code = payload.code
    this.reference = payload.reference
    this.lockedUntil = payload.lockedUntil
    this.attemptsRemaining = payload.attemptsRemaining
    this.errors = payload.errors
  }
}

function formatWaitDuration(lockedUntil: string): string {
  const ms = new Date(lockedUntil).getTime() - Date.now()
  if (!Number.isFinite(ms) || ms <= 0) {
    return 'a short while'
  }

  const totalMinutes = Math.max(1, Math.ceil(ms / 60_000))
  if (totalMinutes === 1) return '1 minute'
  if (totalMinutes < 60) return `${totalMinutes} minutes`

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`
  }
  return `${hours}h ${minutes}m`
}

export function getTransferErrorMessage(error: unknown): string {
  if (error instanceof TransferApiError) {
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
        return `Transfer PIN is temporarily locked. Please wait ${formatWaitDuration(error.lockedUntil)} before trying again.`
      }
      return 'Transfer PIN is temporarily locked. Please wait and try again later.'
    }

    if (error.code === 'TRANSFER_PIN_REQUIRED') {
      return 'Set a transfer PIN in Settings before you can make transfers.'
    }

    if (error.code === 'EXTERNAL_TRANSFER_IP_BLOCKED') {
      return error.message
    }

    if (error.code === 'OUTSIDE_JURISDICTION') {
      return error.message
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
