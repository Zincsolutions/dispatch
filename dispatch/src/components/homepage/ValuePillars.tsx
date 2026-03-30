"use client"

import { StaggerContainer, StaggerItem, AnimateOnScroll } from "./AnimateOnScroll"
import { Layers, TrendingUp, Shield } from "lucide-react"

const pillars = [
  {
    icon: Layers,
    title: "Organize",
    subhead: "Bring everything into one system.",
    body: "Prompts, workflows, tools, brand assets, and outputs — all in one structured platform your whole team can access. No more hunting through chats, docs, and shared drives.",
    closer: "The days of 'Where's that prompt?' are over.",
    iconBg: "rgba(157,218,215,0.2)",
  },
  {
    icon: TrendingUp,
    title: "Amplify",
    subhead: "Scale what works. Stop rebuilding what you've already perfected.",
    body: "When one team finds a workflow that delivers, Dispatch helps you turn it into a repeatable system the whole organization can use. Rate what performs, surface best practices, and let your wins compound.",
    closer: "Your best work should multiply, not evaporate.",
    iconBg: "rgba(253,255,96,0.15)",
  },
  {
    icon: Shield,
    title: "Protect",
    subhead: "A secure home for your most valuable AI assets.",
    body: "Your prompts, proprietary workflows, and brand-critical assets deserve better than a shared Google Doc. Dispatch provides a centralized, controlled environment — a vault at the core of your workspace.",
    closer: "Think of it as a workspace with a vault at its core.",
    iconBg: "rgba(245,180,140,0.2)",
  },
]

export function ValuePillars() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-20">
            One platform to{" "}
            <span className="gradient-text">organize, amplify, and protect</span>{" "}
            your AI.
          </h2>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.12}>
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="group relative bg-white rounded-2xl p-8 border border-[#E5E5E3] hover:border-[#ccc] transition-all duration-300 h-full hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: pillar.iconBg }}
                >
                  <pillar.icon className="h-6 w-6 text-[#141414]" />
                </div>
                <h3 className="text-xl font-bold text-[#141414] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[15px] font-semibold text-[#333] mb-4">
                  {pillar.subhead}
                </p>
                <p className="text-[15px] text-[#666] leading-relaxed mb-6">
                  {pillar.body}
                </p>
                <p className="text-[15px] font-semibold text-[#141414] italic">
                  {pillar.closer}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
