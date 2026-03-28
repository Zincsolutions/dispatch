"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { promptSchema } from "@/lib/validations/prompts"
import type { PromptInsert, PromptUpdate } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = promptSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    prompt_body: formData.get("prompt_body"),
    category: formData.get("category") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from("prompts").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
  } as PromptInsert)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/prompts")
  redirect("/prompts")
}

export async function updatePrompt(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = promptSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    prompt_body: formData.get("prompt_body"),
    category: formData.get("category") || null,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") || "draft",
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("prompts")
    .update(parsed.data as PromptUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/prompts")
  revalidatePath(`/prompts/${id}`)
  redirect(`/prompts/${id}`)
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("prompts").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/prompts")
  redirect("/prompts")
}
