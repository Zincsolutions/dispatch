"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { AnimateOnScroll } from "./AnimateOnScroll"

type Tab = {
  tab: string
  heading: string
  copy: string
  cta: string
  src: string
  alt: string
}

const tabs: Tab[] = [
  {
    tab: "Dashboard",
    heading: "Dashboard",
    copy: "Get a complete view of your organization's AI assets, approvals, agents, workflows, and governance activity from one central dashboard.",
    cta: "Explore Dashboard",
    src: "/screenshots/dashboard.jpg",
    alt: "Dispatch dashboard with AI asset metrics, approvals, and governance activity",
  },
  {
    tab: "Prompts",
    heading: "Prompt Library",
    copy: "Store, improve, and share prompts and master prompts so everyone can build from what already works.",
    cta: "Explore the Prompt Library",
    src: "/screenshots/prompt-detail.jpg",
    alt: "Dispatch prompt detail with Run in ChatGPT and Run in Claude buttons",
  },
  {
    tab: "Agents",
    heading: "Agents",
    copy: "Build reusable AI workers from your approved context, prompts, workflows, and governance rules — so expertise scales across the organization.",
    cta: "Explore Agents",
    src: "/screenshots/agents.jpg",
    alt: "Dispatch agents catalog with reusable AI workers, risk levels, and approval status",
  },
  {
    tab: "Workflows",
    heading: "Workflows & Loops",
    copy: "Capture repeatable AI processes, agents, and automation loops so successful work can be reused across the organization.",
    cta: "Explore Workflows",
    src: "/screenshots/workflow-detail.jpg",
    alt: "Dispatch workflow with documented, repeatable step-by-step process",
  },
  {
    tab: "Images",
    heading: "AI Image Library",
    copy: "Organize generated images, prompts, references, and style direction so your team can create more consistent visual outputs.",
    cta: "Explore the Image Library",
    src: "/screenshots/library.jpg",
    alt: "Dispatch image library with generated assets and their prompt and style recipes",
  },
  {
    tab: "AI Foundation",
    heading: "AI Foundation",
    copy: "Centralize brand context, SOPs, training materials, and approved assets so every AI output starts from the same trusted source of truth.",
    cta: "Explore AI Foundation",
    src: "/screenshots/ai-foundation.jpg",
    alt: "Dispatch AI Foundation with brand context, SOPs, and approved organizational assets",
  },
  {
    tab: "Governance",
    heading: "Governance",
    copy: "Manage policies, approvals, review queues, tool access, and standards so your organization can use AI with confidence.",
    cta: "Explore Governance",
    src: "/screenshots/governance.jpg",
    alt: "Dispatch governance overview with policy acknowledgments, review queue, and tool registry",
  },
]

export function CommandCenter() {
  const [active, setActive] = useState(0)
  const current = tabs[active]

  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-5">
              Your AI operations command center.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <p className="text-lg text-[#666] leading-relaxed">
              See what exists, what&apos;s approved, what needs review, and how
              your organization is building with AI.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Dark panel */}
        <AnimateOnScroll delay={0.1}>
          <div className="rounded-[28px] bg-[#141414] p-5 sm:p-10 lg:p-14 shadow-[0_40px_100px_-30px_rgba(20,20,20,0.45)]">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Command center views"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 mb-10 lg:mb-12 lg:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t, i) => (
                <button
                  key={t.tab}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    active === i
                      ? "bg-white text-[#141414]"
                      : "bg-white/10 text-white/70 hover:bg-white/[0.16] hover:text-white"
                  }`}
                >
                  {t.tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Screenshot */}
              <div className="lg:col-span-7">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 -translate-x-2.5 translate-y-2.5 sm:-translate-x-3.5 sm:translate-y-3.5 rounded-2xl bg-[#FDFF60]"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                      className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={current.src}
                        alt={current.alt}
                        className="h-full w-full object-cover object-top"
                        loading={active === 0 ? "eager" : "lazy"}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Copy */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                      {current.heading}
                    </h3>
                    <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8">
                      {current.copy}
                    </p>
                    <Link
                      href="/signup"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-[#141414]"
                    >
                      {current.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
