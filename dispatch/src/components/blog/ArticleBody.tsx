import Link from "next/link"
import type { Block, CalloutVariant } from "@/lib/blog/types"
import { headingId } from "@/lib/blog/utils"
import { Diagram } from "./Diagrams"

const CALLOUT_STYLES: Record<
  CalloutVariant,
  { box: string; label: string; defaultTitle: string }
> = {
  info: {
    box: "border-[#bcdcf5] bg-[#eaf4fd]",
    label: "text-[#1f6fb2]",
    defaultTitle: "Note",
  },
  "best-practice": {
    box: "border-[#bfe3c8] bg-[#eef8f0]",
    label: "text-[#2f8a48]",
    defaultTitle: "Best Practice",
  },
  "common-mistake": {
    box: "border-[#f3c9b6] bg-[#fdf0ea]",
    label: "text-[#c0562a]",
    defaultTitle: "Common Mistake",
  },
  "key-takeaway": {
    box: "border-[#e7e08a] bg-[#fdfce6]",
    label: "text-[#8a7a1f]",
    defaultTitle: "Key Takeaway",
  },
}

function MidArticleCTA() {
  return (
    <aside className="my-12 rounded-3xl bg-[#141414] p-8 text-center sm:p-12">
      <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
        Ready to organize your company&apos;s AI?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
        Stop rebuilding prompts. Stop losing organizational knowledge. Create a
        shared AI operating system your whole team can run on.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/contact"
          className="inline-block rounded-2xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#141414] transition-all duration-200 hover:bg-[#EDECEC] active:scale-[0.98]"
        >
          Book a Demo
        </Link>
        <Link
          href="/"
          className="inline-block rounded-2xl border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/10"
        >
          Learn About Dispatch
        </Link>
      </div>
    </aside>
  )
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="mb-6 text-[17px] leading-[1.8] text-[#333]">
          {block.text}
        </p>
      )

    case "h2":
      return (
        <h2
          key={i}
          id={headingId(block.text)}
          className="mt-14 mb-5 scroll-mt-28 text-2xl font-extrabold leading-tight text-[#141414] sm:text-[28px]"
        >
          {block.text}
        </h2>
      )

    case "h3":
      return (
        <h3
          key={i}
          className="mt-10 mb-4 text-xl font-bold leading-snug text-[#141414]"
        >
          {block.text}
        </h3>
      )

    case "ul":
      return (
        <ul key={i} className="mb-6 space-y-3 pl-1">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="relative pl-7 text-[17px] leading-[1.75] text-[#333]"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[11px] h-2 w-2 rounded-full bg-[#141414]"
              />
              {item}
            </li>
          ))}
        </ul>
      )

    case "ol":
      return (
        <ol key={i} className="mb-6 space-y-3 pl-1">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="relative pl-9 text-[17px] leading-[1.75] text-[#333]"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#141414] text-[12px] font-bold text-white"
              >
                {j + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )

    case "checklist":
      return (
        <div
          key={i}
          className="my-8 rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] p-6 sm:p-7"
        >
          {block.title && (
            <p className="mb-4 text-[15px] font-bold text-[#141414]">
              {block.title}
            </p>
          )}
          <ul className="space-y-3">
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-start gap-3 text-[16px] leading-[1.6] text-[#333]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 border-[#bbb] bg-white"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )

    case "faq":
      return (
        <div key={i} className="my-8 space-y-3">
          {block.items.map((qa, j) => (
            <details
              key={j}
              className="group rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[18px] font-bold text-[#141414]">
                {qa.q}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#999] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-[16px] leading-[1.75] text-[#444]">
                {qa.a}
              </p>
            </details>
          ))}
        </div>
      )

    case "table":
      return (
        <div key={i} className="my-8">
          {block.title && (
            <p className="mb-3 text-[15px] font-bold text-[#141414]">
              {block.title}
            </p>
          )}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E5E3]">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="bg-[#141414] text-white">
                  {block.headers.map((h, j) => (
                    <th key={j} className="px-5 py-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr
                    key={r}
                    className={r % 2 === 0 ? "bg-white" : "bg-[#F7F7F6]"}
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-5 py-4 align-top leading-relaxed text-[#333] ${
                          c === 0 ? "font-semibold text-[#141414]" : ""
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case "pullquote":
      return (
        <blockquote
          key={i}
          className="my-12 border-l-4 border-[#141414] pl-6 text-[24px] font-extrabold leading-[1.4] tracking-tight text-[#141414] sm:text-[28px]"
        >
          {block.text}
          {block.cite && (
            <cite className="mt-3 block text-sm font-medium not-italic text-[#999]">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      )

    case "callout": {
      const s = CALLOUT_STYLES[block.variant]
      return (
        <div key={i} className={`my-8 rounded-2xl border p-6 ${s.box}`}>
          <p
            className={`mb-2 text-[12px] font-bold uppercase tracking-[0.1em] ${s.label}`}
          >
            {block.title ?? s.defaultTitle}
          </p>
          <p className="text-[16px] leading-[1.75] text-[#333]">{block.text}</p>
        </div>
      )
    }

    case "diagram":
      return <Diagram key={i} name={block.name} caption={block.caption} />

    case "cta":
      return <MidArticleCTA key={i} />

    default:
      return null
  }
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return <div>{blocks.map((b, i) => renderBlock(b, i))}</div>
}
