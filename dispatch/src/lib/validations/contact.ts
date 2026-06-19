import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().min(1, "Email is required").email("Enter a valid email").max(200),
  company: z.string().max(160).nullable(),
  message: z.string().min(1, "Tell us a little about your team").max(4000),
  // Constrained so the hidden plan-interest field can't be used to inject data.
  plan_interest: z
    .enum(["starter", "team", "enterprise", "free", "general"])
    .nullable(),
})

export type ContactInput = z.infer<typeof contactSchema>
