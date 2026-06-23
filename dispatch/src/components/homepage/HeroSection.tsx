"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
})

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24 text-center">
        <motion.p
          {...fadeUp(0.15)}
          className="text-sm sm:text-base font-semibold text-[#999] tracking-[0.18em] uppercase mb-8"
        >
          The AI Operations System for Growth-Focused Organizations
        </motion.p>

        <motion.h1
          {...fadeUp(0.3)}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#141414] leading-[1.08] tracking-tight mb-8 max-w-5xl mx-auto"
        >
          Turn AI chaos into an operational advantage.
        </motion.h1>

        <motion.p
          {...fadeUp(0.45)}
          className="text-lg md:text-xl text-[#666] max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Dispatch gives your organization a centralized system for managing AI
          knowledge, workflows, and governance so you can move faster, maintain
          consistency, and scale what works.
        </motion.p>

        <motion.div {...fadeUp(0.6)} className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
          <Link
            href="/signup"
            className="bg-[#141414] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(20,20,20,0.2)]"
          >
            Start Free Trial
          </Link>
          <a
            href="#product"
            className="border border-[#141414]/20 text-[#141414] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#141414]/[0.04] hover:border-[#141414]/30 active:scale-[0.98] transition-all duration-200"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p {...fadeUp(0.7)} className="text-[13px] text-[#999]">
          No credit card needed ✦ Free plan available
        </motion.p>
      </div>
    </section>
  )
}
