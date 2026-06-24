import { createClient } from "@/lib/supabase/server"

interface DashboardItem {
  id: string
  title?: string
  name?: string
  status: string
  created_at: string
}

export async function getDashboardData() {
  const supabase = await createClient()

  const [prompts, contextAssets, agents, workflows] = await Promise.all([
    supabase
      .from("prompts")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("context_assets")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("agents")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("workflows")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    prompts: (prompts.data || []) as DashboardItem[],
    contextAssets: (contextAssets.data || []) as DashboardItem[],
    agents: (agents.data || []) as DashboardItem[],
    workflows: (workflows.data || []) as DashboardItem[],
  }
}

export interface DashboardMetrics {
  totalAssets: number
  approved: number
  pendingReview: number
  activeAgents: number
  activeWorkflows: number
}

// Operational snapshot across every AI asset type. Uses head+count queries
// (no rows fetched), all RLS-scoped to the current org.
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()
  const headCount = (table: string) =>
    supabase.from(table).select("*", { count: "exact", head: true })

  const [
    promptsTotal,
    promptsApproved,
    contextTotal,
    contextApproved,
    contextReview,
    agentsTotal,
    agentsApproved,
    agentsReview,
    agentsActive,
    workflowsTotal,
    workflowsApproved,
    workflowsReview,
    workflowsActive,
    imagesTotal,
    imagesApproved,
    imagesReview,
  ] = await Promise.all([
    headCount("prompts"),
    headCount("prompts").eq("status", "approved"),
    headCount("context_assets"),
    headCount("context_assets").eq("status", "approved"),
    headCount("context_assets").eq("status", "needs_review"),
    headCount("agents"),
    headCount("agents").eq("status", "approved"),
    headCount("agents").eq("status", "needs_review"),
    headCount("agents").neq("status", "archived"),
    headCount("workflows"),
    headCount("workflows").eq("status", "approved"),
    headCount("workflows").eq("status", "needs_review"),
    headCount("workflows").neq("status", "archived"),
    headCount("library_images"),
    headCount("library_images").eq("status", "approved"),
    headCount("library_images").eq("status", "needs_review"),
  ])

  const n = (r: { count: number | null }) => r.count ?? 0

  return {
    totalAssets:
      n(promptsTotal) +
      n(contextTotal) +
      n(agentsTotal) +
      n(workflowsTotal) +
      n(imagesTotal),
    approved:
      n(promptsApproved) +
      n(contextApproved) +
      n(agentsApproved) +
      n(workflowsApproved) +
      n(imagesApproved),
    pendingReview:
      n(contextReview) + n(agentsReview) + n(workflowsReview) + n(imagesReview),
    activeAgents: n(agentsActive),
    activeWorkflows: n(workflowsActive),
  }
}
