export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function getFilenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const match = /filename="([^"]+)"/i.exec(header)
  return match?.[1] ?? null
}
