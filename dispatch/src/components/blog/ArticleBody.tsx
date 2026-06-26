import type { Block } from "@/lib/blog/types"

// Stable slug for an <h2> so we could deep-link / build a TOC later.
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="text-[17px] leading-[1.8] text-[#333] mb-6">
          {block.text}
        </p>
      )

    case "h2":
      return (
        <h2
          key={i}
          id={headingId(block.text)}
          className="scroll-mt-28 text-2xl sm:text-[28px] font-extrabold text-[#141414] leading-tight mt-14 mb-5"
        >
          {block.text}
        </h2>
      )

    case "h3":
      return (
        <h3
          key={i}
          className="text-xl font-bold text-[#141414] leading-snug mt-10 mb-4"
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
        <ol key={i} className="mb-6 space-y-3 pl-1 counter-reset-list">
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
        <div
          key={i}
          className="my-8 overflow-x-auto rounded-2xl border border-[#E5E5E3]"
        >
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
      )

    case "quote":
      return (
        <blockquote
          key={i}
          className="my-8 border-l-4 border-[#141414] pl-6 text-[20px] font-medium italic leading-relaxed text-[#141414]"
        >
          {block.text}
          {block.cite && (
            <cite className="mt-3 block text-sm font-normal not-italic text-[#999]">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      )

    case "callout":
      return (
        <div
          key={i}
          className="my-8 rounded-2xl border border-[#E5E5E3] bg-[#FDFF60]/20 p-6"
        >
          {block.title && (
            <p className="mb-2 text-[15px] font-bold uppercase tracking-wide text-[#141414]">
              {block.title}
            </p>
          )}
          <p className="text-[16px] leading-[1.75] text-[#333]">{block.text}</p>
        </div>
      )

    default:
      return null
  }
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return <div>{blocks.map((b, i) => renderBlock(b, i))}</div>
}
