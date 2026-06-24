"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { track } from "@/lib/analytics"
import { plans, type Plan } from "@/lib/pricing"

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

function PriceBlock({ plan }: { plan: Plan }) {
  // Show "/mo" only for the paid monthly tiers (not $0 or Custom).
  const showPerMonth = plan.priceMonthly !== "Custom" && plan.priceMonthly !== "$0"
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[40px] font-extrabold text-[#141414] leading-none tracking-tight">
          {plan.priceMonthly}
        </span>
        {showPerMonth && <span className="text-[15px] font-medium text-[#999]">/mo</span>}
      </div>
      <p className="text-[13px] text-[#999] mt-2 h-4">{plan.priceNote || ""}</p>
    </div>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
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

      <PriceBlock plan={plan} />

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
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}
