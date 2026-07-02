"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { agentSchema } from "@/lib/validations/agents"
import { canApprove, APPROVAL_DENIED_ERROR } from "@/lib/authz"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function parseAgentFields(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    purpose: formData.get("purpose") || null,
    platform: formData.get("platform") || null,
    setup_notes: formData.get("setup_notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
    department: (formData.get("department") as string) || null,
    category: (formData.get("category") as string) || null,
    version: (formData.get("version") as string) || null,
    last_reviewed: (formData.get("last_reviewed") as string) || null,
    risk_level: (formData.get("risk_level") as string) || null,
  }
}

export async function createAgent(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  const parsed = agentSchema.safeParse(parseAgentFields(formData))

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  if (parsed.data.status === "approved" && !canApprove(role)) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const { data: created, error } = await supabase
    .from("agents")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error || !created) {
    return { error: { _form: [error?.message || "Could not create agent"] } }
  }

  const relatedAssetIds: string[] = JSON.parse(
    (formData.get("related_context_asset_ids") as string) || "[]"
  )
  if (relatedAssetIds.length) {
    await supabase.from("agent_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        agent_id: created.id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/agents")
  redirect(`/agents/${created.id}?flash=created`)
}

export async function updateAgent(id: string, formData: FormData) {
  const supabase = await createClient()
  const { role } = await getCurrentUserWithOrg()

  const parsed = agentSchema.safeParse(parseAgentFields(formData))

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Only owners can move an asset into the approved state.
  const { data: existing } = await supabase
    .from("agents")
    .select("status")
    .eq("id", id)
    .single()
  if (
    parsed.data.status === "approved" &&
    existing?.status !== "approved" &&
    !canApprove(role)
  ) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const { error } = await supabase
    .from("agents")
    .update(parsed.data)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  // Replace the connected foundation assets.
  const relatedAssetIds: string[] = JSON.parse(
    (formData.get("related_context_asset_ids") as string) || "[]"
  )
  await supabase.from("agent_context_assets").delete().eq("agent_id", id)
  if (relatedAssetIds.length) {
    await supabase.from("agent_context_assets").insert(
      relatedAssetIds.map((context_asset_id) => ({
        agent_id: id,
        context_asset_id,
      }))
    )
  }

  revalidatePath("/agents")
  revalidatePath(`/agents/${id}`)
  redirect(`/agents/${id}?flash=saved`)
}

export async function deleteAgent(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("agents").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agents")
  redirect("/agents?flash=deleted")
}
