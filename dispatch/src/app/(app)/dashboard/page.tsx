import Link from "next/link"
import { getDashboardData } from "@/lib/queries/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import {
  MessageSquareText,
  FileText,
  Bot,
  Workflow,
} from "lucide-react"

export default async function DashboardPage() {
  const data = await getDashboardData()

  const sections = [
    {
      title: "Recent Prompts",
      icon: MessageSquareText,
      items: data.prompts.map((p) => ({
        id: p.id,
        name: p.title,
        status: p.status,
        href: `/prompts/${p.id}`,
      })),
      viewAllHref: "/prompts",
      createHref: "/prompts/new",
      emptyDescription: "No prompts yet. Create your first prompt to get started.",
    },
    {
      title: "Recent Context Assets",
      icon: FileText,
      items: data.contextAssets.map((c) => ({
        id: c.id,
        name: c.title,
        status: c.status,
        href: `/context/${c.id}`,
      })),
      viewAllHref: "/context",
      createHref: "/context/new",
      emptyDescription: "No context assets yet. Add brand voice, audience definitions, and more.",
    },
    {
      title: "Recent Agents",
      icon: Bot,
      items: data.agents.map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status,
        href: `/agents/${a.id}`,
      })),
      viewAllHref: "/agents",
      createHref: "/agents/new",
      emptyDescription: "No agents registered yet. Add your AI agents and assistants.",
    },
    {
      title: "Recent Workflows",
      icon: Workflow,
      items: data.workflows.map((w) => ({
        id: w.id,
        name: w.title,
        status: w.status,
        href: `/workflows/${w.id}`,
      })),
      viewAllHref: "/workflows",
      createHref: "/workflows/new",
      emptyDescription: "No workflows yet. Define repeatable AI processes.",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <section.icon className="h-4 w-4 text-muted-foreground" />
                {section.title}
              </CardTitle>
              <Link
                href={section.viewAllHref}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {section.items.length === 0 ? (
                <EmptyState
                  title="Nothing here yet"
                  description={section.emptyDescription}
                  createHref={section.createHref}
                  createLabel="Create"
                />
              ) : (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="font-medium truncate mr-2">
                          {item.name}
                        </span>
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
