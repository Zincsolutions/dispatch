import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Organization } from "@/lib/types"

// cache() dedupes per request: the layout and the page each call these
// helpers, but only the first call does any work.
//
// getSession() reads the cookie without a network round-trip. That's safe
// here because (a) the middleware already verified/refreshed the token with
// the auth server on this same request, and (b) every data query re-verifies
// the JWT at the database via RLS — a forged token yields no rows, and the
// membership check below then bounces the request out.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/login")
  }

  return session.user
})

export const getCurrentUserWithOrg = cache(async () => {
  const user = await getCurrentUser()
  const supabase = await createClient()

  // Membership + organization in a single round-trip via the FK embed.
  // The RLS policy on organization_members uses user_id = auth.uid()
  // (no recursion, fixed in migration 00002).
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(*)")
    .eq("user_id", user.id)
    .single()

  const organization = (membership?.organizations ?? null) as Organization | null

  if (!membership || !organization) {
    redirect("/signup")
  }

  return {
    user,
    organizationId: membership.organization_id as string,
    organization,
    role: membership.role as string,
  }
})

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
