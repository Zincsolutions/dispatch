import { z } from "zod"

export const libraryImageSchema = z.object({
  storage_path: z.string().min(1).max(500),
  // Optional original image the user worked from; null when none.
  reference_storage_path: z.string().max(500).nullable(),
  title: z.string().max(200).nullable(),
  prompt: z.string().max(10000),
  sref: z.string().max(500).nullable(),
  parameters: z.string().max(1000).nullable(),
  tool: z.enum(["midjourney", "dalle", "firefly", "other"]),
  status: z.enum(["draft", "needs_review", "approved", "archived"]).default("draft"),
  negative_prompt: z.string().max(10000).nullable(),
  cref: z.string().max(500).nullable(),
  seed: z.string().max(100).nullable(),
  aspect_ratio: z.string().max(50).nullable(),
  usage_notes: z.string().max(2000).nullable(),
  collection_id: z.string().uuid().nullable(),
  tags: z.array(z.string().max(50)).max(20),
})

// Edit never touches the generated image, but the reference image can be
// added, replaced, or cleared after the fact — so it stays in the schema.
export const libraryImageUpdateSchema = libraryImageSchema.omit({
  storage_path: true,
})

export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
})
