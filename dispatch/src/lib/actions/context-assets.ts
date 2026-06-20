"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { contextAssetSchema } from "@/lib/validations/context-assets"
import type { ContextAssetInsert, ContextAssetUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createContextAsset(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = contextAssetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    content: formData.get("content"),
    category: formData.get("category"),
    asset_type: formData.get("asset_type") || null,
    notes: formData.get("notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("context_assets").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
    owner_user_id: user.id,
    ...(parsed.data.status === "approved"
      ? { approved_by: user.id, approved_at: new Date().toISOString() }
      : {}),
  } as ContextAssetInsert)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/foundation")
  redirect("/foundation")
}

export async function updateContextAsset(id: string, formData: FormData) {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  const parsed = contextAssetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    content: formData.get("content"),
    category: formData.get("category"),
    asset_type: formData.get("asset_type") || null,
    notes: formData.get("notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Stamp approval metadata when an asset transitions into 'approved';
  // clear it when it moves out of 'approved'.
  const { data: existing } = await supabase
    .from("context_assets")
    .select("status")
    .eq("id", id)
    .single()
  const nowApproved = parsed.data.status === "approved"
  const wasApproved = existing?.status === "approved"
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

  revalidatePath("/foundation")
  revalidatePath(`/foundation/${id}`)
  redirect(`/foundation/${id}`)
}

export async function deleteContextAsset(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("context_assets").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/foundation")
  redirect("/foundation")
}
