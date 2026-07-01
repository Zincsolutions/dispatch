import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Lock,
  Search,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/homepage/AnimateOnScroll"

export const metadata: Metadata = {
  title: "Product — The Dispatch AI Vault, Feature by Feature",
  description:
    "Explore everything inside Dispatch: the Prompt Library, AI Foundation, Agents, Workflows, Image Library, and Governance Center — and how each one turns scattered AI work into a system your team can run on.",
  alternates: { canonical: "/product" },
  openGraph: {
    title: "The Dispatch Product — Features & Benefits",
    description:
      "A detailed look at every layer of the Dispatch AI Vault and the benefits it delivers for your team.",
    url: "/product",
    type: "website",
  },
}

// Accent trio shared with the homepage (OrganizeShareGovern pillars).
const accents = {
  teal: { iconBg: "rgba(157,218,215,0.25)", check: "#4FA8A2" },
  peach: { iconBg: "rgba(245,180,140,0.25)", check: "#D98A52" },
  yellow: { iconBg: "rgba(253,255,96,0.45)", check: "#C9A227" },
}

type AccentKey = keyof typeof accents

const features: {
  icon: typeof BookOpen
  accent: AccentKey
  eyebrow: string
  title: string
  text: string
  capabilities: string[]
  benefit: string
}[] = [
  {
    icon: BookOpen,
    accent: "teal",
    eyebrow: "Prompt Library",
    title: "Every proven prompt, in one searchable place.",
    text: "Stop rewriting the same prompts in scattered chat threads. The Prompt Library gives your organization a structured home for prompts and master prompts — titled, described, tagged, and ready to run.",
    capabilities: [
      "Store prompts with structured titles, descriptions, and tags",
      "Run any prompt directly in ChatGPT or Claude with one click",
      "Mark assets as Approved, Draft, Experimental, or Needs Review",
      "Improve prompts over time so everyone builds from what already works",
    ],
    benefit:
      "Your best prompts stop living in one person's chat history and start compounding across the whole team.",
  },
  {
    icon: Layers,
    accent: "peach",
    eyebrow: "AI Foundation",
    title: "Shared context that makes every AI tool smarter.",
    text: "The most important input to AI isn't the prompt — it's the context. The AI Foundation centralizes your brand voice, messaging frameworks, SOPs, and approved source materials so every teammate and every tool starts from the same truth.",
    capabilities: [
      "Brand voice, messaging frameworks, and image style guides",
      "SOPs, playbooks, and company context in one approved source",
      "Reusable prompt standards the whole organization inherits",
      "Approved organizational assets, ready to drop into any AI tool",
    ],
    benefit:
      "AI output stays on-brand and consistent no matter who is writing, which tool they use, or when they joined.",
  },
  {
    icon: Bot,
    accent: "yellow",
    eyebrow: "Agents",
    title: "A catalog of every agent your company runs on.",
    text: "Custom GPTs, Claude projects, and specialized assistants get built in silos — then forgotten. The Agents catalog documents every AI worker your team has, what it does, and whether it's approved to use.",
    capabilities: [
      "Catalog custom GPTs, AI assistants, and specialized agents",
      "Document each agent's purpose, configuration, and owner",
      "Track risk levels and approval status per agent",
      "Make proven agents discoverable and reusable across teams",
    ],
    benefit:
      "No more duplicate agents and mystery assistants — everyone knows what exists, what works, and what's safe to use.",
  },
  {
    icon: Workflow,
    accent: "teal",
    eyebrow: "Workflows & Loops",
    title: "Turn one-off wins into repeatable processes.",
    text: "When someone figures out a great AI process, it should become a company asset — not a memory. Workflows capture repeatable, step-by-step AI processes so any teammate can run your best play.",
    capabilities: [
      "Document AI processes as clear, step-by-step workflows",
      "Capture the loops and best practices behind your top results",
      "Share repeatable processes across teams and departments",
      "Standardize how work gets done, from onboarding to reporting",
    ],
    benefit:
      "Your team stops reinventing the wheel — new hires and veterans alike execute from the same proven playbook.",
  },
  {
    icon: ImageIcon,
    accent: "peach",
    eyebrow: "AI Image Library",
    title: "Every image, with the recipe that made it.",
    text: "Great AI images are easy to generate and easy to lose. The Image Library preserves generated assets together with the prompts, styles, and references that produced them — so you can reproduce and extend what worked.",
    capabilities: [
      "Store generated images alongside their prompt and style recipes",
      "Preserve references, styles, and image direction",
      "Keep visual output consistent with your image style guide",
      "Browse and reuse assets across campaigns and channels",
    ],
    benefit:
      "Visual consistency at scale — anyone can recreate your look without hunting for the prompt that made it.",
  },
  {
    icon: ShieldCheck,
    accent: "yellow",
    eyebrow: "Governance Center",
    title: "Approvals, policies, and standards — built in.",
    text: "AI adoption without guardrails is a liability. The Governance Center manages approvals, policy acknowledgements, review queues, and your approved tool registry, so scaling AI never means losing control.",
    capabilities: [
      "Review queues showing which prompts, agents, and workflows need approval",
      "Policy acknowledgements so users accept company AI standards",
      "A tool registry tracking approved AI tools and usage rules",
      "Clear asset statuses: Approved, Draft, Experimental, Needs Review",
    ],
    benefit:
      "Leadership gets confidence and compliance; teams get clarity on exactly what's approved and how to use it.",
  },
]

const platform = [
  {
    icon: LayoutGrid,
    title: "Command Center Dashboard",
    text: "See AI asset metrics, pending approvals, and governance activity at a glance — one view of your entire AI operation.",
  },
  {
    icon: Search,
    title: "Search Across Everything",
    text: "Prompts, context, agents, workflows, and images live in one searchable system, not five different tools.",
  },
  {
    icon: Lock,
    title: "Private, Multi-Tenant Vault",
    text: "Your AI IP lives in a secure, organization-specific vault with controlled access — not in personal accounts and chat logs.",
  },
  {
    icon: Users,
    title: "Built for the Whole Team",
    text: "Simple enough for every contributor to browse, use, and improve assets — structured enough to stay organized as you grow.",
  },
]

const benefits: { accent: AccentKey; title: string; text: string }[] = [
  {
    accent: "teal",
    title: "Nothing valuable gets lost",
    text: "Effective prompts, context, and configurations are captured the moment they work — and stay available forever.",
  },
  {
    accent: "peach",
    title: "Consistency across every team",
    text: "Shared context and approved assets mean AI output sounds like your company, from marketing to support.",
  },
  {
    accent: "yellow",
    title: "Faster onboarding",
    text: "New teammates start from your proven prompts and workflows on day one instead of a blank page.",
  },
  {
    accent: "yellow",
    title: "Protected AI IP",
    text: "Your prompt frameworks, context systems, and agent configurations are owned by the company, not scattered on personal machines.",
  },
  {
    accent: "teal",
    title: "Visibility into what works",
    text: "Leaders finally see what AI assets exist, what's approved, and where the leverage is.",
  },
  {
    accent: "peach",
    title: "Value that compounds",
    text: "Every improvement is shared and reused, so your AI capability gets stronger every week instead of resetting.",
  },
]

export default function ProductPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />

      <main>
        {/* Hero — dotted grid + soft radial glow, like the homepage ecosystem section */}
        <section className="relative overflow-hidden bg-white pt-40 pb-24 sm:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(20,20,20,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 35%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 35%, transparent 80%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(157,218,215,0.22) 0%, rgba(253,255,96,0.12) 40%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <AnimateOnScroll>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
                Product
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <h1 className="mb-8 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#141414] sm:text-5xl md:text-6xl">
                One vault for everything your company{" "}
                <span className="gradient-text">knows about AI</span>.
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-[#666] md:text-xl">
                Dispatch is the system of record for your prompts, context,
                agents, workflows, and images — structured, governed, and
                shared. Here&apos;s everything inside, and why it matters.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.3}>
              <div className="mb-5 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-2xl bg-[#141414] px-8 py-4 text-lg font-semibold text-white shadow-[0_4px_24px_rgba(20,20,20,0.2)] transition-all duration-200 hover:bg-[#333] active:scale-[0.98]"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="rounded-2xl border border-[#141414]/20 px-8 py-4 text-lg font-semibold text-[#141414] transition-all duration-200 hover:border-[#141414]/30 hover:bg-[#141414]/[0.04] active:scale-[0.98]"
                >
                  Book a Demo
                </Link>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.4}>
              <p className="text-[13px] text-[#999]">
                No credit card needed ✦ Free plan available
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Feature deep-dives */}
        <section className="bg-[#F8F8F8] py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <AnimateOnScroll>
                <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#141414] sm:text-4xl md:text-[42px]">
                  Six systems. <span className="gradient-text">One vault</span>.
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.1}>
                <p className="text-lg leading-relaxed text-[#666]">
                  Every layer of Dispatch is purpose-built for a different kind
                  of AI asset — and they all work together.
                </p>
              </AnimateOnScroll>
            </div>

            <div className="space-y-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                const accent = accents[feature.accent]
                return (
                  <AnimateOnScroll key={feature.eyebrow} delay={i === 0 ? 0 : 0.05}>
                    <div className="group rounded-3xl border border-[#E8E8E6] bg-white p-8 shadow-[0_8px_30px_rgba(20,20,20,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(20,20,20,0.10)] sm:p-12">
                      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                        <div>
                          <div
                            className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: accent.iconBg }}
                          >
                            <Icon
                              className="h-7 w-7 text-[#141414]"
                              strokeWidth={1.75}
                            />
                          </div>
                          <div className="mb-4 inline-flex items-center rounded-full bg-[#FDFF60]/60 px-3 py-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]">
                              {feature.eyebrow}
                            </span>
                          </div>
                          <h3 className="mb-4 text-2xl font-extrabold leading-tight text-[#141414] sm:text-3xl">
                            {feature.title}
                          </h3>
                          <p className="text-[16px] leading-relaxed text-[#666]">
                            {feature.text}
                          </p>
                        </div>
                        <div className="flex flex-col justify-center">
                          <ul className="space-y-3.5">
                            {feature.capabilities.map((cap) => (
                              <li key={cap} className="flex items-start gap-3">
                                <span
                                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                  style={{ background: `${accent.check}1f` }}
                                >
                                  <Check
                                    className="h-3 w-3"
                                    strokeWidth={3}
                                    style={{ color: accent.check }}
                                  />
                                </span>
                                <span className="text-[15px] leading-relaxed text-[#333]">
                                  {cap}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-7 rounded-2xl border border-[#EAE3BF] bg-[#FDFCF4] p-5 text-[15px] leading-relaxed text-[#141414]">
                            <span className="font-semibold">The benefit: </span>
                            {feature.benefit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                )
              })}
            </div>
          </div>
        </section>

        {/* Platform foundation — dark vault section, like homepage governance */}
        <section className="bg-[#141414] py-32">
          <div className="mx-auto max-w-6xl px-6">
            <AnimateOnScroll>
              <div className="mx-auto mb-14 max-w-3xl text-center">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
                  The Platform
                </p>
                <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[42px]">
                  Built like a vault. Runs like a{" "}
                  <span className="gradient-text-dark">command center</span>.
                </h2>
                <p className="text-lg leading-relaxed text-white/60">
                  Underneath every feature is a secure, structured platform
                  designed for how whole teams — not just power users — work
                  with AI.
                </p>
              </div>
            </AnimateOnScroll>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {platform.map((item) => {
                const Icon = item.icon
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.05] p-7 transition-colors duration-200 hover:bg-white/[0.08]">
                      <div className="mb-4 w-fit rounded-lg bg-[#FDFF60]/10 p-2.5">
                        <Icon className="h-5 w-5 text-[#FDFF60]" />
                      </div>
                      <h3 className="mb-1 text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-white/60">
                        {item.text}
                      </p>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <AnimateOnScroll>
                <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#141414] sm:text-4xl md:text-[42px]">
                  What your team{" "}
                  <span className="gradient-text">gets out of it</span>.
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.1}>
                <p className="text-lg leading-relaxed text-[#666]">
                  Features are the how. This is the payoff of running your AI
                  work through one system instead of a dozen scattered tools.
                </p>
              </AnimateOnScroll>
            </div>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const accent = accents[benefit.accent]
                return (
                  <StaggerItem key={benefit.title}>
                    <div className="h-full rounded-3xl border border-[#E8E8E6] bg-white p-7 shadow-[0_8px_30px_rgba(20,20,20,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(20,20,20,0.10)]">
                      <span
                        className="mb-5 flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ background: `${accent.check}1f` }}
                      >
                        <Check
                          className="h-4 w-4"
                          strokeWidth={3}
                          style={{ color: accent.check }}
                        />
                      </span>
                      <h3 className="mb-2 text-[17px] font-extrabold text-[#141414]">
                        {benefit.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-[#666]">
                        {benefit.text}
                      </p>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Final CTA — dark, yellow highlight, like homepage FinalCTA */}
        <section className="relative overflow-hidden bg-[#141414] py-32">
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <AnimateOnScroll>
              <h2 className="mb-8 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                See Dispatch with{" "}
                <span className="gradient-text-dark">your own AI work</span>{" "}
                inside it.
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/60">
                Start a free trial and load your first prompts in minutes, or
                book a demo and we&apos;ll walk through the vault with your
                team.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.18}>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-2xl bg-[#FDFF60] px-8 py-4 text-lg font-semibold text-[#141414] shadow-[0_4px_24px_rgba(253,255,96,0.2)] transition-all duration-200 hover:bg-[#FDFF60]/90 active:scale-[0.98]"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.98]"
                >
                  View Pricing
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
