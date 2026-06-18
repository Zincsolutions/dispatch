import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { Agent } from "@/lib/types"

interface AgentFilters {
  search?: string
  status?: string
  platform?: string
  department?: string
  tag?: string
}

export type AgentWithOwner = Agent & { owner_name: string | null }

export async function getAgents(
  filters?: AgentFilters
): Promise<AgentWithOwner[]> {
  const supabase = await createClient()

  let query = supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const search = sanitizeSearchTerm(filters?.search)
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    )
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.platform) {
    query = query.eq("platform", filters.platform)
  }
  if (filters?.department) {
    query = query.eq("department", filters.department)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
  }

  const { data, error } = await query
  if (error) throw error
  const agents = (data as Agent[]) || []
  if (agents.length === 0) return []

  // Resolve owner names in one batch instead of per-agent.
  const creatorIds = [...new Set(agents.map((a) => a.created_by))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds)
  const nameById = new Map(
    (profiles || []).map((p) => [p.id as string, p.full_name as string])
  )

  return agents.map((a) => ({
    ...a,
    owner_name: nameById.get(a.created_by) ?? null,
  }))
}

export async function getAgentById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by)
    .single()

  return { ...(data as Agent), created_by_name: profile?.full_name ?? "Unknown" }
}
