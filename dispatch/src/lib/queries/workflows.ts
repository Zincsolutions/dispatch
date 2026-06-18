import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { Workflow } from "@/lib/types"

interface WorkflowFilters {
  search?: string
  status?: string
  type?: string
  department?: string
  tag?: string
}

export type WorkflowWithMeta = Workflow & {
  owner_name: string | null
  agent_name: string | null
  prompt_count: number
  context_count: number
}

export async function getWorkflows(
  filters?: WorkflowFilters
): Promise<WorkflowWithMeta[]> {
  const supabase = await createClient()
  let query = supabase
    .from("workflows")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const search = sanitizeSearchTerm(filters?.search)
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    )
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.type) {
    query = query.eq("type", filters.type)
  }
  if (filters?.department) {
    query = query.eq("department", filters.department)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
  }

  const { data, error } = await query
  if (error) throw error
  const workflows = (data as Workflow[]) || []
  if (workflows.length === 0) return []

  const ids = workflows.map((w) => w.id)
  const [wpRes, wcaRes, waRes, profilesRes] = await Promise.all([
    supabase.from("workflow_prompts").select("workflow_id").in("workflow_id", ids),
    supabase.from("workflow_context_assets").select("workflow_id").in("workflow_id", ids),
    supabase.from("workflow_agents").select("workflow_id, agent_id").in("workflow_id", ids),
    supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", [...new Set(workflows.map((w) => w.created_by))]),
  ])

  const countBy = (rows: { workflow_id: string }[] | null) => {
    const m = new Map<string, number>()
    for (const r of rows || []) m.set(r.workflow_id, (m.get(r.workflow_id) ?? 0) + 1)
    return m
  }
  const promptCounts = countBy(wpRes.data)
  const contextCounts = countBy(wcaRes.data)

  // First linked agent per workflow -> resolve its name.
  const firstAgentByWorkflow = new Map<string, string>()
  for (const r of waRes.data || []) {
    if (!firstAgentByWorkflow.has(r.workflow_id)) {
      firstAgentByWorkflow.set(r.workflow_id, r.agent_id)
    }
  }
  const agentIds = [...new Set([...firstAgentByWorkflow.values()])]
  const agentNameById = new Map<string, string>()
  if (agentIds.length > 0) {
    const { data: agentRows } = await supabase
      .from("agents")
      .select("id, name")
      .in("id", agentIds)
    for (const a of agentRows || []) agentNameById.set(a.id as string, a.name as string)
  }
  const ownerById = new Map(
    (profilesRes.data || []).map((p) => [p.id as string, p.full_name as string])
  )

  return workflows.map((w) => ({
    ...w,
    owner_name: ownerById.get(w.created_by) ?? null,
    agent_name: agentNameById.get(firstAgentByWorkflow.get(w.id) ?? "") ?? null,
    prompt_count: promptCounts.get(w.id) ?? 0,
    context_count: contextCounts.get(w.id) ?? 0,
  }))
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
