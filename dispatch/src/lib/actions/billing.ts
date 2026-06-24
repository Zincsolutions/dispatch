"use server"

import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import {
  getStripe,
  isStripeConfigured,
  priceIdFor,
  siteUrl,
  type BillingInterval,
} from "@/lib/stripe"

// Starts a Stripe Checkout session for a paid plan and returns the URL.
// Inert (returns a friendly error) until Stripe keys + price IDs are set.
export async function startCheckout(plan: string, interval: BillingInterval) {
  const stripe = getStripe()
  if (!stripe || !isStripeConfigured()) {
    return { error: "Billing isn't enabled yet. Contact sales to upgrade." }
  }

  const { user, organization, organizationId, role } = await getCurrentUserWithOrg()
  if (role !== "owner") {
    return { error: "Only organization owners can manage billing." }
  }

  const priceId = priceIdFor(plan, interval)
  if (!priceId) {
    return { error: "That plan isn't available for self-serve checkout yet." }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      // Reuse the org's Stripe customer if we have one, else let Checkout
      // create one and capture it in the webhook.
      ...(organization.stripe_customer_id
        ? { customer: organization.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      client_reference_id: organizationId,
      metadata: { organization_id: organizationId, plan },
      subscription_data: { metadata: { organization_id: organizationId, plan } },
      success_url: `${siteUrl()}/settings?billing=success`,
      cancel_url: `${siteUrl()}/settings?billing=cancelled`,
      allow_promotion_codes: true,
    })
    return { url: session.url }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not start checkout." }
  }
}

// Opens the Stripe billing portal for managing an existing subscription.
export async function openBillingPortal() {
  const stripe = getStripe()
  if (!stripe || !isStripeConfigured()) {
    return { error: "Billing isn't enabled yet." }
  }

  const { organization, role } = await getCurrentUserWithOrg()
  if (role !== "owner") {
    return { error: "Only organization owners can manage billing." }
  }
  if (!organization.stripe_customer_id) {
    return { error: "No billing account found for this organization yet." }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripe_customer_id,
      return_url: `${siteUrl()}/settings`,
    })
    return { url: session.url }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not open billing portal." }
  }
}
