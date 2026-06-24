import { refreshCustomerSession, revokeCustomerSession } from './api'
import {
  clearCustomerTokens,
  getCustomerRefreshToken,
  getCustomerToken,
  setCustomerTokens,
} from './storage'

export async function tryRefreshCustomerSession(): Promise<string | null> {
  const refreshToken = getCustomerRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    const result = await refreshCustomerSession({ refreshToken })
    setCustomerTokens(result.token, result.refreshToken)
    return result.token
  } catch {
    return null
  }
}

export async function endCustomerSession(): Promise<void> {
  const refreshToken = getCustomerRefreshToken()
  if (refreshToken) {
    try {
      await revokeCustomerSession({ refreshToken })
    } catch {
      // Best-effort revoke when access token may be expired.
    }
  }
  clearCustomerTokens()
}

export function getStoredCustomerAccessToken(): string | null {
  return getCustomerToken()
}
