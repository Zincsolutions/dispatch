import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "FAQ — Organizational AI, Governance & Dispatch",
  description:
    "Answers to common questions about organizing AI across teams, AI governance, prompt management, context engineering, and how Dispatch works.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Dispatch FAQ — Organizational AI & Governance",
    description:
      "Common questions about running AI across an organization and how Dispatch helps.",
    url: "/faq",
    type: "website",
  },
}

const faqs: { q: string; a: string }[] = [
  {
    q: "What is Dispatch?",
    a: "Dispatch is the system of record for AI - one platform where an organization centralizes its prompts, workflows, AI tools, company context, and outputs. Instead of every employee using AI in isolation, Dispatch turns scattered AI activity into shared, governed, organizational capability that compounds over time.",
  },
  {
    q: "What is an 'AI operating system,' and why do we need one before adding more AI tools?",
    a: "An AI operating system is the shared layer that sits underneath all your AI tools: the prompts, context, standards, and governance that make those tools produce consistent, on-brand results. Buying another tool rarely fixes the real bottleneck, which is that knowledge and context are not shared. Putting the operating system in place first means every new tool plugs into something coherent instead of adding more chaos.",
  },
  {
    q: "How is Dispatch different from keeping prompts in a shared doc or wiki?",
    a: "A doc can store text, but it cannot version prompts, control who can edit or approve them, connect them to company context, or tell you which ones are actually trusted. Dispatch treats prompts and workflows as managed assets with ownership, status, and governance - so your best work is discoverable and reliable, not buried in a document nobody maintains.",
  },
  {
    q: "Does AI governance slow my team down?",
    a: "Done badly, governance feels like a brake. Done well, it is what lets a team move fast with confidence - clear approvals, brand consistency, and guardrails mean people can use AI boldly without worrying they are going off-script or exposing the company to risk. Governance in Dispatch is about confidence, not control.",
  },
  {
    q: "What happens to our AI knowledge when a key employee leaves?",
    a: "If your most AI-savvy person keeps their best prompts and workflows in their own head and chat history, that knowledge walks out the door with them. Dispatch captures those assets in a shared system so they become institutional memory - the organization keeps the capability even as people come and go.",
  },
  {
    q: "Why do good prompts still produce inconsistent or off-brand results?",
    a: "A great prompt with no company context still produces generic output, because the model does not know your brand voice, your facts, or your standards. This is the context problem, and the fix is context engineering: systematically supplying the AI with the right company knowledge. Dispatch lets you connect prompts and workflows to a shared foundation of context so results come out accurate and on-brand.",
  },
  {
    q: "Can different departments use Dispatch together?",
    a: "Yes - that is the point. Sales, marketing, support, HR, and engineering can each maintain their own assets while drawing on shared standards and context, instead of every team quietly building its own AI silo. Connecting that work is where the biggest gains come from, because good practices spread across the whole organization.",
  },
  {
    q: "How does Dispatch stop teams from duplicating the same AI work?",
    a: "Most teams rewrite the same prompts every week because there is no shared library, no versioning, and no easy way to find what already exists. Dispatch gives you a searchable library of prompts, workflows, and assets with clear ownership, so people reuse and improve proven work instead of reinventing it from scratch.",
  },
  {
    q: "How do we scale AI across the whole organization without losing control?",
    a: "Scaling AI usually fails in one of two ways: total chaos, or lockdown so tight that no one adopts it. The path between them is governed adoption - shared assets and context for consistency, lightweight governance for safety, and clear ownership so the system grows without fragmenting. Dispatch is built to support that phased, organization-wide rollout.",
  },
  {
    q: "Can Dispatch help our content get cited by AI search and answer engines (AEO)?",
    a: "Indirectly, yes. Answer engine optimization depends on producing accurate, well-structured, on-brand content consistently - which is exactly what a shared system of prompts, context, and standards makes possible. By keeping the briefs, prompts, and brand context behind your content organized in one place, Dispatch helps your team produce the kind of trustworthy, consistent material that AI search engines are more likely to surface and cite.",
  },
]

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-40 pb-28 sm:pt-44">
        <header className="text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
            FAQ
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mb-14 text-lg leading-relaxed text-[#666]">
            Common questions about running AI across an organization - governance,
            collaboration, knowledge, and how Dispatch fits in.
          </p>
        </header>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[18px] font-bold text-[#141414]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#999] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-[16px] leading-[1.75] text-[#444]">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[#141414] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
            Talk to us about turning your team&apos;s AI chaos into a system you
            can run on.
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
              Read the Blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
