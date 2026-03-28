import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "./settings-form"

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

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Settings</h1>
      <SettingsForm
        organization={organization}
        profile={profile!}
        members={members || []}
        role={role}
        userEmail={user.email || ""}
      />
    </div>
  )
}
