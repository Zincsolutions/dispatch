"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { logUsage } from "@/lib/actions/usage"
import type { UsageEntityType } from "@/lib/types"

interface CopyButtonProps {
  text: string
  label?: string
  variant?: "outline" | "ghost" | "default" | "secondary"
  size?: "sm" | "icon-sm" | "default"
  // When set, the copy is logged as a usage event for this entity.
  entityType?: UsageEntityType
  entityId?: string
}

export function CopyButton({
  text,
  label,
  variant = "outline",
  size = "sm",
  entityType,
  entityId,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
      if (entityType && entityId) {
        void logUsage(entityType, entityId, "copy")
      }
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access")
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} type="button">
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {label && <span className="ml-1">{copied ? "Copied" : label}</span>}
    </Button>
  )
}
