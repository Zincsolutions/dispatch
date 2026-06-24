"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { Layers, Workflow, Bot, FileText, ShieldCheck, Eye } from "lucide-react"

const points = [
  { icon: Layers, text: "Centralized AI knowledge" },
  { icon: Workflow, text: "Approved workflows" },
  { icon: Bot, text: "Governed agents" },
  { icon: FileText, text: "Brand and context assets" },
  { icon: ShieldCheck, text: "Review and approval process" },
  { icon: Eye, text: "Organizational visibility" },
]

export function MoreThanPromptLibrary() {
  return (
    <section className="py-32 bg-[#141414]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-white leading-tight mb-6">
            More than a prompt library.
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <p className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto mb-16">
            Prompt libraries store ideas. Dispatch helps your organization
            manage the full system around AI: knowledge, workflows, agents,
            governance, approvals, and operational standards.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left" staggerDelay={0.06}>
          {points.map((point) => (
            <StaggerItem key={point.text}>
              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5 hover:bg-white/[0.08] transition-colors duration-200 h-full">
                <div className="rounded-lg bg-[#FDFF60]/10 p-2 flex-shrink-0">
                  <point.icon className="h-5 w-5 text-[#FDFF60]" />
                </div>
                <p className="text-[15px] font-medium text-white/80">{point.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
