"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"

const SHOW_BLOG = true

const articles = [
  {
    title: "Why Your Best Prompts Keep Disappearing (And What to Do About It)",
    description: "The hidden cost of prompt fragmentation — and a better way to manage your team's AI knowledge.",
    wash: "gradient-wash-1",
  },
  {
    title: "The Hidden Cost of AI Silos: What Fragmented Teams Are Really Losing",
    description: "When AI efforts don't compound, you're not just losing efficiency — you're losing competitive advantage.",
    wash: "gradient-wash-2",
  },
  {
    title: "From Experiment to System: How to Make AI Compound Across Your Team",
    description: "The framework for turning scattered AI experiments into organizational capability.",
    wash: "gradient-wash-3",
  },
]

export function BlogSection() {
  if (!SHOW_BLOG) return null

  return (
    <section className="py-32 bg-[#EDECEC]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] text-center leading-tight mb-16">
            How the best teams are using AI right now.
          </h2>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <StaggerItem key={i}>
              <div
                className="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E3] hover:border-[#ccc] transition-all duration-300 h-full flex flex-col cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
              >
                <div className={`aspect-video ${article.wash} flex items-center justify-center`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm">
                    <div className="w-6 h-6 rounded-lg bg-[#141414]/10" />
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-[17px] font-bold text-[#141414] group-hover:text-[#333] transition-colors duration-200 leading-snug mb-3">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed flex-1">
                    {article.description}
                  </p>
                  <span className="text-sm font-semibold text-[#141414] mt-5 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Read more
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
