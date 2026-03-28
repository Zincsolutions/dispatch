import { createClient } from "@/lib/supabase/server"
import type { Workflow } from "@/lib/types"

interface WorkflowFilters {
  search?: string
  status?: string
}

export async function getWorkflows(filters?: WorkflowFilters): Promise<Workflow[]> {
  const supabase = await createClient()
  let query = supabase
    .from("workflows")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Workflow[]) || []
}

export async function getWorkflowById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by)
    .single()

  // Fetch related items
  const [wpRes, wcaRes, waRes] = await Promise.all([
    supabase.from("workflow_prompts").select("prompt_id").eq("workflow_id", id),
    supabase.from("workflow_context_assets").select("context_asset_id").eq("workflow_id", id),
    supabase.from("workflow_agents").select("agent_id").eq("workflow_id", id),
  ])

  const promptIds = (wpRes.data || []).map((r) => r.prompt_id)
  const contextAssetIds = (wcaRes.data || []).map((r) => r.context_asset_id)
  const agentIds = (waRes.data || []).map((r) => r.agent_id)

  const [linkedPrompts, linkedContextAssets, linkedAgents] = await Promise.all([
    promptIds.length > 0
      ? supabase.from("prompts").select("id, title, status").in("id", promptIds).then((r) => r.data || [])
      : Promise.resolve([]),
    contextAssetIds.length > 0
      ? supabase.from("context_assets").select("id, title, status").in("id", contextAssetIds).then((r) => r.data || [])
      : Promise.resolve([]),
    agentIds.length > 0
      ? supabase.from("agents").select("id, name, status").in("id", agentIds).then((r) => r.data || [])
      : Promise.resolve([]),
  ])

  return {
    ...(data as Workflow),
    created_by_name: profile?.full_name ?? "Unknown",
    linked_prompts: linkedPrompts as { id: string; title: string; status: string }[],
    linked_context_assets: linkedContextAssets as { id: string; title: string; status: string }[],
    linked_agents: linkedAgents as { id: string; name: string; status: string }[],
  }
}
