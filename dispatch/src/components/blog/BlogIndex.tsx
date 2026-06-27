"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import type { BlogPost, BlogCategory } from "@/lib/blog/types"
import { articleStats } from "@/lib/blog/utils"
import { BlogMedia, CategoryBadge } from "./shared"

function readTimeOf(post: BlogPost) {
  return articleStats(post.body).readTime
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      <BlogMedia category={post.category} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <CategoryBadge category={post.category} />
        </div>
        <h3 className="mb-3 text-[19px] font-bold leading-snug text-[#141414] transition-colors group-hover:text-[#333]">
          {post.title}
        </h3>
        <p className="mb-5 flex-1 text-[14px] leading-relaxed text-[#666]">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 text-[13px] text-[#999]">
          <time dateTime={post.dateISO}>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{readTimeOf(post)}</span>
        </div>
      </div>
    </Link>
  )
}

export function BlogIndex({
  posts,
  featured,
  categories,
}: {
  posts: BlogPost[]
  featured: BlogPost
  categories: BlogCategory[]
}) {
  const [active, setActive] = useState<BlogCategory | "All">("All")
  const [query, setQuery] = useState("")

  const tabs: (BlogCategory | "All")[] = ["All", ...categories]
  const isBrowsing = active !== "All" || query.trim() !== ""

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchesCat = active === "All" || p.category === active
      const matchesQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [posts, active, query])

  return (
    <main className="bg-white pt-32 sm:pt-36">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 pb-10 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
          Resource Center
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
          Building the AI-Powered Organization
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#666]">
          Practical guidance on AI governance, collaboration, and operations —
          for leaders turning scattered AI use into a system their whole company
          can run on.
        </p>
      </header>

      {/* Search */}
      <div className="mx-auto mb-8 max-w-xl px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the resource center..."
            aria-label="Search articles"
            className="w-full rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] py-3.5 pl-11 pr-4 text-[15px] text-[#141414] outline-none transition-colors placeholder:text-[#999] focus:border-[#141414] focus:bg-white"
          />
        </div>
      </div>

      {/* Featured post — only when not actively browsing */}
      {!isBrowsing && (
        <section className="mx-auto max-w-7xl px-6">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:grid-cols-2"
          >
            <BlogMedia
              category={featured.category}
              big
              className="aspect-[16/10] md:aspect-auto"
            />
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="mb-5 flex items-center gap-3">
                <CategoryBadge category={featured.category} />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#999]">
                  Featured
                </span>
              </div>
              <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#141414] sm:text-[32px]">
                {featured.title}
              </h2>
              <p className="mb-6 text-[16px] leading-relaxed text-[#666]">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-[13px] text-[#999]">
                <span className="font-medium text-[#333]">
                  {featured.author}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={featured.dateISO}>{featured.date}</time>
                <span aria-hidden="true">·</span>
                <span>{readTimeOf(featured)}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Category toggle */}
      <nav
        aria-label="Article categories"
        className="sticky top-[72px] z-30 mt-12 border-y border-[#E5E5E3] bg-white/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-200 ${
                active === tab
                  ? "bg-[#141414] text-white"
                  : "bg-[#EDECEC] text-[#333] hover:bg-[#E0DFDF]"
              }`}
              aria-pressed={active === tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Post grid */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-[#999]">
            No articles match your search yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Stay ahead of organizational AI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
            Get new playbooks on AI governance, collaboration, and operations
            delivered as we publish them.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@company.com"
              aria-label="Email address"
              className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-[15px] text-white outline-none placeholder:text-white/40 focus:border-white/40"
            />
            <button
              type="submit"
              className="rounded-2xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
