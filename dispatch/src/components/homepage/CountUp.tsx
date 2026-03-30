"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, animate, useReducedMotion } from "framer-motion"

interface CountUpProps {
  target: number
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({
  target,
  suffix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState(prefersReducedMotion ? target.toString() : "0")

  useEffect(() => {
    if (!isInView) return
    if (prefersReducedMotion) {
      setDisplay(target.toString())
      return
    }

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })

    return () => controls.stop()
  }, [isInView, target, duration, motionValue, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}
