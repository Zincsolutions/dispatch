"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import {
  libraryImageSchema,
  libraryImageUpdateSchema,
  collectionSchema,
} from "@/lib/validations/library"
import type { LibraryImageInsert, LibraryImageUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function parseImageFields(formData: FormData) {
  return {
    reference_storage_path:
      (formData.get("reference_storage_path") as string) || null,
    title: (formData.get("title") as string) || null,
    prompt: (formData.get("prompt") as string) || "",
    sref: (formData.get("sref") as string) || null,
    parameters: (formData.get("parameters") as string) || null,
    tool: formData.get("tool") || "midjourney",
    status: formData.get("status") || "approved",
    negative_prompt: (formData.get("negative_prompt") as string) || null,
    cref: (formData.get("cref") as string) || null,
    seed: (formData.get("seed") as string) || null,
    aspect_ratio: (formData.get("aspect_ratio") as string) || null,
    usage_notes: (formData.get("usage_notes") as string) || null,
    collection_id: (formData.get("collection_id") as string) || null,
    tags: safeParseTags(formData.get("tags")),
  }
}

function relatedAssetIdsFrom(formData: FormData): string[] {
  try {
    const raw = JSON.parse((formData.get("related_context_asset_ids") as string) || "[]")
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []
  } catch {
    return []
  }
}

function safeParseTags(raw: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse((raw as string) || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// The file itself is uploaded directly from the browser to storage
// (RLS-scoped to the org's folder); this records the metadata row.
export async function createLibraryImage(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = libraryImageSchema.safeParse({
    storage_path: formData.get("storage_path"),
    ...parseImageFields(formData),
  })

  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  // The browser can only upload under its own org prefix (storage RLS),
  // but never trust the client-supplied path regardless.
  if (!parsed.data.storage_path.startsWith(`${organizationId}/`)) {
    return { error: { _form: ["Invalid storage path"] } }
  }
  if (
    parsed.data.reference_storage_path &&
    !parsed.data.reference_storage_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid reference storage path"] } }
  }

  const { data: created, error } = await supabase
    .from("library_images")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      created_by: user.id,
    } as LibraryImageInsert)
    .select("id")
    .single()

  if (error || !created) {
    return { error: { _form: [error?.message || "Could not save image"] } }
  }

  const relatedAssetIds = relatedAssetIdsFrom(formData)
  if (relatedAssetIds.length) {
    await supabase.from("library_image_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        library_image_id: created.id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/library")
  redirect("/library")
}

export async function updateLibraryImage(id: string, formData: FormData) {
  const supabase = await createClient()
  const { organizationId } = await getCurrentUserWithOrg()

  const parsed = libraryImageUpdateSchema.safeParse(parseImageFields(formData))

  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  if (
    parsed.data.reference_storage_path &&
    !parsed.data.reference_storage_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid reference storage path"] } }
  }

  // Grab the previous reference file so we can clean it up if it was
  // replaced or removed in this edit.
  const { data: existing } = await supabase
    .from("library_images")
    .select("reference_storage_path")
    .eq("id", id)
    .single()
  const oldReferencePath = existing?.reference_storage_path as string | null

  const { error } = await supabase
    .from("library_images")
    .update(parsed.data as LibraryImageUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  if (oldReferencePath && oldReferencePath !== parsed.data.reference_storage_path) {
    // Best-effort: an orphaned file is preferable to a failed save.
    await supabase.storage.from("library").remove([oldReferencePath])
  }

  // Replace the connected foundation assets.
  const relatedAssetIds = relatedAssetIdsFrom(formData)
  await supabase.from("library_image_context_assets").delete().eq("library_image_id", id)
  if (relatedAssetIds.length) {
    await supabase.from("library_image_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        library_image_id: id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/library")
  revalidatePath(`/library/${id}`)
  redirect(`/library/${id}`)
}

export async function deleteLibraryImage(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { data: image } = await supabase
    .from("library_images")
    .select("storage_path, reference_storage_path")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("library_images").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  // Best-effort: an orphaned file is preferable to a phantom row.
  const pathsToRemove = [
    image?.storage_path,
    image?.reference_storage_path,
  ].filter(Boolean) as string[]
  if (pathsToRemove.length > 0) {
    await supabase.storage.from("library").remove(pathsToRemove)
  }

  revalidatePath("/library")
  redirect("/library")
}

export async function createCollection(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = collectionSchema.safeParse({
    name: (formData.get("name") as string)?.trim(),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" }
  }

  const { error } = await supabase.from("image_collections").insert({
    name: parsed.data.name,
    organization_id: organizationId,
    created_by: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/library")
  return { success: true }
}
