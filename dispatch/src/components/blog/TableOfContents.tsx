"use client"

import { useEffect, useState } from "react"
import type { TocEntry } from "@/lib/blog/utils"

export function TableOfContents({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "")

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#999]">
        On this page
      </p>
      <ul className="space-y-2.5 border-l border-[#E5E5E3]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 pl-4 leading-snug transition-colors duration-150 ${
                active === item.id
                  ? "border-[#141414] font-semibold text-[#141414]"
                  : "border-transparent text-[#777] hover:text-[#141414]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
