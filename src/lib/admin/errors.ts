import type { ApiErrorResponse } from './types'

export class AdminAuthError extends Error {
  code: string

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'AdminAuthError'
    this.code = payload.code
  }
}

export function getAdminAuthErrorMessage(error: unknown): string {
  if (error instanceof AdminAuthError) {
    if (error.code === 'RATE_LIMITED') {
      return 'Too many login attempts. Please wait a few minutes and try again.'
    }
    if (error.code === 'UNAUTHORIZED') {
      return 'Invalid email or password.'
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
