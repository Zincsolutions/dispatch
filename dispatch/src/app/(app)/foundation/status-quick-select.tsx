"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FOUNDATION_STATUSES } from "@/lib/constants"
import { updateFoundationAssetStatus } from "@/lib/actions/context-assets"
import { cn } from "@/lib/utils"
import { ChevronDown, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function StatusQuickSelect({
  id,
  status,
  canApprove = true,
}: {
  id: string
  status: string
  // Members can move assets between draft/needs_review/archived, but only
  // owners may publish to "approved" (enforced server-side as well).
  canApprove?: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  // Reflect the new status on the badge immediately; reverts automatically if
  // the server rejects it (the `status` prop stays unchanged).
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)

  const statuses = FOUNDATION_STATUSES.filter(
    (s) => canApprove || s.value !== "approved" || s.value === optimisticStatus
  )

  function choose(next: string) {
    if (next === optimisticStatus || isPending) return
    startTransition(async () => {
      setOptimisticStatus(next)
      const result = await updateFoundationAssetStatus(id, next)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Status updated")
      // Inside the transition, so isPending stays true until the refreshed
      // server data has actually painted - no "looks done but isn't" gap.
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label="Change status"
        aria-busy={isPending}
        className="inline-flex items-center gap-1 rounded-full outline-none disabled:opacity-60 cursor-pointer"
      >
        <StatusBadge status={optimisticStatus} />
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((s) => (
          <DropdownMenuItem
            key={s.value}
            onClick={() => choose(s.value)}
            className="cursor-pointer gap-2"
          >
            <Check
              className={cn(
                "h-4 w-4",
                s.value === optimisticStatus ? "opacity-100" : "opacity-0",
              )}
            />
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
