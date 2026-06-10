"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import type { UsageAction, UsageEntityType } from "@/lib/types"

// Fire-and-forget usage signal (copies, click-to-run launches).
// Never surfaces errors to the caller — logging must not break the UX,
// including before the usage_events migration has been applied.
export async function logUsage(
  entityType: UsageEntityType,
  entityId: string,
  action: UsageAction
) {
  try {
    const supabase = await createClient()
    const { user, organizationId } = await getCurrentUserWithOrg()

    await supabase.from("usage_events").insert({
      organization_id: organizationId,
      user_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      action,
    })
  } catch {
    // Swallow — usage logging is best-effort.
  }
}
