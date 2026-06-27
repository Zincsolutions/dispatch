import type { BlogPost, BlogCategory } from "./types"

import { post as knowledgeProblem } from "./posts/knowledge-problem-not-ai-problem"
import { post as aiOperatingSystem } from "./posts/ai-operating-system-before-another-tool"
import { post as hiddenCost } from "./posts/hidden-cost-of-ai-without-shared-system"
import { post as promptChaos } from "./posts/ai-prompt-chaos"
import { post as shareKnowledge } from "./posts/share-ai-knowledge-without-slowing-innovation"
import { post as governanceConfidence } from "./posts/ai-governance-is-about-confidence"
import { post as contextProblem } from "./posts/ai-context-problem"
import { post as stopSilos } from "./posts/stop-building-ai-silos"
import { post as findAssets } from "./posts/find-your-companys-ai-assets"
import { post as promptLibraryToOs } from "./posts/from-prompt-library-to-ai-operating-system"
import { post as bestEmployeeLeaves } from "./posts/what-happens-when-your-best-ai-employee-leaves"
import { post as scaleAi } from "./posts/scale-ai-without-losing-control"

export type { BlogPost, BlogCategory, Block } from "./types"

// Display order on the index (newest / most important first).
export const posts: BlogPost[] = [
  knowledgeProblem,
  aiOperatingSystem,
  hiddenCost,
  promptChaos,
  shareKnowledge,
  governanceConfidence,
  contextProblem,
  stopSilos,
  findAssets,
  promptLibraryToOs,
  bestEmployeeLeaves,
  scaleAi,
]

// Seven resource-center categories.
export const categories: BlogCategory[] = [
  "AI Governance",
  "AI Collaboration",
  "Prompt Management",
  "AI Adoption",
  "Knowledge Management",
  "Context Engineering",
  "AI Strategy",
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
