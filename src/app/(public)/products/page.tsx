import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, TrendingUp, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function ProductsPage() {
  const products = [
    {
      icon: CheckCircle2,
      name: 'Checking Account',
      description: 'For everyday banking',
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
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-pretty">
            Banking Products Built for You
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Choose the perfect account for your needs
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card
                  key={product.name}
                  className={`flex flex-col border-border transition-all ${
                    product.featured ? 'ring-2 ring-primary md:scale-105' : ''
                  }`}
                >
                  {product.featured && (
                    <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-semibold rounded-t-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-primary">{product.apy}</div>
                      <p className="text-sm text-muted-foreground mt-1">No hidden fees</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
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
      <section className="py-20 sm:py-32 bg-card border-t border-border">
        <div className="container px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Checking</th>
                  <th className="text-center py-4 px-4 font-semibold">Savings</th>
                  <th className="text-center py-4 px-4 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">{row.checking}</td>
                    <td className="text-center py-4 px-4">{row.savings}</td>
                    <td className="text-center py-4 px-4">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'Are accounts FDIC insured?',
                answer: 'Yes, all FinanceHub accounts are FDIC insured up to $250,000 per account holder.',
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
