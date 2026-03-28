import { createClient } from "@/lib/supabase/server"
import type { Prompt } from "@/lib/types"

interface PromptFilters {
  search?: string
  status?: string
  category?: string
}

export async function getPrompts(filters?: PromptFilters): Promise<Prompt[]> {
  const supabase = await createClient()
  let query = supabase
    .from("prompts")
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
  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Prompt[]) || []
}

export async function getPromptById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by)
    .single()

  return { ...(data as Prompt), created_by_name: profile?.full_name ?? "Unknown" }
}
