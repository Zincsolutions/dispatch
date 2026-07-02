import type { Metadata } from "next"
import Link from "next/link"
import { getFoundationOverview, getCategoryImagePreviews } from "@/lib/queries/context-assets"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { FOUNDATION_CATEGORIES } from "@/lib/constants"
import {
  Palette,
  Megaphone,
  Package,
  Users,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarClock,
  type LucideIcon,
} from "lucide-react"

export const metadata: Metadata = { title: "AI Foundation" }

const CATEGORY_META: Record<string, { icon: LucideIcon; description: string }> = {
  brand_identity: {
    icon: Palette,
    description: "Logos, colors, fonts, guidelines, and visual standards.",
  },
  voice_messaging: {
    icon: Megaphone,
    description: "Tone, positioning, approved copy, and language.",
  },
  products_services: {
    icon: Package,
    description: "What you sell — features, benefits, pricing, and FAQs.",
  },
  customers_personas: {
    icon: Users,
    description: "ICPs, personas, segments, pain points, and objections.",
  },
  company_knowledge: {
    icon: BookOpen,
    description: "Company overview, processes, research, and positioning.",
  },
  examples_reference: {
    icon: Sparkles,
    description: "Gold-standard examples your AI can learn from.",
  },
}

function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString() : "—"
}

export default async function FoundationPage() {
  const [overview, previewsByCategory] = await Promise.all([
    getFoundationOverview(),
    getCategoryImagePreviews(),
  ])

  if (overview.total === 0) {
    return (
      <div>
        <PageHeader
          title="AI Foundation"
          description="Manage the company knowledge, brand standards, messaging, and reference material that powers your AI systems."
          createHref="/foundation/new"
          createLabel="Add Foundation Asset"
        />
        <EmptyState
          title="Build your AI Foundation"
          description="Add the brand, voice, customer, product, and company knowledge that powers your prompts, agents, workflows, and image systems."
          createHref="/foundation/new"
          createLabel="Add Foundation Asset"
        />
      </div>
    )
  }

  const stats: {
    label: string
    value: string | number
    icon: LucideIcon
    href?: string
  }[] = [
    { label: "Total Assets", value: overview.total, icon: Layers },
    { label: "Approved", value: overview.approved, icon: CheckCircle2 },
    {
      label: "Needs Review",
      value: overview.needsReview,
      icon: AlertCircle,
      href: overview.needsReview > 0 ? "/foundation/browse?status=needs_review" : undefined,
    },
    { label: "Draft", value: overview.draft, icon: FileText },
    { label: "Last Updated", value: fmtDate(overview.lastUpdated), icon: CalendarClock },
  ]

  return (
    <div>
      <PageHeader
        title="AI Foundation"
        description="Manage the company knowledge, brand standards, messaging, and reference material that powers your AI systems."
        createHref="/foundation/new"
        createLabel="Add Foundation Asset"
      />

      {/* Foundation health summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-8">
        {stats.map((stat) => {
          const body = (
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          )
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block transition-opacity hover:opacity-80">
              {body}
            </Link>
          ) : (
            <div key={stat.label}>{body}</div>
          )
        })}
      </div>

      {/* Category cards */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
        <Link href="/foundation/browse" className="text-sm text-muted-foreground hover:text-foreground">
          Browse all assets
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FOUNDATION_CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category.value]
          const stat = overview.byCategory[category.value]
          const previews = previewsByCategory[category.value] ?? []
          const Icon = meta.icon
          return (
            <Link
              key={category.value}
              href={`/foundation/browse?category=${category.value}`}
              className="group rounded-lg border p-5 hover:shadow-md hover:bg-accent/40 transition-all bg-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-medium">{category.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground min-h-10">{meta.description}</p>
              {previews.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {previews.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="h-12 w-12 rounded-md border bg-muted object-contain"
                    />
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{stat?.total ?? 0} assets</span>
                <span>{stat?.approved ?? 0} approved</span>
                {(stat?.needsReview ?? 0) > 0 && (
                  <span className="text-amber-600 dark:text-amber-500">
                    {stat?.needsReview} need review
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Last updated: {fmtDate(stat?.lastUpdated ?? null)}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
