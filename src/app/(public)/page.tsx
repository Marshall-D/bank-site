import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Shield, TrendingUp, Zap, Lock, Globe } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant transfers and real-time balance updates with zero delays.',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: '256-bit encryption and multi-factor authentication to protect your funds.',
    },
    {
      icon: TrendingUp,
      title: 'Better Rates',
      description: 'Competitive interest rates that beat traditional banks.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is yours. We never sell your information.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Send and receive money from 190+ countries worldwide.',
    },
    {
      icon: CheckCircle2,
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no surprises at checkout.',
    },
  ]

  const products = [
    {
      name: 'Checking Account',
      description: 'Manage daily expenses with unlimited transfers',
      price: 'Free',
    },
    {
      name: 'Savings Account',
      description: 'Watch your money grow with competitive interest',
      price: '4.5% APY',
    },
    {
      name: 'Business Account',
      description: 'Tools designed for modern entrepreneurs',
      price: 'From $9/mo',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/15 via-background to-background py-20 sm:py-32">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-pretty">
                  Banking for the modern era
                </h1>
                <p className="text-xl text-muted-foreground text-pretty">
                  Fast, secure, and transparent banking without the complexity. Open an account in minutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">Open Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>FDIC Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-light/30 to-secondary/10 blur-3xl" />
              <div className="relative bg-gradient-to-br from-card to-muted rounded-3xl p-8 border border-border shadow-lg">
                <div className="space-y-4">
                  <div className="h-12 w-32 bg-muted rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-40 bg-muted rounded" />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="h-3 w-20 bg-muted rounded mt-4" />
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-card border-t border-border">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-pretty">Why choose FinanceHub?</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              We&apos;ve reimagined banking from the ground up
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="rounded-lg bg-primary-light/15 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-pretty">Our Products</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Choose the account that fits your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.name} className="flex flex-col border-border">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-2xl font-bold text-primary mb-4">{product.price}</div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Unlimited transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Mobile app access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      24/7 support
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-pretty">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg opacity-90 mb-8 text-pretty">
            Join thousands of users who trust FinanceHub with their banking needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Open Account Today</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
