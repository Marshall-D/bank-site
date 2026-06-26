'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, MessageCircle, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BRAND_EMAILS, BRAND_NAME, BRAND_SHORT } from '@/lib/brand'
import { SUPPORT_IMAGES } from '@/lib/site-images'

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { helpDesk } = SUPPORT_IMAGES

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <>
      {/* Hero Section */}
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

      {/* Contact Methods */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
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
              {
                icon: MessageCircle,
                title: 'Live Chat',
                description: 'Instant support',
                contact: 'Start Chat',
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

      {/* Contact Form */}
      <section className="border-y border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Send us a message</h2>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border shadow-md lg:min-h-0">
              <Image
                src={helpDesk.src}
                alt={helpDesk.alt}
                width={helpDesk.width}
                height={helpDesk.height}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
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
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>

                  {isSubmitted && (
                    <div className="rounded-lg bg-primary/10 p-4 text-sm font-medium text-primary">
                      Thanks for reaching out! We&apos;ll respond within 2 hours.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
