"use client"

import { AnimateOnScroll } from "./AnimateOnScroll"

export function CredibilitySection() {
  return (
    <section className="py-24 bg-white border-t border-[#EDECEC]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999] mb-4">
            Built by the team behind ZINC
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141414] leading-tight mb-4">
            Made for real-world AI adoption.
          </h2>
          <p className="text-lg text-[#666] leading-relaxed">
            Dispatch was created by ZINC to help organizations bring structure,
            governance, and repeatability to how they actually use AI.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
