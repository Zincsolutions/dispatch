import type { Metadata } from "next"
import Link from "next/link"
import { getContextAssets } from "@/lib/queries/context-assets"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { canApprove } from "@/lib/authz"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusQuickSelect } from "../status-quick-select"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { TagFilterChip } from "@/components/lists/tag-filter-chip"
import { FOUNDATION_CATEGORIES, FOUNDATION_STATUSES } from "@/lib/constants"
import { ArrowLeft, Image as ImageIcon } from "lucide-react"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Browse Foundation Assets" }

interface Props {
  searchParams: Promise<{ search?: string; status?: string; category?: string; tag?: string }>
}

export default async function FoundationBrowsePage({ searchParams }: Props) {
  const params = await searchParams
  const [contextAssets, { role }] = await Promise.all([
    getContextAssets(
      {
        search: params.search,
        status: params.status,
        category: params.category,
        tag: params.tag,
      },
      { withCover: true }
    ),
    getCurrentUserWithOrg(),
  ])
  const hasFilters = Boolean(params.search || params.status || params.category || params.tag)
  const activeCategory = FOUNDATION_CATEGORIES.find((c) => c.value === params.category)

  return (
    <div>
      <Link
        href="/foundation"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to AI Foundation
      </Link>
      <PageHeader
        title={activeCategory ? activeCategory.label : "All Foundation Assets"}
        description="Browse, search, and filter your AI Foundation assets."
        createHref="/foundation/new"
        createLabel="Add Foundation Asset"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={[...FOUNDATION_CATEGORIES]}
            categoryLabel="Category"
            categoryParam="category"
            statusOptions={FOUNDATION_STATUSES}
          />
        </Suspense>
        {params.tag && <TagFilterChip tag={params.tag} basePath="/foundation/browse" />}
      </div>
      {contextAssets.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No foundation assets match your filters" : "Build your AI Foundation"}
          description={
            hasFilters
              ? "Try clearing your search or filters."
              : "Add the brand, voice, customer, product, and company knowledge that powers your prompts, agents, workflows, and image systems."
          }
          createHref="/foundation/new"
          createLabel="Add Foundation Asset"
        />
      ) : (
        <div className="space-y-2">
          {contextAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <Link
                href={`/foundation/${asset.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                {asset.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.cover_image_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-md border bg-muted object-contain"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate">{asset.title}</h3>
                  {asset.description && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {asset.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {asset.category && (
                      <span className="text-xs text-muted-foreground">
                        {FOUNDATION_CATEGORIES.find((c) => c.value === asset.category)?.label ??
                          asset.category}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <StatusQuickSelect
                id={asset.id}
                status={asset.status}
                canApprove={canApprove(role)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
