import type { BlogPost, BlogCategory } from "./types"

import { post as whatIsAeo } from "./posts/what-is-answer-engine-optimization"
import { post as aeoVsSeo } from "./posts/aeo-vs-seo"
import { post as getCited } from "./posts/get-cited-by-ai-engines"
import { post as geo } from "./posts/what-is-generative-engine-optimization"
import { post as optimizeContent } from "./posts/optimize-content-for-ai-search"
import { post as schemaMarkup } from "./posts/schema-markup-for-aeo"
import { post as measureAeo } from "./posts/measure-aeo-success"
import { post as faqPages } from "./posts/faq-pages-for-aeo"
import { post as zeroClick } from "./posts/zero-click-search-aeo"

export type { BlogPost, BlogCategory, Block } from "./types"

// Display order on the index (newest / most important first).
export const posts: BlogPost[] = [
  whatIsAeo,
  aeoVsSeo,
  getCited,
  geo,
  optimizeContent,
  schemaMarkup,
  measureAeo,
  faqPages,
  zeroClick,
]

// Four categories, mirroring the toggle pattern on the Zinc blog.
export const categories: BlogCategory[] = [
  "AEO Fundamentals",
  "AI Search Engines",
  "Content Strategy",
  "Technical & Measurement",
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug)
}

export function getFeaturedPost(): BlogPost {
  return posts.find((p) => p.featured) ?? posts[0]
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug)
  if (!current) return posts.slice(0, limit)
  const sameCategory = posts.filter(
    (p) => p.slug !== slug && p.category === current.category,
  )
  const others = posts.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}
