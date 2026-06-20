import { Label } from '@/components/ui/label'

type FieldErrorProps = {
  message?: string
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

export function FormField({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}
