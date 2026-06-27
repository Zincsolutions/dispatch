import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { ArticleBody } from "@/components/blog/ArticleBody"
import { TableOfContents } from "@/components/blog/TableOfContents"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { BlogMedia, CategoryBadge } from "@/components/blog/shared"
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/blog"
import { extractToc, articleStats } from "@/lib/blog/utils"

const SITE = "https://www.dispatchvault.com"

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Not found — Dispatch" }

  const url = `${SITE}/blog/${post.slug}`
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      type: "article",
      publishedTime: post.dateISO,
      modifiedTime: post.lastUpdated ?? post.dateISO,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  }
}

function formatDate(iso: string): string {
  // Stable, locale-independent formatting for the "updated" line.
  const [y, m, d] = iso.split("-").map(Number)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return `${months[m - 1]} ${d}, ${y}`
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)
  const url = `${SITE}/blog/${post.slug}`
  const toc = extractToc(post.body)
  const { words, readTime } = articleStats(post.body)
  const updated = post.lastUpdated ?? post.dateISO

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.dateISO,
    dateModified: updated,
    wordCount: words,
    articleSection: post.category,
    author: { "@type": "Organization", name: "Dispatch", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Dispatch",
      logo: { "@type": "ImageObject", url: `${SITE}/dispatch-logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Resource Center", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 2, name: post.category, item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  }

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dispatch",
    url: SITE,
    logo: `${SITE}/dispatch-logo.svg`,
    description: "The system of record for AI.",
  }

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      {[articleLd, faqLd, breadcrumbLd, organizationLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <Navbar />

      <article className="pt-32 sm:pt-36">
        {/* Hero */}
        <header className="mx-auto max-w-3xl px-6 text-center">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#666] transition-colors hover:text-[#141414]"
          >
            <span aria-hidden="true">←</span> Resource Center
          </Link>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
            <CategoryBadge category={post.category} />
            <span className="text-[13px] text-[#999]">
              <time dateTime={post.dateISO}>{post.date}</time> · {readTime}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-[#141414] sm:text-[44px] sm:leading-[1.1]">
            {post.title}
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-[#999]">
            <span className="font-medium text-[#333]">{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {formatDate(updated)}</span>
          </div>
        </header>

        {/* Hero image */}
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <BlogMedia
            category={post.category}
            big
            className="aspect-[16/8] rounded-3xl"
          />
        </div>

        {/* Body + TOC */}
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} />
              </div>
            </aside>

            <div className="mx-auto max-w-3xl lg:mx-0">
              <div className="mb-8 flex items-center justify-between border-b border-[#E5E5E3] pb-6">
                <ShareButtons url={url} title={post.title} />
                <span className="hidden text-[13px] text-[#999] sm:inline">
                  {words.toLocaleString()} words
                </span>
              </div>

              <ArticleBody blocks={post.body} />

              {/* Author card */}
              <div className="mt-14 flex items-center gap-4 rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141414]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/dispatch-logo-footer.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-auto"
                  />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#141414]">
                    {post.author}
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#666]">
                    Writing about AI governance, collaboration, and operations —
                    helping teams turn AI from scattered experiments into shared
                    organizational capability.
                  </p>
                </div>
              </div>

              {/* Keep exploring — internal links */}
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                <span className="font-semibold text-[#141414]">
                  Explore Dispatch:
                </span>
                <Link href="/" className="text-[#666] hover:text-[#141414]">
                  Overview
                </Link>
                <Link href="/pricing" className="text-[#666] hover:text-[#141414]">
                  Pricing
                </Link>
                <Link href="/contact" className="text-[#666] hover:text-[#141414]">
                  Book a Demo
                </Link>
                <Link href="/blog" className="text-[#666] hover:text-[#141414]">
                  Resource Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[#E5E5E3] bg-[#F7F7F6]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="mb-8 text-2xl font-extrabold text-[#141414]">
              Related articles
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <BlogMedia category={r.category} className="aspect-[16/10]" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#999]">
                      {r.category}
                    </p>
                    <h3 className="text-[17px] font-bold leading-snug text-[#141414]">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Stay ahead of organizational AI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
            Get new playbooks on AI governance, collaboration, and operations as
            we publish them.
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

      <Footer />
    </div>
  )
}
