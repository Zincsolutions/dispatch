import { z } from "zod"

export const contextAssetSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  category: z.enum(
    [
      "brand_identity",
      "voice_messaging",
      "products_services",
      "customers_personas",
      "company_knowledge",
      "examples_reference",
    ],
    { message: "Category is required" }
  ),
  asset_type: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "needs_review", "approved", "archived"]).default("draft"),
})

export type ContextAssetFormValues = z.infer<typeof contextAssetSchema>
