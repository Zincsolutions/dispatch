"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagInput } from "@/components/forms/tag-input"
import { StatusSelect } from "@/components/forms/status-select"
import { toast } from "sonner"
import type { GovDocument } from "@/lib/types"

const DOC_TYPES = [
  { value: "policy", label: "Policy" },
  { value: "sop", label: "SOP" },
  { value: "guideline", label: "Guideline" },
]

interface DocumentFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  defaultValues?: GovDocument
}

export function DocumentForm({ action, defaultValues }: DocumentFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [docType, setDocType] = useState(defaultValues?.doc_type || "policy")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    formData.set("doc_type", docType)

    setLoading(true)
    const result = await action(formData)
    if (result?.error) {
      const errors = result.error
      const message =
        "_form" in errors
          ? errors._form?.[0]
          : Object.values(errors).flat().join(", ")
      toast.error(message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="AI Use Policy"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={docType} onValueChange={(v) => setDocType(v ?? "policy")}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <StatusSelect value={status} onValueChange={setStatus} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={defaultValues?.content}
          rows={16}
          required
          placeholder="Write the policy, SOP, or guideline here…"
        />
        <p className="text-xs text-muted-foreground">
          Teammates will be asked to acknowledge this document once its status
          is set to Approved.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : defaultValues
              ? "Update Document"
              : "Create Document"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
