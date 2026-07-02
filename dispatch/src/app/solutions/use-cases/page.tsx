import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Megaphone, TrendingUp, Headphones, Users } from "lucide-react"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "Use Cases — How Teams Run on Dispatch",
  description:
    "See how marketing, sales, customer support, and operations teams use Dispatch to organize, share, and govern their AI work.",
  alternates: { canonical: "/solutions/use-cases" },
  openGraph: {
    title: "Dispatch Use Cases — How Teams Run on Dispatch",
    description:
      "How marketing, sales, support, and operations teams use Dispatch.",
    url: "/solutions/use-cases",
    type: "website",
  },
}

const useCases = [
  {
    icon: Megaphone,
    title: "Marketing Teams",
    text: "Keep every campaign on-brand. Centralize the prompts, briefs, and brand context your marketers rely on so AI content stays consistent across every channel and writer.",
    href: "/blog",
  },
  {
    icon: TrendingUp,
    title: "Sales Teams",
    text: "Sell with your best playbook. Share the outreach, proposal, and follow-up prompts that actually convert, so every rep starts from proven work instead of a blank page.",
    href: "/blog",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    text: "Answer with one voice. Give support teams approved, up-to-date AI responses so customers get accurate, consistent help - no matter who picks up the ticket.",
    href: "/blog",
  },
  {
    icon: Users,
    title: "Operations & HR",
    text: "Standardize the work behind the scenes. Turn repeatable ops and HR processes - onboarding, policies, reporting - into governed AI workflows the whole company can reuse.",
    href: "/blog",
  },
]

export default function UseCasesPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-40 pb-28 sm:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
            Solutions
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
            Use cases for every team.
          </h1>
          <p className="mb-14 text-lg leading-relaxed text-[#666]">
            However your team uses AI, Dispatch turns scattered prompts and
            knowledge into a shared system. Here&apos;s how different teams put
            it to work.
          </p>
        </div>

        {/* 2-column grid — 4 use cases, two per row */}
        <div className="grid gap-6 sm:grid-cols-2">
          {useCases.map((uc) => {
            const Icon = uc.icon
            return (
              <div
                key={uc.title}
                className="flex flex-col rounded-3xl border border-[#E5E5E3] bg-[#F7F7F6] p-8 transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141414]">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="mb-3 text-2xl font-extrabold leading-tight text-[#141414]">
                  {uc.title}
                </h2>
                <p className="mb-7 flex-1 text-[16px] leading-relaxed text-[#666]">
                  {uc.text}
                </p>
                <Link
                  href={uc.href}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#141414] transition-all hover:gap-2.5"
                >
                  Explore the blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[#141414] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Don&apos;t see your team?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
            Dispatch works for any team running on AI. Tell us how your
            organization uses it and we&apos;ll show you the fastest path.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-block rounded-2xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
            >
              Book a Demo
            </Link>
            <Link
              href="/blog"
              className="inline-block rounded-2xl border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
