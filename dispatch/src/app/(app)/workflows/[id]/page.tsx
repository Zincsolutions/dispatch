import Link from "next/link"
import { notFound } from "next/navigation"
import { getWorkflowById } from "@/lib/queries/workflows"
import { deleteWorkflow } from "@/lib/actions/workflows"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import type { WorkflowStep } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { id } = await params
  const workflow = await getWorkflowById(id)
  if (!workflow) return notFound()

  const steps = (workflow.steps as WorkflowStep[]) || []

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/workflows"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Workflows
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {workflow.title}
            </h1>
            {workflow.description && (
              <p className="text-muted-foreground mt-1">
                {workflow.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/workflows/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete workflow"
              description="Are you sure you want to delete this workflow? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                await deleteWorkflow(id)
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
        <StatusBadge status={workflow.status} />
      </div>

      {steps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Steps
          </h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.order} className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {step.order}
                  </span>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {workflow.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {workflow.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_prompts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Prompts
          </h2>
          <div className="space-y-1">
            {workflow.linked_prompts.map((p) => (
              <Link
                key={p.id}
                href={`/prompts/${p.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{p.title}</span>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_context_assets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Context Assets
          </h2>
          <div className="space-y-1">
            {workflow.linked_context_assets.map((ca) => (
              <Link
                key={ca.id}
                href={`/context/${ca.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{ca.title}</span>
                <StatusBadge status={ca.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_agents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Agents
          </h2>
          <div className="space-y-1">
            {workflow.linked_agents.map((a) => (
              <Link
                key={a.id}
                href={`/agents/${a.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{a.name}</span>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Created by {workflow.created_by_name}</p>
        <p>
          Created {new Date(workflow.created_at).toLocaleDateString()} &middot;
          Updated {new Date(workflow.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
