import { z } from "zod"

export const promptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  prompt_body: z.string().min(1, "Prompt body is required"),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "approved", "archived"]).default("draft"),
  // Optional example of what the prompt produces; null when none.
  sample_output_path: z.string().max(500).optional().nullable(),
})

export type PromptFormValues = z.infer<typeof promptSchema>
