"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUSES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface FilterControlsProps {
  categoryOptions?: { value: string; label: string }[]
  categoryLabel?: string
  categoryParam?: string
  // Defaults to the shared STATUSES; pass a custom set (e.g. AGENT_STATUSES).
  statusOptions?: readonly { value: string; label: string }[]
  // Hide the status dropdown (e.g. when rendering a second standalone filter).
  showStatus?: boolean
}

export function FilterControls({
  categoryOptions,
  categoryLabel = "Category",
  categoryParam = "category",
  statusOptions = STATUSES,
  showStatus = true,
}: FilterControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Filter changes re-render the page on the server without a route change,
  // so no loading.tsx fallback appears — the spinner is the only signal.
  const [isPending, startTransition] = useTransition()

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex items-center gap-2">
      {showStatus && (
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(v) => updateFilter("status", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statusOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      )}
      {categoryOptions && (
        <Select
          value={searchParams.get(categoryParam) || "all"}
          onValueChange={(v) => updateFilter(categoryParam, v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={categoryLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {categoryLabel.toLowerCase()}s</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Loader2
        aria-hidden
        className={cn(
          "h-4 w-4 animate-spin text-muted-foreground transition-opacity",
          isPending ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
