import { z } from "zod"

export const invitationSchema = z.object({
  email: z.string().email("Enter a valid email address").max(255),
  role: z.enum(["owner", "member"]),
})
