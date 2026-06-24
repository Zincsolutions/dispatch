"use client"

import { AnimateOnScroll, StaggerContainer, StaggerItem } from "./AnimateOnScroll"
import {
  Megaphone,
  MessageSquareText,
  Package,
  BadgeCheck,
  Image as ImageIcon,
  ScrollText,
} from "lucide-react"

const assets = [
  { icon: Megaphone, label: "Brand Voice" },
  { icon: MessageSquareText, label: "Messaging Framework" },
  { icon: Package, label: "Product Details" },
  { icon: BadgeCheck, label: "Approved Claims" },
  { icon: ImageIcon, label: "Image Style Guide" },
  { icon: ScrollText, label: "AI Usage SOP" },
]

export function FoundationSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <AnimateOnScroll>
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#141414] leading-tight mb-6">
              Build your organization&apos;s AI foundation.
            </h2>
            <p className="text-lg text-[#666] leading-relaxed mb-6 max-w-xl">
              Give your team a shared source of truth for the context, standards,
              and source materials that make AI outputs more consistent and useful.
            </p>
            <ul className="space-y-2 text-[15px] text-[#444]">
              {[
                "Brand voice and messaging",
                "Company context and approved source materials",
                "SOPs, playbooks, and image direction",
                "Reusable prompt standards",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#141414] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>

        <StaggerContainer className="grid grid-cols-2 gap-4">
          {assets.map((asset) => (
            <StaggerItem key={asset.label}>
              <div className="rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] p-5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FDFF60] flex items-center justify-center">
                    <asset.icon className="h-5 w-5 text-[#141414]" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
                    Approved
                  </span>
                </div>
                <p className="font-semibold text-[#141414]">{asset.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
