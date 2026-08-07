import { clearCustomerTokens, getCustomerToken } from './storage'

/**
 * Customer sessions use access JWT only (same model as admin).
 * Refresh-token renewal has been removed.
 */
export async function endCustomerSession(): Promise<void> {
  clearCustomerTokens()
}

export function getStoredCustomerAccessToken(): string | null {
  return getCustomerToken()
}
