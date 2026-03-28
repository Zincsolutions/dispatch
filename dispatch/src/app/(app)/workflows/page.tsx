import Link from "next/link"
import { getWorkflows } from "@/lib/queries/workflows"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>
}

export default async function WorkflowsPage({ searchParams }: Props) {
  const params = await searchParams
  const workflows = await getWorkflows({
    search: params.search,
    status: params.status,
  })

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Manage your organization's workflows"
        createHref="/workflows/new"
        createLabel="New Workflow"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls />
        </Suspense>
      </div>
      {workflows.length === 0 ? (
        <EmptyState
          title="No workflows found"
          description="Create your first workflow to start organizing your processes."
          createHref="/workflows/new"
          createLabel="New Workflow"
        />
      ) : (
        <div className="space-y-2">
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              href={`/workflows/${workflow.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{workflow.title}</h3>
                {workflow.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {workflow.description}
                  </p>
                )}
                {workflow.steps && (workflow.steps as unknown[]).length > 0 && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {(workflow.steps as unknown[]).length} step
                    {(workflow.steps as unknown[]).length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <StatusBadge status={workflow.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
