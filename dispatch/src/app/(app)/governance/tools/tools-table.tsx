"use client"

import { useState } from "react"
import { createTool, updateTool, deleteTool } from "@/lib/actions/governance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import type { RegistryTool } from "@/lib/types"

const TOOL_STATUSES = [
  { value: "approved", label: "Approved" },
  { value: "experimental", label: "Experimental" },
  { value: "not_allowed", label: "Not allowed" },
]

function ToolStatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return <Badge className="bg-green-600 hover:bg-green-600 text-white">Approved</Badge>
  if (status === "not_allowed") return <Badge variant="destructive">Not allowed</Badge>
  return <Badge variant="secondary">Experimental</Badge>
}

interface ToolFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool?: RegistryTool
}

function ToolFormDialog({ open, onOpenChange, tool }: ToolFormDialogProps) {
  const [status, setStatus] = useState(tool?.status || "experimental")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    formData.set("status", status)
    setLoading(true)
    const result = tool
      ? await updateTool(tool.id, formData)
      : await createTool(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(tool ? "Tool updated" : "Tool added to registry")
      onOpenChange(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tool ? "Edit tool" : "Add tool"}</DialogTitle>
          <DialogDescription>
            Track which AI tools your team uses, why, and the rules around them.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Name</Label>
              <Input
                id="tool-name"
                name="name"
                defaultValue={tool?.name}
                placeholder="ChatGPT"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "experimental")}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tool-owner">Owner</Label>
              <Input
                id="tool-owner"
                name="owner"
                defaultValue={tool?.owner || ""}
                placeholder="Who manages this tool?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool-url">URL</Label>
              <Input
                id="tool-url"
                name="url"
                defaultValue={tool?.url || ""}
                placeholder="https://…"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-rationale">Why we use it</Label>
            <Textarea
              id="tool-rationale"
              name="rationale"
              defaultValue={tool?.rationale || ""}
              rows={2}
              placeholder="What it's for and why it was chosen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-data-notes">Data rules</Label>
            <Textarea
              id="tool-data-notes"
              name="data_notes"
              defaultValue={tool?.data_notes || ""}
              rows={2}
              placeholder='e.g. "Never paste client PII or unreleased financials"'
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Saving..." : tool ? "Save changes" : "Add tool"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ToolsTable({ tools }: { tools: RegistryTool[] }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<RegistryTool | null>(null)

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h3 className="font-medium mb-1">No tools registered yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            List the AI tools your team uses — approved, experimental, or off-limits —
            so everyone knows what&apos;s sanctioned.
          </p>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add your first tool
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tools.map((tool) => (
            <div key={tool.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{tool.name}</h3>
                    <ToolStatusBadge status={tool.status} />
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Open ${tool.name} website`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {tool.owner && (
                      <span className="text-xs text-muted-foreground">
                        Owner: {tool.owner}
                      </span>
                    )}
                  </div>
                  {tool.rationale && (
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {tool.rationale}
                    </p>
                  )}
                  {tool.data_notes && (
                    <p className="text-sm mt-1.5">
                      <span className="font-medium">Data rules: </span>
                      <span className="text-muted-foreground">{tool.data_notes}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setEditing(tool)}
                    aria-label={`Edit ${tool.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    title="Remove tool"
                    description={`Remove "${tool.name}" from the registry?`}
                    onConfirm={async () => await deleteTool(tool.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${tool.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToolFormDialog open={addOpen} onOpenChange={setAddOpen} />
      {editing && (
        <ToolFormDialog
          key={editing.id}
          open={true}
          onOpenChange={(open) => !open && setEditing(null)}
          tool={editing}
        />
      )}
    </div>
  )
}
