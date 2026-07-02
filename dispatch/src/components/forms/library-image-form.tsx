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
import { ImageDropzone } from "@/components/forms/image-dropzone"
import { StatusSelect } from "@/components/forms/status-select"
import { RelatedItemSelector } from "@/components/forms/related-item-selector"
import { FOUNDATION_STATUSES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { ImageCollection, LibraryImage } from "@/lib/types"

const MAX_FILE_MB = 25
const NO_COLLECTION = "__none__"

const TOOLS = [
  { value: "midjourney", label: "Midjourney" },
  { value: "dalle", label: "DALL·E" },
  { value: "firefly", label: "Firefly" },
  { value: "other", label: "Other" },
]

interface LibraryImageFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  collections: ImageCollection[]
  // Needed wherever a file is uploaded: paths go to {orgId}/{uuid}.{ext}.
  // Required in create mode (generated image) and whenever a reference
  // image is added — including from the edit form.
  orgId?: string
  defaultValues?: LibraryImage
  // Signed URL for an already-saved reference image (edit mode).
  defaultReferenceUrl?: string | null
  availableContextAssets?: { id: string; title: string; status: string }[]
  connectedAssetIds?: string[]
}

function fileExt(f: File) {
  return (f.name.split(".").pop() || "png").toLowerCase()
}

export function LibraryImageForm({
  action,
  collections,
  orgId,
  defaultValues,
  defaultReferenceUrl,
  availableContextAssets = [],
  connectedAssetIds = [],
}: LibraryImageFormProps) {
  const router = useRouter()
  const isEdit = Boolean(defaultValues)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // Bumped to remount (and clear) the main image input after an invalid pick.
  const [fileInputKey, setFileInputKey] = useState(0)
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [tool, setTool] = useState(defaultValues?.tool || "midjourney")
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [collectionId, setCollectionId] = useState(
    defaultValues?.collection_id || NO_COLLECTION
  )
  const [relatedContextAssetIds, setRelatedContextAssetIds] =
    useState<string[]>(connectedAssetIds)
  const [loading, setLoading] = useState(false)

  // Reference image: optional original the user worked from.
  const existingReferencePath = defaultValues?.reference_storage_path ?? null
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(
    null
  )
  // Keep the already-saved reference unless the user replaces or removes it.
  const [keepExistingReference, setKeepExistingReference] = useState(true)
  // Bumped to remount (and thus clear) the file input after a remove.
  const [referenceInputKey, setReferenceInputKey] = useState(0)

  // Shared validation for both the generated image and the reference image,
  // whether the file arrives via click or drag-and-drop. Returns the file if
  // valid, or null (after toasting) if not.
  function acceptImage(selected: File | null): File | null {
    if (selected && !selected.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return null
    }
    if (selected && selected.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_FILE_MB} MB`)
      return null
    }
    return selected
  }

  function handleFileSelect(selected: File | null) {
    const valid = acceptImage(selected)
    if (selected && !valid) {
      setFileInputKey((k) => k + 1) // clear the rejected pick
      return
    }
    setFile(valid)
    setPreviewUrl(valid ? URL.createObjectURL(valid) : null)
  }

  function handleReferenceSelect(selected: File | null) {
    const valid = acceptImage(selected)
    if (selected && !valid) {
      setReferenceInputKey((k) => k + 1) // clear the rejected pick
      return
    }
    setReferenceFile(valid)
    setReferencePreviewUrl(valid ? URL.createObjectURL(valid) : null)
    // A new selection supersedes any previously-saved reference.
    if (valid) setKeepExistingReference(false)
  }

  function handleReferenceRemove() {
    setReferenceFile(null)
    setReferencePreviewUrl(null)
    setKeepExistingReference(false)
    setReferenceInputKey((k) => k + 1)
  }

  const showExistingReference = keepExistingReference && Boolean(defaultReferenceUrl)
  const referenceThumb = referencePreviewUrl ?? (showExistingReference ? defaultReferenceUrl : null)

  // Passed to the collection Select root so the closed trigger shows the
  // collection's name instead of its raw id.
  const collectionItems = [
    { value: NO_COLLECTION, label: "No collection" },
    ...collections.map((c) => ({ value: c.id, label: c.name })),
  ]

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("tool", tool)
    formData.set("status", status)
    formData.set("related_context_asset_ids", JSON.stringify(relatedContextAssetIds))
    formData.set(
      "collection_id",
      collectionId === NO_COLLECTION ? "" : collectionId
    )

    setLoading(true)
    const supabase = createClient()
    // Files uploaded in this submit — removed if the save ultimately fails.
    const uploadedPaths: string[] = []

    if (!isEdit) {
      if (!file || !orgId) {
        toast.error("Choose an image to upload")
        setLoading(false)
        return
      }
      const storagePath = `${orgId}/${crypto.randomUUID()}.${fileExt(file)}`
      const { error: uploadError } = await supabase.storage
        .from("library")
        .upload(storagePath, file)

      if (uploadError) {
        toast.error("Upload failed: " + uploadError.message)
        setLoading(false)
        return
      }
      uploadedPaths.push(storagePath)
      formData.set("storage_path", storagePath)
    }

    // Reference image (optional, in both create and edit).
    let referencePath = ""
    if (referenceFile) {
      if (!orgId) {
        toast.error("Unable to upload reference image")
        if (uploadedPaths.length) {
          await supabase.storage.from("library").remove(uploadedPaths)
        }
        setLoading(false)
        return
      }
      const refPath = `${orgId}/${crypto.randomUUID()}.${fileExt(referenceFile)}`
      const { error: refError } = await supabase.storage
        .from("library")
        .upload(refPath, referenceFile)

      if (refError) {
        toast.error("Reference upload failed: " + refError.message)
        if (uploadedPaths.length) {
          await supabase.storage.from("library").remove(uploadedPaths)
        }
        setLoading(false)
        return
      }
      uploadedPaths.push(refPath)
      referencePath = refPath
    } else if (keepExistingReference && existingReferencePath) {
      referencePath = existingReferencePath
    }
    formData.set("reference_storage_path", referencePath)

    const result = await action(formData)
    if (result?.error) {
      // Don't leave orphaned files behind if the metadata write failed.
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
      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="file">Image</Label>
          <ImageDropzone
            id="file"
            onSelect={handleFileSelect}
            resetKey={fileInputKey}
            maxMb={MAX_FILE_MB}
          />
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Upload preview"
              className="mt-2 max-h-64 rounded-lg border object-contain"
            />
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title || ""}
          placeholder="Hero image — desert palette"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          name="prompt"
          defaultValue={defaultValues?.prompt || ""}
          rows={5}
          required
          className="font-mono text-sm"
          placeholder="The full prompt used to generate this image"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sref">Style reference (--sref)</Label>
          <Input
            id="sref"
            name="sref"
            defaultValue={defaultValues?.sref || ""}
            placeholder="e.g. 284756192"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parameters">Other parameters</Label>
          <Input
            id="parameters"
            name="parameters"
            defaultValue={defaultValues?.parameters || ""}
            placeholder="--ar 16:9 --v 7 --stylize 200"
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tool-select">Tool</Label>
          <Select
            value={tool}
            onValueChange={(v) => setTool(v ?? "midjourney")}
            items={TOOLS}
          >
            <SelectTrigger id="tool-select">
              <SelectValue placeholder="Tool" />
            </SelectTrigger>
            <SelectContent>
              {TOOLS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection-select">Collection</Label>
          <Select
            value={collectionId}
            onValueChange={(v) => setCollectionId(v ?? NO_COLLECTION)}
            items={collectionItems}
          >
            <SelectTrigger id="collection-select">
              <SelectValue placeholder="No collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_COLLECTION}>No collection</SelectItem>
              {collections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <StatusSelect
            value={status}
            onValueChange={setStatus}
            options={FOUNDATION_STATUSES}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aspect_ratio">Aspect ratio</Label>
          <Input
            id="aspect_ratio"
            name="aspect_ratio"
            defaultValue={defaultValues?.aspect_ratio || ""}
            placeholder="16:9"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seed">Seed</Label>
          <Input
            id="seed"
            name="seed"
            defaultValue={defaultValues?.seed || ""}
            placeholder="e.g. 12345"
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cref">Character reference (--cref)</Label>
        <Input
          id="cref"
          name="cref"
          defaultValue={defaultValues?.cref || ""}
          placeholder="URL or code"
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="negative_prompt">Negative prompt</Label>
        <Textarea
          id="negative_prompt"
          name="negative_prompt"
          defaultValue={defaultValues?.negative_prompt || ""}
          rows={2}
          className="font-mono text-sm"
          placeholder="What to avoid (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="usage_notes">Usage notes</Label>
        <Textarea
          id="usage_notes"
          name="usage_notes"
          defaultValue={defaultValues?.usage_notes || ""}
          rows={2}
          placeholder="Where/how this image should be used (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <RelatedItemSelector
        items={availableContextAssets}
        selectedIds={relatedContextAssetIds}
        onSelectionChange={setRelatedContextAssetIds}
        label="Connected Foundation Assets"
      />

      {/* Reference image — sits below the rest so it's never confused with
          the generated image. Optional, and addable in both create and edit. */}
      <div className="space-y-2 border-t pt-6">
        <Label htmlFor="reference-file">Reference image (optional)</Label>
        <p className="text-xs text-muted-foreground">
          The original image you worked from. Kept separate from the generated
          image — pull it in alongside the prompt when you need to match a look.
        </p>
        {referenceThumb && (
          <div className="flex items-center gap-3 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={referenceThumb}
              alt="Reference image"
              className="h-20 w-20 rounded-lg border object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReferenceRemove}
            >
              Remove
            </Button>
          </div>
        )}
        <ImageDropzone
          id="reference-file"
          onSelect={handleReferenceSelect}
          resetKey={referenceInputKey}
          maxMb={MAX_FILE_MB}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading
            ? isEdit
              ? "Saving..."
              : "Uploading..."
            : isEdit
              ? "Update Image"
              : "Add to Library"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
