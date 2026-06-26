import { SUPPORT_FIELD_LIMITS, UNSAFE_TEXT_PATTERN } from './constants'
import type { SubmitSupportMessagePayload } from './types'

export type SupportFormErrors = Partial<Record<keyof SubmitSupportMessagePayload, string>>

function hasUnsafeText(value: string): boolean {
  return UNSAFE_TEXT_PATTERN.test(value)
}

export function validateSupportForm(
  values: SubmitSupportMessagePayload
): SupportFormErrors {
  const errors: SupportFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim().toLowerCase()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length > SUPPORT_FIELD_LIMITS.nameMax) {
    errors.name = `Name must be at most ${SUPPORT_FIELD_LIMITS.nameMax} characters`
  } else if (hasUnsafeText(name)) {
    errors.name = 'Name contains disallowed content'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (email.length > SUPPORT_FIELD_LIMITS.emailMax) {
    errors.email = `Email must be at most ${SUPPORT_FIELD_LIMITS.emailMax} characters`
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!subject) {
    errors.subject = 'Subject is required'
  } else if (subject.length > SUPPORT_FIELD_LIMITS.subjectMax) {
    errors.subject = `Subject must be at most ${SUPPORT_FIELD_LIMITS.subjectMax} characters`
  } else if (hasUnsafeText(subject)) {
    errors.subject = 'Subject contains disallowed content'
  }

  if (!message) {
    errors.message = 'Message is required'
  } else if (message.length < SUPPORT_FIELD_LIMITS.messageMin) {
    errors.message = `Message must be at least ${SUPPORT_FIELD_LIMITS.messageMin} characters`
  } else if (message.length > SUPPORT_FIELD_LIMITS.messageMax) {
    errors.message = `Message must be at most ${SUPPORT_FIELD_LIMITS.messageMax} characters`
  } else if (hasUnsafeText(message)) {
    errors.message = 'Message contains disallowed content'
  }

  return errors
}
