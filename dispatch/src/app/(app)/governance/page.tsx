import type { Metadata } from "next"
import Link from "next/link"
import { getDocuments, getTools } from "@/lib/queries/governance"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import { getReviewQueue } from "@/lib/queries/review-queue"
import { FileCheck2, Wrench, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react"

export const metadata: Metadata = { title: "Governance" }

export default async function GovernancePage() {
  // getDocuments() already returns status + acked_by_me, so derive the
  // awaiting-acknowledgment list in memory instead of re-running the full
  // documents-with-acks query (and a second auth.getUser()) via
  // getDocumentsAwaitingMyAck().
  const [documents, tools, reviewQueue] = await Promise.all([
    getDocuments(),
    getTools(),
    getReviewQueue(),
  ])

  const awaitingAck = documents.filter(
    (d) => d.status === "approved" && !d.acked_by_me,
  )
  const approved = documents.filter((d) => d.status === "approved")
  const approvedTools = tools.filter((t) => t.status === "approved")
  const bannedTools = tools.filter((t) => t.status === "not_allowed")

  return (
    <div>
      <PageHeader
        title="Governance"
        description="How your company uses AI — the policies, the playbook, and the approved stack"
      />

      {awaitingAck.length > 0 && (
        <Card className="mb-6 border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/10">
          <CardHeader>
            <CardTitle className="text-base">
              Needs your acknowledgment ({awaitingAck.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {awaitingAck.map((doc) => (
              <Link
                key={doc.id}
                href={`/governance/policies/${doc.id}`}
                className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-accent transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {doc.doc_type}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card
        className={
          reviewQueue.length > 0
            ? "mb-6 border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/10"
            : "mb-6"
        }
      >
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <ClipboardCheck className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Review Queue
                {reviewQueue.length > 0 ? ` (${reviewQueue.length})` : ""}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {reviewQueue.length > 0
                  ? "Foundation assets, agents, workflows, and images awaiting review"
                  : "Nothing is waiting for review right now"}
              </p>
            </div>
          </div>
          <Link
            href="/governance/review"
            className={buttonVariants({
              variant: reviewQueue.length > 0 ? "default" : "outline",
              size: "sm",
            })}
          >
            {reviewQueue.length > 0 ? "Review now" : "Open queue"}
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck2 className="h-4 w-4" />
              Policies &amp; SOPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-6 mb-4">
              <div>
                <p className="text-3xl font-semibold">{documents.length}</p>
                <p className="text-xs text-muted-foreground">documents</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{approved.length}</p>
                <p className="text-xs text-muted-foreground">approved</p>
              </div>
              {awaitingAck.length === 0 && documents.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 ml-auto">
                  <CheckCircle2 className="h-4 w-4" />
                  All caught up
                </div>
              )}
            </div>
            <Link
              href="/governance/policies"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View policies
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" />
              Tool Registry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-6 mb-4">
              <div>
                <p className="text-3xl font-semibold">{tools.length}</p>
                <p className="text-xs text-muted-foreground">tools tracked</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{approvedTools.length}</p>
                <p className="text-xs text-muted-foreground">approved</p>
              </div>
              {bannedTools.length > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {bannedTools.length} not allowed
                </Badge>
              )}
            </div>
            <Link
              href="/governance/tools"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View registry
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
