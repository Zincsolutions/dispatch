import { Navbar } from "@/components/homepage/Navbar"
import { HeroSection } from "@/components/homepage/HeroSection"
import { EcosystemSection } from "@/components/homepage/EcosystemSection"
import { ProductShowcase } from "@/components/homepage/ProductShowcase"
import { ProblemSection } from "@/components/homepage/ProblemSection"
import { ValuePillars } from "@/components/homepage/ValuePillars"
import { FoundationSection } from "@/components/homepage/FoundationSection"
import { GovernanceSection } from "@/components/homepage/GovernanceSection"
import { AgentsWorkflowsSection } from "@/components/homepage/AgentsWorkflowsSection"
import { MoreThanPromptLibrary } from "@/components/homepage/MoreThanPromptLibrary"
import { CredibilitySection } from "@/components/homepage/CredibilitySection"
import { FeatureSection } from "@/components/homepage/FeatureSection"
import { IntegrationsPanel } from "@/components/homepage/IntegrationsPanel"
import { UseCases } from "@/components/homepage/UseCases"
import { SecuritySection } from "@/components/homepage/SecuritySection"
import { EarlyAccess } from "@/components/homepage/EarlyAccess"
import { BlogSection } from "@/components/homepage/BlogSection"
import { FinalCTA } from "@/components/homepage/FinalCTA"
import { Footer } from "@/components/homepage/Footer"

const features = [
  {
    headline: "Stop guessing. Start engineering your prompts.",
    body: "Create, refine, and share prompts that consistently produce high-quality output — then run them in ChatGPT or Claude with one click.",
    soWhat:
      "Without this, your best prompts live in one person's ChatGPT history. When they leave, take PTO, or just forget — that knowledge vanishes. Dispatch means your team's prompt intelligence is an organizational asset, not a personal secret.",
    screenshotSrc: "/screenshots/prompts.jpg",
    screenshotAlt: "Dispatch prompt library with categorized, approved prompts",
  },
  {
    headline: "AI imagery that actually stays on brand.",
    body: "Every image lives next to the prompt, style reference, and parameters that created it — so your visuals are consistent and repeatable.",
    soWhat:
      "Every brand team has experienced this: someone generates a great AI image, but nobody can recreate it because the prompt is gone. Dispatch keeps the recipe next to the result — so your team can reproduce, iterate, and maintain visual consistency at scale.",
    screenshotSrc: "/screenshots/library.jpg",
    screenshotAlt: "Dispatch brand library with image collections and sref recipes",
  },
  {
    headline: "Turn AI into a repeatable process.",
    body: "Build structured workflows that connect tools and steps into systems your team can follow — and scale with confidence.",
    soWhat:
      "Right now, your top performer's process lives in their head. If they're sick on launch day, the team scrambles. Dispatch externalizes expertise into documented, shareable workflows — so your team's capability doesn't depend on any single person.",
    screenshotSrc: "/screenshots/workflow-detail.jpg",
    screenshotAlt: "Dispatch workflow with documented step-by-step process",
  },
]

export default function HomePage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)]">
      <Navbar />
      <HeroSection />
      <EcosystemSection />
      <ProductShowcase />
      <ProblemSection />
      <ValuePillars />
      <FoundationSection />
      <GovernanceSection />
      <AgentsWorkflowsSection />
      {features.map((feature, i) => (
        <FeatureSection key={i} index={i} {...feature} />
      ))}
      <IntegrationsPanel />
      <UseCases />
      <SecuritySection />
      <EarlyAccess />
      <BlogSection />
      <MoreThanPromptLibrary />
      <CredibilitySection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
