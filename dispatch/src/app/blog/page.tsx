import type { Metadata } from "next"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { posts, categories, getFeaturedPost } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog — AEO, AI Search & GEO Guides | Dispatch",
  description:
    "Practical guides on answer engine optimization (AEO), generative engine optimization (GEO), and getting your content cited by ChatGPT, Perplexity, and Google AI Overviews.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Dispatch Blog — AEO, AI Search & GEO Guides",
    description:
      "Practical guides on AEO, GEO, and getting cited by AI answer engines.",
    url: "/blog",
    type: "website",
  },
}

export default function BlogPage() {
  const featured = getFeaturedPost()
  // Keep the featured post out of the grid below to avoid duplication.
  const gridPosts = posts.filter((p) => p.slug !== featured.slug)

  // Blog (ItemList) structured data to help search/answer engines understand
  // this is a hub of articles.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Dispatch Blog",
    description:
      "Guides on answer engine optimization (AEO), AI search, and generative engine optimization (GEO).",
    url: "https://www.dispatchvault.com/blog",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Navbar />
      <BlogIndex posts={gridPosts} featured={featured} categories={categories} />
      <Footer />
    </div>
  )
}
