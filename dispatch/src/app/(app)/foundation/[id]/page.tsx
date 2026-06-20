import Link from "next/link"
import { notFound } from "next/navigation"
import { getContextAssetById } from "@/lib/queries/context-assets"
import { deleteContextAsset } from "@/lib/actions/context-assets"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CopyButton } from "@/components/shared/copy-button"
import { FOUNDATION_CATEGORIES } from "@/lib/constants"
import { Pencil, Trash2, ArrowLeft, Paperclip, ExternalLink } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

function fmt(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString() : "—"
}

export default async function ContextAssetDetailPage({ params }: Props) {
  const { id } = await params
  const asset = await getContextAssetById(id)
  if (!asset) return notFound()

  const categoryLabel =
    FOUNDATION_CATEGORIES.find((c) => c.value === asset.category)?.label ?? asset.category

  const meta: { label: string; value: string }[] = [
    { label: "Category", value: categoryLabel || "—" },
    { label: "Asset Type", value: asset.asset_type ? asset.asset_type.replace("_", " ") : "—" },
    { label: "Owner", value: asset.owner_name || asset.created_by_name },
    { label: "Created", value: fmt(asset.created_at) },
    { label: "Last updated", value: fmt(asset.updated_at) },
    { label: "Approved by", value: asset.approved_by_name || "—" },
    { label: "Approved", value: fmt(asset.approved_at) },
  ]

  return (
    <div>
      <Link
        href="/foundation"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to AI Foundation
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{asset.title}</h1>
          {asset.description && (
            <p className="text-muted-foreground mt-1">{asset.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/foundation/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
          <ConfirmDialog
            title="Delete foundation asset"
            description="Are you sure you want to delete this foundation asset? This action cannot be undone."
            onConfirm={async () => {
              "use server"
              await deleteContextAsset(id)
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-muted-foreground">Content</h2>
              <CopyButton
                text={asset.content}
                label="Copy"
                variant="ghost"
                entityType="context_asset"
                entityId={id}
              />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {asset.content}
            </pre>
          </div>

          {asset.files.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Files</h2>
              <div className="space-y-2">
                {asset.files.map((f) =>
                  f.url ? (
                    <a
                      key={f.id}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{f.file_name}</span>
                    </a>
                  ) : (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="truncate">{f.file_name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {asset.links.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">External Links</h2>
              <div className="space-y-2">
                {asset.links.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{l.label || l.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {asset.tags.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Tags</h2>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag: string) => (
                  <Link key={tag} href={`/foundation/browse?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {asset.notes && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Notes</h2>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{asset.notes}</p>
            </div>
          )}
        </div>

        {/* Metadata sidebar */}
        <aside>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <StatusBadge status={asset.status} />
              </div>
              {meta.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
                  <span className="text-sm text-right capitalize">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
