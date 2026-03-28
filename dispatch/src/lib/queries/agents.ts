import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { Agent } from "@/lib/types"

interface AgentFilters {
  search?: string
  status?: string
  platform?: string
}

export async function getAgents(filters?: AgentFilters): Promise<Agent[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const admin = createAdminClient()

  // Get user's org
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .single()

  if (!membership) return []

  let query = admin
    .from("agents")
    .select("*")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.platform) {
    query = query.eq("platform", filters.platform)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Agent[]) || []
}

export async function getAgentById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()

  const { data, error } = await admin
    .from("agents")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by)
    .single()

  return { ...(data as Agent), created_by_name: profile?.full_name ?? "Unknown" }
}
