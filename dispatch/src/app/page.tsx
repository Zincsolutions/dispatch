import { Navbar } from "@/components/homepage/Navbar"
import { HeroSection } from "@/components/homepage/HeroSection"
import { EcosystemSection } from "@/components/homepage/EcosystemSection"
import { CommandCenter } from "@/components/homepage/CommandCenter"
import { OrganizeShareGovern } from "@/components/homepage/OrganizeShareGovern"
import { FoundationSection } from "@/components/homepage/FoundationSection"
import { GovernanceSection } from "@/components/homepage/GovernanceSection"
import { Testimonial } from "@/components/homepage/Testimonial"
import { FinalCTA } from "@/components/homepage/FinalCTA"
import { Footer } from "@/components/homepage/Footer"

export default function HomePage() {
  return (
    <div className="font-[family-name:var(--font-dm-sans)]">
      <Navbar />
      <HeroSection />
      <EcosystemSection />
      <CommandCenter />
      <OrganizeShareGovern />
      <FoundationSection />
      <GovernanceSection />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  )
}
