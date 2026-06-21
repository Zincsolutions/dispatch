import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { ContextAsset, FoundationAssetFile, FoundationAssetLink } from "@/lib/types"

const SIGNED_URL_TTL = 60 * 60 // 1 hour

interface ContextAssetFilters {
  search?: string
  status?: string
  category?: string
  asset_type?: string
  tag?: string
}

export type ContextAssetWithCover = ContextAsset & { cover_image_url: string | null }

export async function getContextAssets(
  filters?: ContextAssetFilters,
  opts?: { withCover?: boolean }
): Promise<ContextAssetWithCover[]> {
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
  const assets = (data as ContextAsset[]) || []

  if (!opts?.withCover || assets.length === 0) {
    return assets.map((a) => ({ ...a, cover_image_url: null }))
  }

  // Attach a cover thumbnail: the first image file on each asset, signed.
  const { data: fileRows } = await supabase
    .from("foundation_asset_files")
    .select("foundation_asset_id, storage_path, file_type, created_at")
    .in(
      "foundation_asset_id",
      assets.map((a) => a.id)
    )
    .order("created_at", { ascending: true })

  const coverPathByAsset = new Map<string, string>()
  for (const r of fileRows || []) {
    if (!r.file_type || !r.file_type.startsWith("image/")) continue
    if (!coverPathByAsset.has(r.foundation_asset_id)) {
      coverPathByAsset.set(r.foundation_asset_id, r.storage_path)
    }
  }

  let signedByPath = new Map<string, string>()
  const paths = [...coverPathByAsset.values()]
  if (paths.length) {
    const { data: signed } = await supabase.storage
      .from("library")
      .createSignedUrls(paths, SIGNED_URL_TTL)
    signedByPath = new Map(
      (signed || []).filter((s) => s.path).map((s) => [s.path as string, s.signedUrl])
    )
  }

  return assets.map((a) => {
    const p = coverPathByAsset.get(a.id)
    return { ...a, cover_image_url: p ? signedByPath.get(p) ?? null : null }
  })
}

export async function getContextAssetById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("context_assets")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null
  const asset = data as ContextAsset

  // Resolve the people (creator, owner, approver) in one query.
  const personIds = [
    asset.created_by,
    asset.owner_user_id,
    asset.approved_by,
  ].filter(Boolean) as string[]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", personIds.length ? personIds : ["00000000-0000-0000-0000-000000000000"])
  const nameById = new Map((profiles || []).map((p) => [p.id, p.full_name]))

  // Attached files + external links.
  const [filesRes, linksRes] = await Promise.all([
    supabase
      .from("foundation_asset_files")
      .select("*")
      .eq("foundation_asset_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("foundation_asset_links")
      .select("*")
      .eq("foundation_asset_id", id)
      .order("created_at", { ascending: true }),
  ])
  const fileRows = (filesRes.data as FoundationAssetFile[]) || []
  const links = (linksRes.data as FoundationAssetLink[]) || []

  // Sign the file paths (stored in the private `library` bucket).
  let signedByPath = new Map<string, string>()
  if (fileRows.length) {
    const { data: signed } = await supabase.storage
      .from("library")
      .createSignedUrls(
        fileRows.map((f) => f.storage_path),
        SIGNED_URL_TTL
      )
    signedByPath = new Map(
      (signed || [])
        .filter((s) => s.path)
        .map((s) => [s.path as string, s.signedUrl])
    )
  }

  return {
    ...asset,
    created_by_name: nameById.get(asset.created_by) ?? "Unknown",
    owner_name: asset.owner_user_id ? nameById.get(asset.owner_user_id) ?? null : null,
    approved_by_name: asset.approved_by ? nameById.get(asset.approved_by) ?? null : null,
    files: fileRows.map((f) => ({ ...f, url: signedByPath.get(f.storage_path) ?? null })),
    links,
  }
}

// Lightweight options for the "Connected Foundation Assets" picker
// (prompts, agents, etc.). RLS scopes this to the current org.
export async function getFoundationAssetOptions(): Promise<
  { id: string; title: string; status: string }[]
> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("context_assets")
    .select("id, title, status")
    .order("title", { ascending: true })
  return (data as { id: string; title: string; status: string }[]) || []
}

// Recent image thumbnails per foundation category, for the landing cards.
// Returns signed URLs keyed by category value. RLS scopes to the org.
export async function getCategoryImagePreviews(
  perCategory = 4
): Promise<Record<string, string[]>> {
  const supabase = await createClient()

  const { data: assets } = await supabase
    .from("context_assets")
    .select("id, category")
  const categoryByAsset = new Map(
    (assets || []).map((a) => [a.id, a.category as string | null])
  )

  const { data: files } = await supabase
    .from("foundation_asset_files")
    .select("foundation_asset_id, storage_path, file_type, created_at")
    .order("created_at", { ascending: false })
    .limit(150)

  const pathsByCategory: Record<string, string[]> = {}
  for (const f of files || []) {
    if (!f.file_type || !f.file_type.startsWith("image/")) continue
    const category = categoryByAsset.get(f.foundation_asset_id)
    if (!category) continue
    const arr = (pathsByCategory[category] ??= [])
    if (arr.length < perCategory) arr.push(f.storage_path)
  }

  const allPaths = Object.values(pathsByCategory).flat()
  if (allPaths.length === 0) return {}

  const { data: signed } = await supabase.storage
    .from("library")
    .createSignedUrls(allPaths, SIGNED_URL_TTL)
  const urlByPath = new Map(
    (signed || []).filter((s) => s.path).map((s) => [s.path as string, s.signedUrl])
  )

  const result: Record<string, string[]> = {}
  for (const [category, paths] of Object.entries(pathsByCategory)) {
    result[category] = paths
      .map((p) => urlByPath.get(p))
      .filter(Boolean) as string[]
  }
  return result
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
