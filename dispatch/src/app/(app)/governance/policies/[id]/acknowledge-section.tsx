"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { acknowledgeDocument } from "@/lib/actions/governance"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
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
  const [loading, setLoading] = useState(false)

  async function handleAcknowledge() {
    setLoading(true)
    const result = await acknowledgeDocument(documentId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Acknowledged — thank you")
      router.refresh()
    }
    setLoading(false)
  }

  const pct =
    memberCount > 0
      ? Math.round((acknowledgments.length / memberCount) * 100)
      : 0

  return (
    <div className="rounded-lg border p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-medium">
            Acknowledgments: {acknowledgments.length} of {memberCount} members
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Team members confirm they&apos;ve read and understood this document.
          </p>
        </div>
        {ackedByMe ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            You acknowledged this
          </span>
        ) : (
          <Button onClick={handleAcknowledge} disabled={loading} className="shrink-0">
            {loading ? "Acknowledging..." : "I've read this — acknowledge"}
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
