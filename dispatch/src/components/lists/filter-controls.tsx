"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUSES } from "@/lib/constants"

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

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2">
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
    </div>
  )
}
