import { z } from "zod"

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  // Optional — a document may be inline text, an uploaded file, or both.
  content: z.string().max(100000),
  doc_type: z.enum(["policy", "sop", "guideline"]),
  status: z.enum(["draft", "approved", "archived"]),
  tags: z.array(z.string().max(50)).max(20),
  // Optional uploaded file (e.g. a PDF); null when none.
  attachment_path: z.string().max(500).nullable(),
  attachment_name: z.string().max(255).nullable(),
})

export const toolSchema = z.object({
  name: z.string().min(1, "Tool name is required").max(100),
  status: z.enum(["approved", "experimental", "not_allowed"]),
  owner: z.string().max(100).nullable(),
  url: z
    .string()
    .max(500)
    .refine(
      (v) => !v || v.startsWith("https://") || v.startsWith("http://"),
      "URL must start with http(s)://"
    )
    .nullable(),
  rationale: z.string().max(2000).nullable(),
  data_notes: z.string().max(2000).nullable(),
})
