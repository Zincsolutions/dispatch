import { createClient } from "@/lib/supabase/server"
import type { ContextAsset } from "@/lib/types"

interface ContextAssetFilters {
  search?: string
  status?: string
  asset_type?: string
}

export async function getContextAssets(filters?: ContextAssetFilters): Promise<ContextAsset[]> {
  const supabase = await createClient()
  let query = supabase
    .from("context_assets")
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
  if (filters?.asset_type) {
    query = query.eq("asset_type", filters.asset_type)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as ContextAsset[]) || []
}

export async function getContextAssetById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("context_assets")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by)
    .single()

  return { ...(data as ContextAsset), created_by_name: profile?.full_name ?? "Unknown" }
}
