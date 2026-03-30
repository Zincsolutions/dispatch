"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { Shield, Eye, Home, Link } from "lucide-react"

const items = [
  { icon: Shield, text: "Centralized access to prompts, workflows, and assets", iconBg: "rgba(157,218,215,0.2)" },
  { icon: Eye, text: "Clear visibility into how AI is being used across teams", iconBg: "rgba(253,255,96,0.15)" },
  { icon: Home, text: "A reliable home for proprietary and sensitive work", iconBg: "rgba(245,180,140,0.2)" },
  { icon: Link, text: "Reduced reliance on fragmented, untracked tools", iconBg: "rgba(157,218,215,0.2)" },
]

export function SecuritySection() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-5">
            Organized. Controlled. Protected.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.08}>
          <p className="text-lg text-[#666] max-w-2xl mx-auto mb-14 leading-relaxed">
            Dispatch gives your team a centralized environment for managing AI
            workflows — so important data, prompts, and assets aren&apos;t
            scattered across tools.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {items.map((item, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E3] flex gap-4 items-start text-left hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-[#ccc] transition-all duration-200">
                <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: item.iconBg }}>
                  <item.icon className="h-5 w-5 text-[#141414]" />
                </div>
                <p className="text-[15px] text-[#333] leading-relaxed pt-1">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimateOnScroll delay={0.2}>
          <p className="text-lg font-semibold text-[#141414] mt-14 italic">
            A shared workspace — with a vault at its core.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
