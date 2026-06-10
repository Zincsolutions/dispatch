"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void | Promise<void | { error?: string } | null>
  trigger: React.ReactNode
  variant?: "destructive" | "default"
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  trigger,
  variant = "destructive",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      const result = await onConfirm()
      if (result && typeof result === "object" && result.error) {
        toast.error(result.error)
        return
      }
      setOpen(false)
    } catch (e) {
      // Server actions that redirect on success throw internally — let
      // navigation proceed. Anything else is a real failure to surface.
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />} onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
