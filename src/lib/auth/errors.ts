import type { ApiErrorResponse } from './types'

export class CustomerAuthError extends Error {
  code: string

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'CustomerAuthError'
    this.code = payload.code
  }
}

export function getCustomerAuthErrorMessage(error: unknown): string {
  if (error instanceof CustomerAuthError) {
    if (error.code === 'INVALID_ACTIVATION_TOKEN') {
      return 'Invalid or expired activation link. Please check your email or contact support.'
    }
    if (error.code === 'ALREADY_ACTIVATED') {
      return 'This account has already been activated. You can sign in instead.'
    }
    if (error.code === 'INVALID_CREDENTIALS' || error.code === 'UNAUTHORIZED') {
      return 'Invalid email or password.'
    }
    if (error.code === 'INVALID_REFRESH_TOKEN' || error.code === 'REFRESH_TOKEN_EXPIRED') {
      return 'Your session has expired. Please sign in again.'
    }
    if (error.code === 'RATE_LIMITED') {
      return 'Too many attempts. Please wait a few minutes and try again.'
    }
    if (error.code === 'VALIDATION_ERROR') {
      return error.message
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
