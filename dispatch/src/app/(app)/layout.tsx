export const dynamic = "force-dynamic"

import { Suspense } from "react"
import type { Metadata } from "next"
import { getCurrentUser, getCurrentUserWithOrg } from "@/lib/queries/organization"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { FlashToast } from "@/components/shared/flash-toast"

// Pages under the app set short titles ("Prompts") and render in the tab
// as "Prompts · Dispatch" — without this, every tab shows the marketing tagline.
export const metadata: Metadata = {
  title: {
    template: "%s · Dispatch",
    default: "Dispatch",
  },
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify the user once (cached for the whole request), then fetch the
  // org membership and profile concurrently — both only need user.id.
  const user = await getCurrentUser()
  const supabase = await createClient()
  const [{ organization }, { data: profileRow }] = await Promise.all([
    getCurrentUserWithOrg(),
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single(),
  ])

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
        <Suspense>
          <FlashToast />
        </Suspense>
      </div>
    </div>
  )
}
