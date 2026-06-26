import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { posts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Resources — Dispatch",
  description:
    "Guides, templates, and best practices for organizing, sharing, and governing AI with Dispatch — including the Dispatch blog on AEO and AI search.",
}

export default function ResourcesPage() {
  const latest = posts.slice(0, 3)

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-40 pb-28 sm:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
            Resources
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
            Resources to help you build with AI.
          </h1>
          <p className="mb-12 text-lg leading-relaxed text-[#666]">
            Guides, templates, and best practices for organizing, sharing, and
            governing AI across your organization.
          </p>
        </div>

        {/* Blog link — primary resource */}
        <Link
          href="/blog"
          className="group grid overflow-hidden rounded-3xl border border-[#E5E5E3] bg-[#F7F7F6] transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:grid-cols-2"
        >
          <div className="aspect-[16/10] overflow-hidden bg-[#EDECEC] md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/blog/aeo-hero.png"
              alt="The Dispatch Blog"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#999]">
              The Dispatch Blog
            </p>
            <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#141414] sm:text-3xl">
              Ideas &amp; insights on AEO and AI search.
            </h2>
            <p className="mb-6 text-[16px] leading-relaxed text-[#666]">
              Practical guides on answer engine optimization, generative engine
              optimization, and getting your content cited by ChatGPT,
              Perplexity, and Google AI Overviews.
            </p>
            <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#141414] transition-all group-hover:gap-3">
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Latest posts */}
        <div className="mt-16">
          <div className="mb-7 flex items-end justify-between">
            <h3 className="text-xl font-bold text-[#141414]">Latest articles</h3>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#666] transition-colors hover:text-[#141414]"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {latest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
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
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#999]">
                    {post.category}
                  </p>
                  <h4 className="text-[17px] font-bold leading-snug text-[#141414]">
                    {post.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
