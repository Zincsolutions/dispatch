"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { Repeat, Bot } from "lucide-react"

const statusStyles: Record<string, string> = {
  Approved: "text-emerald-700 bg-emerald-100",
  Experimental: "text-sky-700 bg-sky-100",
  "Needs Review": "text-orange-700 bg-orange-100",
  Draft: "text-[#666] bg-[#ECECEC]",
}

const cards = [
  { icon: Repeat, name: "AEO Visibility Loop", purpose: "Monitors and improves AI-search visibility.", status: "Approved", tag: "Marketing" },
  { icon: Repeat, name: "Website Optimization Loop", purpose: "Continuously refines page performance.", status: "Experimental", tag: "Marketing" },
  { icon: Repeat, name: "Brand Consistency Loop", purpose: "Keeps outputs aligned to brand standards.", status: "Approved", tag: "Brand" },
  { icon: Repeat, name: "Proposal Quality Loop", purpose: "Raises the bar on every proposal.", status: "Needs Review", tag: "Sales" },
  { icon: Bot, name: "Brand Writer Agent", purpose: "Writes on-brand copy from your guidelines.", status: "Approved", tag: "Marketing" },
  { icon: Bot, name: "AEO Strategist Agent", purpose: "Plans answer-engine optimization moves.", status: "Experimental", tag: "Marketing" },
  { icon: Bot, name: "Meeting Summary Agent", purpose: "Turns calls into clear action items.", status: "Approved", tag: "Operations" },
  { icon: Bot, name: "Image Direction Agent", purpose: "Generates on-brand visual direction.", status: "Draft", tag: "Brand" },
]

export function AgentsWorkflowsSection() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-6">
              Turn individual AI wins into repeatable workflows.
            </h2>
            <p className="text-lg text-[#666] leading-relaxed">
              Capture the agents, loops, and workflows your team creates so
              successful AI processes can be reused, improved, and scaled.
            </p>
          </div>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
          {cards.map((card) => (
            <StaggerItem key={card.name}>
              <div className="rounded-2xl bg-white border border-[#E5E5E3] p-5 h-full hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:border-[#ccc] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F7F6] border border-[#E5E5E3] flex items-center justify-center">
                    <card.icon className="h-5 w-5 text-[#141414]" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                      statusStyles[card.status] ?? "text-[#666] bg-[#ECECEC]"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#141414] mb-1">{card.name}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed mb-4">{card.purpose}</p>
                <span className="text-[11px] font-medium text-[#999] uppercase tracking-wide">
                  {card.tag}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
