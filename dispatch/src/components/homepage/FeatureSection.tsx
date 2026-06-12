"use client"

import { AnimateOnScroll } from "./AnimateOnScroll"

interface FeatureSectionProps {
  index: number
  headline: string
  body: string
  soWhat: string
  screenshotSrc: string
  screenshotAlt: string
}

function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="aspect-[16/10] rounded-2xl overflow-hidden border border-[#E5E5E3] bg-white"
      style={{ boxShadow: "0 24px 64px -16px rgba(20,20,20,0.08)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
  )
}

export function FeatureSection({
  index,
  headline,
  body,
  soWhat,
  screenshotSrc,
  screenshotAlt,
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
              <div className="border-l-[3px] border-[#FDFF60] pl-6 py-5 bg-[#FDFF60]/[0.06] rounded-r-xl">
                <p className="text-[15px] text-[#333] leading-relaxed">
                  <span className="font-bold text-[#141414] tracking-wide text-xs uppercase">
                    So what:{" "}
                  </span>
                  {soWhat}
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          <div className={isEven ? "order-2" : "order-1 lg:order-2"}>
            <AnimateOnScroll direction={slideDirection} delay={0.15}>
              <Screenshot src={screenshotSrc} alt={screenshotAlt} />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}
