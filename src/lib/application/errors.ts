import type { ApiErrorResponse, ApiFieldError } from './types'

export class ApplicationApiError extends Error {
  code: string
  errors?: ApiFieldError[]

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'ApplicationApiError'
    this.code = payload.code
    this.errors = payload.errors
  }
}

export function getApplicationErrorMessage(error: unknown): string {
  if (error instanceof ApplicationApiError) {
    if (error.code === 'DUPLICATE_APPLICATION') {
      return 'An application for this email is already in progress. Please contact support if you need help.'
    }
    if (error.code === 'RATE_LIMITED') {
      return 'Too many attempts. Please wait a few minutes and try again.'
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
