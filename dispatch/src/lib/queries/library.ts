import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { ImageCollection, LibraryImage } from "@/lib/types"

const SIGNED_URL_TTL = 60 * 60 // 1 hour

export type LibraryImageWithUrl = LibraryImage & { url: string | null }

interface LibraryFilters {
  search?: string
  collection?: string
  tag?: string
}

export async function getLibraryImages(
  filters?: LibraryFilters
): Promise<LibraryImageWithUrl[]> {
  const supabase = await createClient()
  let query = supabase
    .from("library_images")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60)

  const search = sanitizeSearchTerm(filters?.search)
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,prompt.ilike.%${search}%,sref.ilike.%${search}%`
    )
  }
  if (filters?.collection) {
    query = query.eq("collection_id", filters.collection)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
  }

  const { data, error } = await query
  if (error) throw error
  const images = (data as LibraryImage[]) || []
  if (images.length === 0) return []

  // One batch call for all signed URLs instead of one per image.
  const { data: signed } = await supabase.storage
    .from("library")
    .createSignedUrls(
      images.map((img) => img.storage_path),
      SIGNED_URL_TTL
    )

  const urlByPath = new Map(
    (signed || []).map((s) => [s.path, s.signedUrl])
  )

  return images.map((img) => ({
    ...img,
    url: urlByPath.get(img.storage_path) ?? null,
  }))
}

export async function getLibraryImageById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("library_images")
    .select("*, image_collections(name), profiles!library_images_created_by_fkey(full_name)")
    .eq("id", id)
    .single()

  if (error || !data) return null

  const image = data as LibraryImage & {
    image_collections: { name: string } | null
    profiles: { full_name: string } | null
  }

  // Sign the generated image and (when present) the reference image together.
  const pathsToSign = [image.storage_path, image.reference_storage_path].filter(
    Boolean
  ) as string[]
  const { data: signed } = await supabase.storage
    .from("library")
    .createSignedUrls(pathsToSign, SIGNED_URL_TTL)
  const urlByPath = new Map((signed || []).map((s) => [s.path, s.signedUrl]))

  return {
    ...image,
    url: urlByPath.get(image.storage_path) ?? null,
    reference_url: image.reference_storage_path
      ? urlByPath.get(image.reference_storage_path) ?? null
      : null,
    collection_name: image.image_collections?.name ?? null,
    created_by_name: image.profiles?.full_name ?? "Unknown",
  }
}

export async function getCollections(): Promise<ImageCollection[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("image_collections")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.warn("[library] collections query failed:", error.message)
    return []
  }
  return (data as ImageCollection[]) || []
}
