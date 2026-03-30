"use client"

import Link from "next/link"
import { AnimateOnScroll } from "./AnimateOnScroll"

export function FinalCTA() {
  return (
    <section className="relative py-36 overflow-hidden bg-[#141414]">
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight mb-8">
            AI isn&apos;t the advantage.
            <br />
            <span className="gradient-text-dark">How you use it</span> is.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Dispatch gives your team the system to collaborate, scale, and get
            more from AI — without the chaos.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.18}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-[#FDFF60] text-[#141414] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#FDFF60]/90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(253,255,96,0.2)]"
            >
              Get a Free Demo
            </Link>
            <Link
              href="/signup"
              className="border border-[#FDFF60]/30 text-[#FDFF60] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#FDFF60]/[0.07] hover:border-[#FDFF60]/40 active:scale-[0.98] transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
