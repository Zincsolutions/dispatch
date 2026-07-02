import type { Metadata } from "next"
import Link from "next/link"
import { getWorkflows } from "@/lib/queries/workflows"
import { EmptyState } from "@/components/shared/empty-state"
import { WorkflowCard } from "@/components/workflows/workflow-card"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { TagFilterChip } from "@/components/lists/tag-filter-chip"
import { buttonVariants } from "@/components/ui/button-variants"
import { AGENT_STATUSES, DEPARTMENTS, WORKFLOW_TYPES } from "@/lib/constants"
import { Plus, Repeat } from "lucide-react"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{
    search?: string
    status?: string
    type?: string
    department?: string
    tag?: string
  }>
}

export const metadata: Metadata = { title: "Workflows & Loops" }

export default async function WorkflowsPage({ searchParams }: Props) {
  const params = await searchParams
  const workflows = await getWorkflows({
    search: params.search,
    status: params.status,
    type: params.type,
    department: params.department,
    tag: params.tag,
  })
  const hasFilters = Boolean(
    params.search || params.status || params.type || params.department || params.tag
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workflows &amp; Loops
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Standardize how your team uses AI for repeatable work. Build
            workflows and loops from approved agents, prompts, context, and
            governance rules.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/workflows/new"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Plus className="mr-1 h-4 w-4" />
            New Workflow
          </Link>
          <Link
            href="/workflows/new?type=loop"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <Repeat className="mr-1 h-4 w-4" />
            New Loop
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...WORKFLOW_TYPES]}
            categoryLabel="Type"
            categoryParam="type"
            showStatus={false}
          />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...DEPARTMENTS]}
            categoryLabel="Department"
            categoryParam="department"
            statusOptions={AGENT_STATUSES}
          />
        </Suspense>
        {params.tag && <TagFilterChip tag={params.tag} basePath="/workflows" />}
      </div>

      {workflows.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No workflows match your filters" : "No workflows yet"}
          description={
            hasFilters
              ? "Try clearing your search or filters."
              : "Create your first workflow or loop to standardize repeatable AI work."
          }
          createHref="/workflows/new"
          createLabel="New Workflow"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </div>
  )
}
