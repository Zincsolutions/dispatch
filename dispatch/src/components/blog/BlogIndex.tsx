"use client"

import { useState } from "react"
import Link from "next/link"
import type { BlogPost, BlogCategory } from "@/lib/blog/types"

const CATEGORY_STYLES: Record<BlogCategory, string> = {
  "AEO Fundamentals": "bg-[#141414] text-white",
  "AI Search Engines": "bg-[#9DDAD7] text-[#141414]",
  "Content Strategy": "bg-[#F5B48C] text-[#141414]",
  "Technical & Measurement": "bg-[#FDFF60] text-[#141414]",
}

function CategoryBadge({ category }: { category: BlogCategory }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${CATEGORY_STYLES[category]}`}
    >
      {category}
    </span>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[#EDECEC]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
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
          <span>{post.readTime}</span>
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

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active)

  const tabs: (BlogCategory | "All")[] = ["All", ...categories]

  return (
    <main className="bg-white pt-32 sm:pt-36">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 pb-12 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
          Ideas &amp; Insights
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
          The Dispatch Blog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#666]">
          Practical guides on answer engine optimization, AI search, and
          building content that gets cited by ChatGPT, Perplexity, and Google AI
          Overviews.
        </p>
      </header>

      {/* Featured post */}
      <section className="mx-auto max-w-7xl px-6">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:grid-cols-2"
        >
          <div className="aspect-[16/10] overflow-hidden bg-[#EDECEC] md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
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
              <span className="font-medium text-[#333]">{featured.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={featured.dateISO}>{featured.date}</time>
              <span aria-hidden="true">·</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Category toggle */}
      <nav
        aria-label="Blog categories"
        className="sticky top-[72px] z-30 mt-14 border-y border-[#E5E5E3] bg-white/95 backdrop-blur-xl"
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
            No articles in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA — mirrors Zinc's email-subscribe block */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Turn AI chaos into a system your team can run on.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
            Dispatch centralizes the prompts, workflows, and content that power
            your AEO strategy — so your best work compounds instead of
            scattering.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </main>
  )
}
