import type { Metadata } from "next"
import { getAgents } from "@/lib/queries/agents"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { AgentCard } from "@/components/agents/agent-card"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { TagFilterChip } from "@/components/lists/tag-filter-chip"
import { AGENT_STATUSES, DEPARTMENTS } from "@/lib/constants"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{
    search?: string
    status?: string
    department?: string
    tag?: string
  }>
}

export const metadata: Metadata = { title: "Agents" }

export default async function AgentsPage({ searchParams }: Props) {
  const params = await searchParams
  const agents = await getAgents({
    search: params.search,
    status: params.status,
    department: params.department,
    tag: params.tag,
  })
  const hasFilters = Boolean(
    params.search || params.status || params.department || params.tag
  )

  return (
    <div>
      <PageHeader
        title="Agents"
        description="Reusable AI workers built from your approved context, prompts, workflows, and governance rules."
        createHref="/agents/new"
        createLabel="New Agent"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...DEPARTMENTS]}
            categoryLabel="Department"
            categoryParam="department"
            statusOptions={AGENT_STATUSES}
          />
        </Suspense>
        {params.tag && <TagFilterChip tag={params.tag} basePath="/agents" />}
      </div>
      {agents.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No agents match your filters" : "No agents found"}
          description={
            hasFilters
              ? "Try clearing your search or filters."
              : "Create your first agent to start building your agent library."
          }
          createHref="/agents/new"
          createLabel="New Agent"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}
