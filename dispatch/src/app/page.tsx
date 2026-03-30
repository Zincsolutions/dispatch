import { Navbar } from "@/components/homepage/Navbar"
import { HeroSection } from "@/components/homepage/HeroSection"
import { ProductShowcase } from "@/components/homepage/ProductShowcase"
import { ProblemSection } from "@/components/homepage/ProblemSection"
import { ValuePillars } from "@/components/homepage/ValuePillars"
import { FeatureSection } from "@/components/homepage/FeatureSection"
import { IntegrationsPanel } from "@/components/homepage/IntegrationsPanel"
import { UseCases } from "@/components/homepage/UseCases"
import { SecuritySection } from "@/components/homepage/SecuritySection"
import { SocialProof } from "@/components/homepage/SocialProof"
import { BlogSection } from "@/components/homepage/BlogSection"
import { FinalCTA } from "@/components/homepage/FinalCTA"
import { Footer } from "@/components/homepage/Footer"

const features = [
  {
    headline: "Stop guessing. Start engineering your prompts.",
    body: "Create, refine, and share prompts that consistently produce high-quality output — stored in a centralized system your team can trust.",
    soWhat:
      "Without this, your best prompts live in one person's ChatGPT history. When they leave, take PTO, or just forget — that knowledge vanishes. Dispatch means your team's prompt intelligence is an organizational asset, not a personal secret.",
    metric: 60,
    metricSuffix: "%",
    metricDesc: "less time spent finding or rebuilding prompts",
    screenshotLabel: "Prompt Library Interface",
    screenshotGradient: "from-dispatch-blue/30 to-dispatch-teal/20",
  },
  {
    headline: "AI imagery that actually stays on brand.",
    body: "Manage prompts, references, and outputs so your visuals are consistent, repeatable, and aligned — without losing track of source inputs.",
    soWhat:
      "Every brand team has experienced this: someone generates a great AI image, but nobody can recreate it because the prompt is gone. Dispatch keeps the recipe next to the result — so your team can reproduce, iterate, and maintain visual consistency at scale.",
    metric: 100,
    metricSuffix: "%",
    metricDesc: "of source prompts preserved with outputs",
    screenshotLabel: "Image Management System",
    screenshotGradient: "from-purple-500/20 to-dispatch-blue/20",
  },
  {
    headline: "Turn AI into a repeatable process.",
    body: "Build structured workflows that connect tools and steps into systems your team can follow — and scale with confidence.",
    soWhat:
      "Right now, your top performer's process lives in their head. If they're sick on launch day, the team scrambles. Dispatch externalizes expertise into documented, shareable workflows — so your team's capability doesn't depend on any single person.",
    metric: 3,
    metricSuffix: "x",
    metricDesc: "faster onboarding to AI processes",
    screenshotLabel: "Workflow Builder",
    screenshotGradient: "from-dispatch-teal/20 to-emerald-500/20",
  },
  {
    headline: "Finally know what works.",
    body: "Rate and refine prompts, workflows, and tools so your best-performing systems rise to the top.",
    soWhat:
      "Most teams have no idea which AI processes actually perform and which waste time. Dispatch surfaces this — so you double down on what delivers and stop investing in what doesn't. That's how AI becomes a compounding advantage instead of a cost center.",
    metric: 2,
    metricSuffix: "x",
    metricDesc: "improvement in output quality from rated workflows",
    screenshotLabel: "Ratings Dashboard",
    screenshotGradient: "from-dispatch-blue/20 to-indigo-500/20",
  },
]

export default function HomePage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)]">
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <ProblemSection />
      <ValuePillars />
      {features.map((feature, i) => (
        <FeatureSection key={i} index={i} {...feature} />
      ))}
      <IntegrationsPanel />
      <UseCases />
      <SecuritySection />
      <SocialProof />
      <BlogSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
