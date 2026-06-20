export const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png'] as const

export const ALLOWED_DOCUMENT_ACCEPT = 'image/jpeg,image/png,.jpg,.jpeg,.png'

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024

export const MAX_DOCUMENT_SIZE_LABEL = '10 MB'

export type AllowedDocumentMimeType = (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number]
