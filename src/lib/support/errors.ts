import type { ApiErrorResponse } from './types'

export class SupportApiError extends Error {
  code: string
  errors?: ApiErrorResponse['errors']

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'SupportApiError'
    this.code = payload.code
    this.errors = payload.errors
  }
}

export function getSupportErrorMessage(error: unknown): string {
  if (error instanceof SupportApiError) {
    if (error.code === 'RATE_LIMITED') {
      return 'Too many messages sent. Please wait a few minutes and try again.'
    }
    if (error.errors?.length) {
      return error.errors.map((entry) => entry.message).join(' ')
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
