"use client"

import Link from "next/link"
import { track } from "@/lib/analytics"

export function PricingBottomCTA() {
  return (
    <section className="py-32 bg-[#141414]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-white leading-tight tracking-tight mb-6">
          Start organizing your <span className="gradient-text-dark">AI operating system</span>.
        </h2>
        <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          Create a free account or talk with us about setting up Dispatch for your team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup?plan=free"
            onClick={() =>
              track("free_signup_clicked", { plan: "free", cta_location: "bottom_cta" })
            }
            className="bg-[#FDFF60] text-[#141414] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#FDFF60]/90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(253,255,96,0.2)]"
          >
            Create Free Account
          </Link>
          <Link
            href="/contact?plan=enterprise"
            onClick={() =>
              track("enterprise_contact_clicked", { plan: "enterprise", cta_location: "bottom_cta" })
            }
            className="border border-white/25 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/[0.06] hover:border-white/40 active:scale-[0.98] transition-all duration-200"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </section>
  )
}
