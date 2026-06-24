"use client"

import { StaggerContainer, StaggerItem, AnimateOnScroll } from "./AnimateOnScroll"
import { Layers, ShieldCheck, TrendingUp } from "lucide-react"

const pillars = [
  {
    icon: Layers,
    title: "Organize",
    body: "Centralize prompts, agents, workflows, images, brand context, SOPs, and AI foundation assets — one structured system your whole organization can access.",
    iconBg: "rgba(157,218,215,0.2)",
  },
  {
    icon: ShieldCheck,
    title: "Govern",
    body: "Manage approvals, policies, review queues, tool registries, and organizational standards — so the right assets get used the right way.",
    iconBg: "rgba(253,255,96,0.18)",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    body: "Turn successful AI efforts into repeatable systems that can be reused and improved across departments.",
    iconBg: "rgba(245,180,140,0.2)",
  },
]

export function ValuePillars() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-20">
            One system to{" "}
            <span className="gradient-text">organize, govern, and scale</span> AI.
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
                <h3 className="text-xl font-bold text-[#141414] mb-3">{pillar.title}</h3>
                <p className="text-[15px] text-[#666] leading-relaxed">{pillar.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
