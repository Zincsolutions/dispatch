"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { promptSchema } from "@/lib/validations/prompts"
import { canApprove, APPROVAL_DENIED_ERROR } from "@/lib/authz"
import type { PromptInsert, PromptUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  const parsed = promptSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    prompt_body: formData.get("prompt_body"),
    category: formData.get("category") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
    sample_output_path: (formData.get("sample_output_path") as string) || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  if (parsed.data.status === "approved" && !canApprove(role)) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  // The browser uploads under its own org prefix (storage RLS); don't
  // trust the client-supplied path regardless.
  if (
    parsed.data.sample_output_path &&
    !parsed.data.sample_output_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid sample output path"] } }
  }

  const { data: created, error } = await supabase
    .from("prompts")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      created_by: user.id,
    } as PromptInsert)
    .select("id")
    .single()

  if (error || !created) {
    console.error("createPrompt insert failed", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    })
    return { error: { _form: [error?.message || "Could not create prompt"] } }
  }

  const relatedAssetIds: string[] = JSON.parse(
    (formData.get("related_context_asset_ids") as string) || "[]"
  )
  if (relatedAssetIds.length) {
    await supabase.from("prompt_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        prompt_id: created.id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/prompts")
  redirect(`/prompts/${created.id}?flash=created`)
}

export async function updatePrompt(id: string, formData: FormData) {
  const supabase = await createClient()
  const { organizationId, role } = await getCurrentUserWithOrg()

  const parsed = promptSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    prompt_body: formData.get("prompt_body"),
    category: formData.get("category") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
    sample_output_path: (formData.get("sample_output_path") as string) || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  if (
    parsed.data.sample_output_path &&
    !parsed.data.sample_output_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid sample output path"] } }
  }

  // Grab the previous sample output so we can clean it up if it was
  // replaced or removed in this edit.
  const { data: existing } = await supabase
    .from("prompts")
    .select("sample_output_path, status")
    .eq("id", id)
    .single()
  const oldSamplePath = existing?.sample_output_path as string | null

  // Only owners can move an asset into the approved state.
  if (
    parsed.data.status === "approved" &&
    existing?.status !== "approved" &&
    !canApprove(role)
  ) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const { error } = await supabase
    .from("prompts")
    .update(parsed.data as PromptUpdate)
    .eq("id", id)

  if (error) {
    console.error("updatePrompt failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return { error: { _form: [error.message] } }
  }

  if (oldSamplePath && oldSamplePath !== parsed.data.sample_output_path) {
    // Best-effort: an orphaned file is preferable to a failed save.
    await supabase.storage.from("library").remove([oldSamplePath])
  }

  // Replace the connected foundation assets.
  const relatedAssetIds: string[] = JSON.parse(
    (formData.get("related_context_asset_ids") as string) || "[]"
  )
  await supabase.from("prompt_context_assets").delete().eq("prompt_id", id)
  if (relatedAssetIds.length) {
    await supabase.from("prompt_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        prompt_id: id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/prompts")
  revalidatePath(`/prompts/${id}`)
  redirect(`/prompts/${id}?flash=saved`)
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { data: prompt } = await supabase
    .from("prompts")
    .select("sample_output_path")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("prompts").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  if (prompt?.sample_output_path) {
    // Best-effort: an orphaned file is preferable to a phantom row.
    await supabase.storage
      .from("library")
      .remove([prompt.sample_output_path as string])
  }

  revalidatePath("/prompts")
  redirect("/prompts?flash=deleted")
}
