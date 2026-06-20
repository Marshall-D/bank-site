export type AdminRole = 'admin' | 'customer'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRole
}

export type AdminLoginResponse = {
  token: string
  user: AdminUser
}

export type AdminMeResponse = {
  user: AdminUser
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
