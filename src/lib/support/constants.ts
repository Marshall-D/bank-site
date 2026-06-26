export const SUPPORT_FIELD_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  subjectMax: 200,
  messageMin: 10,
  messageMax: 5000,
} as const

export const UNSAFE_TEXT_PATTERN = /<[^>]*>|javascript:|data:text\/html|on\w+\s*=/i

export const SUPPORT_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  resolved: 'Resolved',
}
