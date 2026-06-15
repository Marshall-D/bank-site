import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND_NAME, BRAND_SHORT } from '@/lib/brand'
import { ABOUT_IMAGES } from '@/lib/site-images'

export default function AboutPage() {
  const {
    teamEntrance,
    branchInterior,
    milestone2020,
    headshotCeo,
    headshotCto,
    headshotCpo,
  } = ABOUT_IMAGES

  const leadership = [
    { name: 'Sarah Johnson', role: 'CEO & Co-founder', image: headshotCeo },
    { name: 'Michael Chen', role: 'CTO & Co-founder', image: headshotCto },
    { name: 'Emily Rodriguez', role: 'Chief Product Officer', image: headshotCpo },
  ]

  const values = [
    {
      title: 'Transparency',
      description: 'No hidden fees, no surprises. Every charge is clear and justified.',
    },
    {
      title: 'Security',
      description: 'Your funds and data are protected with military-grade encryption.',
    },
    {
      title: 'Innovation',
      description: 'We continuously improve to serve you better with cutting-edge technology.',
    },
    {
      title: 'Accessibility',
      description: 'Banking should be simple. We make it easy for everyone.',
    },
  ]

  const timeline = [
    {
      year: '2020',
      event: `${BRAND_SHORT} founded with a mission to bring modern banking to the Caribbean`,
      image: milestone2020,
    },
    { year: '2021', event: 'Reached 100,000 active customers and expanded across the region' },
    { year: '2022', event: 'Launched business accounts and multi-currency support' },
    { year: '2023', event: 'Introduced digital banking API for business integrations' },
    { year: '2024', event: 'Opened new branches and became a fastest-growing bank in the region' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/10 to-transparent py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h1 className="mb-6 text-4xl font-bold text-pretty sm:text-5xl">
              About {BRAND_NAME}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-pretty">
              We&apos;re on a mission to make banking simple, transparent, and accessible across the Caribbean.
            </p>
          </div>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border shadow-lg">
            <Image
              src={teamEntrance.src}
              alt={teamEntrance.alt}
              width={teamEntrance.width}
              height={teamEntrance.height}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {BRAND_NAME} was born from a simple belief: Caribbean communities deserve banking
                  that is modern, transparent, and deeply local.
                </p>
                <p>
                  In 2020, our founders set out to combine the trust of traditional banking with
                  technology built for today.
                </p>
                <p>
                  Today we serve customers across the region from physical branches and digital
                  channels — and we&apos;re just getting started.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={branchInterior.src}
                  alt={branchInterior.alt}
                  width={branchInterior.width}
                  height={branchInterior.height}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="space-y-4 text-center">
                  <div className="text-4xl font-bold text-primary">2M+</div>
                  <div className="text-muted-foreground">Active Customers</div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">190+</div>
                    <div className="text-xs text-muted-foreground">Countries Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$5B+</div>
                    <div className="text-xs text-muted-foreground">Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="border-border">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-lg bg-primary-light/15 p-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{value.title}</CardTitle>
                      <CardDescription className="mt-2">{value.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.year}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="mt-2 h-12 w-1 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8 pt-2">
                  <p className="font-medium text-foreground">{item.event}</p>
                  {'image' in item && item.image ? (
                    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        sizes="(max-width: 768px) 100vw, 672px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border bg-card py-20 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Leadership Team</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {leadership.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-primary-light/40 shadow-md">
                  <Image
                    src={member.image.src}
                    alt={member.image.alt}
                    width={member.image.width}
                    height={member.image.height}
                    sizes="112px"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
