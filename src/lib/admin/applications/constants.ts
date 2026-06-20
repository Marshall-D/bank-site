import { ACCOUNT_TYPE_OPTIONS } from '@/lib/application/constants'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'

export const ADMIN_APPLICATION_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
]

export const ADMIN_ACCOUNT_TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All account types' },
  ...ACCOUNT_TYPE_OPTIONS.map(({ value, label }) => ({ value, label })),
]

export const ADMIN_APPLICATION_SORT_OPTIONS = [
  { value: '-submittedAt', label: 'Newest submitted' },
  { value: 'submittedAt', label: 'Oldest submitted' },
  { value: '-createdAt', label: 'Newest created' },
  { value: 'createdAt', label: 'Oldest created' },
]
