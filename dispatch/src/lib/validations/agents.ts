import { z } from "zod"

export const agentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  purpose: z.string().max(1000).optional().nullable(),
  platform: z.string().optional().nullable(),
  setup_notes: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z
    .enum(["draft", "experimental", "needs_review", "approved", "archived"])
    .default("draft"),
  department: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  version: z.string().max(50).optional().nullable(),
  last_reviewed: z.string().max(20).optional().nullable(),
  risk_level: z.enum(["low", "medium", "high"]).optional().nullable(),
})

export type AgentFormValues = z.infer<typeof agentSchema>
