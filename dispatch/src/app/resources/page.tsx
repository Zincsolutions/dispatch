import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { posts, categories, getFeaturedPost } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Resources — Dispatch",
  description:
    "Playbooks on AI governance, collaboration, prompt management, and operations — for leaders building an AI-powered organization with Dispatch.",
  // /resources and /blog render the same blog index; consolidate to /blog for SEO.
  alternates: { canonical: "/blog" },
}

// The Resources page shows the full blog landing layout (featured post +
// category toggle + 3x3 grid), identical to /blog.
export default function ResourcesPage() {
  const featured = getFeaturedPost()
  const gridPosts = posts

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />
      <BlogIndex posts={gridPosts} featured={featured} categories={categories} />
      <Footer />
    </div>
  )
}
