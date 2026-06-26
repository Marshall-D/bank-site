import { BRAND_NAME } from '@/lib/brand'

type LegalDocumentProps = {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalDocument({ title, lastUpdated, children }: LegalDocumentProps) {
  return (
    <article className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {BRAND_NAME} · Last updated {lastUpdated}
          </p>
        </header>
        <div className="legal-prose space-y-8 text-sm leading-relaxed text-foreground sm:text-base">
          {children}
        </div>
      </div>
    </article>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold sm:text-xl">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  )
}
