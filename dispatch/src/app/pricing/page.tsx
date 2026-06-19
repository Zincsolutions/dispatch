import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { PricingHero } from "@/components/pricing/PricingHero"
import { FreePlanStrip } from "@/components/pricing/FreePlanStrip"
import { PricingCards } from "@/components/pricing/PricingCards"
import { ComparisonTable } from "@/components/pricing/ComparisonTable"
import { PricingPhilosophy } from "@/components/pricing/PricingPhilosophy"
import { PricingFAQ } from "@/components/pricing/PricingFAQ"
import { PricingBottomCTA } from "@/components/pricing/PricingBottomCTA"
import { PricingViewTracker } from "@/components/pricing/PricingViewTracker"

export const metadata: Metadata = {
  title: { absolute: "Dispatch Pricing | AI System of Record for Teams" },
  description:
    "Explore Dispatch pricing for teams managing AI context, prompts, agents, workflows, images, and governance across ChatGPT, Claude, Midjourney, Gemini, and more.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Dispatch Pricing | AI System of Record for Teams",
    description:
      "Pricing built for teams managing AI, not just seats. Start free, then scale as your organization's AI footprint grows.",
    url: "https://www.dispatchvault.com/pricing",
    siteName: "Dispatch",
    type: "website",
  },
}

export default function PricingPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <PricingViewTracker />
      <Navbar />
      <PricingHero />
      <FreePlanStrip />
      <section className="pt-16 pb-8">
        <PricingCards />
      </section>
      <ComparisonTable />
      <PricingPhilosophy />
      <PricingFAQ />
      <PricingBottomCTA />
      <Footer />
    </div>
  )
}
