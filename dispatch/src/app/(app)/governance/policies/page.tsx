import type { Metadata } from "next"
import Link from "next/link"
import { getDocuments } from "@/lib/queries/governance"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/lists/search-bar"
import { FilterControls } from "@/components/lists/filter-controls"
import { TagFilterChip } from "@/components/lists/tag-filter-chip"
import { CheckCircle2 } from "lucide-react"
import { Suspense } from "react"

const DOC_TYPES = [
  { value: "policy", label: "Policy" },
  { value: "sop", label: "SOP" },
  { value: "guideline", label: "Guideline" },
]

interface Props {
  searchParams: Promise<{ search?: string; status?: string; doc_type?: string; tag?: string }>
}

export const metadata: Metadata = { title: "Policies & SOPs" }

export default async function PoliciesPage({ searchParams }: Props) {
  const params = await searchParams
  const documents = await getDocuments({
    search: params.search,
    status: params.status,
    doc_type: params.doc_type,
    tag: params.tag,
  })
  const hasFilters = Boolean(params.search || params.status || params.doc_type || params.tag)

  return (
    <div>
      <PageHeader
        title="Policies & SOPs"
        description="The documents that define how your team uses AI"
        createHref="/governance/policies/new"
        createLabel="New Document"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <FilterControls
            categoryOptions={DOC_TYPES}
            categoryLabel="Type"
            categoryParam="doc_type"
          />
        </Suspense>
        {params.tag && (
          <TagFilterChip tag={params.tag} basePath="/governance/policies" />
        )}
      </div>
      {documents.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No documents match your filters" : "No documents yet"}
          description={
            hasFilters
              ? "Try clearing your search or filters."
              : "Create your first policy or SOP — the rules and playbooks your team can acknowledge and follow."
          }
          createHref="/governance/policies/new"
          createLabel="New Document"
        />
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/governance/policies/${doc.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="capitalize text-xs">
                    {doc.doc_type}
                  </Badge>
                  {doc.status === "approved" && (
                    <span className="text-xs text-muted-foreground">
                      {doc.ack_count} acknowledged
                    </span>
                  )}
                  {doc.acked_by_me && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      You acknowledged
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={doc.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
