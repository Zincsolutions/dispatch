import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { FaqCenter } from "@/components/faq/FaqCenter"
import { faqCategories, allFaqItems, faqAnswerText } from "@/lib/faq"

const SITE = "https://www.dispatchvault.com"

export const metadata: Metadata = {
  title: "AI Knowledge Center — 50 FAQs on Organizational AI & Governance",
  description:
    "Answers to 50 common questions about AI operating systems, organizational AI, AI governance, prompt management, team collaboration, and AI adoption.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Dispatch AI Knowledge Center — FAQs on Organizational AI",
    description:
      "50 answers on AI operating systems, governance, prompt management, collaboration, and adoption.",
    url: "/faq",
    type: "website",
  },
}

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems().map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item) },
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Knowledge Center",
        item: `${SITE}/faq`,
      },
    ],
  }

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dispatch",
    url: SITE,
    logo: `${SITE}/dispatch-logo.svg`,
    description: "The system of record for AI.",
  }

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      {[faqLd, breadcrumbLd, organizationLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />
      <FaqCenter categories={faqCategories} />
      <Footer />
    </div>
  )
}
