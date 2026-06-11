import { z } from "zod"

export const libraryImageSchema = z.object({
  storage_path: z.string().min(1).max(500),
  title: z.string().max(200).nullable(),
  prompt: z.string().max(10000),
  sref: z.string().max(500).nullable(),
  parameters: z.string().max(1000).nullable(),
  tool: z.enum(["midjourney", "dalle", "firefly", "other"]),
  collection_id: z.string().uuid().nullable(),
  tags: z.array(z.string().max(50)).max(20),
})

// Edit never touches the stored file.
export const libraryImageUpdateSchema = libraryImageSchema.omit({
  storage_path: true,
})

export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
})
