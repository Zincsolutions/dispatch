import { AnimateOnScroll } from "@/components/homepage/AnimateOnScroll"

export function PricingPhilosophy() {
  return (
    <section className="py-24 bg-[#EDECEC]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] leading-tight mb-6">
            Pricing that scales with your AI footprint.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.08}>
          <p className="text-lg text-[#555] leading-relaxed">
            Dispatch is not priced like traditional seat-based software. Your value comes from
            the AI assets your organization manages: context, prompts, agents, workflows, image
            records, governance rules, and tool standards. Add the people who need access, then
            scale as your AI operating system grows.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
