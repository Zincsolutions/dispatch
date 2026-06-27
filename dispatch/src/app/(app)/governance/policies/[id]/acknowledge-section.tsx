"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { acknowledgeDocument } from "@/lib/actions/governance"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Ack {
  user_id: string
  acknowledged_at: string
  name: string
}

interface AcknowledgeSectionProps {
  documentId: string
  ackedByMe: boolean
  acknowledgments: Ack[]
  memberCount: number
}

export function AcknowledgeSection({
  documentId,
  ackedByMe,
  acknowledgments,
  memberCount,
}: AcknowledgeSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  // Flip to the acknowledged state instantly; reverts if the server rejects.
  const [optimisticAcked, setOptimisticAcked] = useOptimistic(ackedByMe)

  function handleAcknowledge() {
    startTransition(async () => {
      setOptimisticAcked(true)
      const result = await acknowledgeDocument(documentId)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Acknowledged — thank you")
      // Inside the transition: isPending stays true until the refreshed data
      // paints, so the control never looks done before it is.
      router.refresh()
    })
  }

  // Count optimistically reflects my pending acknowledgment.
  const ackCount =
    optimisticAcked && !ackedByMe
      ? acknowledgments.length + 1
      : acknowledgments.length
  const pct = memberCount > 0 ? Math.round((ackCount / memberCount) * 100) : 0

  return (
    <div className="rounded-lg border p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-medium">
            Acknowledgments: {ackCount} of {memberCount} members
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Team members confirm they&apos;ve read and understood this document.
          </p>
        </div>
        {optimisticAcked ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            You acknowledged this
          </span>
        ) : (
          <Button
            onClick={handleAcknowledge}
            disabled={isPending}
            aria-busy={isPending}
            className="shrink-0"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Acknowledging..." : "I've read this — acknowledge"}
          </Button>
        )}
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {acknowledgments.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {acknowledgments.map((a) => a.name).join(", ")}
        </p>
      )}
    </div>
  )
}
