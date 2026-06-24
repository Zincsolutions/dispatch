"use client"

import { AnimateOnScroll } from "./AnimateOnScroll"

const metrics = [
  { value: "300+", label: "Prompts organized" },
  { value: "24", label: "Workflows documented" },
  { value: "8", label: "Approved AI policies" },
  { value: "100%", label: "Team visibility" },
]

export function Testimonial() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <AnimateOnScroll>
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-[#FDFF60]"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E5E5E3] bg-white shadow-[0_30px_70px_-20px_rgba(20,20,20,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/dashboard.jpg"
                  alt="A team's centralized Dispatch workspace for organizing, sharing, and governing AI"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Quote */}
          <AnimateOnScroll delay={0.1}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#999] mb-5">
                Customer Story
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] leading-tight mb-8">
                Built for teams doing real work with AI.
              </h2>

              <blockquote className="text-xl sm:text-2xl text-[#333] leading-relaxed font-medium mb-8">
                &ldquo;Before Dispatch, our prompts, workflows, and AI assets were
                scattered across documents, chats, and individual accounts.
                Dispatch gave us a centralized system to organize, share, and
                govern everything.&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-full bg-[#141414] text-white flex items-center justify-center font-semibold shrink-0">
                  JS
                </div>
                <div>
                  <p className="font-bold text-[#141414] leading-tight">Jane Smith</p>
                  <p className="text-sm text-[#666]">VP Marketing, Example Company</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#141414]/[0.08] pt-8">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-3xl font-extrabold text-[#141414] leading-none mb-1.5">
                      {m.value}
                    </p>
                    <p className="text-sm text-[#666]">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
