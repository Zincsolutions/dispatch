"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { track } from "@/lib/analytics"
import { plans, type Plan } from "@/lib/pricing"

type Billing = "monthly" | "yearly"

function handleCtaClick(plan: Plan) {
  track("pricing_cta_clicked", { plan: plan.id, cta_location: "pricing_card" })
  track("pricing_plan_selected", { plan: plan.id })
  if (plan.id === "enterprise") {
    track("enterprise_contact_clicked", { plan: "enterprise", cta_location: "pricing_card" })
  }
  if (plan.id === "personal") {
    track("free_signup_clicked", { plan: "personal", cta_location: "pricing_card" })
  }
}

function PriceBlock({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "yearly" ? plan.priceAnnual : plan.priceMonthly
  const note = billing === "yearly" ? plan.priceAnnualNote : plan.priceNote
  // Show "/mo" only for the paid tiers (not $0 or Custom).
  const showPerMonth = price !== "Custom" && price !== "$0"
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[40px] font-extrabold text-[#141414] leading-none tracking-tight">
          {price}
        </span>
        {showPerMonth && <span className="text-[15px] font-medium text-[#999]">/mo</span>}
      </div>
      <p className="text-[13px] text-[#999] mt-2 h-4">{note || ""}</p>
    </div>
  )
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const highlighted = plan.highlighted
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 sm:p-7 bg-white transition-shadow ${
        highlighted
          ? "border-2 border-[#141414] shadow-[0_24px_64px_-16px_rgba(20,20,20,0.18)]"
          : "border border-[#E5E5E3]"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block bg-[#FDFF60] text-[#141414] text-[11px] font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(20,20,20,0.12)]">
            {plan.badge}
          </span>
        </div>
      )}

      <h3 className="text-xl font-extrabold text-[#141414] mb-2">{plan.name}</h3>
      <p className="text-[14px] text-[#666] leading-relaxed mb-6 min-h-[42px]">
        {plan.description}
      </p>

      <PriceBlock plan={plan} billing={billing} />

      <Link
        href={plan.ctaHref}
        onClick={() => handleCtaClick(plan)}
        className={`block text-center px-6 py-3.5 rounded-xl text-[15px] font-semibold active:scale-[0.98] transition-all duration-200 ${
          highlighted
            ? "bg-[#141414] text-white hover:bg-[#333] shadow-[0_4px_20px_rgba(20,20,20,0.18)]"
            : "border border-[#141414]/20 text-[#141414] hover:bg-[#141414]/[0.04] hover:border-[#141414]/30"
        }`}
      >
        {plan.ctaLabel}
      </Link>

      <div className="border-t border-[#E5E5E3] my-6" />

      {plan.featuresNote && (
        <p className="text-[13px] font-semibold text-[#141414] mb-4">{plan.featuresNote}</p>
      )}
      <ul className="space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[13.5px] text-[#333] leading-snug">
            <Check className="h-[17px] w-[17px] text-[#141414] shrink-0 mt-[1px]" strokeWidth={2.5} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PricingCards() {
  const [billing, setBilling] = useState<Billing>("yearly")

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#EDECEC] border border-[#E5E5E3]">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              billing === "monthly" ? "bg-white text-[#141414] shadow-sm" : "text-[#999] hover:text-[#666]"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
              billing === "yearly" ? "bg-white text-[#141414] shadow-sm" : "text-[#999] hover:text-[#666]"
            }`}
          >
            Yearly
            <span className="bg-[#FDFF60] text-[#141414] text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} />
        ))}
      </div>
    </div>
  )
}
