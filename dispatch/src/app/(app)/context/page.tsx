import Link from "next/link"
import { getContextAssets } from "@/lib/queries/context-assets"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { CONTEXT_ASSET_TYPES } from "@/lib/constants"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; status?: string; asset_type?: string }>
}

export default async function ContextAssetsPage({ searchParams }: Props) {
  const params = await searchParams
  const contextAssets = await getContextAssets({
    search: params.search,
    status: params.status,
    asset_type: params.asset_type,
  })

  return (
    <div>
      <PageHeader
        title="Context Assets"
        description="Manage your organization's context asset library"
        createHref="/context/new"
        createLabel="New Context Asset"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...CONTEXT_ASSET_TYPES]}
            categoryLabel="Asset Type"
            categoryParam="asset_type"
          />
        </Suspense>
      </div>
      {contextAssets.length === 0 ? (
        <EmptyState
          title="No context assets found"
          description="Create your first context asset to start building your context library."
          createHref="/context/new"
          createLabel="New Context Asset"
        />
      ) : (
        <div className="space-y-2">
          {contextAssets.map((asset) => (
            <Link
              key={asset.id}
              href={`/context/${asset.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{asset.title}</h3>
                {asset.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {asset.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  {asset.asset_type && (
                    <span className="text-xs text-muted-foreground capitalize">
                      {asset.asset_type.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={asset.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
