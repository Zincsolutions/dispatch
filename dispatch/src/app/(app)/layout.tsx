export const dynamic = "force-dynamic"

import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, organization } = await getCurrentUserWithOrg()

  const supabase = await createClient()
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  const profile = {
    name: profileRow?.full_name || user.user_metadata?.full_name || "",
    email: user.email || "",
    avatarUrl: profileRow?.avatar_url ?? null,
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgName={organization.name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          orgName={organization.name}
          userName={profile.name}
          userEmail={profile.email}
          avatarUrl={profile.avatarUrl}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
