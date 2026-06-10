import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Invitation } from "@/lib/types"

export async function getPendingInvitations(): Promise<Invitation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  // Degrade gracefully if the invitations migration hasn't been applied yet,
  // so the settings page keeps working.
  if (error) {
    console.warn("[invitations] query failed:", error.message)
    return []
  }
  return (data as Invitation[]) || []
}

// Public invite-page lookup: uses the service role because the visitor has
// no org membership yet. Only exposes what the invite page needs.
export async function getInvitationForToken(token: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("invitations")
    .select("email, role, status, expires_at, organizations(name)")
    .eq("token", token)
    .single()

  if (!data) return null

  return {
    email: data.email as string,
    role: data.role as string,
    status: data.status as string,
    expiresAt: data.expires_at as string,
    organizationName:
      (data.organizations as { name?: string } | null)?.name ?? "an organization",
  }
}
