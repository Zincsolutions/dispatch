// Content-block model for Dispatch resource-center articles.
// Authored as typed data so we control the rendered, AEO-friendly semantic
// markup (headings for the auto-TOC, FAQ Q&A, callouts, checklists, diagrams,
// comparison tables) and can generate JSON-LD (Article + FAQPage +
// Organization + Breadcrumb) from the same source of truth.

export type DiagramName =
  | "ai-maturity"
  | "prompt-lifecycle"
  | "knowledge-flow"
  | "governance-model"
  | "asset-lifecycle"

export type CalloutVariant =
  | "info"
  | "best-practice"
  | "common-mistake"
  | "key-takeaway"

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  // Checkbox-style list, e.g. "Signs your org has an AI knowledge problem".
  | { type: "checklist"; title?: string; items: string[] }
  // Question-and-answer block. Rendered as accessible Q&A AND used to build
  // FAQPage structured data for answer-engine eligibility.
  | { type: "faq"; items: { q: string; a: string }[] }
  // Comparison table, e.g. "Without Dispatch vs With Dispatch".
  | { type: "table"; title?: string; headers: string[]; rows: string[][] }
  // Large highlighted statement.
  | { type: "pullquote"; text: string; cite?: string }
  // Colored information box with a labeled variant.
  | { type: "callout"; variant: CalloutVariant; title?: string; text: string }
  // References a reusable inline SVG diagram by name.
  | { type: "diagram"; name: DiagramName; caption?: string }
  // Mid-article CTA section (placed ~75% through the article).
  | { type: "cta" }

// Seven resource-center categories.
export type BlogCategory =
  | "AI Governance"
  | "AI Collaboration"
  | "Prompt Management"
  | "AI Adoption"
  | "Knowledge Management"
  | "Context Engineering"
  | "AI Strategy"

export interface BlogPost {
  slug: string
  /** On-page H1 / card title. */
  title: string
  /** <title> tag — front-load the keyword, keep it readable. */
  metaTitle: string
  /** Meta description — 140–160 chars, answer-first. */
  metaDescription: string
  category: BlogCategory
  /** One- or two-sentence card excerpt. */
  excerpt: string
  /** Human publish date, e.g. "June 24, 2026". */
  date: string
  /** ISO publish date for <time> and structured data. */
  dateISO: string
  /** ISO last-updated date (defaults to dateISO when omitted). */
  lastUpdated?: string
  author: string
  /** Promote to the large featured slot on the index. */
  featured?: boolean
  /** Optional real image path; when omitted a branded placeholder is shown. */
  image?: string
  /** Canonical FAQ pairs for FAQPage JSON-LD (also rendered in-body). */
  faqs: { q: string; a: string }[]
  /** Article body. */
  body: Block[]
}
