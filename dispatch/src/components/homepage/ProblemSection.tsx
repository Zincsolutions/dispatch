"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import { FileSearch, Shuffle, Users, Search, ShieldAlert } from "lucide-react"

const problems = [
  { icon: FileSearch, text: "Prompts are scattered across chats, docs, and personal files" },
  { icon: Shuffle, text: "Workflows vary from person to person — nothing is repeatable" },
  { icon: Users, text: "Teams operate in silos, using different tools in different ways" },
  { icon: Search, text: "Knowledge is lost, duplicated, or impossible to find" },
  { icon: ShieldAlert, text: "Sensitive inputs and outputs live in places they shouldn't" },
]

export function ProblemSection() {
  return (
    <section className="py-32 bg-[#141414]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-white leading-tight mb-8">
            Most companies are using AI.
            <br className="hidden sm:block" />
            {" "}Few are using it well.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <p className="text-lg text-white/60 leading-relaxed mb-4 max-w-2xl mx-auto">
            Your marketing lead has a killer prompt in ChatGPT that&apos;s
            generating great copy. Meanwhile, someone in sales is struggling
            with inconsistent results — unaware that a better prompt already
            exists.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15}>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Multiply that across teams, and you&apos;re leaking time, quality,
            and momentum every single day.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-16 max-w-3xl mx-auto text-left">
          {problems.map((problem, i) => (
            <StaggerItem key={i}>
              <div className="flex gap-4 items-start rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5 hover:bg-white/[0.08] transition-colors duration-200">
                <div className="rounded-lg bg-[#FDFF60]/10 p-2 flex-shrink-0">
                  <problem.icon className="h-5 w-5 text-[#FDFF60]" />
                </div>
                <p className="text-[15px] text-white/70 leading-relaxed">{problem.text}</p>
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
