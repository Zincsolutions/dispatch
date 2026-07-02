import type { Metadata } from "next"
import Link from "next/link"
import { getDashboardData, getDashboardMetrics } from "@/lib/queries/dashboard"
import { getReviewQueue } from "@/lib/queries/review-queue"
import { getDocumentsAwaitingMyAck } from "@/lib/queries/governance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  MessageSquareText,
  FileText,
  Bot,
  Workflow,
  Images,
  Layers,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const [data, metrics, reviewQueue, awaitingAck] = await Promise.all([
    getDashboardData(),
    getDashboardMetrics(),
    getReviewQueue(),
    getDocumentsAwaitingMyAck(),
  ])

  const stats: {
    label: string
    value: number
    icon: LucideIcon
    sub: string
    href?: string
  }[] = [
    { label: "AI Assets", value: metrics.totalAssets, icon: Layers, sub: "Across every category" },
    {
      label: "Governed Assets",
      value: metrics.approved,
      icon: CheckCircle2,
      sub: "Approved and ready to use",
      href: "/governance",
    },
    {
      label: "Needs Review",
      value: metrics.pendingReview,
      icon: AlertCircle,
      sub: "Awaiting approval",
      href: metrics.pendingReview > 0 ? "/governance/review" : undefined,
    },
    {
      label: "Active Agents",
      value: metrics.activeAgents,
      icon: Bot,
      sub: "Currently in your stack",
      href: "/agents",
    },
    {
      label: "Workflow Loops",
      value: metrics.activeWorkflows,
      icon: Workflow,
      sub: "Active automations",
      href: "/workflows",
    },
  ]

  const sections = [
    {
      title: "Prompt Library",
      icon: MessageSquareText,
      items: data.prompts.map((p) => ({ id: p.id, name: p.title, status: p.status, href: `/prompts/${p.id}` })),
      viewAllHref: "/prompts",
      createHref: "/prompts/new",
      emptyDescription: "No prompts yet. Create your first prompt to get started.",
    },
    {
      title: "Brand & Context Assets",
      icon: FileText,
      items: data.contextAssets.map((c) => ({ id: c.id, name: c.title, status: c.status, href: `/foundation/${c.id}` })),
      viewAllHref: "/foundation",
      createHref: "/foundation/new",
      emptyDescription: "No foundation assets yet. Add brand voice, audience, product, and company knowledge.",
    },
    {
      title: "AI Agents",
      icon: Bot,
      items: data.agents.map((a) => ({ id: a.id, name: a.name, status: a.status, href: `/agents/${a.id}` })),
      viewAllHref: "/agents",
      createHref: "/agents/new",
      emptyDescription: "No agents registered yet. Add your AI agents and assistants.",
    },
    {
      title: "Workflows & Loops",
      icon: Workflow,
      items: data.workflows.map((w) => ({ id: w.id, name: w.title, status: w.status, href: `/workflows/${w.id}` })),
      viewAllHref: "/workflows",
      createHref: "/workflows/new",
      emptyDescription: "No workflows yet. Define repeatable AI processes.",
    },
    {
      title: "Image Library",
      icon: Images,
      items: data.images.map((i) => ({
        id: i.id,
        name: i.title || "Untitled image",
        status: i.status,
        href: `/library/${i.id}`,
      })),
      viewAllHref: "/library",
      createHref: "/library/new",
      emptyDescription: "No images yet. Save your AI imagery with the prompts that made them.",
    },
  ]

  const topReview = reviewQueue.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          The operational view of your organization&apos;s AI knowledge, workflows, agents, and governance.
        </p>
      </div>

      {/* Operational snapshot */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((stat) => {
          const body = (
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-[18px] w-[18px] text-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-2 text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
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

      {/* Governance Overview — the differentiator, front and center */}
      <Card
        className={
          reviewQueue.length > 0 || awaitingAck.length > 0
            ? "border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/10"
            : ""
        }
      >
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-5 w-5" />
            Governance Overview
          </CardTitle>
          <Link
            href="/governance"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Review Governance
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium mb-3">Needs Review ({reviewQueue.length})</h3>
              {topReview.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing awaiting review.</p>
              ) : (
                <ul className="space-y-2">
                  {topReview.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="truncate">{item.title}</span>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {item.typeLabel}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Needs Acknowledgement ({awaitingAck.length})</h3>
              {awaitingAck.length === 0 ? (
                <p className="text-sm text-muted-foreground">No policies awaiting your sign-off.</p>
              ) : (
                <ul className="space-y-2">
                  {awaitingAck.map((doc) => (
                    <li key={doc.id}>
                      <Link
                        href={`/governance/policies/${doc.id}`}
                        className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="truncate">{doc.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground capitalize">
                          {doc.doc_type}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 content-start">
              <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/60 p-3 dark:bg-emerald-950/20">
                <p className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {metrics.approved}
                </p>
                <p className="text-xs font-medium text-emerald-700/80 dark:text-emerald-400/80">
                  Approved Assets
                </p>
              </div>
              <div className="rounded-lg border border-orange-300/50 bg-orange-50/60 p-3 dark:bg-orange-950/20">
                <p className="text-2xl font-bold tracking-tight text-orange-700 dark:text-orange-400">
                  {reviewQueue.length}
                </p>
                <p className="text-xs font-medium text-orange-700/80 dark:text-orange-400/80">
                  Needs Review
                </p>
              </div>
              <div className="rounded-lg border border-amber-300/50 bg-amber-50/70 p-3 dark:bg-amber-950/20">
                <p className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-500">
                  {awaitingAck.length}
                </p>
                <p className="text-xs font-medium text-amber-700/80 dark:text-amber-500/80">
                  Awaiting Acknowledgement
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI systems */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                {section.title}
              </CardTitle>
              <Link
                href={section.viewAllHref}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {section.items.length === 0 ? (
                <EmptyState
                  title="Nothing here yet"
                  description={section.emptyDescription}
                  createHref={section.createHref}
                  createLabel="Create"
                />
              ) : (
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="font-medium truncate mr-2">{item.name}</span>
                        <StatusBadge status={item.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
