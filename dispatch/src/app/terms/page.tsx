import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "Terms of Service — Dispatch",
  description: "The terms that govern your use of Dispatch.",
}

const sections = [
  {
    heading: "1. The service",
    body: [
      "Dispatch is a platform that lets teams organize, share, and manage their AI prompts, workflows, agents, and related assets. These terms govern your access to and use of Dispatch at dispatchvault.com. By creating an account or using the service, you agree to these terms.",
    ],
  },
  {
    heading: "2. Your account",
    body: [
      "You must provide accurate information when creating an account and keep your credentials secure. You are responsible for activity that occurs under your account. If you create an organization, you are responsible for the users you allow into it.",
    ],
  },
  {
    heading: "3. Your content",
    body: [
      "You retain full ownership of the prompts, workflows, documents, and other content you store in Dispatch. You grant us only the limited rights needed to host, display, and process that content in order to provide the service to you and your organization. We do not use your content to train AI models, and we do not share it outside your organization except as described in our Privacy Policy.",
    ],
  },
  {
    heading: "4. Acceptable use",
    body: [
      "You agree not to misuse the service. This includes: attempting to access another organization's data; probing, scanning, or testing the vulnerability of the service without authorization; using the service to store or distribute unlawful content; reselling the service without our permission; or interfering with the normal operation of the platform.",
    ],
  },
  {
    heading: "5. Early access and fees",
    body: [
      "Dispatch is currently in early access. Features may change, and a free plan is available. If we introduce paid plans, we will communicate pricing clearly before you are charged anything. We will never charge you without your explicit agreement to a paid plan.",
    ],
  },
  {
    heading: "6. Termination",
    body: [
      "You may stop using Dispatch and delete your account at any time. We may suspend or terminate your access if you materially violate these terms, if required by law, or if we discontinue the service — in which case we will make reasonable efforts to give you notice and an opportunity to export your content.",
    ],
  },
  {
    heading: "7. Disclaimers",
    body: [
      "The service is provided “as is” and “as available.” While we work hard to keep Dispatch reliable and secure, we do not warrant that the service will be uninterrupted, error-free, or that stored content will never be lost. You are responsible for maintaining copies of content that is critical to your business.",
    ],
  },
  {
    heading: "8. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, Dispatch and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenues, or data, arising from your use of the service. Our total liability for any claim arising out of these terms or the service is limited to the greater of the amount you paid us in the twelve months before the claim or one hundred U.S. dollars.",
    ],
  },
  {
    heading: "9. Changes to these terms",
    body: [
      "We may update these terms from time to time. If we make material changes, we will notify you by email or through the service before they take effect. Continued use of the service after changes take effect constitutes acceptance of the revised terms.",
    ],
  },
  {
    heading: "10. Contact",
    body: [
      "Questions about these terms? Contact us at support@dispatchvault.com.",
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-40 pb-24">
        <h1 className="text-4xl font-extrabold text-[#141414] tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-[#666] mb-12">Effective date: June 10, 2026</p>
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
