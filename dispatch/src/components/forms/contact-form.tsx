"use client"

import { useState } from "react"
import { submitContactInquiry } from "@/lib/actions/contact"
import { track } from "@/lib/analytics"

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter plan",
  team: "Team plan",
  enterprise: "Enterprise",
  free: "Free plan",
  general: "General question",
}

const inputClass =
  "w-full rounded-xl border border-[#E5E5E3] bg-white px-4 py-3 text-[15px] text-[#141414] placeholder:text-[#999] outline-none transition-colors focus:border-[#141414]/40 focus:ring-2 focus:ring-[#141414]/[0.06]"

export function ContactForm({ plan }: { plan: string }) {
  const planInterest = PLAN_LABELS[plan] ? plan : "general"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await submitContactInquiry(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error._form?.[0] || "Something went wrong. Please try again.")
      return
    }
    track("contact_submitted", { plan: planInterest })
    setDone(true)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#E5E5E3] bg-[#EDECEC] p-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#141414] mb-3">Thanks — we’ll be in touch.</h2>
        <p className="text-[15px] text-[#666] leading-relaxed max-w-md mx-auto">
          Your message is on its way to us. We typically respond within one
          business day to help you set up Dispatch for your organization.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from real users, catches bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <input type="hidden" name="plan_interest" value={planInterest} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-[#141414]">
            Name
          </label>
          <input id="name" name="name" required placeholder="Jane Doe" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[#141414]">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="company" className="block text-sm font-semibold text-[#141414]">
          Company <span className="font-normal text-[#999]">(optional)</span>
        </label>
        <input id="company" name="company" placeholder="Company or team name" className={inputClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-[#141414]">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about your team, how many people need access, and what you’re trying to organize or govern."
          className={`${inputClass} resize-y`}
        />
        {PLAN_LABELS[plan] && plan !== "general" && (
          <p className="text-[13px] text-[#999]">
            Inquiry tagged: <span className="font-medium text-[#666]">{PLAN_LABELS[plan]}</span>
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-[#141414] text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? "Sending…" : "Talk to Us"}
      </button>
    </form>
  )
}
