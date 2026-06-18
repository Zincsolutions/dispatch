"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUSES } from "@/lib/constants"

interface StatusSelectProps {
  value: string
  onValueChange: (value: string) => void
  // Defaults to the shared STATUSES; pass a custom set (e.g. AGENT_STATUSES).
  options?: readonly { value: string; label: string }[]
}

export function StatusSelect({
  value,
  onValueChange,
  options = STATUSES,
}: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? "draft")}>
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {options.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
