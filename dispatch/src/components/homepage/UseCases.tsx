"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AnimateOnScroll } from "./AnimateOnScroll"

const washes = ["gradient-wash-1", "gradient-wash-2", "gradient-wash-3", "gradient-wash-1", "gradient-wash-2"]

const useCases = [
  {
    tab: "Marketing",
    headline: "Scale campaigns faster with shared prompts and on-brand imagery.",
    body: "Your whole marketing team running on the same playbook — shared prompt libraries, consistent brand visuals, and repeatable content workflows that anyone can follow.",
    bullets: ["Shared prompt library for campaigns", "On-brand AI image management", "Repeatable content workflows"],
  },
  {
    tab: "Sales",
    headline: "Make every rep perform like your best rep.",
    body: "Standardize outreach, proposals, and follow-up sequences so your entire sales team operates at the level of your top performer.",
    bullets: ["Standardized outreach templates", "Proposal workflows", "Performance-rated sequences"],
  },
  {
    tab: "Operations",
    headline: "Build processes that scale without you.",
    body: "Document and connect repeatable workflows that reduce manual effort and scale with confidence — even when you're not in the room.",
    bullets: ["Documented AI workflows", "Tool-connected processes", "Team-wide adoption tracking"],
  },
  {
    tab: "Leadership",
    headline: "See what's working. Invest in what compounds.",
    body: "For the first time, visibility into how your teams are using AI — what's performing, what's wasted, and where to double down.",
    bullets: ["AI usage visibility", "Performance analytics", "Investment prioritization"],
  },
  {
    tab: "Agencies",
    headline: "Multi-client output without losing quality.",
    body: "Templatized systems that maintain consistency across every account — with half the onboarding time for new clients.",
    bullets: ["Client-specific workspaces", "Templatized workflows", "50% faster client onboarding"],
  },
]

export function UseCases() {
  const [active, setActive] = useState(0)

  return (
    <section id="use-cases" className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-14">
            Built for teams doing real work.
          </h2>
        </AnimateOnScroll>

        <div className="flex flex-wrap justify-center gap-2 mb-14" role="tablist" aria-label="Use cases">
          {useCases.map((uc, i) => (
            <button
              key={uc.tab}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`px-5 sm:px-7 py-3 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                active === i
                  ? "bg-[#141414] text-white shadow-[0_2px_8px_rgba(20,20,20,0.15)]"
                  : "bg-white text-[#666] border border-[#E5E5E3] hover:text-[#141414]"
              }`}
            >
              {uc.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141414] mb-5 leading-tight">
                {useCases[active].headline}
              </h3>
              <p className="text-lg text-[#666] mb-8 leading-relaxed">
                {useCases[active].body}
              </p>
              <ul className="space-y-4">
                {useCases[active].bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3 text-[15px] text-[#333]">
                    <div className="h-2 w-2 rounded-full bg-[#141414] flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`aspect-[16/10] rounded-2xl overflow-hidden ${washes[active]} flex flex-col p-6 sm:p-10 border border-[#E5E5E3]`}
              style={{ boxShadow: "0 24px 64px -16px rgba(20,20,20,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
              </div>
              <div className="h-3 bg-[#141414]/[0.05] rounded w-1/3 mb-2" />
              <div className="h-5 bg-[#141414]/[0.06] rounded w-2/3 mb-6" />
              <div className="grid grid-cols-2 gap-3 flex-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-white/50 border border-white/60" />
                ))}
              </div>
              <p className="text-center text-[#141414]/25 text-sm font-semibold mt-5">
                {useCases[active].tab} Dashboard
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
