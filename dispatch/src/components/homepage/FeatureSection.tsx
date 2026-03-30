"use client"

import { AnimateOnScroll } from "./AnimateOnScroll"
import { CountUp } from "./CountUp"

interface FeatureSectionProps {
  index: number
  headline: string
  body: string
  soWhat: string
  metric: number
  metricSuffix: string
  metricDesc: string
  screenshotLabel: string
  screenshotGradient: string
}

const washes = ["gradient-wash-1", "gradient-wash-2", "gradient-wash-3", "gradient-wash-1"]

function ScreenPlaceholder({ label, washIndex }: { label: string; washIndex: number }) {
  return (
    <div
      className={`aspect-[16/10] rounded-2xl overflow-hidden ${washes[washIndex % washes.length]} border border-[#E5E5E3] flex flex-col p-6 sm:p-10`}
      style={{ boxShadow: "0 24px 64px -16px rgba(20,20,20,0.08)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#141414]/[0.06]" />
        <div className="flex-1" />
        <div className="h-2.5 w-16 rounded bg-[#141414]/[0.06]" />
      </div>
      <div className="h-3 bg-[#141414]/[0.05] rounded w-2/5 mb-2" />
      <div className="h-5 bg-[#141414]/[0.06] rounded w-3/4 mb-6" />
      <div className="space-y-2.5 flex-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-white/50 rounded-xl border border-white/60" />
        ))}
      </div>
      <p className="text-center text-[#141414]/25 text-sm font-semibold mt-5">{label}</p>
    </div>
  )
}

export function FeatureSection({
  index,
  headline,
  body,
  soWhat,
  metric,
  metricSuffix,
  metricDesc,
  screenshotLabel,
}: FeatureSectionProps) {
  const isEven = index % 2 === 0
  const slideDirection = isEven ? "right" as const : "left" as const
  const bg = index % 2 === 0 ? "bg-[#EDECEC]" : "bg-white"

  return (
    <section className={`py-28 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={isEven ? "order-1" : "order-2 lg:order-1"}>
            <AnimateOnScroll>
              <h3 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#141414] leading-tight mb-5">
                {headline}
              </h3>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.08}>
              <p className="text-lg text-[#666] leading-relaxed mb-8">{body}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.14}>
              <div className="border-l-[3px] border-[#FDFF60] pl-6 py-5 bg-[#FDFF60]/[0.06] rounded-r-xl mb-10">
                <p className="text-[15px] text-[#333] leading-relaxed">
                  <span className="font-bold text-[#141414] tracking-wide text-xs uppercase">
                    So what:{" "}
                  </span>
                  {soWhat}
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <div className="flex items-baseline gap-3">
                <CountUp
                  target={metric}
                  suffix={metricSuffix}
                  className="text-5xl sm:text-6xl font-extrabold text-[#141414] tracking-tight"
                />
                <span className="text-base text-[#666]">{metricDesc}</span>
              </div>
            </AnimateOnScroll>
          </div>

          <div className={isEven ? "order-2" : "order-1 lg:order-2"}>
            <AnimateOnScroll direction={slideDirection} delay={0.15}>
              <ScreenPlaceholder label={screenshotLabel} washIndex={index} />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
