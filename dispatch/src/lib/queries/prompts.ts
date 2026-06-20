import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { Prompt } from "@/lib/types"

interface PromptFilters {
  search?: string
  status?: string
  category?: string
  tag?: string
}

export async function getPrompts(filters?: PromptFilters): Promise<Prompt[]> {
  const supabase = await createClient()
  let query = supabase
    .from("prompts")
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
  if (filters?.category) {
    query = query.eq("category", filters.category)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Prompt[]) || []
}

const SIGNED_URL_TTL = 60 * 60 // 1 hour

export async function getPromptById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const prompt = data as Prompt

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", prompt.created_by)
    .single()

  // Sample output lives in the shared private `library` bucket; serve it
  // via a short-lived signed URL.
  let sampleOutputUrl: string | null = null
  if (prompt.sample_output_path) {
    const { data: signed } = await supabase.storage
      .from("library")
      .createSignedUrl(prompt.sample_output_path, SIGNED_URL_TTL)
    sampleOutputUrl = signed?.signedUrl ?? null
  }

  // Connected foundation assets.
  const { data: linkRows } = await supabase
    .from("prompt_context_assets")
    .select("context_asset_id")
    .eq("prompt_id", id)
  const connectedAssetIds = (linkRows || []).map((r) => r.context_asset_id)
  let connectedAssets: { id: string; title: string; status: string }[] = []
  if (connectedAssetIds.length) {
    const { data: assets } = await supabase
      .from("context_assets")
      .select("id, title, status")
      .in("id", connectedAssetIds)
    connectedAssets = (assets as { id: string; title: string; status: string }[]) || []
  }

  return {
    ...prompt,
    created_by_name: profile?.full_name ?? "Unknown",
    sample_output_url: sampleOutputUrl,
    connected_asset_ids: connectedAssetIds,
    connected_assets: connectedAssets,
  }
}
