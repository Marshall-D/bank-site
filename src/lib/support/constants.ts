export const SUPPORT_FIELD_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  subjectMax: 200,
  messageMin: 10,
  messageMax: 5000,
} as const

export const SUPPORT_SOURCE = {
  publicSupportForm: 'public_support_form',
  passwordReset: 'password_reset',
} as const

export const SUPPORT_SOURCE_LABELS: Record<string, string> = {
  [SUPPORT_SOURCE.publicSupportForm]: 'Support form',
  [SUPPORT_SOURCE.passwordReset]: 'Password reset',
}

export const PASSWORD_RESET_REQUEST_MESSAGE = [
  'This customer submitted a password reset request through the sign-in page.',
  '',
  'Please verify their identity and assist with password recovery.',
].join('\n')

export const PASSWORD_RESET_REQUEST_SUBJECT = 'Password reset request'

export const UNSAFE_TEXT_PATTERN = /<[^>]*>|javascript:|data:text\/html|on\w+\s*=/i

export const SUPPORT_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  resolved: 'Resolved',
}
