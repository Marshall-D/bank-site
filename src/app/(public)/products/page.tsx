import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, TrendingUp, Briefcase } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND_NAME } from '@/lib/brand'
import { PRODUCT_IMAGES, type SiteImage } from '@/lib/site-images'

export default function ProductsPage() {
  const { hero, checking, savings, business } = PRODUCT_IMAGES

  const products: Array<{
    icon: typeof CheckCircle2
    name: string
    description: string
    features: string[]
    apy: string
    cta: string
    image: SiteImage
    featured?: boolean
  }> = [
    {
      icon: CheckCircle2,
      name: 'Checking Account',
      description: 'For everyday banking',
      image: checking,
      features: [
        'Unlimited transfers',
        'No monthly fees',
        'Instant notifications',
        'Mobile app access',
        'Bill pay included',
        'ATM access',
      ],
      apy: 'Free',
      cta: 'Open Account',
    },
    {
      icon: TrendingUp,
      name: 'Savings Account',
      description: 'Grow your wealth',
      image: savings,
      features: [
        '4.5% APY',
        'No withdrawal limits',
        'Automatic savings goals',
        'Interest compounds daily',
        'FDIC insured',
        'Mobile banking',
      ],
      apy: '4.5%',
      cta: 'Open Account',
      featured: true,
    },
    {
      icon: Briefcase,
      name: 'Business Account',
      description: 'For entrepreneurs',
      image: business,
      features: [
        'Unlimited transactions',
        'Invoice management',
        'Tax reports',
        'Team access',
        'API integration',
        'Dedicated support',
      ],
      apy: 'From $9/mo',
      cta: 'Start Free Trial',
    },
  ]

  const comparison = [
    { feature: 'Monthly Fee', checking: 'Free', savings: 'Free', business: '$9/mo' },
    { feature: 'Interest Rate', checking: 'No', savings: '4.5% APY', business: 'No' },
    { feature: 'Transfers', checking: 'Unlimited', savings: 'Unlimited', business: 'Unlimited' },
    { feature: 'Mobile App', checking: 'Yes', savings: 'Yes', business: 'Yes' },
    { feature: 'API Access', checking: 'No', savings: 'No', business: 'Yes' },
    { feature: 'Team Members', checking: 'N/A', savings: 'N/A', business: 'Unlimited' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/10 to-transparent py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h1 className="mb-6 text-4xl font-bold text-pretty sm:text-5xl">
              Banking Products Built for You
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-pretty">
              Choose the perfect account for your needs
            </p>
          </div>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border shadow-lg">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card
                  key={product.name}
                  className={`flex flex-col overflow-hidden border-border transition-all ${
                    product.featured ? 'ring-2 ring-primary md:scale-105' : ''
                  }`}
                >
                  {product.featured && (
                    <div className="bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-border">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      width={product.image.width}
                      height={product.image.height}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-primary">{product.apy}</div>
                      <p className="mt-1 text-sm text-muted-foreground">No hidden fees</p>
                    </div>

                    <div className="mb-6 space-y-3">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button
                      className="w-full"
                      variant={product.featured ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href="/register">{product.cta}</Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left font-semibold">Feature</th>
                  <th className="px-4 py-4 text-center font-semibold">Checking</th>
                  <th className="px-4 py-4 text-center font-semibold">Savings</th>
                  <th className="px-4 py-4 text-center font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-4 font-medium">{row.feature}</td>
                    <td className="px-4 py-4 text-center">{row.checking}</td>
                    <td className="px-4 py-4 text-center">{row.savings}</td>
                    <td className="px-4 py-4 text-center">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'Are accounts FDIC insured?',
                answer: `Yes, all ${BRAND_NAME} accounts are FDIC insured up to $250,000 per account holder.`,
              },
              {
                question: 'When do I start earning interest?',
                answer: 'Interest on savings accounts compounds daily and is credited monthly.',
              },
              {
                question: 'Can I switch between account types?',
                answer: 'Yes, you can open multiple accounts or upgrade at any time. There are no penalties.',
              },
              {
                question: 'What are the fees?',
                answer: 'Checking and Savings accounts have no monthly fees. Business accounts start at $9/mo.',
              },
            ].map((item, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
