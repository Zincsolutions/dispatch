export const dynamic = "force-dynamic"

import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, organization } = await getCurrentUserWithOrg()

  const profile = {
    name: user.user_metadata?.full_name || "",
    email: user.email || "",
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgName={organization.name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          orgName={organization.name}
          userName={profile.name}
          userEmail={profile.email}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
