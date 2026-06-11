import Link from "next/link"
import { getLibraryImages, getCollections } from "@/lib/queries/library"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/lists/search-bar"
import { TagFilterChip } from "@/components/lists/tag-filter-chip"
import { NewCollectionDialog } from "./new-collection-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; collection?: string; tag?: string }>
}

export default async function LibraryPage({ searchParams }: Props) {
  const params = await searchParams
  const [images, collections] = await Promise.all([
    getLibraryImages({
      search: params.search,
      collection: params.collection,
      tag: params.tag,
    }),
    getCollections(),
  ])
  const hasFilters = Boolean(params.search || params.collection || params.tag)

  function collectionHref(id?: string) {
    const qs = new URLSearchParams()
    if (id) qs.set("collection", id)
    if (params.tag) qs.set("tag", params.tag)
    const s = qs.toString()
    return s ? `/library?${s}` : "/library"
  }

  return (
    <div>
      <PageHeader
        title="Brand Library"
        description="Your team's AI imagery — with the prompt and sref recipe behind every image"
        createHref="/library/new"
        createLabel="Add Image"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
        <Suspense>
          <SearchBar />
        </Suspense>
        {params.tag && <TagFilterChip tag={params.tag} basePath="/library" />}
      </div>

      {(collections.length > 0 || images.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Link
            href={collectionHref()}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              !params.collection
                ? "bg-primary text-primary-foreground border-transparent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </Link>
          {collections.map((c) => (
            <Link
              key={c.id}
              href={collectionHref(c.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                params.collection === c.id
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c.name}
            </Link>
          ))}
          <NewCollectionDialog />
        </div>
      )}

      {images.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No images match your filters" : "No images yet"}
          description={
            hasFilters
              ? "Try clearing your search or filters."
              : "Add your first image with the prompt and sref used to create it — so your team can reproduce the look."
          }
          createHref="/library/new"
          createLabel="Add Image"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Link
              key={image.id}
              href={`/library/${image.id}`}
              className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow bg-card"
            >
              <div className="aspect-square bg-muted overflow-hidden">
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.title || image.prompt.slice(0, 80) || "Library image"}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    Preview unavailable
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">
                  {image.title || image.prompt || "Untitled"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {image.sref && (
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      sref {image.sref.length > 12 ? `${image.sref.slice(0, 12)}…` : image.sref}
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground capitalize ml-auto">
                    {image.tool}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
