"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { ListChecks, FileCheck2, Wrench, BadgeCheck } from "lucide-react"

const features = [
  {
    icon: ListChecks,
    title: "Review Queues",
    text: "See which prompts, agents, workflows, and assets need approval.",
  },
  {
    icon: FileCheck2,
    title: "Policy Acknowledgements",
    text: "Ensure users understand and accept company AI standards.",
  },
  {
    icon: Wrench,
    title: "Tool Registry",
    text: "Track approved AI tools, usage rules, and governance status.",
  },
  {
    icon: BadgeCheck,
    title: "Approval Status",
    text: "Clearly mark assets as Approved, Draft, Experimental, or Needs Review.",
  },
]

export function GovernanceSection() {
  return (
    <section className="py-32 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-white leading-tight mb-6">
              Govern AI without slowing your team down.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Dispatch gives your organization the structure to review, approve,
              and manage AI assets before they&apos;re used across the company.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <StaggerContainer className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-6 hover:bg-white/[0.08] transition-colors duration-200 h-full">
                  <div className="rounded-lg bg-[#FDFF60]/10 p-2 w-fit mb-4">
                    <f.icon className="h-5 w-5 text-[#FDFF60]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-[15px] text-white/60 leading-relaxed">{f.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimateOnScroll delay={0.15}>
            <div
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
              style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/governance.jpg"
                alt="Dispatch governance overview — review queues, policy acknowledgements, and tool registry"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
