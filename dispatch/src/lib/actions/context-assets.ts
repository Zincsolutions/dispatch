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
    asset_type: formData.get("asset_type") || null,
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
  } as ContextAssetInsert)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/context")
  redirect("/context")
}

export async function updateContextAsset(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = contextAssetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    content: formData.get("content"),
    asset_type: formData.get("asset_type") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("context_assets")
    .update(parsed.data as ContextAssetUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/context")
  revalidatePath(`/context/${id}`)
  redirect(`/context/${id}`)
}

export async function deleteContextAsset(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("context_assets").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/context")
  redirect("/context")
}
