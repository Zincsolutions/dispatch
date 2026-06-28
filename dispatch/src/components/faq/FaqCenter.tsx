"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Plus, ChevronRight } from "lucide-react"
import type { FaqCategory } from "@/lib/faq"

function AccordionItem({
  id,
  q,
  a,
  bullets,
  links,
  open,
  onToggle,
}: {
  id: string
  q: string
  a: string
  bullets?: string[]
  links?: { label: string; href: string }[]
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      id={id}
      className="scroll-mt-[150px] rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6]"
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start justify-between gap-4 px-6 py-5 text-left text-[18px] font-bold text-[#141414]"
      >
        {q}
        <Plus
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 text-[#999] transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-[16px] leading-[1.75] text-[#444]">{a}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-3 space-y-2">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="relative pl-6 text-[16px] leading-[1.6] text-[#444]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[10px] h-1.5 w-1.5 rounded-full bg-[#141414]"
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {links && links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
              {links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#141414] hover:underline"
                >
                  {l.label}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function FaqCenter({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("")
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "")

  const allIds = useMemo(
    () => categories.flatMap((c) => c.items.map((it) => it.id)),
    [categories],
  )

  // Open a question or scroll to a category from ?q= / #hash on first load.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("q")
    const hash = window.location.hash.replace("#", "")
    const target = param || hash
    if (!target) return
    if (allIds.includes(target)) {
      setOpenIds(new Set([target]))
    }
    // Defer so the (now-open) target is in the DOM before scrolling.
    const t = setTimeout(() => {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 120)
    return () => clearTimeout(t)
  }, [allIds])

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return categories
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            it.q.toLowerCase().includes(q) ||
            it.a.toLowerCase().includes(q) ||
            (it.bullets?.some((b) => b.toLowerCase().includes(q)) ?? false),
        ),
      }))
      .filter((c) => c.items.length > 0)
  }, [categories, q])

  // Scroll-spy: highlight the category pill for the section in view.
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveCat(visible[0].target.id.replace("cat-", ""))
      },
      { rootMargin: "-150px 0px -70% 0px", threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categories, filtered])

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = () => setOpenIds(new Set(allIds))
  const collapseAll = () => setOpenIds(new Set())

  return (
    <main className="bg-white pt-32 sm:pt-36">
      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
          Resource Center
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-[#141414] sm:text-5xl">
          AI Knowledge Center
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#666]">
          Answers to the questions business leaders, operations, marketing, HR,
          and IT teams ask when organizing AI across a company - from AI
          operating systems and governance to prompt management and team
          collaboration.
        </p>

        {/* Search */}
        <div className="relative mx-auto mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the knowledge center..."
            aria-label="Search FAQs"
            className="w-full rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] py-3.5 pl-11 pr-4 text-[15px] text-[#141414] outline-none transition-colors placeholder:text-[#999] focus:border-[#141414] focus:bg-white"
          />
        </div>
      </header>

      {/* Sticky category nav + expand controls */}
      <div className="sticky top-[72px] z-30 mt-12 border-y border-[#E5E5E3] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          <nav
            aria-label="FAQ categories"
            className="flex flex-1 gap-2 overflow-x-auto"
          >
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  activeCat === c.id && !q
                    ? "bg-[#141414] text-white"
                    : "bg-[#EDECEC] text-[#333] hover:bg-[#E0DFDF]"
                }`}
              >
                {c.title}
              </a>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              onClick={expandAll}
              className="text-[13px] font-semibold text-[#666] hover:text-[#141414]"
            >
              Expand all
            </button>
            <span className="text-[#ddd]">|</span>
            <button
              onClick={collapseAll}
              className="text-[13px] font-semibold text-[#666] hover:text-[#141414]"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-3xl px-6 py-14">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-[#999]">
            No questions match your search.
          </p>
        ) : (
          filtered.map((c) => (
            <section
              key={c.id}
              id={c.id}
              className="scroll-mt-[150px] pb-16"
            >
              {/* Inner id used by the scroll-spy observer. */}
              <div id={`cat-${c.id}`}>
                <h2 className="text-2xl font-extrabold text-[#141414] sm:text-3xl">
                  {c.title}
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#666]">
                  {c.intro}
                </p>
              </div>

              <div className="mt-7 space-y-3">
                {c.items.map((it) => (
                  <AccordionItem
                    key={it.id}
                    id={it.id}
                    q={it.q}
                    a={it.a}
                    bullets={it.bullets}
                    links={it.links}
                    open={openIds.has(it.id)}
                    onToggle={() => toggle(it.id)}
                  />
                ))}
              </div>

              {/* Per-category CTA */}
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] px-6 py-5 sm:flex-row">
                <p className="text-[15px] font-semibold text-[#141414]">
                  Still have questions about {c.title.toLowerCase()}?
                </p>
                <div className="flex shrink-0 gap-3">
                  <Link
                    href="/contact"
                    className="rounded-xl bg-[#141414] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
                  >
                    Book a demo
                  </Link>
                  <Link
                    href="/blog"
                    className="rounded-xl border border-[#E5E5E3] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#EDECEC]"
                  >
                    Resources
                  </Link>
                </div>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Page CTA */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to organize your company&apos;s AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
            Turn scattered prompts and AI knowledge into a system your whole
            team can run on.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-block rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
            >
              Book a Demo
            </Link>
            <Link
              href="/pricing"
              className="inline-block rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
