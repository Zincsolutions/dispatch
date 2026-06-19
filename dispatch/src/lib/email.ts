// Outbound email via Resend's REST API (no SDK dependency — just fetch).
// Everything here is best-effort and gated on RESEND_API_KEY: if the key
// isn't set, calls become silent no-ops so the app works without email
// configured. Callers should never let email failures break their flow.

interface ContactNotification {
  name: string
  email: string
  company: string | null
  message: string
  planInterest: string | null
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function sendContactNotification(inquiry: ContactNotification) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Email not configured — inquiry is already saved to the DB, so this is fine.
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] RESEND_API_KEY not set — skipping contact notification")
    }
    return
  }

  const to = process.env.CONTACT_NOTIFY_EMAIL || "jzaslaw@zincsolutions.com"
  const from = process.env.CONTACT_FROM_EMAIL || "Dispatch <onboarding@resend.dev>"

  const plan = inquiry.planInterest || "general"
  const subject = `New Dispatch inquiry — ${inquiry.name}${
    inquiry.company ? ` (${inquiry.company})` : ""
  }`

  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Company", inquiry.company || "—"],
    ["Plan interest", plan],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;font-size:13px">${label}</td><td style="padding:4px 0;color:#141414;font-size:14px;font-weight:500">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("")

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f4;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e5e3;border-radius:12px;padding:28px">
      <h2 style="margin:0 0 4px;color:#141414;font-size:18px">New contact inquiry</h2>
      <p style="margin:0 0 20px;color:#999;font-size:13px">Submitted via the Dispatch pricing/contact page.</p>
      <table style="border-collapse:collapse;margin-bottom:20px">${rows}</table>
      <div style="border-top:1px solid #e5e5e3;padding-top:16px">
        <p style="margin:0 0 6px;color:#666;font-size:13px">Message</p>
        <p style="margin:0;color:#141414;font-size:14px;line-height:1.5;white-space:pre-wrap">${escapeHtml(
          inquiry.message
        )}</p>
      </div>
    </div></body></html>`

  const text = `New Dispatch contact inquiry

Name: ${inquiry.name}
Email: ${inquiry.email}
Company: ${inquiry.company || "—"}
Plan interest: ${plan}

Message:
${inquiry.message}`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`)
  }
}
