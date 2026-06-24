"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { startCheckout, openBillingPortal } from "@/lib/actions/billing"
import { toast } from "sonner"

interface Props {
  plan: string
  hasSubscription: boolean
  billingEnabled: boolean
  isOwner: boolean
}

export function BillingActions({ plan, hasSubscription, billingEnabled, isOwner }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  // Until Stripe is configured, just point owners to the pricing page.
  if (!billingEnabled) {
    if (plan === "enterprise") return null
    return (
      <Link href="/pricing" className={buttonVariants({ size: "sm" })}>
        Upgrade plan
      </Link>
    )
  }

  async function upgrade(target: "starter" | "team") {
    setLoading(target)
    const res = await startCheckout(target, "yearly")
    if (res?.url) {
      window.location.href = res.url
      return
    }
    toast.error(res?.error || "Could not start checkout")
    setLoading(null)
  }

  async function manage() {
    setLoading("manage")
    const res = await openBillingPortal()
    if (res?.url) {
      window.location.href = res.url
      return
    }
    toast.error(res?.error || "Could not open billing")
    setLoading(null)
  }

  if (!isOwner) {
    return <span className="text-xs text-muted-foreground">Owners manage billing.</span>
  }

  const showStarter = plan === "personal"
  const showTeam = plan === "personal" || plan === "starter"
  const busy = loading !== null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showStarter && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => upgrade("starter")}>
          {loading === "starter" ? "Starting…" : "Upgrade to Starter"}
        </Button>
      )}
      {showTeam && (
        <Button size="sm" disabled={busy} onClick={() => upgrade("team")}>
          {loading === "team" ? "Starting…" : "Upgrade to Team"}
        </Button>
      )}
      {hasSubscription && (
        <Button variant="outline" size="sm" disabled={busy} onClick={manage}>
          {loading === "manage" ? "Opening…" : "Manage billing"}
        </Button>
      )}
    </div>
  )
}
