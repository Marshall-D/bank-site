export type CustomerUser = {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
}

export type LoginPayload = {
  email: string
  password: string
}

export type ActivatePayload = {
  activationToken: string
  email: string
  password: string
  confirmPassword: string
}

export type CustomerMeResponse = {
  user: CustomerUser
}

export type RefreshPayload = {
  refreshToken: string
}

export type RefreshResponse = {
  token: string
  refreshToken: string
}

export type RevokeResponse = {
  revoked: boolean
}

export type AuthResponse = {
  token: string
  refreshToken: string
  user: CustomerUser
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
