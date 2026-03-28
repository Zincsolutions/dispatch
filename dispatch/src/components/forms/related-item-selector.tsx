"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface SelectableItem {
  id: string
  title?: string
  name?: string
  status: string
}

interface RelatedItemSelectorProps {
  items: SelectableItem[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  label: string
}

export function RelatedItemSelector({
  items,
  selectedIds,
  onSelectionChange,
  label,
}: RelatedItemSelectorProps) {
  const [selectKey, setSelectKey] = useState(0)

  const availableItems = items.filter(
    (item) => !selectedIds.includes(item.id)
  )

  const selectedItems = items.filter((item) => selectedIds.includes(item.id))

  function getItemLabel(item: SelectableItem) {
    return item.title || item.name || item.id
  }

  function handleAdd(itemId: string) {
    onSelectionChange([...selectedIds, itemId])
    // Reset select by changing key
    setSelectKey((k) => k + 1)
  }

  function handleRemove(itemId: string) {
    onSelectionChange(selectedIds.filter((id) => id !== itemId))
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge key={item.id} variant="secondary" className="gap-1">
              {getItemLabel(item)}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {availableItems.length > 0 && (
        <Select key={selectKey} onValueChange={(v: string | null) => v && handleAdd(v)}>
          <SelectTrigger>
            <SelectValue placeholder={`Add ${label.toLowerCase()}...`} />
          </SelectTrigger>
          <SelectContent>
            {availableItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {getItemLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {availableItems.length === 0 && selectedItems.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No {label.toLowerCase()} available.
        </p>
      )}
    </div>
  )
}
