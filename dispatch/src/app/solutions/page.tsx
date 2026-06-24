import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/homepage/Navbar"
import { Footer } from "@/components/homepage/Footer"

export const metadata: Metadata = {
  title: "Solutions — Dispatch",
  description:
    "How teams use Dispatch to organize, share, and govern their AI operations.",
}

export default function SolutionsPage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)] bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-40 sm:pt-44 pb-40 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#999] mb-5">
          Solutions
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#141414] leading-tight mb-6">
          Solutions for every team.
        </h1>
        <p className="text-lg text-[#666] leading-relaxed mb-10">
          We&apos;re putting this page together. Soon you&apos;ll see how
          marketing, sales, operations, and agencies use Dispatch to organize,
          share, and govern the AI work they do every day.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-[#141414] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200"
        >
          Start Free Trial
        </Link>
      </main>
      <Footer />
    </div>
  )
}
