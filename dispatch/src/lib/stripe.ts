import Stripe from "stripe"

// Lazy, guarded Stripe client. The whole billing layer is inert until
// STRIPE_SECRET_KEY is set, so the app builds and runs without keys.
let cached: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!cached) cached = new Stripe(key)
  return cached
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export type BillingInterval = "monthly" | "yearly"

// Plans that map to a Stripe price (Personal is free, Enterprise is sales-led).
export const BILLABLE_PLANS = ["starter", "team"] as const

function priceEnvKey(plan: string, interval: BillingInterval) {
  return `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`
}

// e.g. STRIPE_PRICE_TEAM_YEARLY -> price_xxx
export function priceIdFor(plan: string, interval: BillingInterval): string | undefined {
  return process.env[priceEnvKey(plan, interval)]
}

// Reverse lookup used by the webhook to translate a Stripe price back to a plan.
export function planForPriceId(priceId: string): string | null {
  for (const plan of BILLABLE_PLANS) {
    for (const interval of ["monthly", "yearly"] as BillingInterval[]) {
      if (priceIdFor(plan, interval) === priceId) return plan
    }
  }
  return null
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.dispatchvault.com"
}
