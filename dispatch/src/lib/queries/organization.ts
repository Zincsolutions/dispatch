import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Organization } from "@/lib/types"

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
    organization: organization as Organization,
    role: membership.role as string,
  }
}

// Org-wide counts for the Plan & Usage card (RLS-scoped to the user's org).
export async function getPlanUsage() {
  const supabase = await createClient()
  const headCount = (table: string) =>
    supabase.from(table).select("*", { count: "exact", head: true })

  const [users, prompts, workflows, agents, images] = await Promise.all([
    headCount("organization_members"),
    headCount("prompts"),
    headCount("workflows"),
    headCount("agents"),
    headCount("library_images"),
  ])

  const n = (r: { count: number | null }) => r.count ?? 0
  return {
    users: n(users),
    prompts: n(prompts),
    workflows: n(workflows),
    agents: n(agents),
    images: n(images),
  }
}
