"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { reviewItem } from "@/lib/actions/review"
import type { ReviewType } from "@/lib/queries/review-queue"
import { Check, Undo2, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Owner-only inline decision buttons on review queue rows. Rendered inside
// a Link row, so clicks must not bubble into the navigation.
export function ReviewActions({ type, id }: { type: ReviewType; id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function decide(
    e: React.MouseEvent,
    decision: "approve" | "send_back",
    successMessage: string
  ) {
    e.preventDefault()
    e.stopPropagation()
    if (isPending) return
    startTransition(async () => {
      const result = await reviewItem(type, id, decision)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success(successMessage)
      router.refresh()
    })
  }

  return (
    <span className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={(e) => decide(e, "approve", "Approved")}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => decide(e, "send_back", "Sent back to draft")}
        disabled={isPending}
      >
        <Undo2 className="h-3.5 w-3.5" />
        Send back
      </Button>
    </span>
  )
}
