"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

export function PromoBanner() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="relative overflow-hidden"
        >
          <div className="relative flex items-center justify-center px-12 py-3 bg-[#141414]">
            <p className="relative text-[13px] sm:text-sm font-medium text-white/70 text-center">
              <span className="hidden sm:inline">Your team is using AI everywhere. And nowhere at the same time. </span>
              <span className="sm:hidden">AI is everywhere — and nowhere. </span>
              <a
                href="#product"
                className="text-[#FDFF60] hover:text-[#FDFF60]/80 transition-colors duration-200 font-semibold"
              >
                See how Dispatch fixes that →
              </a>
            </p>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 sm:right-4 p-1.5 rounded-md hover:bg-white/10 active:bg-white/15 transition-colors duration-150"
              aria-label="Dismiss banner"
            >
              <X className="h-3.5 w-3.5 text-white/40 hover:text-white/70 transition-colors" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
