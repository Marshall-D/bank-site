import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Globe, Lock, Shield, TrendingUp, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND_NAME } from '@/lib/brand'
import { HOME_IMAGES } from '@/lib/site-images'

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

  const { branchExterior, branchInterior, skyline } = HOME_IMAGES

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/15 via-background to-background py-20 sm:py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-pretty sm:text-5xl md:text-6xl">
                  Banking for the modern era
                </h1>
                <p className="text-xl text-muted-foreground text-pretty">
                  Fast, secure, and transparent banking without the complexity. Open an account in minutes.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
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

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-light/30 to-secondary/10 blur-3xl" />
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-border shadow-lg">
                <Image
                  src={branchExterior.src}
                  alt={branchExterior.alt}
                  width={branchExterior.width}
                  height={branchExterior.height}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-pretty sm:text-4xl">
              Why choose {BRAND_NAME}?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Real branches, modern technology, and banking built for the Caribbean
            </p>
          </div>

          <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border shadow-md">
            <Image
              src={branchInterior.src}
              alt={branchInterior.alt}
              width={branchInterior.width}
              height={branchInterior.height}
              sizes="(max-width: 768px) 100vw, 1152px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-border">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-4">
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
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-pretty sm:text-4xl">Our Products</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Choose the account that fits your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {products.map((product) => (
              <Card key={product.name} className="flex flex-col border-border">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-4 text-2xl font-bold text-primary">{product.price}</div>
                  <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
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
      <section className="relative overflow-hidden py-20 text-primary-foreground sm:py-32">
        <Image
          src={skyline.src}
          alt={skyline.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-pretty sm:text-4xl">
            Ready to take control of your finances?
          </h2>
          <p className="mb-8 text-lg opacity-90 text-pretty">
            Join thousands of customers who trust {BRAND_NAME} with their banking needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Open Account Today</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
