import Link from "next/link"
import { notFound } from "next/navigation"
import { getDocumentById } from "@/lib/queries/governance"
import { deleteDocument } from "@/lib/actions/governance"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CopyButton } from "@/components/shared/copy-button"
import { AcknowledgeSection } from "./acknowledge-section"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DocumentDetailPage({ params }: Props) {
  const { id } = await params
  const document = await getDocumentById(id)
  if (!document) return notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/governance/policies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Policies &amp; SOPs
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {document.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/governance/policies/${id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete document"
              description="Are you sure you want to delete this document and its acknowledgment history? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                return await deleteDocument(id)
              }}
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={document.status} />
        <Badge variant="outline" className="capitalize">
          {document.doc_type}
        </Badge>
      </div>

      {document.status === "approved" && (
        <AcknowledgeSection
          documentId={id}
          ackedByMe={document.acked_by_me}
          acknowledgments={document.acknowledgments}
          memberCount={document.member_count}
        />
      )}

      <div className="rounded-lg border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Content</h2>
          <CopyButton text={document.content} label="Copy" variant="ghost" />
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {document.content}
        </div>
      </div>

      {document.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Tags</h2>
          <div className="flex flex-wrap gap-1.5">
            {document.tags.map((tag) => (
              <Link
                key={tag}
                href={`/governance/policies?tag=${encodeURIComponent(tag)}`}
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-secondary/80 cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Created by {document.created_by_name}</p>
        <p>
          Created {new Date(document.created_at).toLocaleDateString()} &middot;
          Updated {new Date(document.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
