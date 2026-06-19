import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { ContactForm } from "@/components/forms/contact-form"

export const metadata: Metadata = {
  title: "Talk to ZINC — Dispatch",
  description:
    "Talk to the ZINC team about setting up Dispatch for your organization — Enterprise governance, security controls, managed onboarding, and custom AI operating structure.",
  alternates: { canonical: "/contact" },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const { plan = "general" } = await searchParams

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-36 pb-28">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#666] font-medium mb-5">
          Talk to ZINC
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#141414] leading-tight tracking-tight mb-5">
          Set up Dispatch for your organization.
        </h1>
        <p className="text-lg text-[#666] leading-relaxed mb-10">
          Tell us about your team and what you’re trying to organize or govern. ZINC can help
          you create your initial context library, agents, workflows, governance rules, and AI
          operating structure — or scope an Enterprise plan with the controls and support you need.
        </p>

        <ContactForm plan={plan} />

        <p className="text-sm text-[#999] mt-10">
          Prefer to explore on your own?{" "}
          <Link href="/signup?plan=free" className="font-medium text-[#141414] underline underline-offset-4 hover:text-[#333]">
            Create a free account
          </Link>{" "}
          or{" "}
          <Link href="/pricing" className="font-medium text-[#141414] underline underline-offset-4 hover:text-[#333]">
            see pricing
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  )
}
