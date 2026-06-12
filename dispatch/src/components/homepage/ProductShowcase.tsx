"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const tabs = [
  {
    label: "Prompts",
    src: "/screenshots/prompt-detail.jpg",
    alt: "Dispatch prompt detail with Run in ChatGPT and Run in Claude buttons",
    caption: "Your team's best prompts — run them in ChatGPT or Claude with one click.",
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
    label: "Governance",
    src: "/screenshots/governance.jpg",
    alt: "Dispatch governance overview with policy acknowledgments and tool registry",
    caption: "Policies your team acknowledges, and a registry of which tools are approved.",
  },
]

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section
      id="product"
      className="relative pb-32 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-10" role="tablist" aria-label="Product features">
          <div className="inline-flex gap-1 p-1 rounded-2xl bg-[#EDECEC] border border-[#E5E5E3]">
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
          className="relative rounded-2xl overflow-hidden border border-[#E5E5E3]"
          style={{ boxShadow: "0 24px 48px -12px rgba(20,20,20,0.08)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="aspect-[16/10] bg-white"
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
