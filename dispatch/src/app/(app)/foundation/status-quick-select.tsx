"use client"

import { useState } from "react"
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
import { ChevronDown, Check } from "lucide-react"
import { toast } from "sonner"

export function StatusQuickSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function choose(next: string) {
    if (next === status || pending) return
    setPending(true)
    const result = await updateFoundationAssetStatus(id, next)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Status updated")
      router.refresh()
    }
    setPending(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        aria-label="Change status"
        className="inline-flex items-center gap-1 rounded-full outline-none disabled:opacity-50 cursor-pointer"
      >
        <StatusBadge status={status} />
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FOUNDATION_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s.value}
            onClick={() => choose(s.value)}
            className="cursor-pointer gap-2"
          >
            <Check
              className={cn("h-4 w-4", s.value === status ? "opacity-100" : "opacity-0")}
            />
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
