import type { Block } from "./types"

// Stable slug for an <h2> so the TOC can anchor-link to it.
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export interface TocEntry {
  id: string
  text: string
}

// Build the table of contents from the article's H2 headings.
export function extractToc(blocks: Block[]): TocEntry[] {
  return blocks
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: headingId(b.text), text: b.text }))
}

// Approximate word count + reading time from the body's text content.
export function articleStats(blocks: Block[]): {
  words: number
  readTime: string
} {
  let words = 0
  const count = (s: string) => {
    const t = s.trim()
    return t ? t.split(/\s+/).length : 0
  }
  for (const b of blocks) {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
        words += count(b.text)
        break
      case "pullquote":
        words += count(b.text)
        break
      case "callout":
        words += count(b.text) + (b.title ? count(b.title) : 0)
        break
      case "ul":
      case "ol":
        words += b.items.reduce((n, i) => n + count(i), 0)
        break
      case "checklist":
        words += b.items.reduce((n, i) => n + count(i), 0)
        break
      case "faq":
        words += b.items.reduce((n, i) => n + count(i.q) + count(i.a), 0)
        break
      case "table":
        words +=
          b.headers.reduce((n, h) => n + count(h), 0) +
          b.rows.reduce((n, r) => n + r.reduce((m, c) => m + count(c), 0), 0)
        break
      default:
        break
    }
  }
  const readTime = `${Math.max(1, Math.round(words / 225))} min read`
  return { words, readTime }
}
