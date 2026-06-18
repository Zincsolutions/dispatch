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
    attachment_path: (formData.get("attachment_path") as string) || null,
    attachment_name: (formData.get("attachment_name") as string) || null,
  }
}

export async function createDocument(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId } = await getCurrentUserWithOrg()

  const parsed = documentSchema.safeParse(parseDocumentFields(formData))
  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  // The browser uploads under its own org prefix (storage RLS); don't
  // trust the client-supplied path regardless.
  if (
    parsed.data.attachment_path &&
    !parsed.data.attachment_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid attachment path"] } }
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
  const { organizationId } = await getCurrentUserWithOrg()

  const parsed = documentSchema.safeParse(parseDocumentFields(formData))
  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  if (
    parsed.data.attachment_path &&
    !parsed.data.attachment_path.startsWith(`${organizationId}/`)
  ) {
    return { error: { _form: ["Invalid attachment path"] } }
  }

  // Grab the previous attachment so we can clean it up if it was
  // replaced or removed in this edit.
  const { data: existing } = await supabase
    .from("documents")
    .select("attachment_path")
    .eq("id", id)
    .single()
  const oldAttachmentPath = existing?.attachment_path as string | null

  const { error } = await supabase
    .from("documents")
    .update(parsed.data as GovDocumentUpdate)
    .eq("id", id)

  if (error) {
    return { error: { _form: [error.message] } }
  }

  if (oldAttachmentPath && oldAttachmentPath !== parsed.data.attachment_path) {
    // Best-effort: an orphaned file is preferable to a failed save.
    await supabase.storage.from("library").remove([oldAttachmentPath])
  }

  revalidatePath("/governance")
  revalidatePath(`/governance/policies/${id}`)
  redirect(`/governance/policies/${id}`)
}

export async function deleteDocument(id: string) {
  const supabase = await createClient()
  await getCurrentUserWithOrg()

  const { data: doc } = await supabase
    .from("documents")
    .select("attachment_path")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }

  if (doc?.attachment_path) {
    // Best-effort: an orphaned file is preferable to a phantom row.
    await supabase.storage.from("library").remove([doc.attachment_path as string])
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
