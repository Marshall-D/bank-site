import { ExternalLink, FileWarning } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DocumentMetadata } from '@/lib/admin/applications/types'

const availabilityLabels: Record<DocumentMetadata['availability'], string> = {
  placeholder: 'Pending upload',
  ready: 'Available',
  unavailable: 'Unavailable',
}

const availabilityVariants: Record<
  DocumentMetadata['availability'],
  'default' | 'secondary' | 'destructive'
> = {
  placeholder: 'secondary',
  ready: 'default',
  unavailable: 'destructive',
}

export function ApplicationDocumentCard({
  document,
}: {
  document: DocumentMetadata
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{document.label}</p>
          {document.originalFilename && (
            <p className="text-sm text-muted-foreground">{document.originalFilename}</p>
          )}
        </div>
        <Badge variant={availabilityVariants[document.availability]}>
          {availabilityLabels[document.availability]}
        </Badge>
      </div>

      <p className="font-mono text-xs text-muted-foreground break-all">{document.fileId}</p>

      {document.url ? (
        <Button asChild size="sm" variant="outline">
          <a href={document.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View document
          </a>
        </Button>
      ) : document.availability === 'placeholder' ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileWarning className="h-4 w-4 shrink-0" />
          <span>Document metadata saved. File upload infrastructure not connected yet.</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Document URL is not available.</p>
      )}
    </div>
  )
}
