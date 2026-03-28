import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function getCurrentUserWithOrg() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Use the admin client for these lookups because the RLS policies on
  // organization_members and organizations depend on get_user_org_id(),
  // which itself reads organization_members — causing infinite recursion
  // if the database has the original (unfixed) policies.
  const admin = createAdminClient()

  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/signup")
  }

  const { data: organization } = await admin
    .from("organizations")
    .select("*")
    .eq("id", membership.organization_id)
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
