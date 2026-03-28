import Link from "next/link"
import { getPrompts } from "@/lib/queries/prompts"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { PROMPT_CATEGORIES } from "@/lib/constants"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; status?: string; category?: string }>
}

export default async function PromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const prompts = await getPrompts({
    search: params.search,
    status: params.status,
    category: params.category,
  })

  return (
    <div>
      <PageHeader
        title="Prompts"
        description="Manage your organization's prompt library"
        createHref="/prompts/new"
        createLabel="New Prompt"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...PROMPT_CATEGORIES]}
            categoryLabel="Category"
            categoryParam="category"
          />
        </Suspense>
      </div>
      {prompts.length === 0 ? (
        <EmptyState
          title="No prompts found"
          description="Create your first prompt to start building your prompt library."
          createHref="/prompts/new"
          createLabel="New Prompt"
        />
      ) : (
        <div className="space-y-2">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{prompt.title}</h3>
                {prompt.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {prompt.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  {prompt.category && (
                    <span className="text-xs text-muted-foreground capitalize">
                      {prompt.category}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={prompt.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
