import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
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
    { year: '2020', event: 'FinanceHub founded with a mission to revolutionize banking' },
    { year: '2021', event: 'Reached 100,000 active users and expanded to 50+ countries' },
    { year: '2022', event: 'Launched business accounts and multi-currency support' },
    { year: '2023', event: 'Introduced API for developers and business integrations' },
    { year: '2024', event: 'Became the fastest-growing fintech platform in the region' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-pretty">
            About FinanceHub
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            We&apos;re on a mission to make banking simple, transparent, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  FinanceHub was born from frustration. Our founders experienced the pain of outdated banking systems, hidden fees, and poor user experiences.
                </p>
                <p>
                  In 2020, they decided to build something better—a bank designed for the modern world.
                </p>
                <p>
                  Today, FinanceHub serves over 2 million customers across 190 countries, and we&apos;re just getting started.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border">
              <div className="space-y-4 text-center">
                <div className="text-4xl font-bold text-primary">2M+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold">190+</div>
                  <div className="text-xs text-muted-foreground">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$5B+</div>
                  <div className="text-xs text-muted-foreground">Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32 bg-card border-t border-border">
        <div className="container px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="border-border">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{value.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {value.description}
                      </CardDescription>
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
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {item.year}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-1 h-12 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8 pt-2">
                  <p className="text-foreground font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 sm:py-32 bg-card border-t border-border">
        <div className="container px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Co-founder', initials: 'SJ' },
              { name: 'Michael Chen', role: 'CTO & Co-founder', initials: 'MC' },
              { name: 'Emily Rodriguez', role: 'Chief Product Officer', initials: 'ER' },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
