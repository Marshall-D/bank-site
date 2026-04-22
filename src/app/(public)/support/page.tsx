'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
    },
    {
      id: 'faq-2',
      question: 'How long does a transfer take?',
      answer: 'Transfers between FinanceHub accounts are instant. External transfers typically complete within 1-3 business days.',
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
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-pretty">
            How can we help?
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Get answers to common questions or contact our support team
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Mail,
                title: 'Email',
                description: 'Response within 2 hours',
                contact: 'support@financehub.com',
              },
              {
                icon: Phone,
                title: 'Phone',
                description: 'Available 24/7',
                contact: '+1 (800) FINANCE-HUB',
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
                <Card key={method.title} className="text-center border-border">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                    <p className="font-medium text-primary">{method.contact}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 sm:py-32 bg-card border-y border-border">
        <div className="container px-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Send us a message</h2>

          <Card className="border-border">
            <CardContent className="pt-6">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    required
                  />
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
                  <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                    Thanks for reaching out! We&apos;ll respond within 2 hours.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 flex items-center justify-between"
                >
                  <h3 className="font-semibold text-lg text-left">{faq.question}</h3>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  )}
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 border-t border-border pt-4 text-muted-foreground">
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
