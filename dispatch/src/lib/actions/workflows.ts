"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { workflowSchema } from "@/lib/validations/workflows"
import { canApprove, APPROVAL_DENIED_ERROR } from "@/lib/authz"
import type { WorkflowInsert, WorkflowUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createWorkflow(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  const parsed = workflowSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    steps: JSON.parse((formData.get("steps") as string) || "[]"),
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
    type: formData.get("type") || "workflow",
    department: (formData.get("department") as string) || null,
    category: (formData.get("category") as string) || null,
    version: (formData.get("version") as string) || null,
    risk_level: (formData.get("risk_level") as string) || null,
    estimated_run_time: (formData.get("estimated_run_time") as string) || null,
    output_format: (formData.get("output_format") as string) || null,
    success_criteria: (formData.get("success_criteria") as string) || null,
    verification_method: (formData.get("verification_method") as string) || null,
    stop_condition: (formData.get("stop_condition") as string) || null,
    escalation_condition: (formData.get("escalation_condition") as string) || null,
    last_reviewed: (formData.get("last_reviewed") as string) || null,
    related_prompt_ids: JSON.parse(
      (formData.get("related_prompt_ids") as string) || "[]"
    ),
    related_context_asset_ids: JSON.parse(
      (formData.get("related_context_asset_ids") as string) || "[]"
    ),
    related_agent_ids: JSON.parse(
      (formData.get("related_agent_ids") as string) || "[]"
    ),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  if (parsed.data.status === "approved" && !canApprove(role)) {
    return { error: { _form: [APPROVAL_DENIED_ERROR] } }
  }

  const {
    related_prompt_ids,
    related_context_asset_ids,
    related_agent_ids,
    ...workflowData
  } = parsed.data

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({
      ...workflowData,
      organization_id: organizationId,
      created_by: user.id,
    } as WorkflowInsert)
    .select("id")
    .single()

  if (error) {
    return { error: { _form: [error.message] } }
  }

  const workflowId = workflow.id

  // Insert join table rows for related items
  if (related_prompt_ids.length > 0) {
    await supabase.from("workflow_prompts").insert(
      related_prompt_ids.map((prompt_id: string) => ({
        workflow_id: workflowId,
        prompt_id,
      }))
    )
  }

  if (related_context_asset_ids.length > 0) {
    await supabase.from("workflow_context_assets").insert(
      related_context_asset_ids.map((context_asset_id: string) => ({
        workflow_id: workflowId,
        context_asset_id,
      }))
    )
  }

  if (related_agent_ids.length > 0) {
    await supabase.from("workflow_agents").insert(
      related_agent_ids.map((agent_id: string) => ({
        workflow_id: workflowId,
        agent_id,
      }))
    )
  }

  revalidatePath("/workflows")
  redirect(`/workflows/${workflowId}?flash=created`)
}

export async function updateWorkflow(id: string, formData: FormData) {
  const supabase = await createClient()
  const { role } = await getCurrentUserWithOrg()

  const parsed = workflowSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    steps: JSON.parse((formData.get("steps") as string) || "[]"),
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
    type: formData.get("type") || "workflow",
    department: (formData.get("department") as string) || null,
    category: (formData.get("category") as string) || null,
    version: (formData.get("version") as string) || null,
    risk_level: (formData.get("risk_level") as string) || null,
    estimated_run_time: (formData.get("estimated_run_time") as string) || null,
    output_format: (formData.get("output_format") as string) || null,
    success_criteria: (formData.get("success_criteria") as string) || null,
    verification_method: (formData.get("verification_method") as string) || null,
    stop_condition: (formData.get("stop_condition") as string) || null,
    escalation_condition: (formData.get("escalation_condition") as string) || null,
    last_reviewed: (formData.get("last_reviewed") as string) || null,
    related_prompt_ids: JSON.parse(
      (formData.get("related_prompt_ids") as string) || "[]"
    ),
    related_context_asset_ids: JSON.parse(
      (formData.get("related_context_asset_ids") as string) || "[]"
    ),
    related_agent_ids: JSON.parse(
      (formData.get("related_agent_ids") as string) || "[]"
    ),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Only owners can move an asset into the approved state.
  const { data: existing } = await supabase
    .from("workflows")
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

  const {
    related_prompt_ids,
    related_context_asset_ids,
    related_agent_ids,
    ...workflowData
  } = parsed.data

  const { error } = await supabase
    .from("workflows")
    .update(workflowData as WorkflowUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  // Delete-then-insert pattern for join tables
  await Promise.all([
    supabase.from("workflow_prompts").delete().eq("workflow_id", id),
    supabase.from("workflow_context_assets").delete().eq("workflow_id", id),
    supabase.from("workflow_agents").delete().eq("workflow_id", id),
  ])

  if (related_prompt_ids.length > 0) {
    await supabase.from("workflow_prompts").insert(
      related_prompt_ids.map((prompt_id: string) => ({
        workflow_id: id,
        prompt_id,
      }))
    )
  }

  if (related_context_asset_ids.length > 0) {
    await supabase.from("workflow_context_assets").insert(
      related_context_asset_ids.map((context_asset_id: string) => ({
        workflow_id: id,
        context_asset_id,
      }))
    )
  }

  if (related_agent_ids.length > 0) {
    await supabase.from("workflow_agents").insert(
      related_agent_ids.map((agent_id: string) => ({
        workflow_id: id,
        agent_id,
      }))
    )
  }

  revalidatePath("/workflows")
  revalidatePath(`/workflows/${id}`)
  redirect(`/workflows/${id}?flash=saved`)
}

export async function deleteWorkflow(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("workflows").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/workflows")
  redirect("/workflows?flash=deleted")
}
