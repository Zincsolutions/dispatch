"use client"

import { Library, Users, ShieldCheck, Check, type LucideIcon } from "lucide-react"
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"

type Pillar = {
  key: string
  title: string
  copy: string
  highlights: string[]
  icon: LucideIcon
  iconBg: string
  check: string
  featured?: boolean
}

const pillars: Pillar[] = [
  {
    key: "organize",
    title: "Organize",
    copy: "Centralize prompts, AI images, agents, workflows, and AI Foundation assets in one searchable system.",
    highlights: [
      "Prompt Library",
      "AI Image Library",
      "Agents & GPTs",
      "Workflows & Loops",
      "AI Foundation",
    ],
    icon: Library,
    iconBg: "rgba(157,218,215,0.25)", // teal
    check: "#4FA8A2",
  },
  {
    key: "share",
    title: "Share",
    copy: "Give teams access to approved resources, reusable workflows, and proven AI processes.",
    highlights: [
      "Shared libraries",
      "Team access",
      "Reusable assets",
      "Searchable knowledge",
      "Cross-team visibility",
    ],
    icon: Users,
    iconBg: "rgba(245,180,140,0.25)", // peach
    check: "#D98A52",
  },
  {
    key: "govern",
    title: "Govern",
    copy: "Create standards, approvals, policies, and accountability without slowing innovation.",
    highlights: ["Review queues", "SOPs", "Policies", "Tool registry", "Approvals"],
    icon: ShieldCheck,
    iconBg: "rgba(253,255,96,0.45)", // yellow — subtle differentiator
    check: "#C9A227",
    featured: true,
  },
]

export function OrganizeShareGovern() {
  return (
    <section className="bg-[#F8F8F8] py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-6">
              Organize. Share. Govern.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <p className="text-lg text-[#666] leading-relaxed">
              Dispatch helps your organization capture what works, make it
              accessible across teams, and scale AI with consistency and control.
            </p>
          </AnimateOnScroll>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.12}
        >
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.key}>
              <div
                className={`group h-full rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                  pillar.featured
                    ? "bg-[#FDFCF4] border border-[#EAE3BF] shadow-[0_12px_40px_rgba(20,20,20,0.05)] hover:shadow-[0_28px_64px_rgba(20,20,20,0.10)]"
                    : "bg-white border border-[#E8E8E6] shadow-[0_8px_30px_rgba(20,20,20,0.04)] hover:shadow-[0_28px_64px_rgba(20,20,20,0.10)]"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
                  style={{ background: pillar.iconBg }}
                >
                  <pillar.icon className="h-7 w-7 text-[#141414]" strokeWidth={1.75} />
                </div>

                <h3 className="text-2xl font-bold text-[#141414] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#666] mb-7">
                  {pillar.copy}
                </p>

                <div className="h-px bg-[#141414]/[0.07] mb-6" />

                <ul className="space-y-3">
                  {pillar.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-3 text-[15px] font-medium text-[#333]"
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${pillar.check}1f` }}
                      >
                        <Check
                          className="h-3 w-3"
                          strokeWidth={3}
                          style={{ color: pillar.check }}
                        />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
