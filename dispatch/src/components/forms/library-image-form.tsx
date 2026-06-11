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
  // Required in create mode: uploads go to {orgId}/{uuid}.{ext}
  orgId?: string
  defaultValues?: LibraryImage
}

export function LibraryImageForm({
  action,
  collections,
  orgId,
  defaultValues,
}: LibraryImageFormProps) {
  const router = useRouter()
  const isEdit = Boolean(defaultValues)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [tool, setTool] = useState(defaultValues?.tool || "midjourney")
  const [collectionId, setCollectionId] = useState(
    defaultValues?.collection_id || NO_COLLECTION
  )
  const [loading, setLoading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    if (selected && !selected.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      e.target.value = ""
      return
    }
    if (selected && selected.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_FILE_MB} MB`)
      e.target.value = ""
      return
    }
    setFile(selected)
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null)
  }

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("tool", tool)
    formData.set(
      "collection_id",
      collectionId === NO_COLLECTION ? "" : collectionId
    )

    setLoading(true)
    let uploadedPath: string | null = null

    if (!isEdit) {
      if (!file || !orgId) {
        toast.error("Choose an image to upload")
        setLoading(false)
        return
      }
      const supabase = createClient()
      const ext = (file.name.split(".").pop() || "png").toLowerCase()
      uploadedPath = `${orgId}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("library")
        .upload(uploadedPath, file)

      if (uploadError) {
        toast.error("Upload failed: " + uploadError.message)
        setLoading(false)
        return
      }
      formData.set("storage_path", uploadedPath)
    }

    const result = await action(formData)
    if (result?.error) {
      // Don't leave an orphaned file behind if the metadata insert failed.
      if (uploadedPath) {
        const supabase = createClient()
        await supabase.storage.from("library").remove([uploadedPath])
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
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="file">Image</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
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
          <Select value={tool} onValueChange={(v) => setTool(v ?? "midjourney")}>
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

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
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
