"use client"

import Link from "next/link"
import { AnimateOnScroll } from "./AnimateOnScroll"

export function EarlyAccess() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#666] font-medium mb-6">
            Early access
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.08}>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-6">
            Be one of the first teams on Dispatch.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.16}>
          <p className="text-lg text-[#666] leading-relaxed mb-10">
            Dispatch is in early access. We&apos;re working closely with our
            first teams to shape the product — your feedback drives the
            roadmap, and there&apos;s room at the table for your team.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.24}>
          <Link
            href="/signup"
            className="inline-block bg-[#141414] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(20,20,20,0.2)]"
          >
            Start free
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
