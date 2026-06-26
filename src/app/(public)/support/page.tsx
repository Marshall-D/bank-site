'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BRAND_EMAILS, BRAND_NAME, BRAND_SHORT } from '@/lib/brand'
import { submitSupportMessage } from '@/lib/support/api'
import { SUPPORT_FIELD_LIMITS } from '@/lib/support/constants'
import { getSupportErrorMessage } from '@/lib/support/errors'
import { validateSupportForm } from '@/lib/support/validation'
import { SUPPORT_IMAGES } from '@/lib/site-images'

const emptyForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
}

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { helpDesk } = SUPPORT_IMAGES

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'Go to the sign-in page, click "Forgot?", enter your email, and submit the reset request. Our support team will follow up to help you regain access.',
    },
    {
      id: 'faq-2',
      question: 'How long does a transfer take?',
      answer: `Transfers between ${BRAND_SHORT} accounts are instant. External transfers typically complete within 1-3 business days.`,
    },
    {
      id: 'faq-3',
      question: 'Is my money safe?',
      answer: 'Yes. Your accounts are FDIC insured and all transactions are protected by 256-bit encryption.',
    },
    {
      id: 'faq-4',
      question: 'Can I close my account?',
      answer: 'Yes, you can close your account anytime. Withdraw remaining funds first, then contact support.',
    },
    {
      id: 'faq-5',
      question: 'Do you charge international fees?',
      answer: 'International transfers are available with competitive rates. Contact support for specific pricing.',
    },
    {
      id: 'faq-6',
      question: 'How do I verify my identity?',
      answer: 'We use secure document verification. You can upload your ID during account creation or in settings.',
    },
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setTicketId(null)

    const errors = validateSupportForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const result = await submitSupportMessage(form)
      setTicketId(result.ticketId)
      setForm(emptyForm)
    } catch (error) {
      setSubmitError(getSupportErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/10 to-transparent py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h1 className="mb-6 text-4xl font-bold text-pretty sm:text-5xl">How can we help?</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-pretty">
              Get answers to common questions or contact our support team
            </p>
          </div>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border shadow-lg">
            <Image
              src={helpDesk.src}
              alt={helpDesk.alt}
              width={helpDesk.width}
              height={helpDesk.height}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: Mail,
                title: 'Email',
                description: 'Response within 2 hours',
                contact: BRAND_EMAILS.support,
              },
              {
                icon: Phone,
                title: 'Phone',
                description: 'Available 24/7',
                contact: '+1 (800) 272-2253',
              },
            ].map((method) => {
              const Icon = method.icon
              return (
                <Card key={method.title} className="border-border text-center">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{method.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{method.description}</p>
                    <p className="font-medium text-primary">{method.contact}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Send us a message</h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="relative aspect-[4/5] min-h-[280px] w-full overflow-hidden rounded-2xl border border-border shadow-md">
              <Image
                src={helpDesk.src}
                alt={helpDesk.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-semibold">Real people, real help</p>
                <p className="mt-1 text-sm text-white/90">
                  Our {BRAND_NAME} support team is ready to assist you.
                </p>
              </div>
            </div>

            <Card className="border-border">
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        maxLength={SUPPORT_FIELD_LIMITS.nameMax}
                        required
                        disabled={isSubmitting}
                      />
                      {fieldErrors.name && (
                        <p className="text-sm text-destructive">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        maxLength={SUPPORT_FIELD_LIMITS.emailMax}
                        required
                        disabled={isSubmitting}
                      />
                      {fieldErrors.email && (
                        <p className="text-sm text-destructive">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      maxLength={SUPPORT_FIELD_LIMITS.subjectMax}
                      required
                      disabled={isSubmitting}
                    />
                    {fieldErrors.subject && (
                      <p className="text-sm text-destructive">{fieldErrors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message">Message</Label>
                      <span className="text-xs text-muted-foreground">
                        {form.message.length}/{SUPPORT_FIELD_LIMITS.messageMax}
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      maxLength={SUPPORT_FIELD_LIMITS.messageMax}
                      rows={5}
                      className="field-sizing-fixed resize-y"
                      required
                      disabled={isSubmitting}
                    />
                    {fieldErrors.message && (
                      <p className="text-sm text-destructive">{fieldErrors.message}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      {submitError}
                    </div>
                  )}

                  {ticketId && (
                    <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary">
                      Thanks for reaching out! Your reference is{' '}
                      <span className="font-semibold">{ticketId}</span>. We&apos;ll respond within 2
                      hours.
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.id}
                className="cursor-pointer border-border transition-colors hover:bg-muted/50"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="flex w-full items-center justify-between p-6"
                >
                  <h3 className="text-left text-lg font-semibold">{faq.question}</h3>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {expandedFAQ === faq.id && (
                  <div className="border-t border-border px-6 pb-6 pt-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
