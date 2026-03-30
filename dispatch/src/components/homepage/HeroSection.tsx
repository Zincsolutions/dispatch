"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
})

const trustLogos = Array.from({ length: 5 }, (_, i) => `Partner ${i + 1}`)

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24 text-center">
        <motion.p
          {...fadeUp(0.15)}
          className="text-base sm:text-lg font-medium text-[#999] tracking-wide mb-8"
        >
          Your teams are using AI everywhere. And nowhere at the same time.
        </motion.p>

        <motion.h1
          {...fadeUp(0.3)}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#141414] leading-[1.08] tracking-tight mb-8 max-w-5xl mx-auto"
        >
          Turn AI chaos into{" "}
          <span className="gradient-text">a system</span>
          <br className="hidden sm:block" /> your whole team can run on.
        </motion.h1>

        <motion.p
          {...fadeUp(0.45)}
          className="text-lg md:text-xl text-[#666] max-w-3xl mx-auto mb-5 leading-relaxed"
        >
          Dispatch centralizes your prompts, workflows, tools, and outputs
          into one structured platform — so your team can collaborate, move
          faster, and scale what actually works.
        </motion.p>

        <motion.p
          {...fadeUp(0.55)}
          className="text-[15px] font-medium text-[#999] mb-12"
        >
          A shared workspace for your team — with a secure vault for your
          most valuable AI assets.
        </motion.p>

        <motion.div {...fadeUp(0.65)} className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
          <Link
            href="/signup"
            className="bg-[#141414] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(20,20,20,0.2)]"
          >
            Get a Free Demo
          </Link>
          <Link
            href="/signup"
            className="border border-[#141414]/20 text-[#141414] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#141414]/[0.04] hover:border-[#141414]/30 active:scale-[0.98] transition-all duration-200"
          >
            Start Free Trial
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.7)} className="text-[13px] text-[#999] mb-20">
          No credit card needed ✦ Free plan available
        </motion.p>

        <motion.div {...fadeUp(0.8)}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#999] font-medium mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center">
            {trustLogos.map((label, i) => (
              <div
                key={i}
                className="w-20 sm:w-24 h-8 rounded-md bg-[#141414]/[0.04] border border-[#141414]/[0.06] flex items-center justify-center opacity-50 hover:opacity-80 transition-opacity duration-300"
              >
                <span className="text-[10px] text-[#999] font-medium tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
