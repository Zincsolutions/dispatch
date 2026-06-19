"use client"

import Link from "next/link"
import { track } from "@/lib/analytics"
import { freePlan } from "@/lib/pricing"

export function FreePlanStrip() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="rounded-2xl border border-[#E5E5E3] bg-[#EDECEC] px-6 sm:px-9 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#141414] font-semibold mb-1.5">
            {freePlan.eyebrow}
          </p>
          <p className="text-[15px] text-[#555] leading-relaxed max-w-2xl">
            {freePlan.description}
          </p>
        </div>
        <Link
          href={freePlan.ctaHref}
          onClick={() =>
            track("free_signup_clicked", { plan: "free", cta_location: "free_strip" })
          }
          className="shrink-0 text-center bg-[#141414] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200"
        >
          {freePlan.ctaLabel}
        </Link>
      </div>
    </div>
  )
}
