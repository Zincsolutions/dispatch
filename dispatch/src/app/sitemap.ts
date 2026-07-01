import type { MetadataRoute } from "next"
import { posts } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.dispatchvault.com"

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.dateISO),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]

  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/resources`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/product`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/solutions/use-cases`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/solutions/integrations`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogEntries,
    {
      url: `${base}/pricing`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/signup`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/login`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]
}
