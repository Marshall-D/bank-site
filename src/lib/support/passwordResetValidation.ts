import { SUPPORT_FIELD_LIMITS } from './constants'
import type { SubmitPasswordResetRequestPayload } from './types'

export type PasswordResetFormErrors = Partial<Record<keyof SubmitPasswordResetRequestPayload, string>>

export function validatePasswordResetForm(
  values: SubmitPasswordResetRequestPayload
): PasswordResetFormErrors {
  const errors: PasswordResetFormErrors = {}
  const email = values.email.trim().toLowerCase()

  if (!email) {
    errors.email = 'Email is required'
  } else if (email.length > SUPPORT_FIELD_LIMITS.emailMax) {
    errors.email = `Email must be at most ${SUPPORT_FIELD_LIMITS.emailMax} characters`
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  return errors
}
