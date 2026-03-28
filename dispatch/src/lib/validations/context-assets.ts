import { z } from "zod"

export const contextAssetSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  asset_type: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "approved", "archived"]).default("draft"),
})

export type ContextAssetFormValues = z.infer<typeof contextAssetSchema>
