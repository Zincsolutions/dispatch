import { createClient } from "@/lib/supabase/server"
import type { Agent } from "@/lib/types"

interface AgentFilters {
  search?: string
  status?: string
  platform?: string
}

export async function getAgents(filters?: AgentFilters): Promise<Agent[]> {
  const supabase = await createClient()

  let query = supabase
    .from("agents")
    .select("*")
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
