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
    title: (formData.get("title") as string) || null,
    prompt: (formData.get("prompt") as string) || "",
    sref: (formData.get("sref") as string) || null,
    parameters: (formData.get("parameters") as string) || null,
    tool: formData.get("tool") || "midjourney",
    collection_id: (formData.get("collection_id") as string) || null,
    tags: safeParseTags(formData.get("tags")),
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

  const { error } = await supabase.from("library_images").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
  } as LibraryImageInsert)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/library")
  redirect("/library")
}

export async function updateLibraryImage(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = libraryImageUpdateSchema.safeParse(parseImageFields(formData))

  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  const { error } = await supabase
    .from("library_images")
    .update(parsed.data as LibraryImageUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
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
    .select("storage_path")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("library_images").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  if (image?.storage_path) {
    // Best-effort: an orphaned file is preferable to a phantom row.
    await supabase.storage.from("library").remove([image.storage_path as string])
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
