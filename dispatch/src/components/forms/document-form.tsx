"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
import { cn } from "@/lib/utils"
import { Loader2, FileText } from "lucide-react"
import { toast } from "sonner"
import type { GovDocument } from "@/lib/types"

const DOC_TYPES = [
  { value: "policy", label: "Policy" },
  { value: "sop", label: "SOP" },
  { value: "guideline", label: "Guideline" },
]

const MAX_FILE_MB = 25
const ACCEPT = ".pdf,.doc,.docx,.txt,.md,.rtf,.csv,.xls,.xlsx,.ppt,.pptx"
const ALLOWED_EXT = new Set([
  "pdf", "doc", "docx", "txt", "md", "rtf", "csv", "xls", "xlsx", "ppt", "pptx",
])

function fileExt(f: File) {
  return (f.name.split(".").pop() || "").toLowerCase()
}

interface DocumentFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  defaultValues?: GovDocument
  // Needed to upload an attachment: paths go to {orgId}/{uuid}.{ext}.
  orgId?: string
  // Signed URL + original name for an already-saved attachment (edit mode).
  defaultAttachmentUrl?: string | null
  defaultAttachmentName?: string | null
}

export function DocumentForm({
  action,
  defaultValues,
  orgId,
  defaultAttachmentName,
}: DocumentFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [docType, setDocType] = useState(defaultValues?.doc_type || "policy")
  const [loading, setLoading] = useState(false)

  // Attachment: optional uploaded file (e.g. a PDF).
  const existingAttachmentPath = defaultValues?.attachment_path ?? null
  const existingAttachmentName = defaultValues?.attachment_name ?? defaultAttachmentName ?? null
  const [file, setFile] = useState<File | null>(null)
  const [keepExisting, setKeepExisting] = useState(true)
  const [fileInputKey, setFileInputKey] = useState(0)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    if (selected && !ALLOWED_EXT.has(fileExt(selected))) {
      toast.error("Unsupported file type. Use PDF, Word, text, or similar.")
      e.target.value = ""
      return
    }
    if (selected && selected.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Files must be under ${MAX_FILE_MB} MB`)
      e.target.value = ""
      return
    }
    setFile(selected)
    if (selected) setKeepExisting(false)
  }

  function handleRemove() {
    setFile(null)
    setKeepExisting(false)
    setFileInputKey((k) => k + 1)
  }

  const showExisting = keepExisting && Boolean(existingAttachmentPath)
  const currentName = file?.name ?? (showExisting ? existingAttachmentName : null)

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    formData.set("doc_type", docType)

    setLoading(true)
    const supabase = createClient()
    const uploadedPaths: string[] = []

    let attachmentPath = ""
    let attachmentName = ""
    if (file) {
      if (!orgId) {
        toast.error("Unable to upload the attachment")
        setLoading(false)
        return
      }
      const path = `${orgId}/${crypto.randomUUID()}.${fileExt(file)}`
      const { error: uploadError } = await supabase.storage
        .from("library")
        .upload(path, file)
      if (uploadError) {
        toast.error("Upload failed: " + uploadError.message)
        setLoading(false)
        return
      }
      uploadedPaths.push(path)
      attachmentPath = path
      attachmentName = file.name
    } else if (keepExisting && existingAttachmentPath) {
      attachmentPath = existingAttachmentPath
      attachmentName = existingAttachmentName ?? ""
    }
    formData.set("attachment_path", attachmentPath)
    formData.set("attachment_name", attachmentName)

    const result = await action(formData)
    if (result?.error) {
      // Don't leave an orphaned file behind if the save failed.
      if (uploadedPaths.length) {
        await supabase.storage.from("library").remove(uploadedPaths)
      }
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
    <form
      action={handleSubmit}
      aria-busy={loading}
      className={cn("space-y-6 max-w-2xl", loading && "cursor-progress")}
    >
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
          <Select
            value={docType}
            onValueChange={(v) => setDocType(v ?? "policy")}
            items={DOC_TYPES}
          >
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
          placeholder="Write the policy, SOP, or guideline here… (optional if you attach a file below)"
        />
        <p className="text-xs text-muted-foreground">
          Teammates will be asked to acknowledge this document once its status
          is set to Approved.
        </p>
      </div>

      {/* Attachment — upload a PDF or document instead of, or alongside,
          the inline text. Optional; available on create and edit. */}
      <div className="space-y-2 border-t pt-6">
        <Label htmlFor="attachment-file">Attachment (optional)</Label>
        <p className="text-xs text-muted-foreground">
          Upload a PDF or document (Word, text, spreadsheet, slides — up to{" "}
          {MAX_FILE_MB} MB). It can be downloaded from the document&apos;s page.
        </p>
        {currentName && (
          <div className="flex items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[18rem] truncate">{currentName}</span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        )}
        <Input
          key={fileInputKey}
          id="attachment-file"
          type="file"
          accept={ACCEPT}
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
