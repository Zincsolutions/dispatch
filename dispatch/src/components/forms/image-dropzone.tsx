"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageDropzoneProps {
  id?: string
  // Fires with the chosen/dropped file (or null when cleared). The parent
  // validates type/size and owns the resulting state.
  onSelect: (file: File | null) => void
  // Bump to remount the native input and clear its value (e.g. after an
  // invalid pick or a remove).
  resetKey?: number
  disabled?: boolean
  accept?: string
  maxMb?: number
}

export function ImageDropzone({
  id,
  onSelect,
  resetKey,
  disabled = false,
  accept = "image/*",
  maxMb,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function openPicker() {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openPicker()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        if (disabled) return
        const dropped = e.dataTransfer.files?.[0] ?? null
        if (dropped) onSelect(dropped)
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:bg-muted/50",
        dragOver && "border-primary bg-primary/5"
      )}
    >
      <Upload className="h-5 w-5 text-muted-foreground" />
      <p className="text-sm text-foreground">
        <span className="font-medium underline underline-offset-2">
          Choose a file
        </span>{" "}
        or drag and drop
      </p>
      <p className="text-xs text-muted-foreground">
        PNG, JPG, or WEBP{maxMb ? ` up to ${maxMb} MB` : ""}
      </p>
      <input
        key={resetKey}
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
