export type TransferMessage = {
  key: string
  code: string
  label: string
  message: string
  updatedAt: string
  updatedBy: string | null
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
