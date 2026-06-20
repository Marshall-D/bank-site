'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { LocalDocumentFile } from '@/lib/application/localDocuments'
import { formatFileSize } from '@/lib/application/localDocuments'
import { ALLOWED_DOCUMENT_ACCEPT, MAX_DOCUMENT_SIZE_LABEL } from '@/lib/application/uploadConfig'
import { cn } from '@/lib/utils'
import { FieldError } from './FormField'

type DocumentUploadFieldProps = {
  id: string
  label: string
  hint?: string
  value: LocalDocumentFile | null
  error?: string
  required?: boolean
  onSelect: (file: File) => void
  onRemove: () => void
}

export function DocumentUploadField({
  id,
  label,
  hint,
  value,
  error,
  required = false,
  onSelect,
  onRemove,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onSelect(file)
    }
    event.target.value = ''
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </Label>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ALLOWED_DOCUMENT_ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
      />

      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-sm transition-colors hover:bg-muted/40',
            error && 'border-destructive/50'
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="font-medium">Choose image</span>
          <span className="text-muted-foreground">JPG or PNG, max {MAX_DOCUMENT_SIZE_LABEL}</span>
        </button>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-[4/3] w-full bg-muted/30">
            <Image
              src={value.previewUrl}
              alt={`Preview of ${value.name}`}
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{value.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <FieldError message={error} />
    </div>
  )
}
