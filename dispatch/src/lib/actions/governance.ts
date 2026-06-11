"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { documentSchema, toolSchema } from "@/lib/validations/governance"
import type {
  GovDocumentInsert,
  GovDocumentUpdate,
  RegistryToolInsert,
  RegistryToolUpdate,
} from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function safeParseTags(raw: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse((raw as string) || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseDocumentFields(formData: FormData) {
  return {
    title: formData.get("title"),
    content: (formData.get("content") as string) || "",
    doc_type: formData.get("doc_type") || "policy",
    status: formData.get("status") || "draft",
    tags: safeParseTags(formData.get("tags")),
  }
}

export async function createDocument(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = documentSchema.safeParse(parseDocumentFields(formData))
  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      ...parsed.data,
      organization_id: organizationId,
      created_by: user.id,
    } as GovDocumentInsert)
    .select("id")
    .single()

  if (error || !data) {
    return { error: { _form: [error?.message || "Failed to create document"] } }
  }

  revalidatePath("/governance")
  redirect(`/governance/policies/${data.id}`)
}

export async function updateDocument(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = documentSchema.safeParse(parseDocumentFields(formData))
  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  const { error } = await supabase
    .from("documents")
    .update(parsed.data as GovDocumentUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath("/governance")
  revalidatePath(`/governance/policies/${id}`)
  redirect(`/governance/policies/${id}`)
}

export async function deleteDocument(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  redirect("/governance/policies")
}

export async function acknowledgeDocument(id: string) {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  // Only approved documents are acknowledgeable.
  const { data: doc } = await supabase
    .from("documents")
    .select("status")
    .eq("id", id)
    .single()

  if (!doc) {
    return { error: "Document not found" }
  }
  if (doc.status !== "approved") {
    return { error: "Only approved documents can be acknowledged" }
  }

  const { error } = await supabase
    .from("document_acknowledgments")
    .upsert(
      { document_id: id, user_id: user.id },
      { onConflict: "document_id,user_id", ignoreDuplicates: true }
    )

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  revalidatePath(`/governance/policies/${id}`)
  return { success: true }
}

function parseToolFields(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim(),
    status: formData.get("status") || "experimental",
    owner: (formData.get("owner") as string)?.trim() || null,
    url: (formData.get("url") as string)?.trim() || null,
    rationale: (formData.get("rationale") as string)?.trim() || null,
    data_notes: (formData.get("data_notes") as string)?.trim() || null,
  }
}

export async function createTool(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = toolSchema.safeParse(parseToolFields(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" }
  }

  const { error } = await supabase.from("tool_registry").insert({
    ...parsed.data,
    organization_id: organizationId,
    created_by: user.id,
  } as RegistryToolInsert)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  revalidatePath("/governance/tools")
  return { success: true }
}

export async function updateTool(id: string, formData: FormData) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const parsed = toolSchema.safeParse(parseToolFields(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" }
  }

  const { error } = await supabase
    .from("tool_registry")
    .update(parsed.data as RegistryToolUpdate)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  revalidatePath("/governance/tools")
  return { success: true }
}

export async function deleteTool(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { error } = await supabase.from("tool_registry").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  revalidatePath("/governance/tools")
  return { success: true }
}
