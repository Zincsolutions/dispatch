import { getCurrentUserWithOrg, getPlanUsage } from "@/lib/queries/organization"
import { getPendingInvitations } from "@/lib/queries/invitations"
import { isStripeConfigured } from "@/lib/stripe"
import { PlanUsageCard } from "./plan-usage-card"
import { BillingActions } from "./billing-actions"
import { createClient } from "@/lib/supabase/server"
import { signout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SettingsForm } from "./settings-form"
import { InviteMembers } from "./invite-members"

export default async function SettingsPage() {
  const { user, organization, role } = await getCurrentUserWithOrg()

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: members } = await supabase
    .from("organization_members")
    .select("*, profiles(*)")
    .order("created_at", { ascending: true })

  const [invitations, usage] = await Promise.all([
    role === "owner" ? getPendingInvitations() : Promise.resolve([]),
    getPlanUsage(),
  ])

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Settings</h1>
      <div className="space-y-6">
        <PlanUsageCard
          plan={organization.plan}
          usage={usage}
          actions={
            <BillingActions
              plan={organization.plan}
              hasSubscription={Boolean(organization.stripe_subscription_id)}
              billingEnabled={isStripeConfigured()}
              isOwner={role === "owner"}
            />
          }
        />
        <SettingsForm
          organization={organization}
          profile={profile!}
          members={members || []}
          role={role}
          userEmail={user.email || ""}
        />
        {role === "owner" && <InviteMembers invitations={invitations} />}
        <Separator />
        <form action={signout}>
          <Button variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  )
}
