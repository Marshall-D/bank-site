import { API_BASE_URL } from '@/lib/api'
import { ApplicationApiError } from './errors'
import type { ApiErrorResponse, ApiSuccessResponse } from './types'
import type { LocalDocumentFile, LocalDocumentSlot, LocalDocumentsState } from './localDocuments'
import { MAX_DOCUMENT_SIZE_BYTES } from './uploadConfig'

export type UploadSignature = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  publicId: string
  maxBytes: number
  uploadUrl: string
}

export type UploadedDocumentIds = {
  idFront: string
  idBack?: string
  proofOfAddress: string
}

async function fetchUploadSignature(slot: LocalDocumentSlot): Promise<UploadSignature> {
  const response = await fetch(`${API_BASE_URL}/api/v1/uploads/signature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slot }),
  })

  const data = (await response.json()) as
    | ApiSuccessResponse<UploadSignature>
    | ApiErrorResponse

  if (!response.ok || !data.success) {
    throw new ApplicationApiError(data as ApiErrorResponse)
  }

  return data.data
}

async function uploadFileToCloudinary(
  file: File,
  signature: UploadSignature
): Promise<string> {
  if (file.size > signature.maxBytes || file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new Error('Document file is too large. Maximum size is 10 MB.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signature.apiKey)
  formData.append('timestamp', String(signature.timestamp))
  formData.append('signature', signature.signature)
  formData.append('folder', signature.folder)
  formData.append('public_id', signature.publicId)

  const response = await fetch(signature.uploadUrl, {
    method: 'POST',
    body: formData,
  })

  const result = (await response.json()) as {
    public_id?: string
    error?: { message?: string }
  }

  if (!response.ok || !result.public_id) {
    throw new Error(
      result.error?.message || 'Failed to upload document. Please try again.'
    )
  }

  return result.public_id
}

async function uploadDocumentSlot(doc: LocalDocumentFile): Promise<string> {
  const signature = await fetchUploadSignature(doc.slot)
  return uploadFileToCloudinary(doc.file, signature)
}

export async function uploadApplicationDocuments(
  localDocuments: LocalDocumentsState
): Promise<UploadedDocumentIds> {
  if (!localDocuments.idFront || !localDocuments.proofOfAddress) {
    throw new Error('Required document images are missing.')
  }

  const [idFront, proofOfAddress, idBack] = await Promise.all([
    uploadDocumentSlot(localDocuments.idFront),
    uploadDocumentSlot(localDocuments.proofOfAddress),
    localDocuments.idBack
      ? uploadDocumentSlot(localDocuments.idBack)
      : Promise.resolve(undefined),
  ])

  return {
    idFront,
    proofOfAddress,
    ...(idBack ? { idBack } : {}),
  }
}
