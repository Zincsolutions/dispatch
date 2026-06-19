"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"
import { track } from "@/lib/analytics"
import { faqs } from "@/lib/pricing"

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0)

  function toggle(i: number) {
    const next = open === i ? null : i
    setOpen(next)
    if (next === i) {
      track("pricing_faq_opened", { faq_question: faqs[i].question })
    }
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] text-center leading-tight mb-12">
          Questions, answered.
        </h2>

        <div className="divide-y divide-[#E5E5E3] border-y border-[#E5E5E3]">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.question}>
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left py-5 group"
                >
                  <span className="text-[16px] font-semibold text-[#141414] group-hover:text-[#333]">
                    {faq.question}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-[#999] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] text-[#666] leading-relaxed pb-6 pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
