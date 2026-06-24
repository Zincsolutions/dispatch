import Link from "next/link"

export function PricingHero() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#666] font-medium mb-6">
          Pricing
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-[#141414] leading-[1.1] tracking-tight mb-7 max-w-4xl mx-auto">
          Pick the plan that fits your <span className="gradient-text">AI operations</span>.
        </h1>
        <p className="text-lg md:text-xl text-[#666] max-w-3xl mx-auto mb-5 leading-relaxed">
          Start free, then scale Dispatch across your team or organization as your AI
          workflows, assets, agents, and governance needs grow.
        </p>
        <p className="text-[15px] font-medium text-[#999] mb-10">
          Annual billing saves up to 20%.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup?plan=personal"
            className="bg-[#141414] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(20,20,20,0.2)]"
          >
            Get Started Free
          </Link>
          <Link
            href="/contact?plan=enterprise"
            className="border border-[#141414]/20 text-[#141414] px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#141414]/[0.04] hover:border-[#141414]/30 active:scale-[0.98] transition-all duration-200"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  )
}
