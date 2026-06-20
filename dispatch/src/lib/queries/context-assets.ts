import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { ContextAsset } from "@/lib/types"

interface ContextAssetFilters {
  search?: string
  status?: string
  category?: string
  asset_type?: string
  tag?: string
}

export async function getContextAssets(filters?: ContextAssetFilters): Promise<ContextAsset[]> {
  const supabase = await createClient()
  let query = supabase
    .from("context_assets")
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
  if (filters?.asset_type) {
    query = query.eq("asset_type", filters.asset_type)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
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

export interface CategoryStat {
  total: number
  approved: number
  needsReview: number
  lastUpdated: string | null
}

export interface FoundationOverview {
  total: number
  approved: number
  needsReview: number
  draft: number
  archived: number
  lastUpdated: string | null
  byCategory: Record<string, CategoryStat>
}

// Aggregates the org's foundation assets for the landing page (health
// summary + per-category cards). RLS scopes this to the current org.
export async function getFoundationOverview(): Promise<FoundationOverview> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("context_assets")
    .select("category, status, updated_at")
  if (error) throw error

  const rows =
    (data as { category: string | null; status: string; updated_at: string }[]) || []

  const overview: FoundationOverview = {
    total: rows.length,
    approved: 0,
    needsReview: 0,
    draft: 0,
    archived: 0,
    lastUpdated: null,
    byCategory: {},
  }

  for (const r of rows) {
    if (r.status === "approved") overview.approved++
    else if (r.status === "needs_review") overview.needsReview++
    else if (r.status === "draft") overview.draft++
    else if (r.status === "archived") overview.archived++

    if (!overview.lastUpdated || r.updated_at > overview.lastUpdated) {
      overview.lastUpdated = r.updated_at
    }

    const key = r.category ?? "uncategorized"
    const stat =
      overview.byCategory[key] ??
      (overview.byCategory[key] = {
        total: 0,
        approved: 0,
        needsReview: 0,
        lastUpdated: null,
      })
    stat.total++
    if (r.status === "approved") stat.approved++
    if (r.status === "needs_review") stat.needsReview++
    if (!stat.lastUpdated || r.updated_at > stat.lastUpdated) {
      stat.lastUpdated = r.updated_at
    }
  }

  return overview
}
