"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/forms/tag-input"
import { StatusSelect } from "@/components/forms/status-select"
import { WorkflowStepEditor } from "@/components/forms/workflow-step-editor"
import { RelatedItemSelector } from "@/components/forms/related-item-selector"
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
}

export function WorkflowForm({
  action,
  defaultValues,
  availablePrompts,
  availableContextAssets,
  availableAgents,
}: WorkflowFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [status, setStatus] = useState(defaultValues?.status || "draft")
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
          <Label>Status</Label>
          <StatusSelect value={status} onValueChange={setStatus} />
        </div>
      </div>

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
          label="Context Assets"
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
