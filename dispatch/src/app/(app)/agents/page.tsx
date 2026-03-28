import Link from "next/link"
import { getAgents } from "@/lib/queries/agents"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { AGENT_PLATFORMS } from "@/lib/constants"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; status?: string; platform?: string }>
}

export default async function AgentsPage({ searchParams }: Props) {
  const params = await searchParams
  const agents = await getAgents({
    search: params.search,
    status: params.status,
    platform: params.platform,
  })

  return (
    <div>
      <PageHeader
        title="Agents"
        description="Manage your organization's AI agents"
        createHref="/agents/new"
        createLabel="New Agent"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...AGENT_PLATFORMS]}
            categoryLabel="Platform"
            categoryParam="platform"
          />
        </Suspense>
      </div>
      {agents.length === 0 ? (
        <EmptyState
          title="No agents found"
          description="Create your first agent to start building your agent library."
          createHref="/agents/new"
          createLabel="New Agent"
        />
      ) : (
        <div className="space-y-2">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{agent.name}</h3>
                {agent.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {agent.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {agent.platform && (
                    <Badge variant="outline" className="capitalize text-xs">
                      {agent.platform}
                    </Badge>
                  )}
                  {agent.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
