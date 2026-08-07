const CUSTOMER_TOKEN_KEY = 'yadi_customer_token'
const CUSTOMER_REFRESH_TOKEN_KEY = 'yadi_customer_refresh_token'

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY)
}

/** @deprecated Refresh tokens are no longer used (access JWT only, like admin). */
export function getCustomerRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CUSTOMER_REFRESH_TOKEN_KEY)
}

export function setCustomerAccessToken(token: string): void {
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  window.localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
}

/** @deprecated Use setCustomerAccessToken — refresh tokens are no longer issued. */
export function setCustomerTokens(token: string, _refreshToken?: string): void {
  setCustomerAccessToken(token)
}

export function clearCustomerTokens(): void {
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  window.localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
}
