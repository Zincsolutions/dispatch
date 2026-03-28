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
