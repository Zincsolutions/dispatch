import { createClient } from "@/lib/supabase/server"

export type ReviewType = "foundation" | "agent" | "workflow" | "image"

export interface ReviewItem {
  type: ReviewType
  typeLabel: string
  id: string
  title: string
  status: string
  href: string
  updatedAt: string
}

export const REVIEW_TYPE_OPTIONS: { value: ReviewType; label: string }[] = [
  { value: "foundation", label: "Foundation Asset" },
  { value: "agent", label: "Agent" },
  { value: "workflow", label: "Workflow" },
  { value: "image", label: "Image Library Item" },
]

const LABELS: Record<ReviewType, string> = Object.fromEntries(
  REVIEW_TYPE_OPTIONS.map((o) => [o.value, o.label])
) as Record<ReviewType, string>

// Aggregates everything sitting in `needs_review` across the entity types
// that support that status, for the Governance review queue. RLS scopes
// each query to the current org. Prompts are excluded — they have no
// needs_review status.
export async function getReviewQueue(type?: string): Promise<ReviewItem[]> {
  const supabase = await createClient()
  const wants = (t: ReviewType) => !type || type === "all" || type === t
  const items: ReviewItem[] = []

  const tasks: PromiseLike<void>[] = []

  if (wants("foundation")) {
    tasks.push(
      supabase
        .from("context_assets")
        .select("id, title, status, updated_at")
        .eq("status", "needs_review")
        .then(({ data }) => {
          for (const r of data || [])
            items.push({
              type: "foundation",
              typeLabel: LABELS.foundation,
              id: r.id,
              title: r.title,
              status: r.status,
              href: `/foundation/${r.id}`,
              updatedAt: r.updated_at,
            })
        })
    )
  }
  if (wants("agent")) {
    tasks.push(
      supabase
        .from("agents")
        .select("id, name, status, updated_at")
        .eq("status", "needs_review")
        .then(({ data }) => {
          for (const r of data || [])
            items.push({
              type: "agent",
              typeLabel: LABELS.agent,
              id: r.id,
              title: r.name,
              status: r.status,
              href: `/agents/${r.id}`,
              updatedAt: r.updated_at,
            })
        })
    )
  }
  if (wants("workflow")) {
    tasks.push(
      supabase
        .from("workflows")
        .select("id, title, status, updated_at")
        .eq("status", "needs_review")
        .then(({ data }) => {
          for (const r of data || [])
            items.push({
              type: "workflow",
              typeLabel: LABELS.workflow,
              id: r.id,
              title: r.title,
              status: r.status,
              href: `/workflows/${r.id}`,
              updatedAt: r.updated_at,
            })
        })
    )
  }
  if (wants("image")) {
    tasks.push(
      supabase
        .from("library_images")
        .select("id, title, status, updated_at")
        .eq("status", "needs_review")
        .then(({ data }) => {
          for (const r of data || [])
            items.push({
              type: "image",
              typeLabel: LABELS.image,
              id: r.id,
              title: r.title || "Untitled image",
              status: r.status,
              href: `/library/${r.id}`,
              updatedAt: r.updated_at,
            })
        })
    )
  }

  await Promise.all(tasks)
  items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  return items
}

export async function getReviewQueueCount(): Promise<number> {
  return (await getReviewQueue()).length
}
