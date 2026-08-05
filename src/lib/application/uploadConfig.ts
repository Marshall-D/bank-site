export const ALLOWED_DOCUMENT_ACCEPT = 'image/*'

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024

export const MAX_DOCUMENT_SIZE_LABEL = '10 MB'

export function isAllowedDocumentMimeType(mimeType: string): boolean {
  return typeof mimeType === 'string' && mimeType.startsWith('image/')
}
