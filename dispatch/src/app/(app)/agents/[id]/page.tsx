import Link from "next/link"
import { notFound } from "next/navigation"
import { getAgentById } from "@/lib/queries/agents"
import { deleteAgent } from "@/lib/actions/agents"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AgentDetailPage({ params }: Props) {
  const { id } = await params
  const agent = await getAgentById(id)
  if (!agent) return notFound()

  const createdByName = agent.created_by_name

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/agents"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Agents
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {agent.name}
            </h1>
            {agent.description && (
              <p className="text-muted-foreground mt-1">{agent.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/agents/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete agent"
              description="Are you sure you want to delete this agent? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                await deleteAgent(id)
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
        <StatusBadge status={agent.status} />
        {agent.platform && (
          <Badge variant="outline" className="capitalize">
            {agent.platform}
          </Badge>
        )}
      </div>

      {agent.purpose && (
        <div className="rounded-lg border p-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Purpose
          </h2>
          <p className="text-sm leading-relaxed">{agent.purpose}</p>
        </div>
      )}

      {agent.setup_notes && (
        <div className="rounded-lg border p-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Setup Notes
          </h2>
          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
            {agent.setup_notes}
          </pre>
        </div>
      )}

      {agent.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {agent.tags.map((tag: string) => (
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
          Created {new Date(agent.created_at).toLocaleDateString()} &middot;
          Updated {new Date(agent.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
