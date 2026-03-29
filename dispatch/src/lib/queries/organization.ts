import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getCurrentUserWithOrg() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Query membership directly — the RLS policy on organization_members
  // uses user_id = auth.uid() (no recursion, fixed in migration 00002).
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/signup")
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.organization_id as string)
    .single()

  if (!organization) {
    redirect("/signup")
  }

  return {
    user,
    organizationId: membership.organization_id as string,
    organization: organization as { id: string; name: string; slug: string; created_at: string; updated_at: string },
    role: membership.role as string,
  }
}
