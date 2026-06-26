export type SubmitSupportMessagePayload = {
  name: string
  email: string
  subject: string
  message: string
  website?: string
}

export type SubmitPasswordResetRequestPayload = {
  email: string
  website?: string
}

export type SubmitSupportMessageResponse = {
  ticketId: string
  submittedAt: string
}

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
  errors?: ApiFieldError[]
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
