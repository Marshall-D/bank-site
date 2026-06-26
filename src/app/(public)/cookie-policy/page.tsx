import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalDocument, LegalSection } from '@/components/legal/LegalDocument'
import { BRAND_EMAILS, BRAND_NAME, BRAND_SHORT } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Cookie Policy | ${BRAND_SHORT}`,
  description: `How ${BRAND_NAME} uses cookies and similar technologies on its website.`,
}

export default function CookiePolicyPage() {
  return (
    <LegalDocument title="Cookie Policy" lastUpdated="20 January 2026">
      <LegalSection title="1. What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help
          websites function correctly, remember preferences, and understand how visitors use the
          site. Similar technologies include local storage, session storage, and pixel tags. This
          Cookie Policy explains how {BRAND_NAME} (&quot;{BRAND_SHORT}&quot;) uses these technologies
          on our public website and online banking platforms.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use cookies">
        <p>We use cookies and similar technologies for the following purposes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Strictly necessary</strong> — enable core
            functionality such as secure login, session management, fraud prevention, and load
            balancing. These cannot be disabled without affecting service operation.
          </li>
          <li>
            <strong className="text-foreground">Functional</strong> — remember choices such as language
            preference and form progress during account applications.
          </li>
          <li>
            <strong className="text-foreground">Analytics</strong> — help us understand how visitors
            navigate our website so we can improve content, performance, and usability. Data is
            aggregated where possible.
          </li>
          <li>
            <strong className="text-foreground">Security</strong> — detect unusual activity and protect
            against automated abuse.
          </li>
        </ul>
        <p>
          We do not use cookies to sell your personal information to third parties for advertising
          purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Cookies we may set">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold text-foreground">Name / type</th>
                <th className="py-2 pr-4 font-semibold text-foreground">Purpose</th>
                <th className="py-2 font-semibold text-foreground">Duration</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-3 pr-4">Session cookie</td>
                <td className="py-3 pr-4">Maintains your authenticated session in online banking</td>
                <td className="py-3">Session</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">Security token</td>
                <td className="py-3 pr-4">Protects against cross-site request forgery</td>
                <td className="py-3">Session</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">Preference cookie</td>
                <td className="py-3 pr-4">Stores interface and accessibility preferences</td>
                <td className="py-3">Up to 12 months</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4">Analytics cookie</td>
                <td className="py-3 pr-4">Measures page views and navigation patterns</td>
                <td className="py-3">Up to 24 months</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Exact cookie names may change as we update our platforms. The purposes and categories above
          remain accurate.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party cookies">
        <p>
          Some cookies may be set by service providers that assist with hosting, analytics, or security.
          These providers process data on our instructions and under contractual data protection
          obligations. We do not permit third parties to use cookies collected on our site for their
          own independent marketing without your consent.
        </p>
      </LegalSection>

      <LegalSection title="5. Managing cookies">
        <p>
          Most browsers allow you to refuse, delete, or block cookies through settings. Blocking
          strictly necessary cookies may prevent you from logging in or completing transactions.
          Functional and analytics cookies can often be managed separately where we provide a consent
          tool on our website.
        </p>
        <p>
          To learn more about browser controls, visit your browser&apos;s help documentation. For
          mobile applications, refer to your device privacy settings.
        </p>
      </LegalSection>

      <LegalSection title="6. Relationship to our Privacy Policy">
        <p>
          Information collected through cookies may constitute personal data. How we handle that
          information is described in our{' '}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          . Where required by law, we obtain consent before placing non-essential cookies.
        </p>
      </LegalSection>

      <LegalSection title="7. Updates">
        <p>
          We may update this Cookie Policy to reflect changes in technology, regulation, or our
          practices. The &quot;Last updated&quot; date at the top of this page indicates when the
          policy was last revised.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Questions about our use of cookies may be sent to{' '}
          <a href={`mailto:${BRAND_EMAILS.privacy}`} className="text-primary hover:underline">
            {BRAND_EMAILS.privacy}
          </a>{' '}
          or via our{' '}
          <Link href="/support" className="text-primary hover:underline">
            support page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
