import { createClient } from "@/lib/supabase/server"
import { sanitizeSearchTerm } from "@/lib/utils"
import type { GovDocument, RegistryTool } from "@/lib/types"

const SIGNED_URL_TTL = 60 * 60 // 1 hour

interface DocumentFilters {
  search?: string
  status?: string
  doc_type?: string
  tag?: string
}

export type GovDocumentWithAcks = GovDocument & {
  ack_count: number
  acked_by_me: boolean
}

// List documents with acknowledgment progress for the current user/org.
export async function getDocuments(
  filters?: DocumentFilters
): Promise<GovDocumentWithAcks[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from("documents")
    .select("*, document_acknowledgments(user_id)")
    .order("created_at", { ascending: false })
    .limit(50)

  const search = sanitizeSearchTerm(filters?.search)
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.doc_type) {
    query = query.eq("doc_type", filters.doc_type)
  }
  if (filters?.tag) {
    query = query.contains("tags", [filters.tag])
  }

  const { data, error } = await query
  if (error) throw error

  return ((data as (GovDocument & { document_acknowledgments: { user_id: string }[] })[]) || []).map(
    ({ document_acknowledgments, ...doc }) => ({
      ...doc,
      ack_count: document_acknowledgments.length,
      acked_by_me: document_acknowledgments.some((a) => a.user_id === user?.id),
    })
  )
}

export async function getDocumentById(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("documents")
    .select(
      "*, document_acknowledgments(user_id, acknowledged_at, profiles(full_name, email))"
    )
    .eq("id", id)
    .single()

  if (error || !data) return null

  const { count: memberCount } = await supabase
    .from("organization_members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", data.organization_id as string)

  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.created_by as string)
    .single()

  const doc = data as GovDocument & {
    document_acknowledgments: Array<{
      user_id: string
      acknowledged_at: string
      profiles: { full_name: string; email: string } | null
    }>
  }

  // Attachment lives in the shared private `library` bucket; serve it via
  // a short-lived signed URL.
  let attachmentUrl: string | null = null
  if (doc.attachment_path) {
    const { data: signed } = await supabase.storage
      .from("library")
      .createSignedUrl(doc.attachment_path, SIGNED_URL_TTL)
    attachmentUrl = signed?.signedUrl ?? null
  }

  return {
    ...doc,
    created_by_name: creator?.full_name ?? "Unknown",
    member_count: memberCount ?? 0,
    attachment_url: attachmentUrl,
    acknowledgments: doc.document_acknowledgments.map((a) => ({
      user_id: a.user_id,
      acknowledged_at: a.acknowledged_at,
      name: a.profiles?.full_name || a.profiles?.email || "Unknown",
    })),
    acked_by_me: doc.document_acknowledgments.some((a) => a.user_id === user?.id),
  }
}

// Approved documents the current user hasn't acknowledged yet.
export async function getDocumentsAwaitingMyAck(): Promise<GovDocumentWithAcks[]> {
  const docs = await getDocuments({ status: "approved" })
  return docs.filter((d) => !d.acked_by_me)
}

export async function getTools(): Promise<RegistryTool[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tool_registry")
    .select("*")
    .order("status", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    // Degrade gracefully if migration 00005 isn't applied yet.
    console.warn("[governance] tool_registry query failed:", error.message)
    return []
  }
  return (data as RegistryTool[]) || []
}
