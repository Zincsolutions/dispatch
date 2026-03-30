"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center">
          <img src="/dispatch-logo.svg" alt="Dispatch" className="h-9 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-lg text-[15px] font-medium text-[#333] hover:text-[#141414] hover:bg-[#EDECEC] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#333] hover:text-[#141414] hover:bg-[#EDECEC] transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#333] hover:text-[#141414] hover:bg-[#EDECEC] transition-all duration-200"
          >
            Get a Demo
          </Link>
          <Link
            href="/signup"
            className="bg-[#141414] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200"
          >
            Start Free Trial
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/signup"
            className="bg-[#141414] text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Start Free Trial
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl text-[#141414] hover:bg-[#EDECEC] transition-all duration-200"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#E5E5E3] overflow-hidden"
          >
            <div className="px-6 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-[15px] font-medium text-[#333] hover:text-[#141414] hover:bg-[#EDECEC] transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-[#E5E5E3] mt-2">
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-xl text-[15px] font-medium text-[#333] hover:text-[#141414] hover:bg-[#EDECEC] transition-colors"
                >
                  Log in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
