"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"

const tools = [
  "ChatGPT", "Claude", "Midjourney", "DALL·E", "Zapier",
  "n8n", "Notion", "Slack", "Google Docs", "Figma",
]

export function IntegrationsPanel() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-5">
            Works with the tools your team{" "}
            <span className="gradient-text">already uses</span>.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.08}>
          <p className="text-lg text-[#666] max-w-2xl mx-auto mb-14 leading-relaxed">
            From ChatGPT to Claude to Zapier — Dispatch brings your entire AI
            stack into one system.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14">
          {tools.map((tool) => (
            <StaggerItem key={tool}>
              <div className="h-12 px-6 rounded-xl bg-white border border-[#E5E5E3] flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.03)] opacity-60 hover:opacity-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-[#ccc] transition-all duration-200 cursor-default">
                <span className="text-sm font-medium text-[#333] whitespace-nowrap">{tool}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimateOnScroll delay={0.15}>
          <p className="text-lg font-semibold text-[#141414]">
            It doesn&apos;t replace your tools. It organizes them.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
