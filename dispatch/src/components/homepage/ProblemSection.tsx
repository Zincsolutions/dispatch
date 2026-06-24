"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { FileSearch, EyeOff, Shuffle, ShieldAlert } from "lucide-react"

const problems = [
  {
    icon: FileSearch,
    title: "Scattered Knowledge",
    text: "Prompts, workflows, and AI discoveries live across chats, docs, and individual accounts.",
  },
  {
    icon: EyeOff,
    title: "No Operational Visibility",
    text: "Leaders can't easily see what exists, what's approved, or what needs attention.",
  },
  {
    icon: Shuffle,
    title: "Inconsistent Outputs",
    text: "Teams use different prompts, standards, tools, and workflows without shared guidance.",
  },
  {
    icon: ShieldAlert,
    title: "Limited Governance",
    text: "Policies, approvals, and review processes are disconnected from daily AI work.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-32 bg-[#141414]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-white leading-tight mb-8">
            AI is spreading across your organization.
            <br className="hidden sm:block" />{" "}
            Most companies have no system for managing it.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <p className="text-lg text-white/60 leading-relaxed mb-4 max-w-2xl mx-auto">
            Prompts are being created. Agents are being tested. Workflows are
            being built. Images are being generated. But without a central
            system, the knowledge gets scattered, duplicated, or lost.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15}>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Dispatch gives your organization a place to capture what works,
            approve what matters, and scale AI with confidence.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-16 max-w-4xl mx-auto text-left">
          {problems.map((problem, i) => (
            <StaggerItem key={i}>
              <div className="flex gap-4 items-start rounded-2xl bg-white/[0.05] border border-white/[0.08] p-6 hover:bg-white/[0.08] transition-colors duration-200 h-full">
                <div className="rounded-lg bg-[#FDFF60]/10 p-2 flex-shrink-0">
                  <problem.icon className="h-5 w-5 text-[#FDFF60]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{problem.title}</h3>
                  <p className="text-[15px] text-white/60 leading-relaxed">{problem.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimateOnScroll delay={0.3}>
          <p className="text-xl sm:text-2xl font-bold text-white mt-16">
            AI is being used. But it isn&apos;t being{" "}
            <span className="gradient-text-dark">managed</span>.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
