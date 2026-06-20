"use client"

import { useRef, useState } from "react"
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
import {
  CONTEXT_ASSET_TYPES,
  FOUNDATION_CATEGORIES,
  FOUNDATION_STATUSES,
} from "@/lib/constants"
import { Plus, X, Paperclip } from "lucide-react"
import { toast } from "sonner"
import type { ContextAsset } from "@/lib/types"

const MAX_FILE_MB = 25

interface ExistingFile {
  id: string
  file_name: string
}
interface LinkRow {
  url: string
  label: string
}

interface ContextAssetFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  // Needed to upload files into the org's own storage folder.
  orgId: string
  defaultValues?: ContextAsset
  existingFiles?: ExistingFile[]
  existingLinks?: { url: string; label: string | null }[]
}

function fileExt(f: File) {
  return (f.name.split(".").pop() || "bin").toLowerCase()
}

export function ContextAssetForm({
  action,
  orgId,
  defaultValues,
  existingFiles = [],
  existingLinks = [],
}: ContextAssetFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [category, setCategory] = useState(defaultValues?.category || "")
  const [assetType, setAssetType] = useState(defaultValues?.asset_type || "")
  const [links, setLinks] = useState<LinkRow[]>(
    existingLinks.map((l) => ({ url: l.url, label: l.label ?? "" }))
  )
  const [keptFiles, setKeptFiles] = useState<ExistingFile[]>(existingFiles)
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  function addLink() {
    setLinks((prev) => [...prev, { url: "", label: "" }])
  }
  function updateLink(i: number, field: keyof LinkRow, value: string) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)))
  }
  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  function removeExistingFile(id: string) {
    setKeptFiles((prev) => prev.filter((f) => f.id !== id))
    setRemovedFileIds((prev) => [...prev, id])
  }
  function onFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (fileInputRef.current) fileInputRef.current.value = ""
    const ok = picked.filter((f) => {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${f.name} is over ${MAX_FILE_MB} MB`)
        return false
      }
      return true
    })
    setPendingFiles((prev) => [...prev, ...ok])
  }
  function removePending(i: number) {
    setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    formData.set("category", category)
    if (assetType) formData.set("asset_type", assetType)
    formData.set("links", JSON.stringify(links.filter((l) => l.url.trim())))
    formData.set("removed_file_ids", JSON.stringify(removedFileIds))

    setLoading(true)
    try {
      // Upload any new files to the org's folder in the `library` bucket.
      const supabase = createClient()
      const uploaded: {
        storage_path: string
        file_name: string
        file_type: string | null
        file_size: number | null
      }[] = []
      for (const file of pendingFiles) {
        const path = `${orgId}/${crypto.randomUUID()}.${fileExt(file)}`
        const { error: upErr } = await supabase.storage
          .from("library")
          .upload(path, file, { contentType: file.type, upsert: false })
        if (upErr) {
          toast.error(`Upload failed: ${file.name}`)
          setLoading(false)
          return
        }
        uploaded.push({
          storage_path: path,
          file_name: file.name,
          file_type: file.type || null,
          file_size: file.size,
        })
      }
      formData.set("new_files", JSON.stringify(uploaded))

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
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={defaultValues?.content}
          rows={10}
          required
          className="font-mono text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {FOUNDATION_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Asset Type</Label>
          <Select value={assetType} onValueChange={(v) => setAssetType(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {CONTEXT_ASSET_TYPES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <StatusSelect
            value={status}
            onValueChange={setStatus}
            options={FOUNDATION_STATUSES}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      {/* Files */}
      <div className="space-y-2">
        <Label>Files</Label>
        <div className="space-y-2">
          {keptFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                {f.file_name}
              </span>
              <button
                type="button"
                onClick={() => removeExistingFile(f.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${f.file_name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {pendingFiles.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-md border border-dashed px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                {f.name} <span className="text-xs text-muted-foreground">(new)</span>
              </span>
              <button
                type="button"
                onClick={() => removePending(i)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${f.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFilesPicked}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add files
        </Button>
        <p className="text-xs text-muted-foreground">
          PDF, DOC, TXT, CSV, or images. Max {MAX_FILE_MB} MB each.
        </p>
      </div>

      {/* External links */}
      <div className="space-y-2">
        <Label>External Links</Label>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://…"
                className="flex-1"
              />
              <Input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label (optional)"
                className="w-40"
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-muted-foreground hover:text-destructive px-1"
                aria-label="Remove link"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addLink}>
          <Plus className="mr-1 h-4 w-4" />
          Add link
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes || ""}
          rows={3}
          placeholder="Internal notes about this asset (optional)"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : defaultValues ? "Update Foundation Asset" : "Add Foundation Asset"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
