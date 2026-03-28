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
  status: z.enum(["draft", "approved", "archived"]).default("draft"),
  related_prompt_ids: z.array(z.string()).default([]),
  related_context_asset_ids: z.array(z.string()).default([]),
  related_agent_ids: z.array(z.string()).default([]),
})

export type WorkflowFormValues = z.infer<typeof workflowSchema>
