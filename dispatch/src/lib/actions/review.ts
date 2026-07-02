"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { canApprove, APPROVAL_DENIED_ERROR } from "@/lib/authz"
import type { ReviewType } from "@/lib/queries/review-queue"
import { revalidatePath } from "next/cache"

const REVIEW_TABLES: Record<
  ReviewType,
  { table: string; basePath: string; hasApprovalFields: boolean }
> = {
  foundation: {
    table: "context_assets",
    basePath: "/foundation",
    hasApprovalFields: true,
  },
  agent: { table: "agents", basePath: "/agents", hasApprovalFields: false },
  workflow: {
    table: "workflows",
    basePath: "/workflows",
    hasApprovalFields: false,
  },
  image: { table: "library_images", basePath: "/library", hasApprovalFields: false },
}

// Owner-only review decision straight from the Governance review queue.
// "approve" publishes the asset; "send_back" returns it to draft so the
// author can revise and resubmit.
export async function reviewItem(
  type: ReviewType,
  id: string,
  decision: "approve" | "send_back"
) {
  const target = REVIEW_TABLES[type]
  if (!target) {
    return { error: "Unknown review item type" }
  }

  const supabase = await createClient()
  const { user, role } = await getCurrentUserWithOrg()

  if (!canApprove(role)) {
    return { error: APPROVAL_DENIED_ERROR }
  }

  const status = decision === "approve" ? "approved" : "draft"
  const approvalFields = target.hasApprovalFields
    ? decision === "approve"
      ? { approved_by: user.id, approved_at: new Date().toISOString() }
      : { approved_by: null, approved_at: null }
    : {}

  const { error } = await supabase
    .from(target.table)
    .update({ status, ...approvalFields })
    .eq("id", id)
    .eq("status", "needs_review")

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/governance")
  revalidatePath("/governance/review")
  revalidatePath("/dashboard")
  revalidatePath(target.basePath)
  revalidatePath(`${target.basePath}/${id}`)
  return { success: true }
}
