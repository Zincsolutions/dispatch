import Link from "next/link"
import { ShieldCheck, BookOpen, Workflow, Lock, ArrowRight } from "lucide-react"

const cards = [
  {
    icon: ShieldCheck,
    label: "Available on Team and Enterprise",
    headline: "Governance Center",
    copy: "Manage approvals, policy acknowledgements, review queues, and approved AI standards across your organization.",
    ctaLabel: "Learn more",
    ctaHref: "/#product",
  },
  {
    icon: BookOpen,
    label: "Available on Starter, Team, and Enterprise",
    headline: "AI Foundation",
    copy: "Centralize your brand voice, company context, SOPs, approved assets, and source materials so AI outputs stay consistent.",
    ctaLabel: "Learn more",
    ctaHref: "/#product",
  },
  {
    icon: Workflow,
    label: "Available on Starter, Team, and Enterprise",
    headline: "Agents & Workflows",
    copy: "Store, organize, and reuse the AI agents, workflows, and loops that help your team move faster.",
    ctaLabel: "Learn more",
    ctaHref: "/#product",
  },
  {
    icon: Lock,
    label: "Available on Enterprise",
    headline: "Enterprise Controls",
    copy: "Add SSO, SCIM, audit logs, custom roles, advanced permissions, and dedicated onboarding for larger organizations.",
    ctaLabel: "Contact sales",
    ctaHref: "/contact?plan=enterprise",
  },
]

export function CapabilityCards() {
  return (
    <section className="py-20 bg-[#F7F7F6]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141414] text-center leading-tight mb-12">
          What you can build with Dispatch.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.headline}
              className="flex flex-col rounded-2xl bg-white border border-[#E5E5E3] p-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-[#141414] flex items-center justify-center mb-5">
                <card.icon className="h-5 w-5 text-[#FDFF60]" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999] mb-2">
                {card.label}
              </p>
              <h3 className="text-lg font-bold text-[#141414] mb-2">{card.headline}</h3>
              <p className="text-[14px] text-[#666] leading-relaxed mb-5 flex-1">{card.copy}</p>
              <Link
                href={card.ctaHref}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#141414] hover:gap-2.5 transition-all"
              >
                {card.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
