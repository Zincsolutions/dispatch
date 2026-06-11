"use client"

import { useState } from "react"
import { createCollection } from "@/lib/actions/library"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export function NewCollectionDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createCollection(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Collection created")
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full px-3 py-1 text-xs font-medium border border-dashed text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" />
        New collection
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New collection</DialogTitle>
            <DialogDescription>
              Group images by brand, client, or campaign.
            </DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                name="name"
                placeholder="Acme Co. brand"
                required
                maxLength={100}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
