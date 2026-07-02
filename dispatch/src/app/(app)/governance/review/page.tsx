import type { Metadata } from "next"
import Link from "next/link"
import { getReviewQueue, REVIEW_TYPE_OPTIONS } from "@/lib/queries/review-queue"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { canApprove } from "@/lib/authz"
import { ReviewActions } from "./review-actions"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { FilterControls } from "@/components/lists/filter-controls"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ type?: string }>
}

export const metadata: Metadata = { title: "Review Queue" }

export default async function ReviewQueuePage({ searchParams }: Props) {
  const { type } = await searchParams
  const [items, { role }] = await Promise.all([
    getReviewQueue(type),
    getCurrentUserWithOrg(),
  ])
  const isReviewer = canApprove(role)
  const hasFilter = Boolean(type && type !== "all")

  return (
    <div>
      <Link
        href="/governance"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Governance
      </Link>
      <PageHeader
        title="Review Queue"
        description="Foundation assets, agents, workflows, and image library items that need review before they're safe for production use."
      />
      <div className="mb-6">
        <Suspense>
          <FilterControls
            categoryOptions={[...REVIEW_TYPE_OPTIONS]}
            categoryLabel="Type"
            categoryParam="type"
            showStatus={false}
          />
        </Suspense>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={hasFilter ? "Nothing of this type needs review" : "Nothing needs review"}
          description={
            hasFilter
              ? "Try clearing the type filter."
              : "When an asset is set to “Needs Review”, it shows up here for a reviewer to approve."
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline">{item.typeLabel}</Badge>
                <StatusBadge status={item.status} />
                {isReviewer && <ReviewActions type={item.type} id={item.id} />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
