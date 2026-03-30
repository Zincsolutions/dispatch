"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const tabs = [
  { label: "Prompts", screenshotLabel: "Prompt Library Interface", caption: "Your team's best prompts, organized and accessible.", wash: "gradient-wash-1" },
  { label: "Workflows", screenshotLabel: "Workflow Builder", caption: "Turn your best processes into repeatable systems.", wash: "gradient-wash-2" },
  { label: "Images", screenshotLabel: "Image Management System", caption: "AI imagery that stays on-brand, every time.", wash: "gradient-wash-3" },
  { label: "Insights", screenshotLabel: "Analytics Dashboard", caption: "See what's working. Double down on it.", wash: "gradient-wash-1" },
]

function WireframeUI({ label, wash }: { label: string; wash: string }) {
  return (
    <div className={`w-full h-full flex flex-col p-6 sm:p-10 ${wash}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-[#141414]/10" />
        <div className="w-3 h-3 rounded-full bg-[#141414]/[0.06]" />
        <div className="w-3 h-3 rounded-full bg-[#141414]/[0.06]" />
        <div className="flex-1" />
        <div className="h-3 w-20 rounded bg-[#141414]/[0.06]" />
      </div>
      <div className="flex gap-4 mb-6">
        <div className="h-8 w-24 rounded-lg bg-[#141414]/[0.06]" />
        <div className="h-8 w-20 rounded-lg bg-[#141414]/[0.04]" />
        <div className="h-8 w-28 rounded-lg bg-[#141414]/[0.04]" />
      </div>
      <div className="h-4 w-48 rounded bg-[#141414]/[0.06] mb-3" />
      <div className="h-3 w-64 rounded bg-[#141414]/[0.04] mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white/40 border border-white/60 min-h-[56px]" />
        ))}
      </div>
      <p className="text-center text-[#141414]/30 text-sm font-medium mt-6">{label}</p>
    </div>
  )
}

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
              className="aspect-[16/10]"
            >
              <WireframeUI label={tabs[activeTab].screenshotLabel} wash={tabs[activeTab].wash} />
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
