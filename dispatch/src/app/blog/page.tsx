import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { posts, categories, getFeaturedPost } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Resource Center — AI Governance, Collaboration & Operations | Dispatch",
  description:
    "Playbooks on AI governance, collaboration, prompt management, and operations — for leaders turning scattered AI use into a system their whole organization can run on.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Dispatch Resource Center — Building the AI-Powered Organization",
    description:
      "Playbooks on AI governance, collaboration, and operations for modern teams.",
    url: "/blog",
    type: "website",
  },
}

export default function BlogPage() {
  const featured = getFeaturedPost()

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dispatch Resource Center",
    description:
      "Playbooks on AI governance, collaboration, prompt management, and operations.",
    url: "https://www.dispatchvault.com/blog",
    publisher: { "@type": "Organization", name: "Dispatch" },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://www.dispatchvault.com/blog/${p.slug}`,
      datePublished: p.dateISO,
      author: { "@type": "Organization", name: "Dispatch" },
    })),
  }

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <Navbar />
      <BlogIndex posts={posts} featured={featured} categories={categories} />
      <Footer />
    </div>
  )
}
