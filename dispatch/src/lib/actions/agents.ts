"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { agentSchema } from "@/lib/validations/agents"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAgent(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = agentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    purpose: formData.get("purpose") || null,
    platform: formData.get("platform") || null,
    setup_notes: formData.get("setup_notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("agents").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
  })

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/agents")
  redirect("/agents")
}

export async function updateAgent(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = agentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    purpose: formData.get("purpose") || null,
    platform: formData.get("platform") || null,
    setup_notes: formData.get("setup_notes") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("agents")
    .update(parsed.data)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/agents")
  revalidatePath(`/agents/${id}`)
  redirect(`/agents/${id}`)
}

export async function deleteAgent(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("agents").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agents")
  redirect("/agents")
}
