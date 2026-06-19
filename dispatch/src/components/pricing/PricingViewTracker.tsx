"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"

export function PricingViewTracker() {
  useEffect(() => {
    track("pricing_viewed", { billing_period: "monthly_annual_text" })
  }, [])
  return null
}
