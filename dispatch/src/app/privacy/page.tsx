import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy — Dispatch",
  description: "How Dispatch collects, uses, and protects your information.",
}

const sections = [
  {
    heading: "1. Information we collect",
    body: [
      "Account information: when you create an account, we collect your name, email address, password (stored in hashed form by our authentication provider), and the name of your organization.",
      "Content you store: Dispatch exists to store your team's prompts, workflows, agents, context documents, and related metadata. This content is stored so we can provide the service to you and your organization, and is only accessible to members of your organization.",
      "Usage information: we collect standard technical information when you use the service, such as IP address, browser type, pages visited, and timestamps, to operate, secure, and improve the service.",
    ],
  },
  {
    heading: "2. How we use your information",
    body: [
      "We use your information to provide and maintain the service, authenticate you, secure your account, respond to support requests, and improve Dispatch. We do not sell your personal information, and we do not use the content you store in Dispatch to train AI models.",
    ],
  },
  {
    heading: "3. How your information is shared",
    body: [
      "Within your organization: content you create in Dispatch is visible to other members of your organization, in line with how the product works.",
      "Service providers: we rely on a small number of infrastructure providers to operate Dispatch — including Supabase (database and authentication) and Vercel (hosting). These providers process data on our behalf under their own security and privacy commitments.",
      "Legal requirements: we may disclose information if required to do so by law or in response to valid legal process.",
    ],
  },
  {
    heading: "4. Data retention",
    body: [
      "We retain your account information and stored content for as long as your account is active. If you delete your account or ask us to delete your data, we will delete it within a commercially reasonable period, except where retention is required by law.",
    ],
  },
  {
    heading: "5. Security",
    body: [
      "We take security seriously. Data is encrypted in transit, access to organization data is enforced at the database level through row-level security, and passwords are handled by our authentication provider and never stored in plain text. No method of transmission or storage is 100% secure, but we work to protect your information using industry-standard practices.",
    ],
  },
  {
    heading: "6. Your rights",
    body: [
      "You may access, correct, or delete your personal information at any time through your account settings, or by contacting us. Depending on where you live, you may have additional rights under applicable data protection laws (such as the GDPR or CCPA), including the right to request a copy of your data or to object to certain processing.",
    ],
  },
  {
    heading: "7. Cookies",
    body: [
      "Dispatch uses cookies that are strictly necessary to operate the service — primarily to keep you signed in. We do not use third-party advertising or tracking cookies.",
    ],
  },
  {
    heading: "8. Children",
    body: [
      "Dispatch is a business tool and is not directed at children under 16. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "9. Changes to this policy",
    body: [
      "We may update this policy from time to time. If we make material changes, we will notify you by email or through the service. The effective date below reflects the latest revision.",
    ],
  },
  {
    heading: "10. Contact us",
    body: [
      "If you have questions about this policy or how we handle your data, contact us at support@dispatchvault.com.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-40 pb-24">
        <h1 className="text-4xl font-extrabold text-[#141414] tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#666] mb-12">Effective date: June 10, 2026</p>
        <p className="text-[15px] text-[#333] leading-[1.8] mb-10">
          Dispatch (&ldquo;we,&rdquo; &ldquo;us&rdquo;) provides a platform for
          teams to organize, share, and protect their AI prompts, workflows,
          and assets, available at dispatchvault.com. This policy explains what
          information we collect, how we use it, and the choices you have.
        </p>
        {sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-bold text-[#141414] mb-3">
              {section.heading}
            </h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="text-[15px] text-[#333] leading-[1.8] mb-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
