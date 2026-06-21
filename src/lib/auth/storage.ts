const CUSTOMER_TOKEN_KEY = 'yadi_customer_token'
const CUSTOMER_REFRESH_TOKEN_KEY = 'yadi_customer_refresh_token'

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY)
}

export function getCustomerRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CUSTOMER_REFRESH_TOKEN_KEY)
}

export function setCustomerTokens(token: string, refreshToken: string): void {
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  window.localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, refreshToken)
}

export function clearCustomerTokens(): void {
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  window.localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
}
