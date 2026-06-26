import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"
import { ArticleBody } from "@/components/blog/ArticleBody"
import {
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
} from "@/lib/blog"

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
      authors: [post.author],
      images: [{ url: post.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.image],
    },
  }
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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: `${SITE}${post.image}`,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { "@type": "Organization", name: "Dispatch", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Dispatch",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/dispatch-logo.svg`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
  }

  // FAQPage structured data — this is what makes Q&A content eligible to
  // surface directly in answer engines and rich results.
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
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: url },
    ],
  }

  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Navbar />

      <article className="pt-32 sm:pt-36">
        {/* Header */}
        <header className="mx-auto max-w-3xl px-6 text-center">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#666] transition-colors hover:text-[#141414]"
          >
            <span aria-hidden="true">←</span> All articles
          </Link>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#999]">
            {post.category}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#141414] sm:text-[44px] sm:leading-[1.1]">
            {post.title}
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[14px] text-[#999]">
            <span className="font-medium text-[#333]">{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.dateISO}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Hero image */}
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <div className="aspect-[16/8] overflow-hidden rounded-3xl bg-[#EDECEC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-6 py-16">
          <ArticleBody blocks={post.body} />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[#E5E5E3] bg-[#F7F7F6]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="mb-8 text-2xl font-extrabold text-[#141414]">
              Keep reading
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E3] bg-white transition-all duration-300 hover:border-[#ccc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#EDECEC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
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

      {/* CTA */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Make your AEO work compound.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
            Dispatch keeps the prompts, briefs, and content behind your answer
            engine strategy organized, shareable, and governed in one place.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
