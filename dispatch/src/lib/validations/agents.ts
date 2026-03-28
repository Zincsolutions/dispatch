import { z } from "zod"

export const agentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  purpose: z.string().max(1000).optional().nullable(),
  platform: z.string().optional().nullable(),
  setup_notes: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "approved", "archived"]).default("draft"),
})

export type AgentFormValues = z.infer<typeof agentSchema>
