import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe, planForPriceId } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  // Billing not configured yet — acknowledge so Stripe doesn't retry forever.
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: "stripe-not-configured" })
  }

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 })
  }

  const admin = createAdminClient()
  const setOrg = (id: string, fields: Record<string, unknown>) =>
    admin.from("organizations").update(fields).eq("id", id)

  // Resolve which org a subscription belongs to (metadata first, then a
  // lookup by stored subscription / customer id).
  async function resolveOrgId(sub: Stripe.Subscription): Promise<string | null> {
    if (sub.metadata?.organization_id) return sub.metadata.organization_id
    const bySub = await admin
      .from("organizations")
      .select("id")
      .eq("stripe_subscription_id", sub.id)
      .maybeSingle()
    if (bySub.data?.id) return bySub.data.id
    const customerId = typeof sub.customer === "string" ? sub.customer : null
    if (customerId) {
      const byCust = await admin
        .from("organizations")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle()
      if (byCust.data?.id) return byCust.data.id
    }
    return null
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session
        const orgId = s.client_reference_id || s.metadata?.organization_id
        const plan = s.metadata?.plan
        if (orgId && plan) {
          await setOrg(orgId, {
            plan,
            plan_status: "active",
            stripe_customer_id: typeof s.customer === "string" ? s.customer : null,
            stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : null,
          })
        }
        break
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const orgId = await resolveOrgId(sub)
        if (orgId) {
          const priceId = sub.items.data[0]?.price?.id
          const plan = priceId ? planForPriceId(priceId) : null
          await setOrg(orgId, {
            ...(plan ? { plan } : {}),
            plan_status: sub.status,
            stripe_subscription_id: sub.id,
          })
        }
        break
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const orgId = await resolveOrgId(sub)
        if (orgId) {
          await setOrg(orgId, {
            plan: "personal",
            plan_status: "canceled",
            stripe_subscription_id: null,
          })
        }
        break
      }
    }
  } catch {
    return NextResponse.json({ error: "handler-error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
