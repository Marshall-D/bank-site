import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_LABEL,
} from './uploadConfig'

export type LocalDocumentSlot = 'idFront' | 'idBack' | 'proofOfAddress'

export type LocalDocumentFile = {
  slot: LocalDocumentSlot
  file: File
  previewUrl: string
  name: string
  size: number
  mimeType: string
}

export type LocalDocumentsState = {
  idFront: LocalDocumentFile | null
  idBack: LocalDocumentFile | null
  proofOfAddress: LocalDocumentFile | null
}

export const emptyLocalDocumentsState: LocalDocumentsState = {
  idFront: null,
  idBack: null,
  proofOfAddress: null,
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateDocumentFile(file: File): string | null {
  if (
    !ALLOWED_DOCUMENT_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number]
    )
  ) {
    return 'Only JPG and PNG images are allowed'
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return `File must be under ${MAX_DOCUMENT_SIZE_LABEL}`
  }

  return null
}

export function createLocalDocumentFile(
  slot: LocalDocumentSlot,
  file: File
): LocalDocumentFile {
  return {
    slot,
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    mimeType: file.type,
  }
}

export function revokeLocalDocumentPreview(doc: LocalDocumentFile | null) {
  if (doc?.previewUrl) {
    URL.revokeObjectURL(doc.previewUrl)
  }
}

export function revokeAllLocalDocumentPreviews(state: LocalDocumentsState) {
  revokeLocalDocumentPreview(state.idFront)
  revokeLocalDocumentPreview(state.idBack)
  revokeLocalDocumentPreview(state.proofOfAddress)
}

export function validateLocalDocuments(state: LocalDocumentsState): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!state.idFront) {
    errors.idFrontFile = 'ID front image is required'
  }

  if (!state.proofOfAddress) {
    errors.proofOfAddressFile = 'Proof of address image is required'
  }

  return errors
}

export function sanitizeFilenameForId(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '')
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32) || 'document'
}
