"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { contactSchema } from "@/lib/validations/contact"
import { sendContactNotification } from "@/lib/email"

const PLAN_VALUES = ["starter", "team", "enterprise", "free", "general"] as const

export async function submitContactInquiry(formData: FormData) {
  // Honeypot: bots fill every field. Real users leave this hidden field empty.
  if (((formData.get("website") as string) || "").trim() !== "") {
    return { success: true } // silently accept, store nothing
  }

  const planRaw = (formData.get("plan_interest") as string) || ""
  const parsed = contactSchema.safeParse({
    name: ((formData.get("name") as string) || "").trim(),
    email: ((formData.get("email") as string) || "").trim(),
    company: ((formData.get("company") as string) || "").trim() || null,
    message: ((formData.get("message") as string) || "").trim(),
    plan_interest: (PLAN_VALUES as readonly string[]).includes(planRaw)
      ? planRaw
      : null,
  })

  if (!parsed.success) {
    return { error: { _form: [parsed.error.issues[0]?.message || "Invalid input"] } }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("contact_inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company,
    message: parsed.data.message,
    plan_interest: parsed.data.plan_interest,
    source: "pricing_contact_form",
  })

  if (error) {
    return { error: { _form: ["Something went wrong. Please try again or email hello@zincsolutions.com."] } }
  }

  // Best-effort notification — the inquiry is already saved, so never let an
  // email failure surface to the visitor.
  try {
    await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      message: parsed.data.message,
      planInterest: parsed.data.plan_interest,
    })
  } catch (e) {
    console.error("[contact] notification failed:", e)
  }

  return { success: true }
}
