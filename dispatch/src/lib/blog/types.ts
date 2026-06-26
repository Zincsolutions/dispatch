// Content-block model for blog articles.
// Authored as typed data so we control the rendered, AEO-friendly semantic markup
// (h2/h3 headings, FAQ Q&A blocks, bullet lists, comparison tables) and can
// generate JSON-LD (Article + FAQPage) from the same source of truth.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  // Question-and-answer block. Rendered as an accessible Q&A list AND used to
  // build FAQPage structured data for answer-engine eligibility.
  | { type: "faq"; items: { q: string; a: string }[] }
  // Comparison table for "X vs Y" style content.
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title?: string; text: string }

export type BlogCategory =
  | "AEO Fundamentals"
  | "AI Search Engines"
  | "Content Strategy"
  | "Technical & Measurement"

export interface BlogPost {
  slug: string
  /** On-page H1 / card title. */
  title: string
  /** <title> tag — keep ≤ ~60 chars, front-load the keyword. */
  metaTitle: string
  /** Meta description — 140–160 chars, answer-first. */
  metaDescription: string
  category: BlogCategory
  /** One-sentence card excerpt. */
  excerpt: string
  /** Image path under /public (e.g. /blog/aeo-hero.png). */
  image: string
  /** Human date, e.g. "June 24, 2026". */
  date: string
  /** ISO date for <time> and structured data, e.g. "2026-06-24". */
  dateISO: string
  author: string
  /** Reading time label, e.g. "11 min read". */
  readTime: string
  /** Promote to the large featured slot on the index. */
  featured?: boolean
  /** Canonical FAQ pairs for FAQPage JSON-LD (also rendered in-body). */
  faqs: { q: string; a: string }[]
  /** Article body. */
  body: Block[]
}
