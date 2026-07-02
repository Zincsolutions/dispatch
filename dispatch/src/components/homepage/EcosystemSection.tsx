"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import {
  MessageSquareText,
  Image as ImageIcon,
  Bot,
  Workflow,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { AnimateOnScroll } from "./AnimateOnScroll"

type Card = {
  key: string
  title: string
  copy: string
  label: string
  icon: LucideIcon
  accent: string
  featured?: boolean
  /** Position of the card center on the desktop orbit canvas, in %. Hub is at (50,50). */
  pos: { x: number; y: number }
}

const cards: Card[] = [
  {
    key: "prompts",
    title: "Prompts",
    copy: "Store and share reusable prompts across your organization.",
    label: "Prompt Templates",
    icon: MessageSquareText,
    accent: "rgba(157,218,215,0.25)", // teal
    pos: { x: 21, y: 15 },
  },
  {
    key: "images",
    title: "AI Images",
    copy: "Preserve image prompts, styles, references, and generated assets.",
    label: "Image Prompts + References",
    icon: ImageIcon,
    accent: "rgba(245,180,140,0.25)", // peach
    pos: { x: 15, y: 50 },
  },
  {
    key: "agents",
    title: "Agents",
    copy: "Catalog custom GPTs, AI assistants, and specialized agents.",
    label: "Custom GPTs + Assistants",
    icon: Bot,
    accent: "rgba(253,255,96,0.22)", // yellow
    pos: { x: 21, y: 85 },
  },
  {
    key: "workflows",
    title: "Workflows",
    copy: "Document repeatable AI processes and best practices.",
    label: "Repeatable AI Processes",
    icon: Workflow,
    accent: "rgba(157,218,215,0.25)", // teal
    pos: { x: 79, y: 15 },
  },
  {
    key: "foundation",
    title: "AI Foundation",
    copy: "Centralize brand context, SOPs, training materials, approved assets, and organizational knowledge to drive more consistent AI outputs.",
    label: "Brand Context + SOPs",
    icon: BookOpen,
    accent: "rgba(253,255,96,0.45)", // yellow — emphasized
    featured: true,
    pos: { x: 85, y: 50 },
  },
  {
    key: "governance",
    title: "Governance",
    copy: "Manage approvals, policies, standards, and review workflows.",
    label: "Policies + Approvals",
    icon: ShieldCheck,
    accent: "rgba(253,255,96,0.45)", // yellow — emphasized
    featured: true,
    pos: { x: 79, y: 85 },
  },
]

function CardBody({ card }: { card: Card }) {
  const Icon = card.icon
  const featured = card.featured
  return (
    <div
      className={`group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(20,20,20,0.10)] ${
        featured
          ? "bg-[#FDFCEF] border border-[#E6E1AE] hover:border-[#D6CE82]"
          : "bg-white border border-[#E5E5E3] hover:border-[#ccc]"
      }`}
    >
      {featured && (
        <div className="mb-3 inline-flex items-center rounded-full bg-[#FDFF60]/60 px-2.5 py-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#141414]">
            Core System
          </span>
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: card.accent }}
        >
          <Icon className="h-5 w-5 text-[#141414]" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-bold text-[#141414]">{card.title}</h3>
      </div>
      <p className="text-[13.5px] leading-relaxed text-[#666] mb-4">{card.copy}</p>
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#999]">
        <span
          className={`w-1.5 h-1.5 rounded-full ${featured ? "bg-[#E0B33C]" : "bg-[#9DDAD7]"}`}
        />
        {card.label}
      </div>
    </div>
  )
}

export function EcosystemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()
  const animate = isInView && !prefersReducedMotion

  return (
    <section id="product" className="relative overflow-hidden bg-[#F7F7F6] py-28">
      {/* Soft radial glow + faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,20,20,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 35%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(157,218,215,0.18) 0%, rgba(253,255,96,0.10) 40%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-6">
              Everything your organization needs to{" "}
              <span className="gradient-text">build with AI</span>.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <p className="text-lg text-[#666] leading-relaxed">
              Organize, share, and govern the prompts, AI images, agents,
              workflows, and knowledge your organization creates every day.
            </p>
          </AnimateOnScroll>
        </div>

        {/* ---------- Desktop: orbit layout ---------- */}
        <div ref={ref} className="relative mx-auto hidden lg:block h-[660px]">
          {/* Connecting lines */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {cards.map((card, i) => (
              <motion.line
                key={card.key}
                x1={50}
                y1={50}
                x2={card.pos.x}
                y2={card.pos.y}
                stroke="rgba(20,20,20,0.14)"
                strokeWidth={1}
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={animate ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Central hub */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={animate ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-5 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(157,218,215,0.5) 0%, rgba(253,255,96,0.25) 55%, transparent 75%)",
                }}
              />
              <div className="relative w-44 h-44 rounded-full bg-[#141414] flex flex-col items-center justify-center text-center shadow-[0_24px_60px_-12px_rgba(20,20,20,0.45)] ring-1 ring-white/10">
                <span className="text-xl font-bold text-white leading-tight">
                  Dispatch
                </span>
                <span className="mt-1.5 text-[11px] font-medium leading-snug text-[#FDFF60] px-5">
                  The OS for Your AI Operations
                </span>
              </div>
            </div>
          </motion.div>

          {/* Orbiting cards */}
          {cards.map((card, i) => {
            const dx = (50 - card.pos.x) * 0.7
            const dy = (50 - card.pos.y) * 0.7
            return (
              <div
                key={card.key}
                className="absolute z-10 w-[260px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${card.pos.x}%`, top: `${card.pos.y}%` }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: dx, y: dy }}
                  animate={animate ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.35 + i * 0.09,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <CardBody card={card} />
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* ---------- Mobile / tablet: stacked grid ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {cards.map((card, i) => (
            <AnimateOnScroll key={card.key} delay={i * 0.06}>
              <CardBody card={card} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA */}
        <AnimateOnScroll delay={0.1}>
          <div className="mt-16 lg:mt-12 text-center">
            <a
              href="/signup"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#141414] hover:text-[#333] transition-colors"
            >
              Explore the Platform
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
