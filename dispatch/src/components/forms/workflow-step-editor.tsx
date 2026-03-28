"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import type { WorkflowStep } from "@/lib/types"

interface WorkflowStepEditorProps {
  steps: WorkflowStep[]
  onChange: (steps: WorkflowStep[]) => void
}

export function WorkflowStepEditor({
  steps,
  onChange,
}: WorkflowStepEditorProps) {
  function addStep() {
    onChange([
      ...steps,
      { order: steps.length + 1, title: "", description: "" },
    ])
  }

  function removeStep(index: number) {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }))
    onChange(updated)
  }

  function updateStep(
    index: number,
    field: "title" | "description",
    value: string
  ) {
    const updated = steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Steps</Label>
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="mr-1 h-4 w-4" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No steps added yet. Click &quot;Add Step&quot; to define your workflow
          steps.
        </p>
      )}

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Step {step.order}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStep(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Step title"
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
              />
              <Textarea
                placeholder="Step description"
                value={step.description}
                onChange={(e) =>
                  updateStep(index, "description", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
