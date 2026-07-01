import type { Metadata } from "next"
import Link from "next/link"
import { Layers, ShieldCheck, Boxes } from "lucide-react"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "Integrations — LLMs & AI Platforms Dispatch Works With",
  description:
    "Dispatch is model-agnostic. See the LLMs and AI platforms it works with - OpenAI, Anthropic Claude, Google Gemini, Microsoft Copilot, and more.",
  alternates: { canonical: "/solutions/integrations" },
  openGraph: {
    title: "Dispatch Integrations — Works With Your Entire AI Stack",
    description:
      "The LLMs and AI platforms Dispatch works with, from OpenAI and Claude to Gemini and Copilot.",
    url: "/solutions/integrations",
    type: "website",
  },
}

// High-level value points (the "start high" layer).
const highlights = [
  {
    icon: Layers,
    title: "Model-agnostic",
    text: "Dispatch sits above your AI tools, not inside them. Your prompts, context, and workflows work the same no matter which model your team uses - no lock-in.",
  },
  {
    icon: ShieldCheck,
    title: "One system of record",
    text: "Keep every prompt, asset, and governance policy in one place, so switching or adding a model never means rebuilding your organization's AI knowledge.",
  },
  {
    icon: Boxes,
    title: "Bring your own tools",
    text: "Organize the AI apps your team already works in every day - from ChatGPT and Copilot to custom GPTs and agents - under one shared operating system.",
  },
]

// Drill-down: the specific models and platforms, grouped.
const ACCENTS = ["#9DDAD7", "#F5B48C", "#FDFF60", "#C9B6F5", "#9DD9A8", "#9DB4DA", "#F59DB4", "#EDECEC"]

const groups: {
  title: string
  intro: string
  items: { name: string; detail: string; mark: string }[]
}[] = [
  {
    title: "Large language models",
    intro:
      "Run your prompts and workflows on any leading LLM. Dispatch keeps them portable, so your team can pick the best model for the job.",
    items: [
      { name: "OpenAI", detail: "GPT-4 & GPT-5 family, custom GPTs", mark: "AI" },
      { name: "Anthropic Claude", detail: "Claude Opus, Sonnet & Haiku", mark: "C" },
      { name: "Google Gemini", detail: "Gemini Pro & Flash", mark: "G" },
      { name: "Meta Llama", detail: "Open Llama models", mark: "L" },
      { name: "Mistral AI", detail: "Mistral & Mixtral", mark: "M" },
      { name: "xAI Grok", detail: "Grok models", mark: "X" },
      { name: "Cohere", detail: "Command models", mark: "Co" },
      { name: "DeepSeek", detail: "DeepSeek models", mark: "D" },
    ],
  },
  {
    title: "AI assistants & platforms",
    intro:
      "Organize the prompts, context, and best practices behind the AI apps your team uses every day.",
    items: [
      { name: "ChatGPT", detail: "OpenAI", mark: "GP" },
      { name: "Microsoft Copilot", detail: "Microsoft 365", mark: "Co" },
      { name: "Google Gemini", detail: "Google Workspace", mark: "Ge" },
      { name: "Perplexity", detail: "AI search & answers", mark: "Px" },
      { name: "Claude", detail: "Anthropic", mark: "Cl" },
      { name: "Custom GPTs & agents", detail: "Your own builds", mark: "{ }" },
    ],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />

      <main className="pt-40 pb-28 sm:pt-44">
        {/* Hero — the high level */}
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
            Integrations
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
            Works with your entire AI stack.
          </h1>
          <p className="text-lg leading-relaxed text-[#666]">
            Dispatch is the system of record that sits above your AI tools - so
            your prompts, context, and governance work across every model and
            platform your team uses.
          </p>
        </div>

        {/* High-level value points */}
        <div className="mx-auto mt-16 max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = h.icon
              return (
                <div
                  key={h.title}
                  className="rounded-3xl border border-[#E5E5E3] bg-[#F7F7F6] p-8"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#141414]">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="mb-2 text-lg font-bold text-[#141414]">
                    {h.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-[#666]">
                    {h.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drill-down groups */}
        <div className="mx-auto mt-24 max-w-6xl px-6">
          {groups.map((group, gi) => (
            <section key={group.title} className="mb-20 last:mb-0">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-extrabold text-[#141414] sm:text-3xl">
                  {group.title}
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#666]">
                  {group.intro}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item, ii) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-start rounded-2xl border border-[#E5E5E3] bg-white p-6 transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-[15px] font-extrabold text-[#141414]"
                      style={{
                        backgroundColor:
                          ACCENTS[(gi * 3 + ii) % ACCENTS.length],
                      }}
                    >
                      {item.mark}
                    </div>
                    <h3 className="text-[16px] font-bold text-[#141414]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#999]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-8 max-w-6xl px-6">
          <div className="rounded-3xl bg-[#141414] p-8 text-center sm:p-12">
            <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              Don&apos;t see your model or tool?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
              Because Dispatch is model-agnostic, it works with the AI tools your
              team already uses - and the ones you adopt next. Tell us your
              stack and we&apos;ll show you how it fits.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-block rounded-2xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
              >
                Book a Demo
              </Link>
              <Link
                href="/solutions/use-cases"
                className="inline-block rounded-2xl border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                See Use Cases
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
