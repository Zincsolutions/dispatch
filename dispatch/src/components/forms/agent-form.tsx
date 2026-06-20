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
import { RelatedItemSelector } from "@/components/forms/related-item-selector"
import {
  AGENT_PLATFORMS,
  AGENT_STATUSES,
  DEPARTMENTS,
  RISK_LEVELS,
} from "@/lib/constants"
import { toast } from "sonner"
import type { Agent } from "@/lib/types"

interface AgentFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>
  defaultValues?: Agent
  availableContextAssets?: { id: string; title: string; status: string }[]
  connectedAssetIds?: string[]
}

export function AgentForm({
  action,
  defaultValues,
  availableContextAssets = [],
  connectedAssetIds = [],
}: AgentFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [platform, setPlatform] = useState(defaultValues?.platform || "")
  const [department, setDepartment] = useState(defaultValues?.department || "")
  const [riskLevel, setRiskLevel] = useState(defaultValues?.risk_level || "")
  const [relatedContextAssetIds, setRelatedContextAssetIds] =
    useState<string[]>(connectedAssetIds)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    if (platform) formData.set("platform", platform)
    if (department) formData.set("department", department)
    if (riskLevel) formData.set("risk_level", riskLevel)
    formData.set("related_context_asset_ids", JSON.stringify(relatedContextAssetIds))

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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Textarea
          id="purpose"
          name="purpose"
          defaultValue={defaultValues?.purpose || ""}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Platform</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {AGENT_PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
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
            options={AGENT_STATUSES}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={department} onValueChange={(v) => setDepartment(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={defaultValues?.category || ""}
            placeholder="e.g. Website Strategy"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            name="version"
            defaultValue={defaultValues?.version || ""}
            placeholder="1.0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_reviewed">Last reviewed</Label>
          <Input
            id="last_reviewed"
            name="last_reviewed"
            type="date"
            defaultValue={defaultValues?.last_reviewed || ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Risk level</Label>
          <Select value={riskLevel} onValueChange={(v) => setRiskLevel(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select risk" />
            </SelectTrigger>
            <SelectContent>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="setup_notes">Setup Notes</Label>
        <Textarea
          id="setup_notes"
          name="setup_notes"
          defaultValue={defaultValues?.setup_notes || ""}
          rows={4}
          className="font-mono text-sm"
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

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : defaultValues
              ? "Update Agent"
              : "Create Agent"}
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
