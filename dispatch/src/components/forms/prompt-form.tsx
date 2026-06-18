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
import { PROMPT_CATEGORIES } from "@/lib/constants"
import { toast } from "sonner"
import type { Prompt } from "@/lib/types"

const MAX_FILE_MB = 25

function fileExt(f: File) {
  return (f.name.split(".").pop() || "png").toLowerCase()
}

interface PromptFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  defaultValues?: Prompt
  // Needed to upload the sample output: paths go to {orgId}/{uuid}.{ext}.
  orgId?: string
  // Signed URL for an already-saved sample output (edit mode).
  defaultSampleOutputUrl?: string | null
}

export function PromptForm({
  action,
  defaultValues,
  orgId,
  defaultSampleOutputUrl,
}: PromptFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [category, setCategory] = useState(defaultValues?.category || "")
  const [loading, setLoading] = useState(false)

  // Sample output: optional example of what the prompt produces.
  const existingSamplePath = defaultValues?.sample_output_path ?? null
  const [sampleFile, setSampleFile] = useState<File | null>(null)
  const [samplePreviewUrl, setSamplePreviewUrl] = useState<string | null>(null)
  // Keep the already-saved sample unless the user replaces or removes it.
  const [keepExistingSample, setKeepExistingSample] = useState(true)
  // Bumped to remount (and thus clear) the file input after a remove.
  const [sampleInputKey, setSampleInputKey] = useState(0)

  function handleSampleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    setSampleFile(selected)
    setSamplePreviewUrl(selected ? URL.createObjectURL(selected) : null)
    if (selected) setKeepExistingSample(false)
  }

  function handleSampleRemove() {
    setSampleFile(null)
    setSamplePreviewUrl(null)
    setKeepExistingSample(false)
    setSampleInputKey((k) => k + 1)
  }

  const showExistingSample = keepExistingSample && Boolean(defaultSampleOutputUrl)
  const sampleThumb = samplePreviewUrl ?? (showExistingSample ? defaultSampleOutputUrl : null)

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    if (category) formData.set("category", category)

    setLoading(true)
    const supabase = createClient()
    // Files uploaded in this submit — removed if the save ultimately fails.
    const uploadedPaths: string[] = []

    let samplePath = ""
    if (sampleFile) {
      if (!orgId) {
        toast.error("Unable to upload sample output")
        setLoading(false)
        return
      }
      const path = `${orgId}/${crypto.randomUUID()}.${fileExt(sampleFile)}`
      const { error: uploadError } = await supabase.storage
        .from("library")
        .upload(path, sampleFile)
      if (uploadError) {
        toast.error("Sample upload failed: " + uploadError.message)
        setLoading(false)
        return
      }
      uploadedPaths.push(path)
      samplePath = path
    } else if (keepExistingSample && existingSamplePath) {
      samplePath = existingSamplePath
    }
    formData.set("sample_output_path", samplePath)

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
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
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
        <Label htmlFor="prompt_body">Prompt Body</Label>
        <Textarea
          id="prompt_body"
          name="prompt_body"
          defaultValue={defaultValues?.prompt_body}
          rows={8}
          required
          className="font-mono text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {PROMPT_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
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
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      {/* Sample output — an example of what this prompt produces, so people
          browsing the prompt can see what it's capable of. Optional. */}
      <div className="space-y-2 border-t pt-6">
        <Label htmlFor="sample-output-file">Sample output (optional)</Label>
        <p className="text-xs text-muted-foreground">
          An example image this prompt produced, so viewers can see what it can
          create. Shown on the prompt&apos;s page.
        </p>
        {sampleThumb && (
          <div className="flex items-center gap-3 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sampleThumb}
              alt="Sample output"
              className="h-20 w-20 rounded-lg border object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSampleRemove}
            >
              Remove
            </Button>
          </div>
        )}
        <Input
          key={sampleInputKey}
          id="sample-output-file"
          type="file"
          accept="image/*"
          onChange={handleSampleChange}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : defaultValues
              ? "Update Prompt"
              : "Create Prompt"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
