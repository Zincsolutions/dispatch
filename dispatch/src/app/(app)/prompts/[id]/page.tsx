import Link from "next/link"
import { notFound } from "next/navigation"
import { getPromptById } from "@/lib/queries/prompts"
import { deletePrompt } from "@/lib/actions/prompts"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params
  const prompt = await getPromptById(id)
  if (!prompt) return notFound()

  const createdByName = prompt.created_by_name

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/prompts"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Prompts
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {prompt.title}
            </h1>
            {prompt.description && (
              <p className="text-muted-foreground mt-1">{prompt.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/prompts/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete prompt"
              description="Are you sure you want to delete this prompt? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                await deletePrompt(id)
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
        <StatusBadge status={prompt.status} />
        {prompt.category && (
          <Badge variant="outline" className="capitalize">
            {prompt.category}
          </Badge>
        )}
      </div>

      <div className="rounded-lg border p-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          Prompt Body
        </h2>
        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
          {prompt.prompt_body}
        </pre>
      </div>

      {prompt.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Created by {createdByName}</p>
        <p>
          Created {new Date(prompt.created_at).toLocaleDateString()} &middot;
          Updated {new Date(prompt.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
