"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { contextAssetSchema } from "@/lib/validations/context-assets"
import { canApprove, APPROVAL_DENIED_ERROR } from "@/lib/authz"
import type { ContextAssetInsert, ContextAssetUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function parseFields(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description") || null,
    content: formData.get("content"),
    category: formData.get("category"),
    asset_type: formData.get("asset_type") || null,
    notes: formData.get("notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  }
}

interface NewFile {
  storage_path: string
  file_name: string
  file_type: string | null
  file_size: number | null
}

function parseLinks(formData: FormData): { url: string; label: string | null }[] {
  try {
    const raw = JSON.parse((formData.get("links") as string) || "[]")
    if (!Array.isArray(raw)) return []
    return raw
      .map((l) => ({ url: String(l.url || "").trim(), label: l.label ? String(l.label).trim() : null }))
      .filter((l) => l.url.length > 0)
  } catch {
    return []
  }
}

function parseNewFiles(formData: FormData, organizationId: string): NewFile[] {
  try {
    const raw = JSON.parse((formData.get("new_files") as string) || "[]")
    if (!Array.isArray(raw)) return []
    return raw
      .filter(
        (f) =>
          typeof f.storage_path === "string" &&
          // Never trust the client path: must live under the org's own folder.
          f.storage_path.startsWith(`${organizationId}/`)
      )
      .map((f) => ({
        storage_path: f.storage_path,
        file_name: String(f.file_name || "file"),
        file_type: f.file_type ? String(f.file_type) : null,
        file_size: typeof f.file_size === "number" ? f.file_size : null,
      }))
  } catch {
    return []
  }
}

export async function createContextAsset(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  const parsed = contextAssetSchema.safeParse(parseFields(formData))
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  if (parsed.data.status === "approved" && !canApprove(role)) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const { data: created, error } = await supabase
    .from("context_assets")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      created_by: user.id,
      owner_user_id: user.id,
      ...(parsed.data.status === "approved"
        ? { approved_by: user.id, approved_at: new Date().toISOString() }
        : {}),
    } as ContextAssetInsert)
    .select("id")
    .single()

  if (error || !created) {
    return { error: { _form: [error?.message || "Could not create asset"] } }
  }

  await saveChildren(supabase, created.id, organizationId, user.id, formData)

  revalidatePath("/foundation")
  redirect(`/foundation/${created.id}?flash=created`)
}

export async function updateContextAsset(id: string, formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  const parsed = contextAssetSchema.safeParse(parseFields(formData))
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Stamp approval metadata when an asset enters 'approved'; clear when it leaves.
  const { data: existing } = await supabase
    .from("context_assets")
    .select("status")
    .eq("id", id)
    .single()
  const nowApproved = parsed.data.status === "approved"
  const wasApproved = existing?.status === "approved"

  // Only owners can move an asset into the approved state.
  if (nowApproved && !wasApproved && !canApprove(role)) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const approvalFields = nowApproved
    ? wasApproved
      ? {}
      : { approved_by: user.id, approved_at: new Date().toISOString() }
    : { approved_by: null, approved_at: null }

  const { error } = await supabase
    .from("context_assets")
    .update({ ...parsed.data, ...approvalFields } as ContextAssetUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  await saveChildren(supabase, id, organizationId, user.id, formData, true)

  revalidatePath("/foundation")
  revalidatePath(`/foundation/${id}`)
  redirect(`/foundation/${id}?flash=saved`)
}

// Inserts new files + links; on edit, replaces links and removes deleted files.
async function saveChildren(
  supabase: Awaited<ReturnType<typeof createClient>>,
  assetId: string,
  organizationId: string,
  userId: string,
  formData: FormData,
  isEdit = false
) {
  const links = parseLinks(formData)
  const newFiles = parseNewFiles(formData, organizationId)

  if (isEdit) {
    // Links: replace the full set.
    await supabase.from("foundation_asset_links").delete().eq("foundation_asset_id", assetId)

    // Files: remove the ones the user deleted (rows + storage objects).
    let removedIds: string[] = []
    try {
      const raw = JSON.parse((formData.get("removed_file_ids") as string) || "[]")
      if (Array.isArray(raw)) removedIds = raw.filter((x) => typeof x === "string")
    } catch {}
    if (removedIds.length) {
      const { data: toRemove } = await supabase
        .from("foundation_asset_files")
        .select("storage_path")
        .in("id", removedIds)
      await supabase.from("foundation_asset_files").delete().in("id", removedIds)
      const paths = (toRemove || []).map((f) => f.storage_path).filter(Boolean) as string[]
      if (paths.length) await supabase.storage.from("library").remove(paths)
    }
  }

  if (links.length) {
    await supabase.from("foundation_asset_links").insert(
      links.map((l) => ({
        foundation_asset_id: assetId,
        organization_id: organizationId,
        url: l.url,
        label: l.label,
        created_by: userId,
      }))
    )
  }

  if (newFiles.length) {
    await supabase.from("foundation_asset_files").insert(
      newFiles.map((f) => ({
        foundation_asset_id: assetId,
        organization_id: organizationId,
        storage_path: f.storage_path,
        file_name: f.file_name,
        file_type: f.file_type,
        file_size: f.file_size,
        uploaded_by: userId,
      }))
    )
  }
}

// Quick status change from the list/detail views (no full form submit).
export async function updateFoundationAssetStatus(id: string, status: string) {
  const supabase = await createClient()
  const { user, role } = await getCurrentUserWithOrg()

  if (!["draft", "needs_review", "approved", "archived"].includes(status)) {
    return { error: "Invalid status" }
  }

  const { data: existing } = await supabase
    .from("context_assets")
    .select("status")
    .eq("id", id)
    .single()
  const nowApproved = status === "approved"
  const wasApproved = existing?.status === "approved"

  // Only owners can move an asset into the approved state.
  if (nowApproved && !wasApproved && !canApprove(role)) {
    return { error: APPROVAL_DENIED_ERROR }
  }

  const approvalFields = nowApproved
    ? wasApproved
      ? {}
      : { approved_by: user.id, approved_at: new Date().toISOString() }
    : { approved_by: null, approved_at: null }

  const { error } = await supabase
    .from("context_assets")
    .update({ status, ...approvalFields } as ContextAssetUpdate)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/foundation")
  revalidatePath("/foundation/browse")
  revalidatePath(`/foundation/${id}`)
  return { success: true }
}

export async function deleteContextAsset(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  // Grab attached file paths so we can clean up storage after the row goes.
  const { data: files } = await supabase
    .from("foundation_asset_files")
    .select("storage_path")
    .eq("foundation_asset_id", id)

  const { error } = await supabase.from("context_assets").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  // Best-effort: child rows cascade; remove the orphaned storage objects too.
  const paths = (files || []).map((f) => f.storage_path).filter(Boolean) as string[]
  if (paths.length) await supabase.storage.from("library").remove(paths)

  revalidatePath("/foundation")
  redirect("/foundation?flash=deleted")
}
