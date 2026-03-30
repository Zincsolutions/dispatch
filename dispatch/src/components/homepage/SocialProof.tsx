"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { CountUp } from "./CountUp"

const testimonials = [
  {
    quote: "We had prompts in Slack, workflows in Google Docs, and brand assets spread across three different tools. Nobody could find anything. Dispatch gave us one place for all of it — and for the first time, our whole team is actually on the same page.",
    name: "Sarah Chen", title: "Head of Marketing", company: "Meridian Growth Co.", initials: "SC",
    avatarBg: "bg-[#9DDAD7]",
  },
  {
    quote: "Our senior strategist built an incredible content workflow, but it only lived in her head. When she went on leave, the team fell apart. Now every process is documented in Dispatch — anyone can pick it up and run it.",
    name: "Marcus Rivera", title: "COO", company: "BrightPath Agency", initials: "MR",
    avatarBg: "bg-[#F5B48C]",
  },
  {
    quote: "We were spending hours every week rebuilding prompts that someone on another team had already perfected. Dispatch cut that to zero. Our team estimates we're saving 8–10 hours a week in duplicated effort alone.",
    name: "Jessica Tran", title: "Director of Content", company: "Vantage Digital", initials: "JT",
    avatarBg: "bg-[#FDFF60]",
  },
]

const metrics = [
  { target: 60, suffix: "%", desc: "less time rebuilding prompts" },
  { target: 3, suffix: "x", desc: "faster AI workflow onboarding" },
  { target: 1, suffix: "", desc: "single source of truth for AI" },
]

export function SocialProof() {
  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-16">
            Teams are already building on Dispatch.
          </h2>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24" staggerDelay={0.1}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div
                className="bg-white rounded-2xl p-8 border border-[#E5E5E3] h-full flex flex-col hover:border-[#ccc] transition-all duration-300"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
              >
                <p className="text-[15px] text-[#333] italic leading-[1.7] flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-[#E5E5E3] my-6" />
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-full ${t.avatarBg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xs font-bold text-[#141414]">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#141414]">{t.name}</p>
                    <p className="text-xs text-[#666]">{t.title}, {t.company}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-3 gap-8 text-center mb-20">
          {metrics.map((m, i) => (
            <StaggerItem key={i}>
              <div>
                <CountUp
                  target={m.target}
                  suffix={m.suffix}
                  className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#141414] tracking-tight"
                />
                <p className="text-sm text-[#666] mt-3">{m.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#999] font-medium mb-8">
            Recognized by
          </p>
          <div className="flex justify-center gap-10 sm:gap-14 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-16 sm:w-20 h-5 rounded bg-[#141414]/[0.06]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
