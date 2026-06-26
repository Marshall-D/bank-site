import type { ApiErrorResponse } from './types'

export class TransferApiError extends Error {
  code: string
  reference?: string
  errors?: ApiErrorResponse['errors']

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = 'TransferApiError'
    this.code = payload.code
    this.reference = payload.reference
    this.errors = payload.errors
  }
}

export function getTransferErrorMessage(error: unknown): string {
  if (error instanceof TransferApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
