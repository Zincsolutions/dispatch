import type { BlogCategory } from "@/lib/blog/types"

// Accent color per category — used for badges and the placeholder media stripe.
export const CATEGORY_ACCENT: Record<BlogCategory, string> = {
  "AI Governance": "#9DDAD7",
  "AI Collaboration": "#F5B48C",
  "Prompt Management": "#FDFF60",
  "AI Adoption": "#C9B6F5",
  "Knowledge Management": "#9DD9A8",
  "Context Engineering": "#F59DB4",
  "AI Strategy": "#9DB4DA",
}

export function CategoryBadge({
  category,
  className = "",
}: {
  category: BlogCategory
  className?: string
}) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#141414] ${className}`}
      style={{ backgroundColor: CATEGORY_ACCENT[category] }}
    >
      {category}
    </span>
  )
}

// Branded light-gray placeholder shown in place of a hero/card image. Reads as
// an intentional, on-brand placeholder (not a broken image) until real artwork
// is added.
export function BlogMedia({
  category,
  className = "",
  big = false,
}: {
  category: BlogCategory
  className?: string
  big?: boolean
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[#EDECEC] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4F3F3] to-[#E2E1E1]" />
      {/* faint geometric motif */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-3xl border border-black/[0.04]" />
      <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full border border-black/[0.04]" />
      <span
        className="absolute bottom-0 left-0 h-1.5 w-full"
        style={{ backgroundColor: CATEGORY_ACCENT[category] }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dispatch-logo.svg"
          alt=""
          aria-hidden="true"
          className={big ? "h-7 opacity-25" : "h-5 opacity-25"}
        />
        <span
          className={`font-bold uppercase tracking-[0.18em] text-[#9a9a9a] ${
            big ? "text-sm" : "text-[11px]"
          }`}
        >
          {category}
        </span>
      </div>
    </div>
  )
}
