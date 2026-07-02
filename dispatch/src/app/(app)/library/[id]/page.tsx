import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getLibraryImageById } from "@/lib/queries/library"
import { deleteLibraryImage } from "@/lib/actions/library"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CopyButton } from "@/components/shared/copy-button"
import { StatusBadge } from "@/components/shared/status-badge"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

// "Copy full prompt" gives back the complete Midjourney input:
// prompt text + sref + remaining parameters.
function buildFullPrompt(image: {
  prompt: string
  sref: string | null
  parameters: string | null
}) {
  const parts = [image.prompt.trim()]
  if (image.sref) parts.push(`--sref ${image.sref.trim()}`)
  if (image.parameters) parts.push(image.parameters.trim())
  return parts.filter(Boolean).join(" ")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("library_images")
    .select("title")
    .eq("id", id)
    .maybeSingle()
  return { title: data?.title ?? "Not found" }
}

export default async function LibraryImageDetailPage({ params }: Props) {
  const { id } = await params
  const image = await getLibraryImageById(id)
  if (!image) return notFound()

  const fullPrompt = buildFullPrompt(image)

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/library"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Brand Library
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {image.title || "Untitled image"}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={image.status} />
              <Badge variant="outline" className="capitalize">
                {image.tool}
              </Badge>
              {image.collection_name && (
                <Link href={`/library?collection=${image.collection_id}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {image.collection_name}
                  </Badge>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/library/${id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete image"
              description="Are you sure you want to delete this image and its prompt recipe? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                return await deleteLibraryImage(id)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border overflow-hidden bg-muted">
          {image.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.title || image.prompt.slice(0, 80) || "Library image"}
              className="w-full object-contain"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center text-sm text-muted-foreground">
              Preview unavailable
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-muted-foreground">Prompt</h2>
              <CopyButton
                text={image.prompt}
                label="Copy"
                variant="ghost"
                entityType="library_image"
                entityId={id}
              />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {image.prompt}
            </pre>
          </div>

          {image.sref && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-1">
                    Style reference
                  </h2>
                  <code className="text-sm font-mono">--sref {image.sref}</code>
                </div>
                <CopyButton
                  text={`--sref ${image.sref}`}
                  label="Copy"
                  variant="ghost"
                  entityType="library_image"
                  entityId={id}
                />
              </div>
            </div>
          )}

          {image.parameters && (
            <div className="rounded-lg border p-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">
                Parameters
              </h2>
              <code className="text-sm font-mono">{image.parameters}</code>
            </div>
          )}

          {image.negative_prompt && (
            <div className="rounded-lg border p-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">
                Negative prompt
              </h2>
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {image.negative_prompt}
              </pre>
            </div>
          )}

          {(image.aspect_ratio || image.seed || image.cref) && (
            <div className="rounded-lg border p-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {image.aspect_ratio && (
                <span>
                  <span className="text-muted-foreground">Aspect ratio:</span>{" "}
                  <code className="font-mono">{image.aspect_ratio}</code>
                </span>
              )}
              {image.seed && (
                <span>
                  <span className="text-muted-foreground">Seed:</span>{" "}
                  <code className="font-mono">{image.seed}</code>
                </span>
              )}
              {image.cref && (
                <span>
                  <span className="text-muted-foreground">--cref</span>{" "}
                  <code className="font-mono">{image.cref}</code>
                </span>
              )}
            </div>
          )}

          <div className="rounded-lg border p-4 bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-medium mb-1">Full prompt</h2>
                <p className="text-xs text-muted-foreground truncate">
                  {fullPrompt}
                </p>
              </div>
              <CopyButton
                text={fullPrompt}
                label="Copy full prompt"
                entityType="library_image"
                entityId={id}
              />
            </div>
          </div>
        </div>
      </div>

      {image.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Tags</h2>
          <div className="flex flex-wrap gap-1.5">
            {image.tags.map((tag) => (
              <Link key={tag} href={`/library?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {image.connected_assets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Connected Foundation Assets
          </h2>
          <div className="space-y-1">
            {image.connected_assets.map((a) => (
              <Link
                key={a.id}
                href={`/foundation/${a.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span className="truncate">{a.title}</span>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {image.usage_notes && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Usage notes</h2>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{image.usage_notes}</p>
        </div>
      )}

      <div className="mb-6 border-t pt-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-1">
          Reference image
        </h2>
        {image.reference_url ? (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              The original image used as a reference — pull it in alongside the
              prompt to get closer to the look you&apos;re after.
            </p>
            <a
              href={image.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.reference_url}
                alt="Reference image"
                className="h-40 w-40 rounded-lg border object-cover hover:opacity-90 transition-opacity"
              />
            </a>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            No reference image yet.{" "}
            <Link
              href={`/library/${id}/edit`}
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              Add one
            </Link>{" "}
            to keep the original you worked from alongside this prompt.
          </p>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Added by {image.created_by_name}</p>
        <p>
          Added {new Date(image.created_at).toLocaleDateString()} &middot;
          Updated {new Date(image.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
