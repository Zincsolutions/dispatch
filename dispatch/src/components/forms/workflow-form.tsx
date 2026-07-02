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
import { WorkflowStepEditor } from "@/components/forms/workflow-step-editor"
import { RelatedItemSelector } from "@/components/forms/related-item-selector"
import {
  AGENT_STATUSES,
  DEPARTMENTS,
  RISK_LEVELS,
  WORKFLOW_TYPES,
} from "@/lib/constants"
import { toast } from "sonner"
import type { Workflow, WorkflowStep } from "@/lib/types"

interface RelatedItem {
  id: string
  title?: string
  name?: string
  status: string
}

interface WorkflowFormProps {
  action: (
    formData: FormData
  ) => Promise<{ error?: Record<string, string[]> } | void>
  defaultValues?: Workflow & {
    workflow_prompts?: { prompt_id: string }[]
    workflow_context_assets?: { context_asset_id: string }[]
    workflow_agents?: { agent_id: string }[]
  }
  availablePrompts: RelatedItem[]
  availableContextAssets: RelatedItem[]
  availableAgents: RelatedItem[]
  // Preselect the type (e.g. "loop" from the New Loop button).
  defaultType?: string
}

export function WorkflowForm({
  action,
  defaultValues,
  availablePrompts,
  availableContextAssets,
  availableAgents,
  defaultType,
}: WorkflowFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
  const [type, setType] = useState(
    defaultValues?.type || defaultType || "workflow"
  )
  const [department, setDepartment] = useState(defaultValues?.department || "")
  const [riskLevel, setRiskLevel] = useState(defaultValues?.risk_level || "")
  const [steps, setSteps] = useState<WorkflowStep[]>(
    (defaultValues?.steps as WorkflowStep[]) || []
  )
  const [loading, setLoading] = useState(false)

  const [relatedPromptIds, setRelatedPromptIds] = useState<string[]>(
    defaultValues?.workflow_prompts?.map((wp) => wp.prompt_id) || []
  )
  const [relatedContextAssetIds, setRelatedContextAssetIds] = useState<
    string[]
  >(
    defaultValues?.workflow_context_assets?.map(
      (wca) => wca.context_asset_id
    ) || []
  )
  const [relatedAgentIds, setRelatedAgentIds] = useState<string[]>(
    defaultValues?.workflow_agents?.map((wa) => wa.agent_id) || []
  )

  async function handleSubmit(formData: FormData) {
    formData.set("tags", JSON.stringify(tags))
    formData.set("status", status)
    formData.set("type", type)
    if (department) formData.set("department", department)
    if (riskLevel) formData.set("risk_level", riskLevel)
    formData.set("steps", JSON.stringify(steps))
    formData.set("related_prompt_ids", JSON.stringify(relatedPromptIds))
    formData.set(
      "related_context_asset_ids",
      JSON.stringify(relatedContextAssetIds)
    )
    formData.set("related_agent_ids", JSON.stringify(relatedAgentIds))

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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          rows={3}
        />
      </div>

      <WorkflowStepEditor steps={steps} onChange={setSteps} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v ?? "workflow")}
            items={WORKFLOW_TYPES}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {WORKFLOW_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
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
          <Select
            value={department}
            onValueChange={(v) => setDepartment(v ?? "")}
            items={DEPARTMENTS}
          >
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
            placeholder="e.g. SEO/GEO"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <Label>Risk level</Label>
          <Select
            value={riskLevel}
            onValueChange={(v) => setRiskLevel(v ?? "")}
            items={RISK_LEVELS}
          >
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="estimated_run_time">Estimated run time</Label>
          <Input
            id="estimated_run_time"
            name="estimated_run_time"
            defaultValue={defaultValues?.estimated_run_time || ""}
            placeholder="e.g. 10-15 min"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="output_format">Output format</Label>
          <Input
            id="output_format"
            name="output_format"
            defaultValue={defaultValues?.output_format || ""}
            placeholder="e.g. Prioritized checklist"
          />
        </div>
      </div>

      {type === "loop" && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Loop success &amp; stop
          </h3>
          <div className="space-y-2">
            <Label htmlFor="success_criteria">Success criteria</Label>
            <Textarea
              id="success_criteria"
              name="success_criteria"
              defaultValue={defaultValues?.success_criteria || ""}
              rows={2}
              placeholder="What does done look like?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="verification_method">Verification method</Label>
            <Textarea
              id="verification_method"
              name="verification_method"
              defaultValue={defaultValues?.verification_method || ""}
              rows={2}
              placeholder="How is success checked?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop_condition">Stop condition</Label>
            <Textarea
              id="stop_condition"
              name="stop_condition"
              defaultValue={defaultValues?.stop_condition || ""}
              rows={2}
              placeholder="When should the loop stop?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalation_condition">Escalation condition</Label>
            <Textarea
              id="escalation_condition"
              name="escalation_condition"
              defaultValue={defaultValues?.escalation_condition || ""}
              rows={2}
              placeholder="When should this escalate to a human?"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div className="border-t pt-6 space-y-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Related Items
        </h3>

        <RelatedItemSelector
          items={availablePrompts}
          selectedIds={relatedPromptIds}
          onSelectionChange={setRelatedPromptIds}
          label="Prompts"
        />

        <RelatedItemSelector
          items={availableContextAssets}
          selectedIds={relatedContextAssetIds}
          onSelectionChange={setRelatedContextAssetIds}
          label="Connected Foundation Assets"
        />

        <RelatedItemSelector
          items={availableAgents}
          selectedIds={relatedAgentIds}
          onSelectionChange={setRelatedAgentIds}
          label="Agents"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : defaultValues
              ? "Update Workflow"
              : "Create Workflow"}
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
