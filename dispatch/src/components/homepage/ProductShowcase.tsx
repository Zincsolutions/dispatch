"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const tabs = [
  {
    label: "Dashboard",
    src: "/screenshots/dashboard.jpg",
    alt: "Dispatch dashboard — AI operations command center with asset metrics and governance overview",
    caption: "Your AI operations command center — what exists, what's approved, and what needs review.",
  },
  {
    label: "Governance",
    src: "/screenshots/governance.jpg",
    alt: "Dispatch governance overview with policy acknowledgments and tool registry",
    caption: "Review queues, policy acknowledgements, and a registry of approved tools.",
  },
  {
    label: "Workflows",
    src: "/screenshots/workflow-detail.jpg",
    alt: "Dispatch workflow with documented step-by-step process",
    caption: "Turn your best processes into repeatable systems.",
  },
  {
    label: "Images",
    src: "/screenshots/library.jpg",
    alt: "Dispatch brand library with images and their sref recipes",
    caption: "AI imagery that stays on-brand — every image stored with its prompt and sref.",
  },
  {
    label: "Prompts",
    src: "/screenshots/prompt-detail.jpg",
    alt: "Dispatch prompt detail with Run in ChatGPT and Run in Claude buttons",
    caption: "Your team's best prompts — run them in ChatGPT or Claude with one click.",
  },
]

const washes = ["gradient-wash-1", "gradient-wash-2", "gradient-wash-3", "gradient-wash-1"]

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="product" className="relative pb-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-4">
            Your AI operations command center.
          </h2>
          <p className="text-lg text-[#666] leading-relaxed">
            See what exists, what&apos;s approved, what needs review, and how your
            organization is building with AI.
          </p>
        </div>

        <div className="flex justify-center mb-10" role="tablist" aria-label="Product features">
          <div className="inline-flex gap-1 p-1 rounded-2xl bg-[#EDECEC] border border-[#E5E5E3] flex-wrap justify-center">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                role="tab"
                aria-selected={activeTab === i}
                onClick={() => setActiveTab(i)}
                className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === i
                    ? "text-[#141414]"
                    : "text-[#999] hover:text-[#666]"
                }`}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`relative rounded-2xl border border-[#E5E5E3] transition-colors duration-300 ${washes[activeTab % washes.length]} p-5 sm:p-8`}
          style={{ boxShadow: "0 24px 48px -12px rgba(20,20,20,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="aspect-[16/10] rounded-xl overflow-hidden border border-white/60 bg-white"
              style={{ boxShadow: "0 12px 32px -8px rgba(20,20,20,0.12)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tabs[activeTab].src}
                alt={tabs[activeTab].alt}
                className="w-full h-full object-cover object-top"
                loading={activeTab === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          key={`caption-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[#999] text-center mt-8"
        >
          {tabs[activeTab].caption}
        </motion.p>
      </div>
    </section>
  )
}
