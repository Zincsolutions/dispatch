"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimateOnScroll } from "./AnimateOnScroll"

type Metric = { value: string; label: string }

type Story = {
  image: string
  imageAlt: string
  quote: string
  name: string
  role: string
  initials: string
  metrics: Metric[]
}

const stories: Story[] = [
  {
    image: "/case-study-dfnd.jpg",
    imageAlt: "DFND — Active Ax Compression Short campaign, built to cover more ground",
    quote:
      "Before Dispatch, our prompts, workflows, and AI assets were scattered across documents, chats, and individual accounts. Dispatch gave us a centralized system to organize, share, and govern everything.",
    name: "Jeff Herdman",
    role: "CEO, DFND",
    initials: "JH",
    metrics: [
      { value: "300+", label: "Prompts organized" },
      { value: "24", label: "Workflows documented" },
      { value: "8", label: "Approved AI policies" },
      { value: "100%", label: "Team visibility" },
    ],
  },
  {
    image: "/screenshots/dashboard.jpg",
    imageAlt: "A marketing team's centralized Dispatch workspace",
    quote:
      "Our team was reinventing the same prompts every week. Now everything — prompts, workflows, and brand context — lives in one place the whole company can pull from. Onboarding a new marketer takes days, not months.",
    name: "Marcus Hale",
    role: "Head of Brand, Northpeak Outfitters",
    initials: "MH",
    metrics: [
      { value: "5", label: "Teams aligned" },
      { value: "60%", label: "Faster onboarding" },
      { value: "1", label: "Source of truth" },
      { value: "0", label: "Lost prompts" },
    ],
  },
]

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -64 : 64, opacity: 0 }),
}

function StorySlide({ story }: { story: Story }) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Image */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-[#FDFF60]"
        />
        <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-[#E5E5E3] bg-white shadow-[0_30px_70px_-20px_rgba(20,20,20,0.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.image}
            alt={story.imageAlt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      {/* Quote */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#999] mb-5">
          Customer Story
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] leading-tight mb-8">
          Built for teams doing real work with AI.
        </h2>

        <blockquote className="text-xl sm:text-2xl text-[#333] leading-relaxed font-medium mb-8">
          &ldquo;{story.quote}&rdquo;
        </blockquote>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-full bg-[#141414] text-white flex items-center justify-center font-semibold shrink-0">
            {story.initials}
          </div>
          <div>
            <p className="font-bold text-[#141414] leading-tight">{story.name}</p>
            <p className="text-sm text-[#666]">{story.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#141414]/[0.08] pt-8">
          {story.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-3xl font-extrabold text-[#141414] leading-none mb-1.5">
                {m.value}
              </p>
              <p className="text-sm text-[#666]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Testimonial() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  const count = stories.length

  function paginate(dir: number) {
    setState(([i]) => [(i + dir + count) % count, dir])
  }

  function goTo(next: number) {
    setState(([i]) => [next, next > i ? 1 : -1])
  }

  return (
    <section className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <StorySlide story={stories[index]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimateOnScroll>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {stories.map((s, i) => (
              <button
                key={s.name}
                onClick={() => goTo(i)}
                aria-label={`Go to story ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-7 bg-[#141414]"
                    : "w-2 bg-[#141414]/20 hover:bg-[#141414]/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#141414]/15 text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-white hover:border-[#141414]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next story"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#141414]/15 text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-white hover:border-[#141414]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
