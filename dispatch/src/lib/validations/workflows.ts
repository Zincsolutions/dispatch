import { z } from "zod"

export const workflowStepSchema = z.object({
  order: z.number(),
  title: z.string().min(1, "Step title is required"),
  description: z.string(),
})

export const workflowSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  steps: z.array(workflowStepSchema).default([]),
  tags: z.array(z.string()).default([]),
  status: z
    .enum(["draft", "experimental", "needs_review", "approved", "archived"])
    .default("draft"),
  type: z.enum(["workflow", "loop", "checklist", "sop"]).default("workflow"),
  department: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  version: z.string().max(50).optional().nullable(),
  risk_level: z.enum(["low", "medium", "high"]).optional().nullable(),
  estimated_run_time: z.string().max(100).optional().nullable(),
  output_format: z.string().max(200).optional().nullable(),
  success_criteria: z.string().max(2000).optional().nullable(),
  verification_method: z.string().max(2000).optional().nullable(),
  stop_condition: z.string().max(2000).optional().nullable(),
  escalation_condition: z.string().max(2000).optional().nullable(),
  last_reviewed: z.string().max(20).optional().nullable(),
  related_prompt_ids: z.array(z.string()).default([]),
  related_context_asset_ids: z.array(z.string()).default([]),
  related_agent_ids: z.array(z.string()).default([]),
})

export type WorkflowFormValues = z.infer<typeof workflowSchema>
